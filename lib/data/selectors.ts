import { dateFor } from "./seed";
import { getStore, setAfterPersist } from "./store";
import type { Invoice, InvoiceStatus, MoneyTotal, Period, Transaction } from "./types";

function db() {
  return getStore();
}

const PERIOD_DAYS: Record<Period, number> = { day: 1, week: 7, month: 30 };

export function signedAmount(txn: Transaction): number {
  return txn.direction === "in" ? txn.amountMinor : -txn.amountMinor;
}

function inPeriod(dayOffset: number, period: Period): boolean {
  const days = PERIOD_DAYS[period];
  return dayOffset <= 0 && dayOffset >= -(days - 1);
}

function inPreviousPeriod(dayOffset: number, period: Period): boolean {
  const days = PERIOD_DAYS[period];
  return dayOffset <= -days && dayOffset >= -(2 * days - 1);
}

function completedInPeriod(period: Period): Transaction[] {
  return db().transactions.filter(txn => txn.status !== "pending" && inPeriod(txn.dayOffset, period));
}

export function getMoneyIn(period: Period): number {
  return db().transactions
    .filter(txn => txn.direction === "in" && txn.status !== "pending" && inPeriod(txn.dayOffset, period))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
}

export function getMoneyOut(period: Period): number {
  return db().transactions
    .filter(txn => txn.direction === "out" && txn.status !== "pending" && inPeriod(txn.dayOffset, period))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
}

export function getMoneyInPrevious(period: Period): number {
  return db().transactions
    .filter(txn => txn.direction === "in" && txn.status !== "pending" && inPreviousPeriod(txn.dayOffset, period))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
}

export function getMoneyOutPrevious(period: Period): number {
  return db().transactions
    .filter(txn => txn.direction === "out" && txn.status !== "pending" && inPreviousPeriod(txn.dayOffset, period))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
}

export function getMoneyShare(period: Period): { inPct: number; outPct: number } {
  const moneyIn = getMoneyIn(period);
  const moneyOut = getMoneyOut(period);
  const total = moneyIn + moneyOut;
  if (total <= 0) return { inPct: 0, outPct: 0 };
  const inPct = Math.round((moneyIn / total) * 100);
  return { inPct, outPct: 100 - inPct };
}

export function getPendingSettlement(period: Period): number {
  return db().transactions
    .filter(txn => txn.status === "pending" && inPeriod(txn.dayOffset, period))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
}

export function getNet(period: Period): number {
  const net = getMoneyIn(period) - getMoneyOut(period);
  if (period === "month") {
    const netProfit = getProfitAndLoss(period).netProfit;
    if (net !== netProfit) {
      throw new Error("30-day Home Net " + net + " does not equal Reports net profit " + netProfit + " (minor units)");
    }
  }
  return net;
}

export function getNetSeries(period: Period): { labels: string[]; values: number[] } {
  if (period === "day") {
    const net = getNet(period);
    return { labels: ["Open", "Now"], values: [0, net] };
  }
  const days = PERIOD_DAYS[period];
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const labels: string[] = [];
  const values: number[] = [];
  let running = 0;
  for (let offset = -(days - 1); offset <= 0; offset++) {
    const dayNet = db().transactions
      .filter(txn => txn.status !== "pending" && txn.dayOffset === offset)
      .reduce((sum, txn) => sum + signedAmount(txn), 0);
    running += dayNet;
    if (period === "week") {
      labels.push(weekday[dateFor(offset).getUTCDay()] ?? "");
    } else {
      const index = offset + days - 1;
      labels.push(index % 5 === 0
        ? dateFor(offset).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
        : "");
    }
    values.push(running);
  }
  return { labels, values };
}

function linkedTxns(invoiceId: string): Transaction[] {
  return db().transactions.filter(txn => txn.invoiceId === invoiceId);
}

export function getInvoiceStatus(invoiceId: string): InvoiceStatus {
  const invoice = db().invoices.find(row => row.id === invoiceId);
  if (!invoice) return "draft";
  const linked = linkedTxns(invoiceId);
  if (linked.some(txn => txn.type === "refund")) return "refunded";
  const settledIn = linked
    .filter(txn => txn.direction === "in" && txn.status !== "pending")
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  if (settledIn >= invoice.amountMinor) return "paid";
  if (linked.some(txn => txn.status === "pending")) return "awaiting settlement";
  if (invoice.dueOffset < 0) return "overdue";
  if (invoice.viewedAt !== null) return "viewed";
  if (invoice.sentAt !== null) return "sent";
  return "draft";
}

function sumStatus(predicate: (status: InvoiceStatus, invoice: Invoice) => boolean): MoneyTotal {
  const rows = db().invoices.filter(invoice => predicate(getInvoiceStatus(invoice.id), invoice));
  return {
    amountMinor: rows.reduce((sum, invoice) => sum + invoice.amountMinor, 0),
    count: rows.length
  };
}

export function getOutstandingInvoices(): Invoice[] {
  return db().invoices
    .filter(invoice => {
      const status = getInvoiceStatus(invoice.id);
      return status !== "paid" && status !== "refunded" && status !== "draft";
    })
    .sort((a, b) => a.dueOffset - b.dueOffset || a.id.localeCompare(b.id));
}

export function getOutstanding(): MoneyTotal {
  const rows = getOutstandingInvoices();
  const amountMinor = rows.reduce((sum, invoice) => sum + invoice.amountMinor, 0);
  if (amountMinor !== sumStatus(status => status !== "paid" && status !== "refunded" && status !== "draft").amountMinor) {
    throw new Error("Who owes me does not equal Outstanding");
  }
  return { amountMinor, count: rows.length };
}

export function getOverdue(): MoneyTotal {
  return sumStatus(status => status === "overdue");
}

export function getTotalInvoiced(): MoneyTotal {
  return sumStatus(status => status !== "draft");
}

export function periodLabel(period: Period): string {
  if (period === "day") return "Last 1 day";
  if (period === "week") return "Last 7 days";
  return "Last 30 days";
}

export function getRefunds(period: Period): number {
  return db().transactions
    .filter(txn => txn.type === "refund" && txn.status !== "pending" && inPeriod(txn.dayOffset, period))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
}

export function getMatchUniverse(): Transaction[] {
  return db().transactions.filter(txn =>
    (txn.direction === "in" || txn.type === "refund") && inPeriod(txn.dayOffset, "month")
  );
}

export function getMatchedTransactions(): Transaction[] {
  const openIds = new Set(getOpenMatches().map(proposal => proposal.transactionId));
  return getMatchUniverse().filter(txn =>
    !openIds.has(txn.id) && (txn.invoiceId !== null || txn.source === "shopify")
  );
}

export function getReminderInvoices(): Invoice[] {
  return db().invoices.filter(invoice => {
    const status = getInvoiceStatus(invoice.id);
    return status === "sent" || status === "viewed" || status === "overdue" || status === "awaiting settlement";
  });
}

export function getMatchRate(): { matched: number; total: number; percent: number } {
  const openMatches = getOpenMatches();
  const matched = getMatchedTransactions().length;
  const total = getMatchUniverse().length;
  if (matched + openMatches.length !== total) {
    throw new Error("Match rate " + matched + " + " + openMatches.length + " open does not equal " + total);
  }
  return { matched, total, percent: total ? Math.round((matched / total) * 100) : 0 };
}

export function getOpenMatches() {
  return db().matchProposals.filter(proposal => proposal.status === "open");
}

export function getPayrollGross(runId: string): number {
  const run = db().payrollRuns.find(row => row.id === runId);
  if (!run) return 0;
  return db().employees
    .filter(employee => run.employeeIds.includes(employee.id))
    .reduce((sum, employee) => sum + employee.monthlySalary, 0);
}

export function getPayrollDeductions(runId: string): number {
  const run = db().payrollRuns.find(row => row.id === runId);
  if (!run) return 0;
  return Math.round(getPayrollGross(runId) * run.deductionRate);
}

export function getPayrollNet(runId: string): number {
  return getPayrollGross(runId) - getPayrollDeductions(runId);
}

function assertPayrollLink(): void {
  const run = db().payrollRuns[0];
  if (!run) return;
  const txn = db().transactions.find(row => row.id === run.transactionId);
  const net = getPayrollNet(run.id);
  if (!txn || txn.amountMinor !== net) {
    throw new Error("Payroll net " + net + " does not equal " + run.transactionId);
  }
}

assertPayrollLink();

export function getProfitAndLoss(period: Period) {
  const refunds = getRefunds(period);
  const revenue = getMoneyIn(period);
  const rows = completedInPeriod(period).filter(txn => txn.direction === "out");
  const sumTag = (tags: string[]) => rows
    .filter(txn => txn.type !== "refund" && tags.includes(txn.tag))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const costOfSales = sumTag(["Supplies", "Rent"]);
  const salaries = sumTag(["Salaries"]);
  const overheads = sumTag(["Utilities", "Marketing", "Fees"]);
  const netProfit = revenue - refunds - costOfSales - salaries - overheads;
  return {
    revenue,
    refunds,
    costOfSales,
    salaries,
    overheads,
    netProfit,
    margin: revenue ? netProfit / revenue : 0
  };
}

export function getVatRate(): number {
  return db().merchant.country === "QA" ? 0 : 0.05;
}

export function getPlanUsage(): { used: number; limit: number } {
  return { used: db().transactions.length, limit: db().merchant.plan.txnLimit };
}

export function getBranchComparison(period: Period = "month") {
  return db().branches.map(branch => {
    const rows = db().transactions.filter(txn => txn.branchId === branch.id && txn.status !== "pending" && inPeriod(txn.dayOffset, period));
    const inflow = rows.filter(txn => txn.direction === "in").reduce((sum, txn) => sum + txn.amountMinor, 0);
    const outflow = rows.filter(txn => txn.direction === "out").reduce((sum, txn) => sum + txn.amountMinor, 0);
    return {
      id: branch.id,
      name: branch.name,
      inflow,
      outflow,
      net: inflow - outflow,
      count: rows.length,
      staff: db().employees.filter(employee => employee.branchId === branch.id).length
    };
  });
}

export function getOpeningBalance(): number {
  return db().bankAccounts.reduce((sum, account) => sum + account.openingBalanceMinor, 0);
}

export function getCashOnHand(): number {
  const asOf = db().bankAccounts.reduce((min, account) => Math.min(min, account.asOfOffset), 0);
  const movement = db().transactions
    .filter(txn => txn.status !== "pending" && txn.dayOffset > asOf)
    .reduce((sum, txn) => sum + signedAmount(txn), 0);
  const cashOnHand = getOpeningBalance() + movement;
  const realised = db().transactions.filter(txn => txn.status !== "pending" && txn.dayOffset > asOf);
  const inflows = realised.filter(txn => txn.direction === "in").reduce((sum, txn) => sum + txn.amountMinor, 0);
  const outflows = realised.filter(txn => txn.direction === "out").reduce((sum, txn) => sum + txn.amountMinor, 0);
  const expected = getOpeningBalance() + inflows - outflows;
  if (!Number.isSafeInteger(cashOnHand) || cashOnHand !== expected) {
    throw new Error("Cash on hand invariant failed: " + cashOnHand + " !== opening " + getOpeningBalance() + " + inflows " + inflows + " - outflows " + outflows);
  }
  return cashOnHand;
}

export function getRunway(period: Period) {
  const cashOnHand = getCashOnHand();
  const net = getNet(period);
  if (net >= 0) {
    return { cashOnHand, net, burn: 0, profitable: true, months: null as number | null };
  }
  const burn = Math.abs(net);
  return { cashOnHand, net, burn, profitable: false, months: Math.floor(cashOnHand / Math.max(burn, 1)) };
}

export function getSpend(period: Period) {
  const rows = completedInPeriod(period).filter(txn => txn.direction === "out" && txn.type !== "refund");
  const total = rows.reduce((sum, txn) => sum + txn.amountMinor, 0);
  const grouped = new Map<string, number>();
  for (const txn of rows) grouped.set(txn.tag, (grouped.get(txn.tag) ?? 0) + txn.amountMinor);
  const tags = [...grouped.entries()]
    .map(([tag, amount]) => ({ tag, amount, percent: total ? Math.round((amount / total) * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount || a.tag.localeCompare(b.tag));
  const vendors = rows
    .slice()
    .sort((a, b) => b.amountMinor - a.amountMinor || a.id.localeCompare(b.id))
    .slice(0, 5)
    .map(txn => ({
      name: txn.counterparty,
      tag: txn.tag,
      source: txn.source,
      amount: txn.amountMinor
    }));
  const refunds = getRefunds(period);
  const salaries = tags.find(row => row.tag === "Salaries");
  const rentAndSupplies = tags.filter(row => row.tag === "Rent" || row.tag === "Supplies").reduce((sum, row) => sum + row.percent, 0);
  const insight = salaries
    ? "Salaries are your largest outflow at " + salaries.percent + "% of spend. Rent and supplies together add another " + rentAndSupplies + "%."
    : "";
  return { total, tags, vendors, refunds, insight };
}

export function getCashForecast(period: Period) {
  const days = PERIOD_DAYS[period];
  const bucketCount = period === "month" ? 6 : period === "week" ? 7 : 1;
  const width = days / bucketCount;
  const buckets = [];
  for (let i = 0; i < bucketCount; i++) {
    const start = -(days - 1) + Math.round(i * width);
    const end = i === bucketCount - 1 ? 0 : -(days - 1) + Math.round((i + 1) * width) - 1;
    const rows = db().transactions.filter(txn => txn.status !== "pending" && txn.dayOffset >= start && txn.dayOffset <= end);
    const inflow = rows.filter(txn => txn.direction === "in").reduce((sum, txn) => sum + txn.amountMinor, 0);
    const outflow = rows.filter(txn => txn.direction === "out").reduce((sum, txn) => sum + txn.amountMinor, 0);
    const label = period === "week"
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateFor(start).getUTCDay()] ?? ""
      : dateFor(start).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
    buckets.push({ label, start, end, inflow, outflow, projected: false });
  }
  buckets.push({ label: "Next", start: 1, end: 1, inflow: 0, outflow: 0, projected: true });
  return buckets;
}

export function invoiceById(invoiceId: string): Invoice | undefined {
  return db().invoices.find(row => row.id === invoiceId);
}

export function assertInvoiceStatuses(): void {
  for (const invoice of db().invoices) {
    const status = getInvoiceStatus(invoice.id);
    const linked = db().transactions.filter(txn => txn.invoiceId === invoice.id);
    if (linked.some(txn => txn.type === "refund") && status !== "refunded") {
      throw new Error(invoice.number + " should be refunded");
    }
    const settledIn = linked.filter(txn => txn.direction === "in" && txn.status !== "pending").reduce((sum, txn) => sum + txn.amountMinor, 0);
    if (settledIn >= invoice.amountMinor && !linked.some(txn => txn.type === "refund") && status !== "paid") {
      throw new Error(invoice.number + " should be paid");
    }
    if (linked.some(txn => txn.status === "pending") && settledIn < invoice.amountMinor && status !== "awaiting settlement") {
      throw new Error(invoice.number + " should be awaiting settlement");
    }
  }
}

export function assertPhase1Invariants(): void {
  getNet("month");
  getOutstanding();
  getMatchRate();
  getCashOnHand();
  assertPayrollLink();
  assertInvoiceStatuses();
  const unpaid = getOutstanding();
  const whoOwes = getOutstandingInvoices().reduce((sum, invoice) => sum + invoice.amountMinor, 0);
  if (whoOwes !== unpaid.amountMinor || getOutstandingInvoices().length !== unpaid.count) {
    throw new Error("Hub unpaid count does not equal Outstanding");
  }
}

assertInvoiceStatuses();
setAfterPersist(assertPhase1Invariants);
