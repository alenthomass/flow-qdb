import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { dashboardSnapshot, dashboardState } from "../lib/data/view.ts";
import { formatDate, formatMoney, offsetFromLabel } from "../lib/format.ts";
import { chartScale } from "../lib/chart.ts";
import { dateFor, seed } from "../lib/data/seed.ts";
import { SAMPLE_BILL, SAMPLE_BILLS, EXTRACT_DELAY_MS, EXTRACT_DELAY_MIN_MS, EXTRACT_DELAY_MAX_MS, extractBill, extractDelayMs, extractedBillForm } from "../lib/data/sample-bill.ts";
import { appendTransaction, getStore, resetStore } from "../lib/data/store.ts";
import {
  addSubscriber,
  cancelSubscriber,
  confirmMatch,
  connectSampleBank,
  connectShopify,
  createPaymentLink,
  createSubscriptionPlan,
  deactivatePaymentLink,
  ingestShopifyOrder,
  payPublishedCheckout,
  publishCheckoutPage,
  runSimulatedBilling,
  setSmartCheckout,
  settleBilling,
  settleCheckoutPayment,
  settlePayment,
  simulatePayment
} from "../lib/data/spine.ts";
import { SAMPLE_BANKS, SAMPLE_CHECKOUT_ANALYTICS, SAMPLE_SHOPIFY_ORDER } from "../lib/data/sample-checkout.ts";
import { buildTallyExport, exportTallyXml, simulateZohoSync, transactionsInTallyRange } from "../lib/data/tally-export.ts";
import { resetGateway } from "../lib/gateway/index.ts";
import {
  getBranchComparison,
  getCashOnHand,
  getInvoiceStatus,
  getMatchRate,
  getMoneyIn,
  getMoneyOut,
  getNet,
  getNetSeries,
  getOpenMatches,
  getOpeningBalance,
  getOutstanding,
  getOutstandingInvoices,
  getOverdue,
  getPayrollNet,
  getPendingSettlement,
  getProfitAndLoss,
  getRefunds,
  getRunway,
  getSpend,
  getTotalInvoiced,
  getVatRate,
  signedAmount
} from "../lib/data/selectors.ts";

resetStore();

const money = minor => formatMoney(minor, seed.merchant.currency);

function live() {
  return getStore();
}

function completed(direction) {
  return live().transactions.filter(txn => txn.direction === direction && txn.status !== "pending");
}

const lines = [];
const failures = [];

function check(name, ok, detail) {
  lines.push("- " + (ok ? "PASS" : "FAIL") + " " + name + ": " + detail);
  if (!ok) failures.push(name);
}

const periods = ["day", "week", "month"];
const data = dashboardState();
const FlowStore = {
  appendTransaction, resetStore, dashboardState, dashboardSnapshot, SAMPLE_BILL, SAMPLE_BILLS,
  EXTRACT_DELAY_MS, extractBill, extractDelayMs, extractedBillForm, offsetFromLabel,
  createPaymentLink, simulatePayment, settlePayment, confirmMatch,
  publishCheckoutPage, payPublishedCheckout, settleCheckoutPayment,
  createSubscriptionPlan, addSubscriber, runSimulatedBilling, settleBilling,
  cancelSubscriber, deactivatePaymentLink, connectShopify, ingestShopifyOrder,
  connectSampleBank, setSmartCheckout, SAMPLE_CHECKOUT_ANALYTICS,
  exportTallyXml, simulateZohoSync, resetGateway
};
let pendingExtract = null;
function gatedTimeout(fn, ms) {
  if (typeof ms === "number" && ms >= EXTRACT_DELAY_MIN_MS && ms <= EXTRACT_DELAY_MAX_MS) {
    pendingExtract = { fn, ms };
    return { extract: true };
  }
  return setTimeout(fn, ms);
}
const html = readFileSync(new URL("../public/flow.dc.html", import.meta.url), "utf8");
const payPage = readFileSync(new URL("../public/pay.html", import.meta.url), "utf8");
const rootSource = html.match(/<script\b[^>]*data-dc-script[^>]*>([\s\S]*?)<\/script>/)[1];
const root = runInNewContext(rootSource + "; new Component()", {
  DCLogic: class {
    props = {};
    setState(update) {
      const patch = typeof update === "function" ? update(this.state) : update;
      if (!patch) return;
      this.state = Object.assign({}, this.state, patch);
    }
  },
  FlowStore,
  navigator: { clipboard: { writeText: async () => {} } },
  setTimeout: gatedTimeout,
  clearTimeout,
  Promise,
  window: { FLOW_DATA: data, FlowStore, innerWidth: 1440 }
});
check("Home defaults to 30 days", root.state.tf === "month", root.periodOf().label);
const homeToggle = root.renderVals().tfs.map(item => item.label).join(" / ");
check("Home period toggle uses rolling labels",
  homeToggle === "24h / 7 days / 30 days",
  homeToggle);
const homeMatch = root.renderVals();
check("Matching status open equals Needs Your Attention",
  Number(homeMatch.match.open) === Number(homeMatch.att.count) &&
    Number(homeMatch.match.matched) + Number(homeMatch.match.open) === Number(homeMatch.match.totalItems) &&
    homeMatch.att.any === (Number(homeMatch.att.count) > 0) &&
    homeMatch.att.none === (Number(homeMatch.att.count) === 0),
  homeMatch.match.matched + " of " + homeMatch.match.totalItems + " · " + homeMatch.match.open + " open · attention " + homeMatch.att.count
);
const prevMatches = root.state.matches;
const prevAttention = root.state.attention;
root.state.matches = [];
root.state.attention = [];
const zeroMatch = root.renderVals();
const autoZero = zeroMatch.kpis.find(k => k.label === "Auto-matched");
check("Matching status zero copy",
  zeroMatch.match.look === "Everything is matched" &&
    zeroMatch.match.hasOpen === false &&
    zeroMatch.match.pctText === "100%" &&
    zeroMatch.match.matched === String(zeroMatch.match.totalItems) &&
    autoZero.delta === "0 open",
  zeroMatch.match.look + "; " + zeroMatch.match.matched + " of " + zeroMatch.match.totalItems + "; kpi " + autoZero.delta
);
const oneRow = (prevAttention[0] || prevMatches[0]);
root.state.matches = [oneRow];
root.state.attention = [oneRow];
const oneMatch = root.renderVals();
const autoOne = oneMatch.kpis.find(k => k.label === "Auto-matched");
check("Matching status singular copy",
  oneMatch.match.look === "1 still needs a look" &&
    oneMatch.match.openLabel === "1 open" &&
    oneMatch.match.hasOpen === true &&
    autoOne.delta === "1 open",
  oneMatch.match.look + "; header " + oneMatch.match.openLabel + "; kpi " + autoOne.delta
);
root.state.matches = prevMatches;
root.state.attention = prevAttention;
check("Money formatting normalizes negative zero",
  formatMoney(-0, "QAR") === "QR 0" && formatMoney(0, "QAR") === "QR 0" &&
  formatMoney(-1, "QAR") === "-QR 0.01" && formatMoney(-154000, "QAR") === "-QR 1,540.00",
  "zero " + money(-0) + "; negative minor unit " + money(-1));
check("Zero P&L expenses have no negative sign",
  ["refunds", "costOfSales", "salaries", "overheads"].every(key => data.periods.day.pnl.formatted[key] === "QR 0"),
  "day expenses " + ["refunds", "costOfSales", "salaries", "overheads"].map(key => data.periods.day.pnl.formatted[key]).join(", "));
for (const homePeriod of periods) {
  root.state.tf = homePeriod;
  check("Reports independent of Home " + homePeriod,
    root.state.reportsTf === "month" && root.reportsPeriod() === data.periods.month && root.periodOf() === data.periods[homePeriod],
    root.reportsPeriod().label + "; revenue " + money(getProfitAndLoss("month").revenue));
  const values = getNetSeries(homePeriod).values;
  const scale = chartScale(values, seed.merchant.currency);
  const low = Math.min(0, ...values), high = Math.max(0, ...values);
  const padding = Math.max(1, Math.ceil((high - low) * 0.1));
  check(homePeriod + " chart auto-scales with 10% padding and includes zero",
    scale.min === low - padding && scale.max === high + padding && scale.min < scale.max &&
    scale.min <= 0 && scale.max >= 0 && scale.ticks.some(tick => tick.value === 0),
    "domain " + money(scale.min) + " to " + money(scale.max));
  const inBounds = values.every((_, index) => {
    root.state.hoverIdx = index;
    const y = Number(root.chart().marker.y);
    return y >= 20 && y <= 168;
  });
  root.state.hoverIdx = null;
  check(homePeriod + " chart shows the full balance range", inBounds,
    "all " + values.length + " points inside plot; minimum " + money(Math.min(...values)) + ", maximum " + money(Math.max(...values)));
}
// Exercise the failure path without changing the seed on disk.
const expense = live().transactions.find(txn => txn.id === "txn_03");
const originalTag = expense.tag;
let driftDetected = false;
try {
  expense.tag = "Unclassified test expense";
  try { getNet("month"); } catch (error) {
    driftDetected = /30-day Home Net.*does not equal Reports net profit/.test(error.message);
  }
} finally {
  expense.tag = originalTag;
}
check("Runtime assertion rejects Home/Reports drift", driftDetected, "unclassified completed expense triggers an error");

const refund = live().transactions.find(txn => txn.id === "txn_02");
const originalStatus = refund.status;
const completedMoneyOut = getMoneyOut("month");
try {
  refund.status = "pending";
  check("Pending outflow excluded from realised money",
    getMoneyOut("month") === completedMoneyOut - refund.amountMinor && getRefunds("month") === 0 && getNet("month") === getProfitAndLoss("month").netProfit,
    "pending refund excluded from Money Out and P&L");
} finally {
  refund.status = originalStatus;
}
for (const period of periods) {
  const moneyIn = getMoneyIn(period);
  const moneyOut = getMoneyOut(period);
  const net = getNet(period);
  const series = getNetSeries(period);
  const last = series.values[series.values.length - 1];
  const pending = getPendingSettlement(period);
  if (period === "month") {
    check("Month chart thins labels only",
      series.values.length === 30 && series.labels.length === 30 && series.labels.filter(Boolean).length === 6 &&
      series.labels.every((label, index) => label === (index % 5 === 0
        ? dateFor(index - 29).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : "")),
      "30 data points; ticks " + series.labels.filter(Boolean).join(", "));
  }
  const pageIn = completed("in")
    .filter(txn => txn.dayOffset <= 0 && txn.dayOffset >= (period === "month" ? -29 : period === "week" ? -6 : 0))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const pageOut = completed("out")
    .filter(txn => txn.dayOffset <= 0 && txn.dayOffset >= (period === "month" ? -29 : period === "week" ? -6 : 0))
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const pnl = getProfitAndLoss(period);

  check(
    period + " Money In vs completed inflow rows",
    moneyIn === pageIn,
    money(moneyIn) + " vs ledger " + money(pageIn)
  );
  check(
    period + " Money Out vs completed outflow rows",
    moneyOut === pageOut,
    money(moneyOut) + " vs ledger " + money(pageOut)
  );
  check(
    period + " Net equals Money In minus Money Out",
    net === moneyIn - moneyOut,
    money(net) + " = " + money(moneyIn) + " - " + money(moneyOut)
  );
  check(
    period + " chart last point equals Net",
    last === net && series.values.length >= 2,
    "last " + money(last ?? 0) + ", points " + series.values.length
  );
  if (period !== "day") {
    const firstOffset = period === "week" ? -6 : -29;
    check(period + " chart includes every completed transaction on its day",
      series.values.every((value, index) => value === live().transactions
        .filter(txn => txn.status !== "pending" && txn.dayOffset >= firstOffset && txn.dayOffset <= firstOffset + index)
        .reduce((sum, txn) => sum + signedAmount(txn), 0)),
      series.values.length + " cumulative points checked, including refunds");
  }
  const pendingIn = live().transactions
    .filter(txn => txn.status === "pending" && txn.direction === "in")
    .filter(txn => period === "month" ? txn.dayOffset >= -29 : period === "week" ? txn.dayOffset >= -6 : txn.dayOffset === 0)
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  check(
    period + " pending excluded from Money In",
    moneyIn === pageIn && pending === pendingIn,
    "pending " + money(pending) + " sits outside Money In " + money(moneyIn)
  );
  const refunds = getRefunds(period);
  check(
    period + " refunds line sits under revenue",
    pnl.revenue === moneyIn && pnl.netProfit === moneyIn - refunds - pnl.costOfSales - pnl.salaries - pnl.overheads,
    "revenue " + money(pnl.revenue) + ", refunds " + money(refunds) + ", net " + money(pnl.netProfit)
  );
}

const payrollTxn = live().transactions.find(txn => txn.id === seed.payrollRuns[0].transactionId);
const payrollNet = getPayrollNet(seed.payrollRuns[0].id);
check(
  "Payroll net equals payroll transaction",
  payrollTxn && payrollTxn.amountMinor === payrollNet,
  money(payrollNet) + " vs " + (payrollTxn ? payrollTxn.id + " " + money(payrollTxn.amountMinor) : "missing")
);

const statusRows = live().invoices.map(invoice => {
  const status = getInvoiceStatus(invoice.id);
  const linked = live().transactions.filter(txn => txn.invoiceId === invoice.id);
  return invoice.number + " " + status + " linked " + (linked.map(txn => txn.id + "/" + txn.type + "/" + txn.status).join(", ") || "none");
});
const statusOk = live().invoices.every(invoice => {
  const status = getInvoiceStatus(invoice.id);
  const linked = live().transactions.filter(txn => txn.invoiceId === invoice.id);
  if (linked.some(txn => txn.type === "refund")) return status === "refunded";
  const settledIn = linked.filter(txn => txn.direction === "in" && txn.status !== "pending").reduce((sum, txn) => sum + txn.amountMinor, 0);
  if (settledIn >= invoice.amountMinor) return status === "paid";
  if (linked.some(txn => txn.status === "pending")) return status === "awaiting settlement";
  if (invoice.dueOffset < 0) return status === "overdue";
  return status === "viewed" || status === "sent" || status === "draft";
});
check("Invoice status matches linked transactions", statusOk, statusRows.join("; "));

const outstanding = getOutstanding();
const unpaidRows = live().invoices.filter(invoice => {
  const status = getInvoiceStatus(invoice.id);
  return status !== "paid" && status !== "refunded" && status !== "draft";
});
const unpaidSum = unpaidRows.reduce((sum, invoice) => sum + invoice.amountMinor, 0);
check(
  "Outstanding equals unpaid invoice rows",
  outstanding.amountMinor === unpaidSum && outstanding.count === unpaidRows.length,
  money(outstanding.amountMinor) + " across " + outstanding.count + " invoices"
);

const whoOwes = getOutstandingInvoices();
const whoOwesSum = whoOwes.reduce((sum, invoice) => sum + invoice.amountMinor, 0);
check(
  "Who owes me equals Outstanding",
  whoOwesSum === outstanding.amountMinor && whoOwes.length === outstanding.count &&
    data.ageing.amountMinor === outstanding.amountMinor && data.ageing.count === outstanding.count &&
    !whoOwes.some(invoice => getInvoiceStatus(invoice.id) === "refunded") &&
    !data.ageing.rows.some(row => row.status === "Refunded"),
  money(whoOwesSum) + " across " + whoOwes.length + " invoices"
);
const zeroAgeingDefault = data.ageing.buckets.every(bucket => {
  const amount = Number(String(bucket.val).replace(/[^\d.-]/g, "")) || 0;
  return amount > 0 || bucket.color === "var(--ink)";
});
check("Zero ageing buckets use default colour", zeroAgeingDefault, data.ageing.buckets.map(bucket => bucket.label + " " + bucket.val + " " + bucket.color).join("; "));

const rate = getMatchRate();
const open = getOpenMatches();
const openTransactionIds = new Set(open.map(proposal => proposal.transactionId));
const monthMatchRows = live().transactions.filter(txn =>
  (txn.direction === "in" || txn.type === "refund") && txn.dayOffset >= -29 && txn.dayOffset <= 0);
const linkedOpen = monthMatchRows.filter(txn => openTransactionIds.has(txn.id) && txn.invoiceId !== null);
const confirmedRows = monthMatchRows.filter(txn => !openTransactionIds.has(txn.id) && (txn.invoiceId !== null || txn.source === "shopify"));
check("Unconfirmed invoice links excluded from matched",
  rate.matched === confirmedRows.length && rate.total === monthMatchRows.length,
  "excluded " + linkedOpen.map(txn => txn.id).join(", ") + "; " + rate.matched + " of " + rate.total + " over 30 days");
check(
  "matched + open equals total",
  rate.matched + open.length === rate.total,
  rate.matched + " matched + " + open.length + " open = " + rate.total + " (" + rate.percent + "%)"
);

check(
  "No VAT line for this merchant",
  getVatRate() === 0 && seed.merchant.country === "QA" && seed.merchant.vatRegistered === false,
  "vat rate " + getVatRate() + ", country " + seed.merchant.country
);

const pendingTxn = live().transactions.find(txn => txn.status === "pending");
lines.push("");
lines.push("Computed figures (month window, minor units stored, displayed as QR):");
const monthPnl = getProfitAndLoss("month");
const expected = {
  revenue: 4651000,
  refunds: 154000,
  costOfSales: 513000,
  salaries: 1966500,
  overheads: 703000,
  netProfit: 1314500
};
const qr0 = minor => Math.round(minor / 100).toLocaleString("en-US");
const grouping = [
  "Revenue " + qr0(monthPnl.revenue),
  "Refunds -" + qr0(monthPnl.refunds),
  "Cost of sales -" + qr0(monthPnl.costOfSales),
  "Salaries -" + qr0(monthPnl.salaries),
  "Overheads -" + qr0(monthPnl.overheads),
  "Net profit " + qr0(monthPnl.netProfit)
];
const observed = {
  ...monthPnl,
  moneyIn: getMoneyIn("month"), moneyOut: getMoneyOut("month"), net: getNet("month"),
  pending: getPendingSettlement("month"), marginPercent: Math.round(monthPnl.margin * 100),
  matched: rate.matched, totalMatches: rate.total, matchPercent: rate.percent, openMatches: open.length,
  invoiced: getTotalInvoiced().amountMinor, invoiceCount: getTotalInvoiced().count,
  outstanding: outstanding.amountMinor, outstandingCount: outstanding.count, overdue: getOverdue().amountMinor,
  cashOnHand: getCashOnHand(), opening: getOpeningBalance(),
  spendTotal: getSpend("month").total, spendRefunds: getSpend("month").refunds,
  spendHasSales: getSpend("month").tags.some(row => row.tag === "Sales"),
  spendHasRefundVendor: getSpend("month").vendors.some(row => /refund/i.test(row.name)),
  runwayProfitable: getRunway("month").profitable,
  accountantName: seed.merchant.accountantName,
  ownerOnTeam: seed.teamMembers.some(member => member.role === "Owner" && member.name === seed.merchant.ownerName),
  transactions: live().transactions.length, planLimit: seed.merchant.plan.txnLimit,
  doha: getBranchComparison().find(b => b.id === "br_01").inflow,
  wakrah: getBranchComparison().find(b => b.id === "br_02").inflow,
  dohaShare: Math.round(getBranchComparison().find(b => b.id === "br_01").inflow / getMoneyIn("month") * 100),
  wakrahShare: Math.round(getBranchComparison().find(b => b.id === "br_02").inflow / getMoneyIn("month") * 100),
  inv0149: getInvoiceStatus("inv_0149"), inv0150: getInvoiceStatus("inv_0150")
};
Object.assign(expected, {
  moneyIn: 4651000, moneyOut: 3336500, net: 1314500, pending: 630000, marginPercent: 28,
  matched: 9, totalMatches: 12, matchPercent: 75, openMatches: 3,
  invoiced: 4330000, invoiceCount: 9, outstanding: 2090000, outstandingCount: 3, overdue: 920000,
  cashOnHand: 9814500, opening: 8500000,
  spendTotal: 3182500, spendRefunds: 154000, spendHasSales: false, spendHasRefundVendor: false,
  runwayProfitable: true, accountantName: "Priya Menon", ownerOnTeam: true,
  transactions: 20, planLimit: 5000, doha: 2831000, wakrah: 1820000, dohaShare: 61, wakrahShare: 39,
  inv0149: "paid", inv0150: "paid"
});
const mismatch = Object.keys(expected).filter(key => observed[key] !== expected[key]);
if (mismatch.length) {
  const rows = live().transactions.filter(txn => txn.dayOffset <= 0 && txn.dayOffset >= -29);
  const bucket = (pred) => rows.filter(pred).map(txn => txn.id + " " + txn.tag + " " + txn.type + " " + txn.status + " " + money(txn.amountMinor)).join("; ") || "(none)";
  console.error("Figures differ: " + mismatch.map(key => key + " computed=" + observed[key] + " expected=" + expected[key]).join("; "));
  console.error(grouping.join("\n"));
  const completedRows = live().transactions.filter(txn => txn.status !== "pending");
  console.error("Cash grouping: opening " + money(getOpeningBalance()) + "; signed completed " + money(completedRows.reduce((sum, txn) => sum + signedAmount(txn), 0)) + "; cash on hand " + money(getCashOnHand()));
  console.error("Completed inflow: " + bucket(txn => txn.direction === "in" && txn.status !== "pending"));
  console.error("Refunds: " + bucket(txn => txn.type === "refund"));
  console.error("Cost of sales: " + bucket(txn => txn.direction === "out" && txn.status !== "pending" && txn.type !== "refund" && (txn.tag === "Supplies" || txn.tag === "Rent")));
  console.error("Salaries: " + bucket(txn => txn.direction === "out" && txn.status !== "pending" && txn.tag === "Salaries"));
  console.error("Overheads: " + bucket(txn => txn.direction === "out" && txn.status !== "pending" && txn.type !== "refund" && (txn.tag === "Utilities" || txn.tag === "Marketing" || txn.tag === "Fees")));
  process.exit(1);
}
check("All requested figures match", mismatch.length === 0, "Home, Reports, matching, branches, invoices and plan usage");
check("Home Net equals Reports net profit (30 days)", getNet("month") === monthPnl.netProfit,
  money(getNet("month")) + " = " + money(monthPnl.netProfit));
lines.push("- 30-day P&L: " + grouping.join("; ") + "; margin " + Math.round(monthPnl.margin * 100) + "%");
lines.push("- matched + open = total: " + rate.matched + " + " + open.length + " = " + rate.total);
lines.push("- Money In: " + money(getMoneyIn("month")));
lines.push("- Money Out: " + money(getMoneyOut("month")));
lines.push("- Net: " + money(getNet("month")));
lines.push("- Pending settlement: " + money(getPendingSettlement("month")) + (pendingTxn ? " (" + pendingTxn.id + ")" : ""));
lines.push("- Cash on hand: " + money(getCashOnHand()) + " = opening " + money(getOpeningBalance()) + " + completed net " + money(getCashOnHand() - getOpeningBalance()));
lines.push("- Who owes me equals Outstanding: " + money(outstanding.amountMinor) + " across " + outstanding.count + " invoices");
lines.push("- Overdue: " + money(getOverdue().amountMinor));
lines.push("- Total invoiced: " + money(getTotalInvoiced().amountMinor) + " (" + getTotalInvoiced().count + ")");
lines.push("- Plan usage: " + live().transactions.length + " of " + seed.merchant.plan.txnLimit);
lines.push("- Branches: " + getBranchComparison().map(branch => branch.name + " inflow " + money(branch.inflow) + " (" + Math.round(branch.inflow / getMoneyIn("month") * 100) + "%)").join("; "));

check("Sample bill is distinct from seed Kahramaa",
  data.scan.vendor === "Barzan Water" &&
    SAMPLE_BILL.amountMinor === 118000 &&
    SAMPLE_BILL.dayOffset <= 0 && SAMPLE_BILL.dayOffset >= -6 &&
    !seed.transactions.some(txn => txn.counterparty === "Barzan Water"),
  data.scan.vendor + " " + data.scan.date + " offset " + data.scan.dayOffset);
check("Two sample bills ship in the repo",
  SAMPLE_BILLS.length === 2 &&
    SAMPLE_BILLS[1].vendor === "Al Maha Stationery" &&
    SAMPLE_BILLS[1].amountMinor === 34000 &&
    SAMPLE_BILLS[1].taxMinor === 0 &&
    SAMPLE_BILLS[0].taxMinor === 0 &&
    !seed.transactions.some(txn => txn.counterparty === "Al Maha Stationery") &&
    existsSync(new URL("../public/samples/barzan-water.pdf", import.meta.url)) &&
    existsSync(new URL("../public/samples/al-maha-stationery.svg", import.meta.url)),
  SAMPLE_BILLS.map(bill => bill.filename).join(", "));
const barzanExtract = extractBill("barzan-water.pdf");
const almahaExtract = extractBill("al-maha-stationery.svg");
const barzanLines = barzanExtract.lines.reduce((sum, line) => sum + line.amountMinor, 0);
check("Extraction returns vendor, date, total, tax, lines and tag",
  barzanExtract.vendor === "Barzan Water" &&
    barzanExtract.amountMinor === 118000 &&
    barzanExtract.taxMinor === 0 &&
    barzanExtract.tag === "Utilities" &&
    barzanExtract.lines.length === 2 &&
    barzanLines === barzanExtract.amountMinor &&
    almahaExtract.vendor === "Al Maha Stationery" &&
    almahaExtract.tag === "Supplies" &&
    typeof barzanExtract.confidence.vendor === "number" &&
    barzanExtract.confidence.vendor > 0 && barzanExtract.confidence.vendor <= 1,
  barzanExtract.vendor + " / " + almahaExtract.vendor);
check("Scan accepts an image or PDF",
  /accept="image\/\*,application\/pdf"/.test(html) && /Choose image or PDF/.test(html),
  "file input accept image/*,application/pdf");
check("Extraction delay is 1.5-2.5s",
  EXTRACT_DELAY_MS >= EXTRACT_DELAY_MIN_MS && EXTRACT_DELAY_MS <= EXTRACT_DELAY_MAX_MS,
  EXTRACT_DELAY_MS + "ms");
root.state.modal = "scan";
pendingExtract = null;
root.startExtract("bill_barzan");
check("Scan shows extraction in progress",
  root.state.scanBusy === true && root.state.scanDone === false &&
    pendingExtract && pendingExtract.ms >= EXTRACT_DELAY_MIN_MS && pendingExtract.ms <= EXTRACT_DELAY_MAX_MS,
  pendingExtract ? pendingExtract.ms + "ms" : "no delay");
pendingExtract.fn();
const extractedForm = extractedBillForm(barzanExtract);
check("Extracted fields are correctable with confidence",
  root.state.scanDone === true && root.state.scanBusy === false &&
    root.state.form.scanVendor === "Barzan Water" &&
    root.state.form.scanTax === extractedForm.form.scanTax &&
    root.state.scanLines.length === 2 &&
    root.state.scanConf.vendor === extractedForm.conf.vendor &&
    root.state.scanConf.total === extractedForm.conf.total,
  root.state.form.scanVendor + " tax " + root.state.form.scanTax + " · vendor " + root.state.scanConf.vendor);
root.state.form = Object.assign({}, root.state.form, {
  scanVendor: data.scan.vendor,
  scanAmount: data.scan.amount,
  scanDate: data.scan.date,
  scanTag: "Utilities",
  scanOffset: data.scan.dayOffset
});
root.submitModal();
const monthAfter = root.state.periods.month;
const recentTop = root.sortedTxns()[0];
check("Scan save recomputes Money Out",
  monthAfter.moneyOut === 34545 && getMoneyOut("month") === 3454500,
  "Money Out " + monthAfter.moneyOutText + " (was QR 33,365.00)");
check("Scan save drops Reports net profit",
  monthAfter.pnl.netProfit === 11965 && getProfitAndLoss("month").netProfit === 1196500,
  "net profit " + monthAfter.pnl.formatted.netProfit + " (was QR 13,145.00)");
check("Scanned bill sorts to top of Recent Activity",
  recentTop && recentTop.party === "Barzan Water" && recentTop.offset === SAMPLE_BILL.dayOffset,
  recentTop ? recentTop.party + " offset " + recentTop.offset : "missing");
resetStore();
root.applyStore({ modal: "scan" });
pendingExtract = null;
root.startExtract("bill_almaha");
pendingExtract.fn();
root.submitModal();
check("Second sample bill saves through selectors",
  getMoneyOut("month") === 3336500 + 34000 &&
    getProfitAndLoss("month").netProfit === 1314500 - 34000 &&
    live().transactions.some(txn => txn.counterparty === "Al Maha Stationery" && txn.amountMinor === 34000 && txn.tag === "Supplies" && txn.dayOffset === -1),
  "Money Out " + money(getMoneyOut("month")) + " · Al Maha Stationery");
check("Payment link copies to clipboard",
  /clipboard\.writeText/.test(rootSource),
  "submitModal writes the pay URL");
resetStore();
resetGateway();

const moneyIn0 = getMoneyIn("month");
const net0 = getNet("month");
const out0 = getOutstanding();
const pending0 = getPendingSettlement("month");
const match0 = getMatchRate();
const open0 = getOpenMatches().length;
const link = await createPaymentLink({
  amountMinor: 540000,
  description: "Lusail hospitality balance",
  clientId: "cli_07",
  invoiceId: "inv_0148"
});
check("Payment link URL stays on Flow, not SkipCash test",
  /\/pay\//.test(link.payUrl) && !/skipcashtest|azurewebsites/i.test(link.payUrl),
  link.payUrl);
check("Copied payment links open Flow checkout",
  /\/pay\//.test(dashboardState().links.find(row => row.id === link.id)?.payUrl || "") &&
    /paymentLinkById/.test(payPage) &&
    !/skipcashtest|azurewebsites/i.test(payPage),
  "pay.html handles payment links");
check("Spine create leaves Money In unchanged",
  getMoneyIn("month") === moneyIn0 && getNet("month") === net0,
  "Money In " + money(getMoneyIn("month")));
check("Home Net equals Reports after creating a link",
  getNet("month") === getProfitAndLoss("month").netProfit,
  money(getNet("month")));
check("Who owes me equals Outstanding after creating a link",
  getOutstanding().amountMinor === out0.amountMinor && getOutstanding().count === out0.count,
  money(getOutstanding().amountMinor) + " across " + getOutstanding().count);

const sim = await simulatePayment(link.id, "success");
const spinePending = live().transactions.find(txn => txn.id === sim.txnId);
check("Spine success appends a pending ledger row",
  spinePending && spinePending.status === "pending" && spinePending.direction === "in" && spinePending.source === "link" && spinePending.tag === "Sales" && spinePending.branchId === "br_01" && spinePending.invoiceId === "inv_0148",
  spinePending ? spinePending.id + " " + spinePending.status : "missing");
check("Pending payment is excluded from Money In",
  getMoneyIn("month") === moneyIn0 && getPendingSettlement("month") === pending0 + 540000,
  "Money In " + money(getMoneyIn("month")) + "; pending " + money(getPendingSettlement("month")));
check("Linked invoice awaits settlement while pending",
  getInvoiceStatus("inv_0148") === "awaiting settlement",
  getInvoiceStatus("inv_0148"));
check("Needs Your Attention includes the new proposal",
  getOpenMatches().some(proposal => proposal.transactionId === sim.txnId),
  getOpenMatches().length + " open");
check("matched + open after pending payment",
  getMatchRate().matched + getOpenMatches().length === getMatchRate().total,
  getMatchRate().matched + " + " + getOpenMatches().length + " = " + getMatchRate().total);
check("Who owes me equals Outstanding while payment is pending",
  getOutstanding().amountMinor === out0.amountMinor,
  money(getOutstanding().amountMinor));
check("Home Net equals Reports while payment is pending",
  getNet("month") === getProfitAndLoss("month").netProfit,
  money(getNet("month")));
const recentPending = dashboardState().txns[0];
check("Pending payment is at the top of Recent Activity",
  recentPending && recentPending.id === sim.txnId && recentPending.status === "Pending",
  recentPending ? recentPending.party + " " + recentPending.status : "missing");

settlePayment(link.id);
check("Spine settle increases Money In by the bill amount",
  getMoneyIn("month") === moneyIn0 + 540000,
  "Money In " + money(getMoneyIn("month")) + " (was " + money(moneyIn0) + ")");
check("Spine settle lifts Home Net and Reports net profit",
  getNet("month") === net0 + 540000 && getNet("month") === getProfitAndLoss("month").netProfit,
  "Net " + money(getNet("month")));
check("Invoice is paid after settlement",
  getInvoiceStatus("inv_0148") === "paid",
  getInvoiceStatus("inv_0148"));
check("Outstanding drops by the paid invoice",
  getOutstanding().amountMinor === out0.amountMinor - 540000 && getOutstanding().count === out0.count - 1,
  money(getOutstanding().amountMinor) + " across " + getOutstanding().count);
check("Who owes me equals Outstanding after settlement",
  getOutstandingInvoices().reduce((sum, invoice) => sum + invoice.amountMinor, 0) === getOutstanding().amountMinor,
  money(getOutstanding().amountMinor));
const recentSettled = dashboardState().txns[0];
check("Settled payment stays at the top of Recent Activity",
  recentSettled && recentSettled.id === sim.txnId && recentSettled.status === "Settled",
  recentSettled ? recentSettled.party + " " + recentSettled.status : "missing");

confirmMatch("mp_" + sim.txnId);
const rateAfter = getMatchRate();
const openAfter = getOpenMatches();
check("Confirming the new match updates the match rate",
  rateAfter.matched === match0.matched + 1 && openAfter.length === open0 &&
    rateAfter.matched + openAfter.length === rateAfter.total &&
    !openAfter.some(proposal => proposal.transactionId === sim.txnId),
  rateAfter.matched + " of " + rateAfter.total + " · " + openAfter.length + " open");
check("Home Net equals Reports after confirm",
  getNet("month") === getProfitAndLoss("month").netProfit,
  money(getNet("month")));
resetStore();
resetGateway();

const tallyRows = transactionsInTallyRange(-29, 0);
const tallyFile = buildTallyExport();
const tallyXml = tallyFile.xml;
const voucherCount = (tallyXml.match(/<VOUCHER /g) || []).length;
const pendingInXml = /<REFERENCE>txn_13<\/REFERENCE>/.test(tallyXml);
const costCentreOk = tallyRows.every(txn => {
  const ref = "<REFERENCE>" + txn.id + "</REFERENCE>";
  const at = tallyXml.indexOf(ref);
  if (at < 0) return false;
  const start = tallyXml.lastIndexOf("<VOUCHER", at);
  const end = tallyXml.indexOf("</VOUCHER>", at);
  const block = tallyXml.slice(start, end);
  return block.includes("<COSTCENTREALLOCATIONS.LIST>") && block.includes("<NAME>" + txn.tag + "</NAME>");
});
const sampleAmount = tallyXml.includes("<REFERENCE>txn_01</REFERENCE>") && tallyXml.includes("1540.00");
check("Tally export uses ENVELOPE / HEADER / BODY",
  tallyXml.includes("<ENVELOPE>") && tallyXml.includes("<HEADER>") && tallyXml.includes("<BODY>") &&
    tallyXml.includes("<TALLYREQUEST>Import</TALLYREQUEST>") && tallyXml.includes("<ID>Vouchers</ID>"),
  "envelope present");
check("Tally export is one voucher per settled transaction in the last 30 days",
  tallyFile.items === 19 && voucherCount === 19 && tallyRows.length === 19 && !pendingInXml,
  voucherCount + " vouchers; pending txn_13 " + (pendingInXml ? "included" : "omitted"));
check("Tally vouchers tag the cost centre",
  costCentreOk,
  "COSTCENTREALLOCATIONS.LIST NAME = transaction tag");
check("Tally amounts are major units",
  sampleAmount,
  "txn_01 1540.00");
check("Tally filename uses from and to stamps",
  /^flow-tally-export-\d{8}-\d{8}\.xml$/.test(tallyFile.filename) &&
    tallyFile.filename === "flow-tally-export-" + tallyFile.filename.slice(18, 26) + "-" + tallyFile.filename.slice(27, 35) + ".xml",
  tallyFile.filename);
const weekTally = buildTallyExport(formatDate(-6), formatDate(0));
check("Tally range is editable",
  weekTally.items === 5 && weekTally.fromOffset === -6 && weekTally.toOffset === 0,
  weekTally.items + " vouchers from " + formatDate(-6) + " to " + formatDate(0));

const exported = exportTallyXml();
const zoho = simulateZohoSync();
const history = live().exportHistory;
check("Tally export is recorded in history",
  history.some(row => row.kind === "tally" && row.filename === exported.filename && row.status === "Success" && !row.simulated),
  history.filter(row => row.kind === "tally").length + " tally row(s)");
check("Zoho sync is labelled simulated and recorded",
  zoho.simulated && zoho.status === "Simulated" && zoho.target.includes("simulated") &&
    history.some(row => row.id === zoho.id && row.kind === "zoho" && row.items === 19),
  zoho.target + " · " + zoho.items + " items");
check("From and To inputs are bound",
  /onChange="\{\{ F\.periodFrom \}\}"/.test(html) && /onChange="\{\{ F\.periodTo \}\}"/.test(html),
  "periodFrom / periodTo onChange");
check("Export XML downloads a file",
  /downloadNamedFile/.test(rootSource) && /exportTallyXml/.test(rootSource),
  "runTallyExport writes XML");

resetStore();
root.applyStore();
root.runTallyExport();
root.runZohoSync();
check("Tally export history appears in the UI",
  (root.state.exportHistory || []).some(row => row.kind === "tally" && row.status === "Success") &&
    (root.state.exportHistory || []).length === 2,
  (root.state.exportHistory || []).length + " history row(s)");
check("Zoho sync success is visible",
  root.state.zoho && root.state.zoho.hasLast && String(root.state.zoho.line).includes("simulated") &&
    (root.state.syncLog || []).some(row => row.status === "Simulated"),
  root.state.zoho ? root.state.zoho.line : "missing");
resetStore();
resetGateway();

check("Hosted checkout publishes a shareable /pay/ slug",
  existsSync(new URL("../public/pay.html", import.meta.url)) &&
    /\/pay\/:slug/.test(readFileSync(new URL("../next.config.js", import.meta.url), "utf8")) &&
    /\/pay\//.test(html),
  "pay.html + rewrite + UI URL");
check("Public payment page matches the builder without edit chrome",
  /Payment details/.test(payPage) &&
    /Share this on/.test(payPage) &&
    /Secured by SkipCash · SANDBOX/.test(payPage) &&
    /Contact us/.test(payPage) &&
    !/Click any text to edit/i.test(payPage) &&
    !/Add new/.test(payPage) &&
    !/pp\.setTitle/.test(payPage),
  "customer checkout chrome");
const page = publishCheckoutPage({
  productName: "Eid hamper",
  description: "Pickup from the Doha store",
  amountMinor: 25000,
  accent: "#17171C"
});
check("Published checkout stores product name, QAR price and slug",
  page.slug === "eid-hamper" && page.amountMinor === 25000 && page.published && page.currency === "QAR",
  page.slug + " " + money(page.amountMinor));
const moneyInBeforePay = getMoneyIn("month");
const netBeforePay = getNet("month");
const checkoutPay = await payPublishedCheckout(page.slug);
check("Hosted checkout pay appends a pending SkipCash row",
  checkoutPay.pending && live().transactions.some(txn => txn.id === checkoutPay.txnId && txn.source === "skipcash" && txn.status === "pending" && txn.amountMinor === 25000),
  checkoutPay.txnId || "missing");
check("Hosted checkout pending is excluded from Money In",
  getMoneyIn("month") === moneyInBeforePay,
  money(getMoneyIn("month")));
settleCheckoutPayment(checkoutPay.txnId);
check("Hosted checkout settle lifts Money In by the page price",
  getMoneyIn("month") === moneyInBeforePay + 25000 && getNet("month") === netBeforePay + 25000,
  "Money In " + money(getMoneyIn("month")));
check("Home Net equals Reports after hosted checkout",
  getNet("month") === getProfitAndLoss("month").netProfit,
  money(getNet("month")));
check("matched + open after hosted checkout",
  getMatchRate().matched + getOpenMatches().length === getMatchRate().total,
  getMatchRate().matched + " + " + getOpenMatches().length + " = " + getMatchRate().total);
resetStore();
resetGateway();

const linkForOff = await createPaymentLink({ amountMinor: 10000, description: "Deactivate me", expiry: formatDate(7) });
deactivatePaymentLink(linkForOff.id);
const offView = dashboardState().links.find(row => row.id === linkForOff.id);
check("Payment link deactivate updates status",
  offView && offView.status === "Deactivated" && offView.canSimulate === false && offView.canDeactivate === false,
  offView ? offView.status : "missing");
check("Payment links expose expiry, uses and copy URL",
  offView && offView.expiry === formatDate(7) && offView.uses === 0 && !!offView.payUrl && /copyPayUrl/.test(rootSource),
  offView ? offView.expiry + " · uses " + offView.uses : "missing");
resetStore();
resetGateway();

const plan = await createSubscriptionPlan({
  name: "Monthly Care",
  amountMinor: 40000,
  interval: "Month",
  description: "Weekly restock",
  customerName: "Layla Hassan"
});
const upcoming = live().upcomingCharges.filter(row => row.status === "upcoming");
check("Subscription plan creates a customer and upcoming charge",
  plan.name === "Monthly Care" && live().subscribers.some(row => row.name === "Layla Hassan" && row.planId === plan.id) && upcoming.length === 1 && upcoming[0].amountMinor === 40000,
  upcoming.length + " upcoming · " + money(plan.amountMinor));
const moneyInBeforeBill = getMoneyIn("month");
const billed = await runSimulatedBilling(upcoming[0].id);
check("Simulated billing appends a pending ledger row",
  billed.pending && live().transactions.some(txn => txn.id === billed.txnId && txn.source === "skipcash" && txn.amountMinor === 40000),
  billed.txnId || "missing");
settleBilling(billed.txnId);
check("Simulated billing settle lifts Money In",
  getMoneyIn("month") === moneyInBeforeBill + 40000 && getNet("month") === getProfitAndLoss("month").netProfit,
  money(getMoneyIn("month")));
cancelSubscriber(live().subscribers[0].id);
check("Cancel stops further upcoming charges",
  live().upcomingCharges.filter(row => row.status === "upcoming").length === 0 &&
    live().subscribers[0].status === "canceled",
  live().upcomingCharges.filter(row => row.status === "upcoming").length + " upcoming");
resetStore();
resetGateway();

check("Smart Checkout lives on Get Paid overview",
  /smart\.overview/.test(html) && /Automatic Checkout/.test(html) && !/smartCard/.test(rootSource),
  "overview toggle card");
setSmartCheckout(true);
check("Smart Checkout on shows labelled sample analytics",
  dashboardState().smartCheckout.on &&
    dashboardState().smartCheckout.analytics.note === SAMPLE_CHECKOUT_ANALYTICS.note &&
    dashboardState().smartCheckout.analytics.steps.length === 3,
  SAMPLE_CHECKOUT_ANALYTICS.note);
resetStore();

check("Shopify starts disconnected",
  dashboardState().shopify.connected === false && dashboardState().shopify.disconnected === true,
  "disconnected");
connectShopify("albidda.myshopify.com");
const shopifyCount0 = live().transactions.filter(txn => txn.source === "shopify").length;
const moneyInBeforeShop = getMoneyIn("month");
ingestShopifyOrder();
check("Connected Shopify tags the new sample order",
  live().transactions.some(txn => txn.counterparty === SAMPLE_SHOPIFY_ORDER.counterparty && txn.source === "shopify" && txn.amountMinor === SAMPLE_SHOPIFY_ORDER.amountMinor) &&
    live().transactions.filter(txn => txn.source === "shopify").length === shopifyCount0 + 1,
  SAMPLE_SHOPIFY_ORDER.counterparty);
check("Shopify sample order lifts Money In",
  getMoneyIn("month") === moneyInBeforeShop + SAMPLE_SHOPIFY_ORDER.amountMinor &&
    getNet("month") === getProfitAndLoss("month").netProfit,
  money(getMoneyIn("month")));
check("matched + open after Shopify sample",
  getMatchRate().matched + getOpenMatches().length === getMatchRate().total,
  getMatchRate().matched + " + " + getOpenMatches().length + " = " + getMatchRate().total);
check("Seed Shopify rows were not rewritten",
  seed.transactions.filter(txn => txn.source === "shopify").every(txn => live().transactions.some(row => row.id === txn.id && row.amountMinor === txn.amountMinor)),
  seed.transactions.filter(txn => txn.source === "shopify").length + " seed shopify rows");
resetStore();

const cash0 = getCashOnHand();
connectSampleBank(SAMPLE_BANKS[0].id);
check("Sample bank connect is labelled and does not change cash",
  live().bankAccounts.some(row => row.id === SAMPLE_BANKS[0].id && row.sample === true && row.openingBalanceMinor === 0) &&
    getCashOnHand() === cash0,
  money(getCashOnHand()));
check("Bank onboarding is wired in the UI",
  /bankOn\.start/.test(html) && /Connect sample bank/.test(html),
  "onboarding steps");
resetStore();
resetGateway();

const linkReset = await createPaymentLink({
  amountMinor: 540000,
  description: "Reset rehearsal",
  clientId: "cli_07",
  invoiceId: "inv_0148"
});
await simulatePayment(linkReset.id, "success");
settlePayment(linkReset.id);
await createSubscriptionPlan({ name: "Reset plan", amountMinor: 40000, interval: "Month" });
publishCheckoutPage({
  productName: "Reset hamper",
  description: "Cleared by reset",
  amountMinor: 25000,
  accent: "#17171C"
});
connectShopify("albidda.myshopify.com");
const moneyAfterMutate = getMoneyIn("month");
const periodFromKept = "3 Sept 2026";
const periodToKept = "9 Sept 2026";
root.setState({ periodFrom: periodFromKept, periodTo: periodToKept });
root.renderVals().h.resetDemo();
check("Reset demo data asks for confirm",
  root.state.modal === "reset" &&
    /resetDemo:\s*this\.openModal\('reset'\)/.test(rootSource) &&
    getMoneyIn("month") === moneyAfterMutate &&
    live().paymentLinks.length > 0 &&
    live().shopify.connected === true,
  "modal open, Money In still " + money(moneyAfterMutate));
root.submitModal();
const rateReset = getMatchRate();
const openReset = getOpenMatches();
check("Reset restores Money In",
  getMoneyIn("month") === 4651000 && getMoneyOut("month") === 3336500 && getNet("month") === 1314500,
  "In " + money(getMoneyIn("month")) + " · Out " + money(getMoneyOut("month")) + " · Net " + money(getNet("month")));
check("Reset restores match identity",
  rateReset.matched === 9 && rateReset.total === 12 && openReset.length === 3 &&
    rateReset.matched + openReset.length === rateReset.total,
  rateReset.matched + " of " + rateReset.total + " · " + openReset.length + " open");
check("Reset clears created links and plans",
  live().paymentLinks.length === 0 && live().checkoutPages.length === 0 && live().subscriptionPlans.length === 0,
  "paymentLinks/checkoutPages/subscriptionPlans empty");
check("Reset disconnects Shopify",
  live().shopify.connected === false && dashboardState().shopify.disconnected === true,
  "disconnected");
check("Reset keeps the Tally date range",
  root.state.periodFrom === periodFromKept && root.state.periodTo === periodToKept,
  root.state.periodFrom + " → " + root.state.periodTo);
check("HTML has Reset demo data and confirm modal",
  /Reset demo data/.test(html) && /modal\.reset/.test(html) && /s\.modal === 'reset'/.test(html) &&
    /This restores the seed/.test(html),
  "button + confirm modal");
check("SANDBOX tooltip string present",
  html.includes("Simulated gateway. Live payment processing pending Qatar commercial registration.") &&
    /envLabel:\s*'SANDBOX'/.test(rootSource) &&
    /title="Simulated gateway\. Live payment processing pending Qatar commercial registration\."/.test(html),
  "SANDBOX hover tooltip");
check("No Peppol or VAT in public HTML",
  !/Peppol/i.test(html) && !/\bVAT\b/i.test(html) && !/Peppol/i.test(payPage) && !/\bVAT\b/i.test(payPage),
  "flow.dc.html and pay.html");
check("Simulated labels on Payment Setup and Connected Apps",
  /money settles straight to you/.test(html) &&
    /One simulated gateway in this phase/.test(html) &&
    /Live mode is still simulated\. Payment processing pending Qatar commercial registration\./.test(html) &&
    /Simulated connection/.test(html),
  "Payment Setup / Connected Apps");
check("getVatRate still 0 after Stage 6",
  getVatRate() === 0,
  String(getVatRate()));
resetStore();
resetGateway();

const doc = [
  "# Data verification",
  "",
  "Computed by `scripts/verify-data.mjs` from `lib/data/selectors.ts` at runtime. Figures below were not typed by hand.",
  "",
  failures.length ? "Failures: " + failures.join(", ") : "All identity checks passed.",
  "",
  ...lines,
  "",
  "## Not stored in the seed",
  "",
  "- Bank account number is not stored. Opening balance is stored on bank_01 (QR 85,000 as of ANCHOR_DATE minus 30 days).",
  "- Subscription plans, payment-page totals, checkout product price and saved report packs are not in the seed, so those lists start empty. Checkout drop-off uses labelled sample analytics in lib/data/sample-checkout.ts.",
  "- Shopify starts disconnected. Seed shopify transactions stay as historical rows; only new incoming after connect are tagged by the plugin.",
  "- Extra bank connections are labelled sample and store opening QR 0 so cash on hand does not change.",
  "- Recurring invoice schedules, sync payloads and approval caps are not in the seed.",
  "- Other Flow billing tiers besides the current Starter plan are not in the seed.",
  "- Reports profit and loss, the four stat cards and the branch table use their own 30-day period. They do not follow the Home 24h / 7 days / 30 days toggle.",
  ""
].join("\n");

writeFileSync(new URL("../docs/data-verification.md", import.meta.url), doc);
if (failures.length) {
  console.error(doc);
  process.exit(1);
}
console.log(doc);
