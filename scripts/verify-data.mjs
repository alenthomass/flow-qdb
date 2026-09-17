import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dashboardSnapshot, dashboardState, bankLogoSrc, bankReminderView } from "../lib/data/view.ts";
import { Component } from "../lib/dashboard/component.js";
import { formatDate, formatMoney, offsetFromLabel, dateInputValue, previousMonthLabel, monthYearLabel } from "../lib/format.ts";
import { chartScale } from "../lib/chart.ts";
import { dateFor, seed } from "../lib/data/seed.ts";
import { SAMPLE_BILL, SAMPLE_BILLS, EXTRACT_DELAY_MS, EXTRACT_DELAY_MIN_MS, EXTRACT_DELAY_MAX_MS, extractBill, extractDelayMs, extractedBillForm } from "../lib/data/sample-bill.ts";
import { appendTransaction, getStore, hydrateFromStorage, removeBankAccount, resetStore, updateBankAccount } from "../lib/data/store.ts";
import {
  addClient,
  addSubscriber,
  cancelSubscriber,
  cancelRecurringInvoice,
  checkoutPageUnavailable,
  confirmMatch,
  connectSampleBank,
  importBankStatement,
  connectShopify,
  createTag,
  createInvoice,
  peekNextInvoiceNumber,
  createPaymentLink,
  createRecurringInvoice,
  createSubscriptionPlan,
  deactivatePaymentLink,
  defaultPayrollPeriod,
  generatePayslips,
  payslipsForPeriod,
  duplicateInvoice,
  ingestShopifyOrder,
  payPublishedCheckout,
  payrollPostedFor,
  pauseRecurringInvoice,
  postPayroll,
  publishCheckoutPage,
  recurringNextOffsets,
  removeTag,
  renameTag,
  setTagParent,
  requestApproval,
  resolveApproval,
  runSimulatedBilling,
  saveCheckoutSettings,
  sendRecurringInvoice,
  setApprovalLimit,
  setRolePermission,
  setSmartCheckout,
  settleBilling,
  settleCheckoutPayment,
  settlePayment,
  simulatePayment
} from "../lib/data/spine.ts";
import { CONNECTED_BANKING_PREVIEW, QATAR_BANKS, SAMPLE_BANKS, SAMPLE_CHECKOUT_ANALYTICS, SAMPLE_SHOPIFY_ORDER } from "../lib/data/sample-checkout.ts";
import { parseBankStatementCsv, parseStatementDate } from "../lib/data/statement.ts";
import { buildTallyExport, exportTallyXml, simulateZohoSync, transactionsInTallyRange } from "../lib/data/tally-export.ts";
import { resetGateway } from "../lib/gateway/index.ts";
import {
  getBranchComparison,
  getCashOnHand,
  getInvoiceStatus,
  getMatchRate,
  getMatchedTransactions,
  getMoneyIn,
  getMoneyInPrevious,
  getMoneyOut,
  getMoneyOutPrevious,
  getMoneyShare,
  getNet,
  getNetSeries,
  getOpenMatches,
  getOpeningBalance,
  getOutstanding,
  getOutstandingInvoices,
  getOverdue,
  getPayrollDeductions,
  getPayrollGross,
  getPayrollNet,
  getPendingSettlement,
  getProfitAndLoss,
  getRefunds,
  getReminderInvoices,
  getRunway,
  getSpend,
  getAiInsights,
  getTotalInvoiced,
  getVatRate,
  signedAmount,
  assertPhase1Invariants
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
  publishCheckoutPage, payPublishedCheckout, settleCheckoutPayment, saveCheckoutSettings, checkoutPageUnavailable,
  createSubscriptionPlan, addSubscriber, runSimulatedBilling, settleBilling,
  cancelSubscriber, deactivatePaymentLink, connectShopify, ingestShopifyOrder,
  connectSampleBank, importBankStatement, setSmartCheckout, SAMPLE_CHECKOUT_ANALYTICS,
  createInvoice, duplicateInvoice, addClient, postPayroll, payrollPostedFor, defaultPayrollPeriod,
  generatePayslips, payslipsForPeriod,
  dateInputValue, previousMonthLabel, formatDate,
  exportTallyXml, simulateZohoSync, resetGateway,
  createRecurringInvoice, sendRecurringInvoice, recurringNextOffsets,
  pauseRecurringInvoice, cancelRecurringInvoice,
  renameTag, removeTag, createTag, setTagParent, setRolePermission, setApprovalLimit,
  requestApproval, resolveApproval
};
let pendingExtract = null;
const realTimeout = setTimeout;
function gatedTimeout(fn, ms) {
  if (typeof ms === "number" && ms >= EXTRACT_DELAY_MIN_MS && ms <= EXTRACT_DELAY_MAX_MS) {
    pendingExtract = { fn, ms };
    return { extract: true };
  }
  return realTimeout(fn, ms);
}
globalThis.setTimeout = gatedTimeout;
if (!globalThis.localStorage) {
  const saved = new Map();
  globalThis.localStorage = {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
    removeItem: key => saved.delete(key)
  };
}
try {
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: { writeText: async () => {} }
  });
} catch {
  /* Node 22 navigator is read-only; copy helpers already try/catch. */
}
globalThis.window = Object.assign(globalThis.window || {}, { FLOW_DATA: data, FlowStore, innerWidth: 1440 });
const html = [
  readFileSync(new URL("../app/dashboard/view.tsx", import.meta.url), "utf8"),
  readFileSync(new URL("../app/dashboard/dashboard.css", import.meta.url), "utf8"),
  readFileSync(new URL("../lib/dashboard/component.js", import.meta.url), "utf8")
].join("\n");
const payPage = readFileSync(new URL("../app/pay/pay-checkout.tsx", import.meta.url), "utf8");
const rootSource = readFileSync(new URL("../lib/dashboard/component.js", import.meta.url), "utf8");
const enChrome = readFileSync(new URL("../locales/en/chrome.json", import.meta.url), "utf8");
const enSettings = readFileSync(new URL("../locales/en/settings.json", import.meta.url), "utf8");
const enUi = readFileSync(new URL("../locales/en/ui.json", import.meta.url), "utf8");
const enPages = readFileSync(new URL("../locales/en/pages.json", import.meta.url), "utf8");
const root = new Component();
check("Home defaults to 30 days", root.state.tf === "month", root.periodOf().label);
const homeToggle = root.renderVals().tfs.map(item => item.label).join(" / ");
check("Home period toggle uses rolling labels",
  homeToggle === "Day / Week / Month",
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
  const share = getMoneyShare(period);
  const moved = moneyIn + moneyOut;
  check(
    period + " Money In/Out share of movement",
    (moved <= 0 && share.inPct === 0 && share.outPct === 0) ||
      (share.inPct + share.outPct === 100 && share.inPct === Math.round((moneyIn / moved) * 100)),
    share.inPct + "% in · " + share.outPct + "% out"
  );
  const days = period === "month" ? 30 : period === "week" ? 7 : 1;
  const prevHi = -days;
  const prevLo = -(2 * days - 1);
  const pageInPrev = completed("in")
    .filter(txn => txn.dayOffset <= prevHi && txn.dayOffset >= prevLo)
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const pageOutPrev = completed("out")
    .filter(txn => txn.dayOffset <= prevHi && txn.dayOffset >= prevLo)
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const inPrev = getMoneyInPrevious(period);
  const outPrev = getMoneyOutPrevious(period);
  const inTrend = inPrev === 0 || moneyIn === 0 ? null : Math.round(((moneyIn - inPrev) / inPrev) * 100);
  const outTrend = outPrev === 0 || moneyOut === 0 ? null : Math.round(((moneyOut - outPrev) / outPrev) * 100);
  const block = data.periods[period];
  check(
    period + " Money In/Out vs prior equivalent window",
    inPrev === pageInPrev && outPrev === pageOutPrev &&
      block.moneyInTrendPct === inTrend && block.moneyOutTrendPct === outTrend &&
      block.moneyInShare === (inTrend == null ? "" : (inTrend > 0 ? "+" : "") + inTrend + "%") &&
      block.moneyOutShare === (outTrend == null ? "" : (outTrend > 0 ? "+" : "") + outTrend + "%"),
    "In " + (inTrend == null ? "n/a" : (inTrend > 0 ? "+" : "") + inTrend + "%") +
      " · Out " + (outTrend == null ? "n/a" : (outTrend > 0 ? "+" : "") + outTrend + "%")
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
  revenue: 5601000,
  refunds: 154000,
  costOfSales: 513000,
  salaries: 1966500,
  overheads: 703000,
  netProfit: 2264500
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
  moneyIn: 5601000, moneyOut: 3336500, net: 2264500, pending: 630000, marginPercent: 40,
  matched: 11, totalMatches: 14, matchPercent: 79, openMatches: 3,
  invoiced: 4330000, invoiceCount: 9, outstanding: 2090000, outstandingCount: 3, overdue: 920000,
  cashOnHand: 10764500, opening: 8500000,
  spendTotal: 3182500, spendRefunds: 154000, spendHasSales: false, spendHasRefundVendor: false,
  runwayProfitable: true, accountantName: "Priya Menon", ownerOnTeam: true,
  transactions: 42, planLimit: 5000, doha: 3261000, wakrah: 2340000, dohaShare: 58, wakrahShare: 42,
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
const allInvoiceRows = dashboardState().invoices.filter(row => row.status !== "Draft");
check(
  "All Invoices row count equals Total Invoiced count",
  allInvoiceRows.length === getTotalInvoiced().count && Number(root.renderVals().counts.invoices) === live().invoices.length,
  allInvoiceRows.length + " non-draft rows · " + getTotalInvoiced().count + " invoiced · list " + root.renderVals().counts.invoices
);
root.setState({ page: "invoicing", tab: Object.assign({}, root.state.tab, { invoicing: "hub" }), detail: null });
const hubAll = (root.renderVals().hub.cards || []).find(card => card.title === "All Invoices");
check(
  "Invoices hub badge equals Outstanding count",
  hubAll && hubAll.meta === getOutstanding().count + " unpaid",
  (hubAll && hubAll.meta) + " vs Outstanding " + getOutstanding().count
);
lines.push("- Hub All Invoices badge equals All Invoices unpaid / Outstanding: " + (hubAll && hubAll.meta) + " = " + getOutstanding().count + " unpaid");
const asOf = live().bankAccounts.reduce((min, account) => Math.min(min, account.asOfOffset), 0);
const bankMovement = live().transactions
  .filter(txn => txn.status !== "pending" && txn.dayOffset > asOf)
  .reduce((sum, txn) => sum + signedAmount(txn), 0);
check(
  "Bank Activity equals cash on hand",
  dashboardState().bank.activity === money(getCashOnHand()) && getCashOnHand() === getOpeningBalance() + bankMovement,
  dashboardState().bank.activity + " = opening " + money(getOpeningBalance()) + " + " + money(bankMovement)
);
lines.push("- Bank Activity is cash on hand: opening " + money(getOpeningBalance()) + " on bank_01 as of offset " + asOf + " + signed completed transactions with dayOffset > " + asOf + " (" + money(bankMovement) + ") = " + money(getCashOnHand()));
lines.push("- Verified Stage B clean-seed baseline: cash on hand = opening 85,000 + inflows 56,010 - outflows 33,365 = 107,645, pending 6,300 excluded.");
lines.push("- The previously reported QR 96,965 was measured against a dirty store after saving a scanned bill (Money Out QR 34,545), not the clean seed.");
root.setState({ bank: { activity: "-QR 31,475.00", activityCaption: "Settled bank rows only" } });
check("Bank Activity ignores a stale display snapshot",
  root.renderVals().bank.activity === money(getCashOnHand()) && root.renderVals().bank.activityCaption === "Cash on hand",
  root.renderVals().bank.activity + " · " + root.renderVals().bank.activityCaption);
const cashBefore = getCashOnHand();
const cashProbe = { ...live().transactions[0], id: "cash-invariant-probe", dayOffset: 0, direction: "out", status: "pending", amountMinor: 118000 };
appendTransaction(cashProbe);
check("Pending cash movement is excluded", getCashOnHand() === cashBefore, money(getCashOnHand()));
cashProbe.status = "refunded";
check("Completed refunded outflow reduces live cash", getCashOnHand() === cashBefore - cashProbe.amountMinor, money(getCashOnHand()));
resetStore();
root.applyStore();
check(
  "Matched automatically list equals getMatchRate().matched",
  getMatchedTransactions().length === getMatchRate().matched &&
    dashboardState().autoMatches.length === getMatchRate().matched &&
    Number(root.renderVals().auto.count) === getMatchRate().matched &&
    root.renderVals().auto.rows.length === getMatchRate().matched,
  root.renderVals().auto.count + " listed · " + getMatchRate().matched + " matched"
);
const reminderStatuses = new Set(["Sent", "Viewed", "Overdue", "Awaiting Settlement"]);
const reminderView = dashboardState().reminderInvoices;
check(
  "Reminders list is sent, viewed, overdue or awaiting settlement",
  reminderView.length === getReminderInvoices().length &&
    reminderView.every(row => reminderStatuses.has(row.status)) &&
    !reminderView.some(row => row.status === "Paid" || row.status === "Refunded" || row.status === "Draft"),
  reminderView.length + " remindable · " + reminderView.map(row => row.no).join(", ")
);
const inv0147 = dashboardState().invoices.find(row => row.no === "INV-0147");
check(
  "INV-0147 timeline dates follow invoice offsets",
  inv0147 && inv0147.issued === formatDate(-20) && inv0147.sentOn === formatDate(-20) && inv0147.viewedOn === formatDate(-16),
  "created " + (inv0147 && inv0147.issued) + " · sent " + (inv0147 && inv0147.sentOn) + " · viewed " + (inv0147 && inv0147.viewedOn)
);
root.setState({ page: "invoicing", detail: { type: "invoice", id: "inv_0147" } });
const timeline = root.renderVals().det.o;
check(
  "Invoice detail timeline binds derived dates",
  timeline.createdOn === formatDate(-20) && timeline.sentOn === formatDate(-20) && timeline.viewedOn === formatDate(-16),
  timeline.createdOn + " / " + timeline.sentOn + " / " + timeline.viewedOn
);
root.setState({ detail: null });
root.setState({ page: "invoicing", detail: { type: "invoice", id: "inv_0148" } });
root.renderVals().det.o.sendReminder();
const reminderPreviewed = root.state.modal === "reminderPreview" && /Lusail Hospitality/.test(root.state.form.reminderDraft || "");
root.submitModal();
check(
  "Send reminder toasts the client, not the clipboard",
  reminderPreviewed &&
    root.state.toast === "Reminder sent to Lusail Hospitality" &&
    !/clipboard/.test(rootSource.slice(rootSource.indexOf("sendInvoiceReminder"), rootSource.indexOf("draftReminderMessage"))),
  root.state.toast || "(none)"
);
root.setState({ detail: null, toast: "", modal: null });

const peekedNumber = peekNextInvoiceNumber();
const created = createInvoice({
  clientName: "Lusail Hospitality",
  amountMinor: 340000,
  dueOffset: 14,
  notes: "Thanks for your business.",
  termsAndConditions: "Payment due within 14 days of issue."
});
check(
  "peekNextInvoiceNumber matches the number assigned on save",
  peekedNumber === created.number && created.number === "INV-0151",
  peekedNumber + " vs " + created.number
);
check(
  "Invoice notes and termsAndConditions persist separately",
  created.notes === "Thanks for your business." &&
    created.termsAndConditions === "Payment due within 14 days of issue.",
  "notes " + (created.notes || "") + " · terms " + (created.termsAndConditions || "")
);
root.applyStore();
const afterCreate = getTotalInvoiced();
const afterOut = getOutstanding();
const lusail = dashboardState().clients.find(client => client.name === "Lusail Hospitality");
check(
  "Creating INV-0151 updates invoiced totals from the store",
  created.number === "INV-0151" &&
    afterCreate.amountMinor === 4670000 && afterCreate.count === 10 &&
    afterOut.amountMinor === 2430000 && afterOut.count === 4 &&
    Number(root.renderVals().invSum.paidN) === 10 &&
    Number(root.renderVals().counts.invoices) === 10 &&
    dashboardState().invoices.filter(row => row.status !== "Draft").length === afterCreate.count,
  "invoiced " + money(afterCreate.amountMinor) + " / " + afterCreate.count + " · outstanding " + money(afterOut.amountMinor) + " / " + afterOut.count
);
lines.push("- After creating INV-0151 (Lusail Hospitality, QR 3,400): Total Invoiced " + money(afterCreate.amountMinor) + " / " + afterCreate.count + " invoices; Outstanding " + money(afterOut.amountMinor) + " / " + afterOut.count + " unpaid");
check(
  "Lusail lifetime and invoice count both read the store",
  lusail && lusail.invoiceCount === 2 && lusail.total === 8800,
  "count " + (lusail && lusail.invoiceCount) + " · lifetime QR " + (lusail && lusail.total)
);
root.setState({ page: "invoicing", tab: Object.assign({}, root.state.tab, { invoicing: "hub" }), detail: null });
const hubAfter = (root.renderVals().hub.cards || []).find(card => card.title === "All Invoices");
check(
  "Hub unpaid badge follows Outstanding after create",
  hubAfter && hubAfter.meta === afterOut.count + " unpaid",
  hubAfter && hubAfter.meta
);
const overdueCreated = createInvoice({
  clientName: "Lusail Hospitality",
  amountMinor: 10000,
  dueOffset: -1
});
check(
  "getInvoiceStatus returns overdue for a new unpaid past-due invoice",
  getInvoiceStatus(overdueCreated.id) === "overdue",
  overdueCreated.number + " " + getInvoiceStatus(overdueCreated.id)
);
resetStore();
root.applyStore();

root.setState({
  page: "invoicing",
  tab: Object.assign({}, root.state.tab, { invoicing: "create" }),
  nv: { client: "Lusail Hospitality", items: [{ desc: "Stay", qty: "1", price: "3400" }], due: "" }
});
root.renderVals().nv.create();
check(
  "Blank due date is blocked with an inline error",
  !!root.renderVals().nv.dueErrorOn && live().invoices.length === 9,
  (root.renderVals().nv.dueError || "no error") + " · invoices " + live().invoices.length
);

const dup = duplicateInvoice("inv_0148");
check(
  "Duplicate copies client and amount as a draft due in 14 days",
  dup.clientId === "cli_07" && dup.amountMinor === 540000 && dup.dueOffset === 14 && dup.issuedOffset === 0 &&
    getInvoiceStatus(dup.id) === "draft" && dup.number !== "INV-0148",
  dup.number + " " + getInvoiceStatus(dup.id) + " due +" + dup.dueOffset
);
resetStore();
root.applyStore();

const payPeriod = defaultPayrollPeriod();
check(
  "Seed payroll is already posted for the payslip period",
  payrollPostedFor(payPeriod) === true,
  payPeriod
);
root.setState({ page: "payroll", tab: Object.assign({}, root.state.tab, { payroll: "payslips" }) });
check(
  "Post to Transactions is labelled already posted for the seed period",
  root.renderVals().payroll.postLabel === "Already posted for " + payPeriod,
  root.renderVals().payroll.postLabel
);
const postedAgain = postPayroll(payPeriod);
check("Posting the seed period does not append another salaries row", postedAgain.alreadyPosted === true, postedAgain.period);
const slips = generatePayslips(payPeriod);
const slipGross = slips.reduce((sum, row) => sum + row.grossMinor, 0);
const slipDed = slips.reduce((sum, row) => sum + row.deductionMinor, 0);
const slipNet = slips.reduce((sum, row) => sum + row.netMinor, 0);
check(
  "Generate payslips writes one slip per seed employee for the period",
  slips.length === seed.employees.length && payslipsForPeriod(payPeriod).length === seed.employees.length,
  slips.length + " slips · " + payPeriod
);
check(
  "Generated payslip totals match payroll run gross / deduction / net",
  slipGross === getPayrollGross("pay_01") && slipDed === getPayrollDeductions("pay_01") && slipNet === getPayrollNet("pay_01"),
  money(slipGross) + " / " + money(slipDed) + " / " + money(slipNet)
);
const slipsAgain = generatePayslips(payPeriod);
check(
  "Generating the same period replaces slips instead of duplicating",
  slipsAgain.length === seed.employees.length && live().payslips.filter(row => row.period === payPeriod).length === seed.employees.length,
  live().payslips.filter(row => row.period === payPeriod).length + " stored"
);
root.applyStore();
check(
  "Payslips page lists generated slips for the selected period",
  root.renderVals().payroll.hasSlips && root.renderVals().payroll.slips.length === seed.employees.length,
  String(root.renderVals().payroll.slips.length)
);
resetStore();
root.applyStore();

lines.push("- Plan usage: " + live().transactions.length + " of " + seed.merchant.plan.txnLimit);
lines.push("- Branches: " + getBranchComparison().map(branch => branch.name + " inflow " + money(branch.inflow) + " (" + Math.round(branch.inflow / getMoneyIn("month") * 100) + "%)").join("; "));

const seedLinks = live().paymentLinks;
const seedLinkById = id => seedLinks.find(row => row.id === id);
const seedCollected = seedLinks.reduce((sum, row) => sum + row.amountMinor * row.uses, 0);
const seedUses = seedLinks.reduce((sum, row) => sum + row.uses, 0);
check("Seeded payment links match the four paid counterparties",
  seedLinks.length === 4 &&
    seedLinkById("link_txn_01")?.description === "Noor Interiors" &&
    seedLinkById("link_txn_01")?.amountMinor === 154000 &&
    seedLinkById("link_txn_01")?.txnId === "txn_01" &&
    seedLinkById("link_txn_01")?.clientId === "cli_04" &&
    seedLinkById("link_txn_01")?.invoiceId === "inv_0145" &&
    seedLinkById("link_txn_10")?.description === "Mohammed Rashid" &&
    seedLinkById("link_txn_10")?.amountMinor === 98000 &&
    seedLinkById("link_txn_10")?.txnId === "txn_10" &&
    seedLinkById("link_txn_10")?.clientId === "cli_08" &&
    seedLinkById("link_txn_10")?.invoiceId == null &&
    seedLinkById("link_txn_14")?.description === "Fatima Al-Kuwari" &&
    seedLinkById("link_txn_14")?.amountMinor === 215000 &&
    seedLinkById("link_txn_14")?.txnId === "txn_14" &&
    seedLinkById("link_txn_14")?.clientId === "cli_05" &&
    seedLinkById("link_txn_14")?.invoiceId === "inv_0146" &&
    seedLinkById("link_txn_20")?.description === "Msheireb Boutiques" &&
    seedLinkById("link_txn_20")?.amountMinor === 187000 &&
    seedLinkById("link_txn_20")?.txnId === "txn_20" &&
    seedLinkById("link_txn_20")?.clientId === "cli_10" &&
    seedLinkById("link_txn_20")?.invoiceId === "inv_0150",
  seedLinks.map(row => row.description).join(", "));
check("Collected via links is QR 6,540 across 4 payments",
  seedCollected === 654000 && seedUses === 4 &&
    data.links.reduce((sum, row) => sum + row.amount * row.uses, 0) === 6540 &&
    data.links.reduce((sum, row) => sum + row.uses, 0) === 4,
  money(seedCollected) + " · times paid " + seedUses);
check("Page settings slug is derived, not a leftover default",
  root.state.ps.slug === "" && root.state.ps.slugCustom === false &&
    typeof root.pageSlug === "function" && root.pageSlug({ pp: { title: "Fleet Deposit" }, ps: { slug: "", slugCustom: false } }) === "fleet-deposit",
  "empty slug · Fleet Deposit → " + root.pageSlug({ pp: { title: "Fleet Deposit" }, ps: { slug: "", slugCustom: false } }));

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
  /accept="image\/\*,application\/pdf"/.test(html) && /ui\.scan\.choose/.test(html) && /Choose image or PDF/.test(enUi),
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
  monthAfter.pnl.netProfit === 21465 && getProfitAndLoss("month").netProfit === 2146500,
  "net profit " + monthAfter.pnl.formatted.netProfit + " (was QR 22,645.00)");
check("Scanned bill sorts to top of Recent Activity",
  recentTop && recentTop.party === "Barzan Water" && recentTop.offset === SAMPLE_BILL.dayOffset,
  recentTop ? recentTop.party + " offset " + recentTop.offset : "missing");
const tallyAfterBarzan = buildTallyExport();
check("Tally after Barzan scan is 22 settled rows",
  tallyAfterBarzan.items === 22 &&
    transactionsInTallyRange(-29, 0).length === 22 &&
    !transactionsInTallyRange(-29, 0).some(txn => txn.id === "txn_13"),
  tallyAfterBarzan.items + " items (23 would include pending txn_13)");
resetStore();
root.applyStore({ modal: "scan" });
pendingExtract = null;
root.startExtract("bill_almaha");
pendingExtract.fn();
root.submitModal();
check("Second sample bill saves through selectors",
  getMoneyOut("month") === 3336500 + 34000 &&
    getProfitAndLoss("month").netProfit === 2264500 - 34000 &&
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
    /checkoutBySlug/.test(payPage) &&
    !/skipcashtest|azurewebsites/i.test(payPage),
  "React /pay handles payment links");
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

const declineLink = await createPaymentLink({ amountMinor: 10000, description: "Decline rehearsal" });
const declined = await simulatePayment(declineLink.id, "decline");
check("Simulate decline marks the link rejected without a ledger row",
  declined.pending === false && declined.txnId == null &&
    live().paymentLinks.find(row => row.id === declineLink.id)?.status === "rejected" &&
    !live().transactions.some(txn => txn.id === declined.txnId),
  live().paymentLinks.find(row => row.id === declineLink.id)?.status || "missing");
const timeoutLink = await createPaymentLink({ amountMinor: 10000, description: "Timeout rehearsal" });
const timedOut = await simulatePayment(timeoutLink.id, "timeout");
check("Simulate timeout marks the link failed without a ledger row",
  timedOut.pending === false && timedOut.txnId == null &&
    live().paymentLinks.find(row => row.id === timeoutLink.id)?.status === "failed",
  live().paymentLinks.find(row => row.id === timeoutLink.id)?.status || "missing");
const partialLink = await createPaymentLink({
  amountMinor: 20000,
  description: "Partial rehearsal",
  invoiceId: "inv_0148"
});
const partial = await simulatePayment(partialLink.id, "partial");
check("Simulate partial posts half the amount and a match proposal",
  partial.pending && partial.amountMinor === 10000 &&
    live().transactions.some(txn => txn.id === partial.txnId && txn.amountMinor === 10000 && txn.status === "pending") &&
    getOpenMatches().some(proposal => proposal.transactionId === partial.txnId),
  money(partial.amountMinor) + " · " + (partial.txnId || "missing"));
resetStore();
resetGateway();

const refLink = await createPaymentLink({
  amountMinor: 482000,
  description: "Reference match",
  referenceId: "INV-0144"
});
check("Reference ID matches an outstanding invoice for reconciliation",
  refLink.invoiceId === "inv_0144" && refLink.referenceId === "INV-0144",
  refLink.invoiceId || "missing");
resetStore();
resetGateway();

const persistLink = await createPaymentLink({ amountMinor: 15000, description: "Gateway persist" });
resetGateway();
const persistSim = await simulatePayment(persistLink.id, "success");
check("simulatePayment still works after gateway reset",
  persistSim.pending && !!persistSim.txnId && persistSim.reference &&
    live().transactions.some(txn => txn.id === persistSim.txnId && txn.status === "pending"),
  persistSim.txnId || "missing");
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
  tallyFile.items === 21 && voucherCount === 21 && tallyRows.length === 21 && !pendingInXml,
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
    history.some(row => row.id === zoho.id && row.kind === "zoho" && row.items === 21),
  zoho.target + " · " + zoho.items + " items");
check("From and To inputs are bound",
  /onChange=\{v\.F\.periodFrom\}/.test(html) && /onChange=\{v\.F\.periodTo\}/.test(html),
  "periodFrom / periodTo onChange");
check("Export XML downloads a file",
  /downloadNamedFile/.test(rootSource) && /exportTallyXml/.test(rootSource),
  "runTallyExport writes XML");

resetStore();
root.applyStore();
root.setState(st => ({ page: "accounting", detail: null, tab: Object.assign({}, st.tab, { accounting: "zoho" }) }));
const emptyZohoLog = root.renderVals().syncLog;
check("Zoho sync log empty state matches Tally export history",
  emptyZohoLog && emptyZohoLog.none === true && emptyZohoLog.any === false && (emptyZohoLog.rows || []).length === 0 &&
    /v\.syncLog\.none/.test(html) &&
    /ui\.acc\.noLog/.test(html) &&
    /"noLog": "No sync history is stored\."/.test(enUi) &&
    /v\.exports\.none/.test(html) &&
    /ui\.tally\.noHist/.test(html) &&
    !/\(\(v\.syncLog\) \|\| \[\]\)\.map/.test(html),
  "No sync history is stored.");
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
const filledZohoLog = root.renderVals().syncLog;
check("Zoho sync log lists rows after Sync now",
  filledZohoLog && filledZohoLog.any === true && filledZohoLog.none === false &&
    (filledZohoLog.rows || []).some(row => row.status === "Simulated"),
  (filledZohoLog && filledZohoLog.rows ? filledZohoLog.rows.length : 0) + " log row(s)");
const zohoLogId = ((filledZohoLog && filledZohoLog.rows) || []).find(row => row.status === "Simulated");
root.setState({ detail: { type: "synclog", id: zohoLogId && zohoLogId.id } });
const zohoLogDet = root.renderVals().det;
check("Zoho sync log detail still opens from a row",
  !!(zohoLogDet && zohoLogDet.synclog && zohoLogDet.o && zohoLogDet.o.status === "Simulated" && zohoLogDet.o.itemsT),
  zohoLogDet && zohoLogDet.o ? String(zohoLogDet.o.target || "") : "missing");
resetStore();
resetGateway();

check("Hosted checkout publishes a shareable /pay/ slug",
  existsSync(new URL("../app/pay/pay-checkout.tsx", import.meta.url)) &&
    existsSync(new URL("../app/pay/[slug]/page.tsx", import.meta.url)) &&
    /\/pay\//.test(html),
  "React route + UI URL");
check("Public payment page matches the builder without edit chrome",
  /Payment Details/.test(payPage) &&
    /Share this on/.test(payPage) &&
    /Secured by SkipCash · SANDBOX/.test(payPage) &&
    /Contact Us/.test(payPage) &&
    /box locked/.test(payPage) &&
    !/Click any text to edit/i.test(payPage) &&
    !/Add new/.test(payPage) &&
    !/pp\.setTitle/.test(payPage),
  "customer checkout chrome");
check("Public pay page validates email and shows a receipt",
  /emailError/.test(payPage) &&
    /Payment received/.test(payPage) &&
    /Reference /.test(payPage) &&
    /box locked/.test(payPage),
  "email + success card");
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

const settingsPage = publishCheckoutPage({
  productName: "Settings hamper",
  description: "Theme and receipts",
  amountMinor: 18000,
  theme: "dark",
  afterPay: "message",
  receiptAuto: true,
  receiptCustomer: false,
  receiptRef: false
});
check("Published checkout stores page theme and receipt defaults",
  settingsPage.theme === "dark" && settingsPage.afterPay === "message" && settingsPage.receiptAuto === true &&
    settingsPage.closeMode === "none" && settingsPage.receiptCustomer === false,
  settingsPage.theme + " " + settingsPage.afterPay);
const savedSettings = saveCheckoutSettings(settingsPage.id, {
  slug: "settings-hamper",
  theme: "light",
  closeMode: "date",
  closeLabel: dateInputValue(-1),
  afterPay: "redirect",
  redirectUrl: "https://desertbloom.qa/thank-you",
  receiptAuto: false,
  receiptCustomer: true,
  receiptRef: true
});
check("Save checkout settings persists theme, close date, redirect and receipts",
  savedSettings.theme === "light" && savedSettings.closeMode === "date" && savedSettings.closeLabel === dateInputValue(-1) &&
    savedSettings.afterPay === "redirect" && savedSettings.redirectUrl === "https://desertbloom.qa/thank-you" &&
    savedSettings.receiptAuto === false && savedSettings.receiptCustomer === true && savedSettings.receiptRef === true &&
    savedSettings.amountMinor === 18000,
  savedSettings.theme + " " + savedSettings.closeMode);
check("Closed checkout page is no longer accepting payments",
  checkoutPageUnavailable(savedSettings) === "This page is no longer accepting payments.",
  checkoutPageUnavailable(savedSettings) || "open");
let closedPay = "";
try {
  await payPublishedCheckout(savedSettings.slug);
} catch (err) {
  closedPay = err && err.message || String(err);
}
check("Paying a closed checkout page is rejected",
  closedPay === "This page is no longer accepting payments.",
  closedPay || "paid");
root.setState({
  modal: "pageSettings",
  ppEditing: savedSettings.id,
  ps: {
    slug: "settings-hamper",
    slugCustom: true,
    theme: "dark",
    expiry: "none",
    after: "message",
    closeDate: "",
    redirectUrl: ""
  }
});
root.submitModal();
const afterModal = live().checkoutPages.find(row => row.id === savedSettings.id);
check("Page settings Save writes the store",
  !!(afterModal && afterModal.theme === "dark" && afterModal.closeMode === "none" && afterModal.afterPay === "message" && root.state.modal === null),
  (afterModal && afterModal.theme) || "missing");
root.setState({
  modal: "receipts",
  ppEditing: savedSettings.id,
  rc: { auto: true, showCustomer: false, ref: false }
});
root.submitModal();
const afterReceipts = live().checkoutPages.find(row => row.id === savedSettings.id);
check("Receipts Save writes the store",
  !!(afterReceipts && afterReceipts.receiptAuto === true && afterReceipts.receiptCustomer === false && afterReceipts.receiptRef === false && root.state.modal === null),
  afterReceipts ? String(afterReceipts.receiptAuto) : "missing");
const chromeSource = readFileSync(new URL("../app/dashboard/chrome.tsx", import.meta.url), "utf8");
check("Hoverable does not paint empty borderColor as black",
  !/merged\[key\] = ""/.test(chromeSource) && !/hoverStyle=\{sx\("border-color:var\(--ink-6\)"\)\}/.test(html),
  "no empty borderColor, no settings card hover outline");

resetStore();
resetGateway();

const fleet = publishCheckoutPage({
  productName: "Fleet Deposit",
  description: "Vehicle deposit",
  amountMinor: 10000
});
check("Publish derives slug from the title",
  fleet.slug === "fleet-deposit",
  fleet.slug);
const fleetAgain = publishCheckoutPage({
  productName: "Fleet Deposit",
  description: "Second vehicle deposit",
  amountMinor: 12000
});
check("Duplicate title gets a uniqueness suffix",
  fleetAgain.slug === "fleet-deposit-2",
  fleetAgain.slug);
root.setState({
  ppEditing: null,
  ppPublishError: "",
  ps: Object.assign({}, root.state.ps, { slug: "", slugCustom: false }),
  pp: Object.assign({}, root.state.pp, {
    title: "Fleet Deposit",
    desc: "Vehicle deposit",
    published: false,
    fields: [{ label: "Amount", kind: "price", unitPrice: "" }, { label: "Email", kind: "mail" }]
  })
});
root.publishCheckout();
check("Publish with no amount names the missing field",
  root.state.ppPublishError === "Amount is required" &&
    !live().checkoutPages.some(row => row.slug === "fleet-deposit" && row.amountMinor === 0),
  root.state.ppPublishError || "no error");
root.setState({
  ppPublishError: "",
  pp: Object.assign({}, root.state.pp, {
    title: "",
    fields: [{ label: "Amount", kind: "price", unitPrice: "100" }]
  })
});
root.publishCheckout();
check("Publish with no title names the missing field",
  root.state.ppPublishError === "Page title is required",
  root.state.ppPublishError || "no error");
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
  /smart\.overview/.test(html) && /ui\.smart\.title/.test(html) && /Automatic Checkout/.test(enUi) && !/smartCard/.test(rootSource),
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
check("Connected banking is a static preview, not a wizard",
  /function BankAccountsPanel/.test(html) &&
    /v\.pt\.bank[\s\S]{0,120}BankAccountsPanel/.test(html) &&
    /v\.ct\.banks[\s\S]{0,120}BankAccountsPanel/.test(html) &&
    /ui\.bank\.previewTitle/.test(html) && /What connected banking will look like/.test(enUi) &&
    /bankOn\.demo/.test(html) && /ui\.bank\.previewCta/.test(html) && /See how it works/.test(enUi) &&
    /v\.modal\.bankDemo/.test(html) && /function BankPickerList/.test(html) &&
    !/bankOn\.start/.test(html) && !/bankOn\.confirm/.test(html) &&
    !/connectSampleBank/.test(rootSource) && !/bankOnboarding/.test(rootSource),
  "preview card + demo");
check("Upload statement is the primary bank action",
  /bankOn\.upload/.test(html) && /ui\.bank\.upload/.test(html) && /Upload statement/.test(enUi) &&
    /v\.modal\.statement/.test(html) && /flow-stmt-file/.test(html) && /accept="\.csv,text\/csv"/.test(html) &&
    /ui\.bank\.upload[\s\S]+ui\.bank\.previewTitle/.test(html) &&
    !/ui\.bank\.connectAnother/.test(html) && !/ui\.bank\.connectSample/.test(html),
  "upload first + csv modal");
check("Live bank connect is labelled Coming soon",
  /c\.soonChip/.test(html) && /'Coming soon': \['var\(--ink-3\)', 'var\(--chip\)'\]/.test(rootSource) &&
    /Upload a statement\. Live bank feeds are coming soon\./.test(enPages) &&
    /A preview only\. Live bank feeds are not connected yet\./.test(enUi) &&
    !/Link your bank to see money as it arrives/.test(enPages),
  "dest coming soon + preview-only copy");
check("Connected banking preview is not a store account",
  dashboardState().bankPreview &&
    dashboardState().bankPreview.logo === bankLogoSrc(CONNECTED_BANKING_PREVIEW.bank) &&
    dashboardState().bankPreview.balance === money(CONNECTED_BANKING_PREVIEW.balanceMinor) &&
    dashboardState().bankPreview.iban === CONNECTED_BANKING_PREVIEW.ibanMasked &&
    !live().bankAccounts.some(row => row.openingBalanceMinor === CONNECTED_BANKING_PREVIEW.balanceMinor) &&
    !dashboardState().banks.some(row => row.name === dashboardState().bankPreview.name && row.id),
  dashboardState().bankPreview.balance);
check("Statement upload bank picker uses Qatar majors",
  QATAR_BANKS.length === 8 &&
    dashboardState().qatarBanks.length === 8 &&
    QATAR_BANKS.map(row => row.bank).join(" · ") ===
      "Qatar National Bank · Doha Bank · Commercial Bank of Qatar · Qatar Islamic Bank · Qatar International Islamic Bank · Dukhan Bank · Ahli Bank · Masraf Al Rayan" &&
    /stmt\.banks/.test(html) && /v\.stmt && v\.stmt\.banks/.test(html) &&
    /qatarBankCatalog/.test(rootSource) && !/Masraf Al Rayan/.test(rootSource) &&
    !/placeholder=\{v\.t\("ui\.bank\.bankNamePh"\)\}/.test(html),
  QATAR_BANKS.map(row => row.short || row.bank).join(", "));
const qatarLogoByBank = {
  "Qatar National Bank": "/banks/qnb.png",
  "Doha Bank": "/banks/doha.jpg",
  "Commercial Bank of Qatar": "/banks/cbq.png",
  "Qatar Islamic Bank": "/banks/qib.png",
  "Qatar International Islamic Bank": "/banks/qiib.png",
  "Dukhan Bank": "/banks/dukhan.png",
  "Ahli Bank": "/banks/ahli.png",
  "Masraf Al Rayan": "/banks/alrayan.png"
};
check("Qatar bank picker logos map every catalog name",
  QATAR_BANKS.every(row => bankLogoSrc(row.bank) === qatarLogoByBank[row.bank]) &&
    dashboardState().qatarBanks.every(row => row.logo === qatarLogoByBank[row.bank] && row.initials) &&
    bankLogoSrc("Commercial Bank") === "/banks/cbq.png" &&
    bankLogoSrc("QIIB") === "/banks/qiib.png" &&
    bankLogoSrc("QIB") === "/banks/qib.png" &&
    bankLogoSrc("QIIB") !== bankLogoSrc("QIB") &&
    bankLogoSrc("Unknown Credit Union") == null &&
    /BankMark logo=\{opt\.logo\} initials=\{opt\.initials\}/.test(html) &&
    /onError=\{\(event\) => \{ event\.currentTarget\.style\.display = "none"; \}\}/.test(html),
  QATAR_BANKS.map(row => bankLogoSrc(row.bank)).join(", "));
check("Statement bank picker selected row is high-contrast",
  /border:" \+ \(opt\.on \? "1\.5px solid var\(--ink-6\)" : "1px solid var\(--line\)"\)/.test(html) &&
    /background:" \+ \(opt\.on \? "var\(--panel-2\)" : "var\(--btn-light\)"\)/.test(html) &&
    /font-weight:" \+ \(opt\.on \? "700" : "600"\)/.test(html) &&
    /opt\.on[\s\S]{0,500}m4 10\.2 4\.2 4\.2L16\.5 5\.6/.test(html) &&
    !/border:2px solid " \+ \(opt\.on \? "var\(--ink\)"/.test(html) &&
    !/opt\.on \? "var\(--accent-soft\)"/.test(html) &&
    !/opt\.on \? "var\(--bar-solid\)"/.test(html),
  "1.5px ink-6 border + check");
check("Bank pages have Accounts and Statements nested tabs",
  /tabOf\('bankView', 'accounts'\)/.test(rootSource) &&
    /tabList\('bankView'/.test(rootSource) &&
    /v\.bankViewTabs/.test(html) &&
    /v\.bt && v\.bt\.statements/.test(html) &&
    /ui\.bank\.tabAccounts/.test(html) && /Accounts/.test(enUi) &&
    /ui\.bank\.tabStatements/.test(html) && /Statements/.test(enUi) &&
    /ui\.bank\.statementsEmpty/.test(html) &&
    /v\.bt\.statements[\s\S]+ui\.bank\.previewTitle/.test(html) &&
    /v\.pt\.bank[\s\S]{0,120}BankAccountsPanel/.test(html) &&
    /v\.ct\.banks[\s\S]{0,120}BankAccountsPanel/.test(html),
  "bankView accounts|statements");
const debitCsv = "date,description,debit,credit\n" + dateInputValue(0) + ",Counter sale,,210.00\n" + dateInputValue(-1) + ",Kahramaa,95.00,\n,,missing,10.00\n";
const parsedDebit = parseBankStatementCsv(debitCsv);
check("Statement CSV accepts debit and credit columns",
  parsedDebit.rows.length === 2 && parsedDebit.skipped === 1 &&
    parsedDebit.rows[0].signedMinor === 21000 && parsedDebit.rows[1].signedMinor === -9500,
  parsedDebit.rows.length + " rows · skipped " + parsedDebit.skipped);
const stmtIsoOffset = offsetFromLabel("2026-09-05");
const spineSource = readFileSync(new URL("../lib/data/spine.ts", import.meta.url), "utf8");
check("Statement date parser accepts Gulf and English bank dates",
  stmtIsoOffset != null &&
    parseStatementDate("2026-09-05") === stmtIsoOffset &&
    parseStatementDate("05/09/2026") === stmtIsoOffset &&
    parseStatementDate("05-09-2026") === stmtIsoOffset &&
    parseStatementDate("5 Sep 2026") === stmtIsoOffset &&
    parseStatementDate("05 Sep 2026") === stmtIsoOffset &&
    parseStatementDate("5 Sept 2026") === stmtIsoOffset &&
    parseStatementDate("Sep 5, 2026") === stmtIsoOffset &&
    parseStatementDate("not-a-date") == null &&
    offsetFromLabel("5 Sep 2026") == null,
  "ISO " + stmtIsoOffset + " · Sep " + parseStatementDate("5 Sep 2026") + " · Sept " + parseStatementDate("5 Sept 2026"));
check("Statement import names unreadable dates in the toast",
  /skippedReasons/.test(rootSource) &&
    /chrome\.toast\.stmtBadDate/.test(rootSource) &&
    /try DD\/MM\/YYYY or YYYY-MM-DD/.test(enChrome) &&
    /parseStatementDate\(row\.dateRaw\)/.test(spineSource) &&
    !/offsetFromLabel\(row\.dateRaw\)/.test(spineSource),
  "stmtBadDate toast + parseStatementDate");
resetStore();
check("Seed statement history is empty",
  dashboardState().statementMonths.empty === true &&
    dashboardState().statementMonths.months.length === 0 &&
    live().bankAccounts.every(row => !(row.importHistory && row.importHistory.length)),
  "no imports");
const moneyInBeforeStmt = getMoneyIn("month");
const moneyOutBeforeStmt = getMoneyOut("month");
const matchBefore = getMatchRate();
const openBefore = getOpenMatches().length;
const csv = [
  "date,description,amount",
  dateInputValue(0) + ",Lusail Hospitality,9200.00",
  dateInputValue(-1) + ",Walk-in till,125.50",
  dateInputValue(-2) + ",Ahli Bank fees,-80.00",
  "not-a-date,Skipped row,10.00"
].join("\n");
const imported = importBankStatement({
  csvText: csv,
  accountId: "bank_01"
});
const matchAfter = getMatchRate();
const stmtIn = live().transactions.find(txn => txn.id.startsWith("txn_stmt_") && txn.counterparty === "Lusail Hospitality");
const stmtOut = live().transactions.find(txn => txn.id.startsWith("txn_stmt_") && txn.counterparty === "Ahli Bank fees");
const stmtWalk = live().transactions.find(txn => txn.id.startsWith("txn_stmt_") && txn.counterparty === "Walk-in till");
const stmtProposal = live().matchProposals.find(row => row.transactionId === stmtIn?.id);
const walkProposal = live().matchProposals.find(row => row.transactionId === stmtWalk?.id);
check("Bank statement import writes settled bank rows",
  imported.imported === 3 && imported.skipped === 1 && imported.matched === 1 &&
    imported.skippedReasons.badDate === 1 && imported.skippedReasons.missingFields === 0 &&
    stmtIn && stmtIn.source === "bank" && stmtIn.direction === "in" && stmtIn.status === "settled" &&
    stmtIn.amountMinor === 920000 && stmtIn.invoiceId === "inv_0147" &&
    stmtOut && stmtOut.direction === "out" && stmtOut.type === "expense" && stmtOut.tag === "Fees" &&
    stmtOut.amountMinor === 8000 && !live().matchProposals.some(row => row.transactionId === stmtOut.id),
  imported.imported + " imported · skipped " + imported.skipped + " · badDate " + imported.skippedReasons.badDate);
const importedAccount = live().bankAccounts.find(row => row.id === "bank_01");
check("Statement import updates lastImportOffset and importHistory",
  importedAccount && importedAccount.lastImportOffset === 0 &&
    Array.isArray(importedAccount.importHistory) && importedAccount.importHistory.length === 1 &&
    importedAccount.importHistory[0].id.indexOf("stmt_") === 0 &&
    importedAccount.importHistory[0].importedOffset === 0 &&
    importedAccount.importHistory[0].rowsImported === 3 &&
    importedAccount.importHistory[0].rowsSkipped === 1 &&
    importedAccount.periodFromOffset === -2 && importedAccount.periodToOffset === 0 &&
    bankReminderView(importedAccount).status == null &&
    dashboardState().banks.find(row => row.id === "bank_01").reminder.status == null,
  "lastImport " + (importedAccount && importedAccount.lastImportOffset) + " · history " + ((importedAccount && importedAccount.importHistory) || []).length);
const stmtMonthsAfterImport = dashboardState().statementMonths;
const stmtMonthAfterImport = stmtMonthsAfterImport.months[0];
const stmtRowAfterImport = stmtMonthAfterImport && stmtMonthAfterImport.rows[0];
check("Statements tab groups seed-empty then imported history by month",
  stmtMonthsAfterImport.empty === false &&
    stmtMonthsAfterImport.months.length === 1 &&
    stmtMonthAfterImport.label === monthYearLabel(0) &&
    stmtMonthAfterImport.rows.length === 1 &&
    stmtRowAfterImport.accountId === "bank_01" &&
    String(stmtRowAfterImport.name).indexOf("Ahli") >= 0 &&
    stmtRowAfterImport.logo === bankLogoSrc("Ahli Bank") &&
    stmtRowAfterImport.rowsImported === 3 &&
    stmtRowAfterImport.rowsSkipped === 1 &&
    stmtRowAfterImport.periodOn === true &&
    stmtRowAfterImport.importedDate === formatDate(0),
  stmtMonthAfterImport ? stmtMonthAfterImport.label + " · " + stmtMonthAfterImport.rows.length + " row" : "missing");
check("Statement amount match uses open invoices",
  stmtProposal && stmtProposal.status === "open" && stmtProposal.confidence === 0.9 &&
    stmtProposal.invoiceId === "inv_0147" &&
    stmtProposal.reason === "Statement amount matches invoice INV-0147" &&
    walkProposal && walkProposal.confidence === 0.4 && walkProposal.invoiceId == null,
  stmtProposal ? stmtProposal.reason : "missing proposal");
check("Statement import keeps matched + open = total",
  matchAfter.matched + getOpenMatches().length === matchAfter.total &&
    matchAfter.total === matchBefore.total + 2 &&
    getOpenMatches().length === openBefore + 2 &&
    matchAfter.matched === matchBefore.matched,
  matchAfter.matched + " + " + getOpenMatches().length + " = " + matchAfter.total);
check("Statement import lifts Money In and Out from the ledger",
  getMoneyIn("month") === moneyInBeforeStmt + 920000 + 12550 &&
    getMoneyOut("month") === moneyOutBeforeStmt + 8000 &&
    getNet("month") === getProfitAndLoss("month").netProfit,
  "In " + money(getMoneyIn("month")) + " · Out " + money(getMoneyOut("month")));
check("Statement import writes one activity summary",
  live().activityLog.some(row => row.what === "Bank statement imported, 3 transactions, 1 matched automatically"),
  live().activityLog[0] ? live().activityLog[0].what : "missing");
const createdBank = importBankStatement({
  csvText: "date,description,amount\n" + dateInputValue(-3) + ",QNB transfer,50.00\n",
  bankName: "Qatar National Bank",
  label: "Collections"
});
check("New statement bank account is appended like sample banks",
  live().bankAccounts.some(row => row.id === createdBank.accountId && row.bank === "Qatar National Bank" &&
    row.label === "Collections" && row.openingBalanceMinor === 0 && row.asOfOffset === 0 && !row.sample),
  createdBank.accountId);
const stmtMonthsTwoAccounts = dashboardState().statementMonths;
check("Statements tab flattens imports across accounts in one month",
  stmtMonthsTwoAccounts.empty === false &&
    stmtMonthsTwoAccounts.months.length === 1 &&
    stmtMonthsTwoAccounts.months[0].rows.length === 2 &&
    stmtMonthsTwoAccounts.months[0].rows[0].accountId === createdBank.accountId &&
    stmtMonthsTwoAccounts.months[0].rows[1].accountId === "bank_01",
  stmtMonthsTwoAccounts.months[0] ? stmtMonthsTwoAccounts.months[0].rows.map(row => row.accountId).join(" · ") : "missing");
resetStore();
updateBankAccount("bank_01", {
  importHistory: [
    { id: "stmt_now", importedOffset: 0, periodFromOffset: -10, periodToOffset: 0, rowsImported: 4, rowsSkipped: 0 },
    { id: "stmt_prev", importedOffset: -40, periodFromOffset: -50, periodToOffset: -40, rowsImported: 2, rowsSkipped: 1 }
  ]
});
const stmtMonthsGrouped = dashboardState().statementMonths;
check("Statements tab sorts months and rows newest-first",
  stmtMonthsGrouped.months.length === 2 &&
    stmtMonthsGrouped.months[0].label === monthYearLabel(0) &&
    stmtMonthsGrouped.months[1].label === monthYearLabel(-40) &&
    stmtMonthsGrouped.months[0].label !== stmtMonthsGrouped.months[1].label &&
    stmtMonthsGrouped.months[0].rows[0].id === "stmt_now" &&
    stmtMonthsGrouped.months[1].rows[0].id === "stmt_prev" &&
    stmtMonthsGrouped.months[1].rows[0].periodOn === true &&
    stmtMonthsGrouped.months[1].rows[0].periodFrom === formatDate(-50) &&
    stmtMonthsGrouped.months[1].rows[0].periodTo === formatDate(-40),
  stmtMonthsGrouped.months.map(month => month.label).join(" → "));
resetStore();
const gulfCsv = [
  "date,description,amount",
  "05/09/2026,Gulf dated sale,10.00",
  "5 Sep 2026,English dated sale,20.00",
  "32/13/2026,Bad calendar,5.00",
  ",Missing date,5.00"
].join("\n");
const gulfImported = importBankStatement({
  csvText: gulfCsv,
  accountId: "bank_01"
});
const gulfSale = live().transactions.find(txn => txn.counterparty === "Gulf dated sale");
const engSale = live().transactions.find(txn => txn.counterparty === "English dated sale");
check("Statement import accepts DD/MM/YYYY and 5 Sep 2026",
  gulfImported.imported === 2 && gulfImported.skipped === 2 &&
    gulfImported.skippedReasons.badDate === 1 && gulfImported.skippedReasons.missingFields === 1 &&
    gulfSale && gulfSale.dayOffset === stmtIsoOffset && gulfSale.amountMinor === 1000 &&
    engSale && engSale.dayOffset === stmtIsoOffset && engSale.amountMinor === 2000 &&
    !live().transactions.some(txn => txn.counterparty === "Bad calendar"),
  gulfImported.imported + " imported · skipped " + gulfImported.skipped +
    " · offsets " + (gulfSale && gulfSale.dayOffset) + "/" + (engSale && engSale.dayOffset));
const gulfAccount = live().bankAccounts.find(row => row.id === "bank_01");
check("Statement period falls back to imported row offsets",
  gulfAccount && gulfAccount.periodFromOffset === stmtIsoOffset && gulfAccount.periodToOffset === stmtIsoOffset &&
    gulfAccount.lastImportOffset === 0,
  "period " + (gulfAccount && gulfAccount.periodFromOffset) + ".." + (gulfAccount && gulfAccount.periodToOffset));
resetStore();
const datedImport = importBankStatement({
  csvText: "date,description,amount\n" + dateInputValue(-5) + ",Period sale,15.00\n",
  accountId: "bank_01",
  periodFromRaw: dateInputValue(-20),
  periodToRaw: dateInputValue(-1)
});
const datedAccount = live().bankAccounts.find(row => row.id === "bank_01");
check("Statement import stores the submitted period when provided",
  datedImport.imported === 1 && datedAccount && datedAccount.periodFromOffset === -20 && datedAccount.periodToOffset === -1 &&
    datedAccount.importHistory[0].periodFromOffset === -20 && datedAccount.importHistory[0].periodToOffset === -1,
  "from " + (datedAccount && datedAccount.periodFromOffset) + " · to " + (datedAccount && datedAccount.periodToOffset));
resetStore();
const seedAhli = live().bankAccounts.find(row => row.id === "bank_01");
check("Seed current account is sample and has no reminder",
  seedAhli && seedAhli.sample === true && bankReminderView(seedAhli).status == null &&
    dashboardState().overdueBankCount === 0 &&
    dashboardState().banks.find(row => row.id === "bank_01").sample === true &&
    dashboardState().banks.find(row => row.id === "bank_01").reminder.status == null,
  bankReminderView(seedAhli).status);
const sampleAcc = connectSampleBank(SAMPLE_BANKS[0].id);
const sampleExtra = connectSampleBank(SAMPLE_BANKS[1].id);
check("Sample bank accounts never get a statement reminder status",
  sampleAcc.sample === true && sampleExtra.sample === true && seedAhli.sample === true &&
    bankReminderView(seedAhli).status == null &&
    bankReminderView(sampleAcc).status == null && bankReminderView(sampleExtra).status == null &&
    dashboardState().banks.filter(row => row.sample).every(row => row.reminder.status == null) &&
    dashboardState().overdueBankCount === 0 &&
    /bx\.sampleOn/.test(html) && /ui\.bank\.sample/.test(html) &&
    /bx\.removeOn/.test(html) && /ui\.bank\.removeSample/.test(html) &&
    /Array\.isArray\(v\.banks\)/.test(html),
  SAMPLE_BANKS.map(row => row.id).concat("bank_01").join(", "));
check("removeBankAccount removes extra sample accounts from the old wizard",
  sampleAcc.id !== "bank_01" && sampleExtra.id !== "bank_01" &&
    !!removeBankAccount(sampleAcc.id) && !!removeBankAccount(sampleExtra.id) &&
    !live().bankAccounts.some(row => row.id === sampleAcc.id || row.id === sampleExtra.id) &&
    live().bankAccounts.some(row => row.id === "bank_01" && row.sample === true),
  sampleAcc.id + " · " + sampleExtra.id);
resetStore();
const liveStmt = importBankStatement({
  csvText: "date,description,amount\n" + dateInputValue(0) + ",Live sale,10.00\n",
  bankName: "Qatar National Bank",
  label: "Collections"
});
const liveBank = live().bankAccounts.find(row => row.id === liveStmt.accountId);
check("An account importing today is current, not overdue",
  liveBank && !liveBank.sample && bankReminderView(liveBank).status === "current" &&
    dashboardState().overdueBankCount === 0,
  bankReminderView(liveBank).label);
updateBankAccount(liveStmt.accountId, { lastImportOffset: -30 });
check("Statement reminder is overdue after 30 days",
  bankReminderView(live().bankAccounts.find(row => row.id === liveStmt.accountId)).status === "overdue" &&
    dashboardState().overdueBankCount === 1 &&
    /overdueBanksOn/.test(html) && /ui\.bank\.overdueBanner/.test(rootSource) &&
    /'Up to date': \['var\(--pos\)'/.test(rootSource) &&
    /stmtPeriodFrom/.test(rootSource) && /ui\.bank\.periodFrom/.test(html),
  dashboardState().overdueBankCount + " overdue");
const refusedMissing = removeBankAccount("bank_missing");
const refusedLive = removeBankAccount(liveStmt.accountId);
check("removeBankAccount refuses to remove a non-sample account",
  refusedMissing == null && refusedLive == null &&
    live().bankAccounts.some(row => row.id === liveStmt.accountId && !row.sample),
  liveStmt.accountId);
const removedSample = removeBankAccount("bank_01");
check("removeBankAccount removes a sample account",
  removedSample && removedSample.id === "bank_01" && removedSample.sample === true &&
    !live().bankAccounts.some(row => row.id === "bank_01") &&
    live().bankAccounts.some(row => row.id === liveStmt.accountId),
  removedSample && removedSample.id);
resetStore();
resetGateway();

root.applyStore();
root.openModal("statement")();
check("Upload statement defaults to New account on a fresh demo",
  dashboardState().banks.every(row => Object.prototype.hasOwnProperty.call(row, "lastImportOffset")) &&
    dashboardState().banks[0] && dashboardState().banks[0].id === "bank_01" &&
    dashboardState().banks[0].sample === true &&
    dashboardState().banks[0].lastImportOffset == null &&
    root.defaultStmtAccount(dashboardState().banks) === "__new__" &&
    root.state.form.stmtAccount === "__new__" &&
    !/form\.stmtAccount = \(s\.banks && s\.banks\[0\]/.test(rootSource) &&
    /this\.defaultStmtAccount\(s\.banks\)/.test(rootSource) &&
    /v\.stmt && v\.stmt\.updatingOn/.test(html) &&
    /Updating \{\{bank\}\} · \{\{label\}\}/.test(enUi),
  root.state.form.stmtAccount);
const olderLive = importBankStatement({
  csvText: "date,description,amount\n" + dateInputValue(-8) + ",Older live sale,10.00\n",
  bankName: "Qatar National Bank",
  label: "New 1"
});
const olderStamp = Date.now();
while (Date.now() === olderStamp) { /* next bank id must not collide */ }
const newerLive = importBankStatement({
  csvText: "date,description,amount\n" + dateInputValue(-1) + ",Newer live sale,12.00\n",
  bankName: "Doha Bank",
  label: "Ops"
});
updateBankAccount(olderLive.accountId, { lastImportOffset: -10 });
updateBankAccount(newerLive.accountId, { lastImportOffset: -1 });
updateBankAccount("bank_01", { lastImportOffset: 0 });
root.applyStore();
root.openModal("statement")();
const stmtLiveVals = root.renderVals();
check("Upload statement defaults to the most recently imported live account",
  olderLive.accountId !== newerLive.accountId &&
    live().bankAccounts[0].id === "bank_01" &&
    dashboardState().banks[0].id === "bank_01" &&
    dashboardState().banks.find(row => row.id === olderLive.accountId).lastImportOffset === -10 &&
    dashboardState().banks.find(row => row.id === newerLive.accountId).lastImportOffset === -1 &&
    dashboardState().banks.find(row => row.id === "bank_01").lastImportOffset === 0 &&
    root.defaultStmtAccount([
      { id: "bank_01", sample: true, lastImportOffset: 0 },
      { id: "bank_old", sample: false, lastImportOffset: -10 },
      { id: "bank_new", sample: false, lastImportOffset: -1 }
    ]) === "bank_new" &&
    root.defaultStmtAccount(dashboardState().banks) === newerLive.accountId &&
    root.state.form.stmtAccount === newerLive.accountId &&
    root.state.form.stmtAccount !== "bank_01" &&
    stmtLiveVals.stmt.updatingOn === true &&
    stmtLiveVals.stmt.updatingLine === "Updating Doha Bank · Ops",
  root.state.form.stmtAccount);
root.setState(st => ({ form: Object.assign({}, st.form, { stmtAccount: "__new__" }) }));
const stmtNewVals = root.renderVals();
root.setState(st => ({ form: Object.assign({}, st.form, { stmtAccount: olderLive.accountId }) }));
const stmtOlderVals = root.renderVals();
check("Upload statement confirmation follows the selected account",
  stmtNewVals.stmt.updatingOn === false && stmtNewVals.stmt.updatingLine === "" &&
    stmtOlderVals.stmt.updatingOn === true &&
    stmtOlderVals.stmt.updatingLine === "Updating Qatar National Bank · New 1",
  stmtOlderVals.stmt.updatingLine);
const bankCards = root.renderVals().banks;
root.openStatementForAccount(olderLive.accountId);
check("Per-account Upload statement locks the modal to that account",
  bankCards.some(row => row.sampleOn && row.removeOn && !row.uploadOn) &&
    bankCards.some(row => row.id === olderLive.accountId && row.liveOn && row.uploadOn && !row.removeOn && typeof row.upload === "function") &&
    /uploadOn: !row\.sample/.test(rootSource) &&
    /openStatementForAccount/.test(rootSource) &&
    /modalOpenState/.test(rootSource) &&
    /bx\.uploadOn/.test(html) && /onClick=\{bx\.upload\}/.test(html) &&
    root.state.modal === "statement" &&
    root.state.form.stmtAccount === olderLive.accountId &&
    root.state.form.stmtAccount !== newerLive.accountId,
  root.state.form.stmtAccount);
root.openStatementForAccount(newerLive.accountId);
check("Per-account Upload statement can target a different live account",
  root.state.modal === "statement" && root.state.form.stmtAccount === newerLive.accountId,
  root.state.form.stmtAccount);
root.openModal("statement")();
check("Generic upload still defaults to the most recently imported live account",
  root.state.form.stmtAccount === newerLive.accountId,
  root.state.form.stmtAccount);
const banksBeforeDemo = JSON.stringify(live().bankAccounts);
const txnCountBeforeDemo = live().transactions.length;
root.openModal("bankDemo")();
const demo0 = root.renderVals();
const demoSecond = (demo0.bankDemo.banks || []).find(row => !row.on);
if (demoSecond && typeof demoSecond.go === "function") demoSecond.go();
const demo0Picked = root.renderVals();
root.submitModal();
const demo1 = root.renderVals();
root.submitModal();
const demo2 = root.renderVals();
root.submitModal();
const demo3 = root.renderVals();
const demoCurrent = (demo3.bankDemo.accounts || []).find(row => row.id === "current");
if (demoCurrent && typeof demoCurrent.toggle === "function") demoCurrent.toggle({ target: { checked: false } });
const demo3Toggled = root.renderVals();
root.submitModal();
const demo4 = root.renderVals();
check("Connected banking demo is UI-only and does not write the store",
  banksBeforeDemo === JSON.stringify(live().bankAccounts) &&
    live().transactions.length === txnCountBeforeDemo &&
    root.state.modal === "bankDemo" &&
    demo0.modal.bankDemo === true &&
    demo0.bankDemoStep === 0 && demo0.bankDemo.step0 === true &&
    demo0.modal.title === "Choose a bank" && demo0.modal.cta === "Continue" &&
    demo0.bankDemo.picked.bank === QATAR_BANKS[0].bank &&
    demo0Picked.bankDemo.picked.bank === (demoSecond && demoSecond.bank) &&
    demo1.bankDemoStep === 1 && demo1.bankDemo.step1 === true &&
    demo1.modal.title === "Sign in" && demo1.modal.cta === "Continue" &&
    demo1.f.bankDemoLoginId === "demo_user" && demo1.f.bankDemoLoginPw === "demo1234" &&
    demo2.bankDemoStep === 2 && demo2.bankDemo.step2 === true &&
    demo2.modal.title === "Enter the code" &&
    (demo2.bankDemo.otp || []).map(box => box.value).join("") === "482913" &&
    demo3.bankDemoStep === 3 && demo3.bankDemo.step3 === true &&
    demo3.modal.title === "Choose accounts" && demo3.modal.cta === "Link account(s)" &&
    (demo3.bankDemo.accounts || []).length === 2 &&
    (demo3.bankDemo.accounts || []).every(row => row.on) &&
    (demo3Toggled.bankDemo.accounts || []).some(row => row.id === "current" && !row.on) &&
    (demo3Toggled.bankDemo.accounts || []).some(row => row.id === "savings" && row.on) &&
    demo4.bankDemoStep === 4 && demo4.bankDemo.step4 === true &&
    demo4.modal.title === "Connected preview" && demo4.modal.cta === "Got it" &&
    demo4.bankDemo.previewIban === CONNECTED_BANKING_PREVIEW.ibanMasked &&
    /k === 'bankDemo'/.test(rootSource) &&
    /bankDemoStep \|\| 0\) < 4/.test(rootSource) &&
    !/k === 'bankDemo'[\s\S]{0,280}applyStore/.test(rootSource) &&
    !/FlowStore\./.test(rootSource.slice(rootSource.indexOf("} else if (k === 'bankDemo')"), rootSource.indexOf("} else if (k === 'bankDemo')") + 280)) &&
    /chrome\.modal\.continue/.test(rootSource) && /"continue": "Continue"/.test(enChrome),
  "step " + root.state.bankDemoStep + " · accounts " + live().bankAccounts.length);
root.submitModal();
check("Connected banking demo Got it closes without persisting",
  root.state.modal == null &&
    banksBeforeDemo === JSON.stringify(live().bankAccounts) &&
    live().transactions.length === txnCountBeforeDemo,
  String(root.state.modal));
root.openModal("bankDemo")();
root.setState(st => ({ form: Object.assign({}, st.form, { bankDemoLoginId: "changed", bankDemoOtp: "000000" }) }));
root.submitModal();
root.renderVals().h.closeModal();
root.openModal("bankDemo")();
const demoReopen = root.renderVals();
check("Connected banking demo restarts at step 0 after close",
  root.state.modal === "bankDemo" &&
    root.state.bankDemoStep === 0 &&
    demoReopen.bankDemo.step0 === true &&
    root.state.form.bankDemoPick === QATAR_BANKS[0].bank &&
    root.state.form.bankDemoLoginId === "demo_user" &&
    root.state.form.bankDemoLoginPw === "demo1234" &&
    root.state.form.bankDemoOtp === "482913" &&
    JSON.stringify(root.state.form.bankDemoAccountsPicked) === JSON.stringify(["current", "savings"]) &&
    banksBeforeDemo === JSON.stringify(live().bankAccounts),
  "step " + root.state.bankDemoStep);
resetStore();
resetGateway();

root.applyStore();
const monthAiSrc = getAiInsights("month").insights;
const dayAiSrc = getAiInsights("day").insights;
check("Flow AI insights are derived from spend and runway",
  monthAiSrc.length >= 1 &&
    monthAiSrc.length <= 4 &&
    monthAiSrc.some(line => /Salaries/.test(line)) &&
    monthAiSrc.some(line => /cash-flow positive/.test(line)) &&
    JSON.stringify(monthAiSrc) !== JSON.stringify(dayAiSrc),
  monthAiSrc.length + " month · " + dayAiSrc.length + " day");
root.setState(st => ({ page: "reports", reportsTf: "month", detail: null }));
const monthRepAi = root.renderVals();
root.setState({ reportsTf: "week" });
const weekRepAi = root.renderVals();
root.setState({ reportsTf: "day" });
const dayRepAi = root.renderVals();
const aiBlock = rootSource.slice(rootSource.indexOf("const aiInsights = [];"), rootSource.indexOf("const aiInsights = [];") + 1200);
check("Reports Overview Flow AI panel is local and period-specific",
  Array.isArray(monthRepAi.aiInsights) &&
    monthRepAi.aiInsights.length >= 1 &&
    monthRepAi.aiInsights.length <= 4 &&
    JSON.stringify(monthRepAi.aiInsights) !== JSON.stringify(weekRepAi.aiInsights) &&
    JSON.stringify(monthRepAi.aiInsights) !== JSON.stringify(dayRepAi.aiInsights) &&
    /ui\.rep\.aiTitle/.test(html) &&
    /Flow AI insights/.test(enUi) &&
    /v\.aiInsights/.test(html) &&
    /v\.reportsTfs/.test(html) &&
    !/openai|anthropic|\bllm\b|fetch\(/.test(aiBlock),
  "month " + monthRepAi.aiInsights.length + " · week " + weekRepAi.aiInsights.length + " · day " + dayRepAi.aiInsights.length);
root.setState(st => ({
  page: "transactions",
  reportsTf: "month",
  tab: Object.assign({}, st.tab, { transactions: "matching" })
}));
const matchAi = root.renderVals();
check("Match cards label reasoning as Flow AI",
  /ui\.match\.aiTag/.test(html) &&
    /"aiTag": "Flow AI"/.test(enUi) &&
    /ui\.det\.why/.test(html) &&
    matchAi.matches.length > 0 &&
    typeof matchAi.matches[0].why === "string" &&
    typeof matchAi.matches[0].confT === "string" &&
    /v\.t\("ui\.match\.suggested"/.test(html),
  matchAi.matches.length + " open · " + matchAi.matches[0].confT);
const monthForecast = dashboardState().periods.month.forecastSummary;
check("Forecast summary narrates projected cash-forecast buckets",
  monthForecast &&
    monthForecast.hasProjection === true &&
    typeof monthForecast.netMinor === "number" &&
    typeof monthForecast.netText === "string" &&
    typeof monthForecast.positive === "boolean" &&
    monthRepAi.aiInsights.some(line => /Projected to (bring in|spend)/.test(line)),
  (monthForecast.positive ? "in " : "out ") + monthForecast.netText);
const overdueInv = (root.state.invoices || []).find(i => i.id === "inv_0147");
const upcomingInv = (root.state.invoices || []).find(i => i.id === "inv_0148");
const overdueDraft = overdueInv ? root.draftReminderMessage(Object.assign({}, overdueInv, { amt: root.fmt(overdueInv.amount) })) : "";
const upcomingDraft = upcomingInv ? root.draftReminderMessage(Object.assign({}, upcomingInv, { amt: root.fmt(upcomingInv.amount) })) : "";
check("Reminder drafts change tone for overdue vs upcoming",
  !!overdueInv &&
    !!upcomingInv &&
    /now overdue/i.test(overdueDraft) &&
    /due on/i.test(upcomingDraft) &&
    overdueDraft !== upcomingDraft &&
    /openReminderPreview/.test(rootSource) &&
    /reminderPreview/.test(html) &&
    /"previewTitle": "Review reminder"/.test(enUi),
  (overdueInv && overdueInv.status) + " vs " + (upcomingInv && upcomingInv.status));
root.openReminderPreview(Object.assign({}, overdueInv, { amt: root.fmt(overdueInv.amount) }));
const previewOpen = root.state.modal === "reminderPreview" && String(root.state.form.reminderDraft || "").length > 20;
root.setState({ form: Object.assign({}, root.state.form, { reminderDraft: "Edited reminder copy" }) });
const edited = root.state.form.reminderDraft === "Edited reminder copy";
root.submitModal();
check("Remind opens an editable preview then the existing toast",
  previewOpen &&
    edited &&
    root.state.modal == null &&
    /Reminder sent/.test(String(root.state.toast || "")),
  String(root.state.toast || "").slice(0, 48));
root.setState({ modal: null, reportsTf: "month", aiChatOpen: true, aiChatMessages: [] });
const cashA = root.answerAiChat("what's my cash runway");
const overdueA = root.answerAiChat("show overdue receivables");
const spendMonth = root.answerAiChat("how much did I spend this month");
const revA = root.answerAiChat("what's my revenue trend");
root.setState({ reportsTf: "day" });
const spendDay = root.answerAiChat("how much did I spend this month");
const weather = root.answerAiChat("what's the weather");
const chatFn = rootSource.slice(rootSource.indexOf("answerAiChat("), rootSource.indexOf("postPayrollToLedger()"));
const origTimeout = setTimeout;
const origClear = clearTimeout;
const queuedAi = [];
globalThis.setTimeout = (fn) => { queuedAi.push(fn); return queuedAi.length; };
globalThis.clearTimeout = () => {};
root.setState({ aiChatMessages: [], aiChatThinking: false, form: Object.assign({}, root.state.form, { aiChatDraft: "" }) });
root.sendAiChatMessage("what's my cash runway");
const thinkingOn = root.state.aiChatThinking === true &&
  (root.state.aiChatMessages || []).length === 1 &&
  (root.state.aiChatMessages || [])[0].role === "user";
queuedAi.forEach((fn) => fn());
const thinkingOff = root.state.aiChatThinking === false &&
  (root.state.aiChatMessages || []).length === 2 &&
  (root.state.aiChatMessages || [])[1].role === "ai" &&
  /QR/.test(String((root.state.aiChatMessages || [])[1].text || ""));
globalThis.setTimeout = origTimeout;
globalThis.clearTimeout = origClear;
check("Flow AI chat answers from live Flow data, not an external model",
  /QR/.test(cashA) &&
    /outstanding invoice/i.test(overdueA) &&
    spendMonth !== spendDay &&
    /Net income|Not enough data/.test(revA) &&
    /cash and runway/.test(weather) &&
    thinkingOn && thinkingOff &&
    /toggleAiChat/.test(html) &&
    /z-index:75/.test(html) &&
    /v\.h\.toggleAiChat/.test(html) &&
    /sendAiChatSuggestion/.test(html) &&
    /aiChatThinking/.test(html) &&
    /flowAiDot/.test(html) &&
    /--ai-gradient/.test(html) &&
    /#3A4668/.test(html) &&
    /#7A8AB4/.test(html) &&
    !/#4F5BFF/.test(html) &&
    !/#8B5CF6/.test(html) &&
    !/#C061E8/.test(html) &&
    /--ai-glow/.test(html) &&
    /position:relative; width:min\(400px, calc\(100vw - 36px\)\)/.test(html) &&
    /top:-40px/.test(html) &&
    /width:220px; height:180px/.test(html) &&
    /flowAiGlow/.test(html) &&
    !/width:280px; height:200px/.test(html) &&
    /background:var\(--ai-gradient\)/.test(html) &&
    !/var\(--accent, #6C5CE7\)/.test(html) &&
    /ui\.ai\.emptyHeading/.test(html) &&
    /width:min\(400px, calc\(100vw - 36px\)\)/.test(html) &&
    /height:min\(640px, calc\(100vh - 120px\)\)/.test(html) &&
    !/max-height:min\(520px/.test(html) &&
    !/onClick=\{v\.h\.openAiChat\}/.test(html) &&
    /v\.aiChatOpen/.test(html) &&
    /"chatTitle": "Flow AI"/.test(enUi) &&
    /"chatSubtitle": "Answers from your live data"/.test(enUi) &&
    /"emptyHeading": "Ask Flow AI anything"/.test(enUi) &&
    /"suggestRunway": "What's my cash runway\?"/.test(enUi) &&
    !/openai|anthropic|\bllm\b|fetch\(/.test(chatFn),
  "spend month vs day · thinking delay · chips");
root.setState(st => ({ page: "dashboard", reportsTf: "month", aiChatOpen: false, aiChatMessages: [], aiChatThinking: false, tab: Object.assign({}, st.tab, { transactions: "all" }) }));

assertPhase1Invariants();
check("Phase 1 invariants hold on the seed", true, "Home Net / Outstanding / match / payroll / cash / invoice status");
root.state.team = [];
root.state.employees = [];
root.applyStore();
check("applyStore copies team and employees from the ledger",
  root.state.team.length === live().teamMembers.length &&
    root.state.employees.length === live().employees.length,
  root.state.team.length + " members · " + root.state.employees.length + " employees");

const recRow = createRecurringInvoice({
  clientName: "Lusail Hospitality",
  amountMinor: 540000,
  interval: "Month"
});
const recNext = recurringNextOffsets(recRow);
check("Recurring invoice next three offsets",
  recNext.length === 3 && recNext[0] === 0 && recNext[1] === 30 && recNext[2] === 60,
  recNext.join(", "));
const invoiceCountBeforeSend = live().invoices.length;
const sentRecurring = sendRecurringInvoice(recRow.id);
check("Sending a recurring invoice appends an invoice",
  live().invoices.length === invoiceCountBeforeSend + 1 &&
    sentRecurring.amountMinor === 540000 &&
    sentRecurring.clientId === recRow.clientId &&
    live().recurringInvoices[0].sentCount === 1,
  sentRecurring.number + " · sentCount " + live().recurringInvoices[0].sentCount);
resetStore();
resetGateway();

root.applyStore();
root.setState(st => ({
  page: "invoicing",
  tab: Object.assign({}, st.tab, { invoicing: "recurring" }),
  form: Object.assign({}, st.form, { recClient: "Lusail Hospitality", recAmount: "5400", recEvery: "Month" })
}));
root.renderVals().rec.start();
const uiRec = live().recurringInvoices[0];
check("Recurring Start schedule writes the store",
  uiRec && uiRec.amountMinor === 540000 && uiRec.interval === "Month" && recurringNextOffsets(uiRec).length === 3,
  uiRec ? uiRec.id + " · " + recurringNextOffsets(uiRec).join(", ") : "missing");
check("Recurring UI shows the next three sends",
  root.renderVals().rec.hasNext === true && root.renderVals().rec.next.length === 3 && root.renderVals().rec.none === false,
  String(root.renderVals().rec.next.map(row => row.label).join(" / ")));
resetStore();
resetGateway();
root.applyStore();

const salesCount = live().transactions.filter(txn => txn.tag === "Sales").length;
const renamed = renameTag("Sales", "Sales renamed");
check("Tag rename updates ledger rows",
  renamed.count === salesCount &&
    live().transactions.filter(txn => txn.tag === "Sales renamed").length === salesCount &&
    live().transactions.every(txn => txn.tag !== "Sales"),
  renamed.count + " rows");
root.applyStore();
root.setState(st => ({ page: "settings", tab: Object.assign({}, st.tab, { settings: "tags" }), detail: null }));
const salesTag = root.renderVals().tagList.find(row => row.label === "Sales renamed");
check("Tag list counts come from the ledger",
  salesTag && salesTag.count === String(salesCount),
  salesTag ? salesTag.count + " items" : "missing");
let removeUsed = "";
try { removeTag("Sales renamed"); } catch (err) { removeUsed = err.message; }
check("Removing a used tag fails loudly",
  /still use/.test(removeUsed),
  removeUsed || "no error");
renameTag("Sales renamed", "Sales");

const createdTop = createTag("Events");
const createdChild = createTag("Ads", "Marketing");
check("Create tag adds a top-level catalog entry",
  createdTop === "Events" && live().tags.includes("Events") && !live().tagParents.Events,
  live().tags.join(", "));
check("Create tag nests a child under a top-level parent",
  createdChild === "Ads" && live().tagParents.Ads === "Marketing",
  JSON.stringify(live().tagParents));
root.applyStore();
root.setState(st => ({ page: "settings", tab: Object.assign({}, st.tab, { settings: "tags" }), detail: null }));
const nested = root.renderVals().tagList;
const adsRow = nested.find(row => row.label === "Ads");
const marketingIdx = nested.findIndex(row => row.label === "Marketing");
const adsIdx = nested.findIndex(row => row.label === "Ads");
check("Manage Tags nests the child under its parent",
  adsRow && adsRow.depth === 1 && adsRow.child === true && adsIdx === marketingIdx + 1,
  adsRow ? "depth " + adsRow.depth + " after " + nested[marketingIdx]?.label : "missing");
const expensePick = root.renderVals().expCat.options.some(row => row.value === "Events" || row.label === "Events");
const moneyFilter = (root.renderVals().fopts.tag || []).some(row => row.label === "Ads" || row.value === "Ads");
const scanOpts = (root.renderVals().tagOptions || []).includes("Ads") && (root.renderVals().tagOptions || []).includes("Events");
check("New tags appear on expense, filter, and scan pickers",
  expensePick && moneyFilter && scanOpts,
  "picks " + expensePick + " · filter " + moneyFilter + " · scan " + scanOpts);
root.setState(st => ({ form: Object.assign({}, st.form, { expTag: "Marketing", scanTag: "Marketing" }) }));
const expSub = root.renderVals().expCat;
const scanSub = root.renderVals().scanCat;
check("Expense and scan offer a tag when the category has children",
  expSub.hasTag && expSub.tagOptions.some(row => row.value === "Ads") &&
    scanSub.hasTag && scanSub.tagOptions.some(row => row.value === "Ads") &&
    !expSub.hasSub && !scanSub.hasSub,
  "exp " + (expSub.tagOptions || []).map(row => row.value).join(",") + " · scan " + (scanSub.tagOptions || []).map(row => row.value).join(","));
root.setState(st => ({ form: Object.assign({}, st.form, { expTag: "Utilities", scanTag: "Utilities" }) }));
const utilPick = root.renderVals().expCat;
check("Tag field stays hidden when the category has no tags",
  !utilPick.hasTag && !utilPick.hasSub,
  "hasTag=" + !!utilPick.hasTag + " hasSub=" + !!utilPick.hasSub);
root.setState(st => ({ form: Object.assign({}, st.form, { expTag: "Marketing", scanTag: "Marketing" }) }));
const marketingRow = root.renderVals().tagList.find(row => row.label === "Marketing");
check("Manage Tags lists sub-tags inside the parent",
  marketingRow && (marketingRow.subs || []).some(row => row.label === "Ads"),
  marketingRow ? "subs " + (marketingRow.subs || []).map(row => row.label).join(",") : "missing");
root.setState({ openTag: "Marketing" });
const folder = root.renderVals().tagFolder;
check("Opening a parent tag shows its sub-tags",
  folder.on && folder.name === "Marketing" && !folder.empty &&
    root.renderVals().tagList.some(row => row.parent === "Marketing" && row.label === "Ads"),
  folder.on ? folder.name + " empty=" + folder.empty : "closed");
root.setState({ openTag: null });
check("Manage Tags parent rows expose a manage action",
  root.renderVals().tagList.filter(row => !row.child).every(row => typeof row.open === "function"),
  "parents " + root.renderVals().tagList.filter(row => !row.child).length);

const laterParent = setTagParent("Events", "Marketing");
check("Existing top-level tag can get a parent later",
  laterParent.parent === "Marketing" && live().tagParents.Events === "Marketing",
  JSON.stringify(live().tagParents));
const persisted = globalThis.localStorage.getItem("flow-live-v1");
const persistedParents = persisted ? JSON.parse(persisted).tagParents : {};
check("Later parent is written to storage",
  persistedParents.Events === "Marketing",
  JSON.stringify(persistedParents));
resetStore();
if (persisted) globalThis.localStorage.setItem("flow-live-v1", persisted);
hydrateFromStorage();
check("Later parent survives reload hydrate",
  live().tagParents.Events === "Marketing" && live().tags.includes("Events"),
  JSON.stringify(live().tagParents));
root.applyStore();
const eventsNested = root.renderVals().tagList.find(row => row.label === "Events");
check("Later parent nests in Manage Tags",
  eventsNested && eventsNested.depth === 1 && eventsNested.parent === "Marketing",
  eventsNested ? "depth " + eventsNested.depth + " under " + eventsNested.parent : "missing");

root.setState(st => ({ modal: "tag", editTag: "Events", form: Object.assign({}, st.form, { newTag: "Launch", newTagParent: "Sales" }) }));
root.submitModal();
check("Rename can change name and parent together",
  live().tags.includes("Launch") && !live().tags.includes("Events") && live().tagParents.Launch === "Sales",
  JSON.stringify({ tags: live().tags, parents: live().tagParents }));

const renamedParent = renameTag("Marketing", "Promo");
check("Renaming a parent remaps the child",
  renamedParent.to === "Promo" && live().tagParents.Ads === "Promo" && !live().tagParents.Marketing,
  JSON.stringify(live().tagParents));
renameTag("Promo", "Marketing");

let nestParentErr = "";
try { setTagParent("Marketing", "Sales"); } catch (err) { nestParentErr = err.message; }
check("A parent with children cannot be nested",
  /sub-tags|cannot be nested/i.test(nestParentErr),
  nestParentErr || "no error");
let nestUnderChild = "";
try { setTagParent("Launch", "Ads"); } catch (err) { nestUnderChild = err.message; }
check("setTagParent rejects a child as parent",
  /top-level/.test(nestUnderChild),
  nestUnderChild || "no error");

removeTag("Launch");
check("Unused top-level tag can be removed",
  !live().tags.includes("Launch") && !live().tags.includes("Events"),
  live().tags.join(", "));

createTag("Campaigns");
createTag("Flyers", "Campaigns");
removeTag("Campaigns");
check("Removing an unused parent promotes its children",
  live().tags.includes("Flyers") && !live().tagParents.Flyers && !live().tags.includes("Campaigns"),
  JSON.stringify({ tags: live().tags, parents: live().tagParents }));
removeTag("Ads");
removeTag("Flyers");
let nestedParentErr = "";
createTag("Events");
createTag("Ads", "Marketing");
try { createTag("Banners", "Ads"); } catch (err) { nestedParentErr = err.message; }
check("A child cannot be used as a parent",
  /top-level/.test(nestedParentErr),
  nestedParentErr || "no error");
resetStore();
resetGateway();

setRolePermission("Payroll", "staff", "view");
check("Permission write persists",
  live().rolePermissions.find(row => row.area === "Payroll")?.staff === "view",
  live().rolePermissions.find(row => row.area === "Payroll")?.staff || "missing");
setApprovalLimit("tm_01", 500000);
check("Approval limit write persists",
  live().approvalLimits.tm_01 === 500000,
  money(live().approvalLimits.tm_01 || 0));
const asked = requestApproval({ memberId: "tm_01", amountMinor: 900000, what: "Vendor bill" });
check("Approval request waits on the owner",
  live().approvalRequests.some(row => row.id === asked.id && row.status === "open"),
  asked.id);
resolveApproval(asked.id, "approved");
check("Approval resolve writes the store",
  live().approvalRequests.find(row => row.id === asked.id)?.status === "approved",
  live().approvalRequests.find(row => row.id === asked.id)?.status || "missing");
check("Recurring / tags / approvals are bound in the view",
  /v\.rec\.start/.test(html) && /v\.F\.recClient/.test(html) && /v\.F\.recAmount/.test(html) &&
    /tg\.edit/.test(html) && /tg\.del/.test(html) && /l\.setCap/.test(html) && /l\.readOnly/.test(html),
  "start + rename + limits");
resetStore();
resetGateway();
root.applyStore();

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
    live().paymentLinks.length === 5 &&
    live().shopify.connected === true,
  "modal open, Money In still " + money(moneyAfterMutate));
root.submitModal();
const rateReset = getMatchRate();
const openReset = getOpenMatches();
check("Reset restores Money In",
  getMoneyIn("month") === 5601000 && getMoneyOut("month") === 3336500 && getNet("month") === 2264500,
  "In " + money(getMoneyIn("month")) + " · Out " + money(getMoneyOut("month")) + " · Net " + money(getNet("month")));
check("Reset restores match identity",
  rateReset.matched === 11 && rateReset.total === 14 && openReset.length === 3 &&
    rateReset.matched + openReset.length === rateReset.total,
  rateReset.matched + " of " + rateReset.total + " · " + openReset.length + " open");
check("Reset restores seeded links and clears created pages",
  live().paymentLinks.length === 4 &&
    live().paymentLinks.reduce((sum, row) => sum + row.amountMinor * row.uses, 0) === 654000 &&
    live().paymentLinks.reduce((sum, row) => sum + row.uses, 0) === 4 &&
    live().checkoutPages.length === 0 &&
    live().subscriptionPlans.length === 0,
  "4 seeded links · QR 6,540 · pages/plans empty");
check("Reset disconnects Shopify",
  live().shopify.connected === false && dashboardState().shopify.disconnected === true,
  "disconnected");
check("Reset keeps the Tally date range",
  root.state.periodFrom === periodFromKept && root.state.periodTo === periodToKept,
  root.state.periodFrom + " → " + root.state.periodTo);
check("HTML has Reset demo data and confirm modal",
  /settings\.account\.resetCta/.test(html) && /settings\.reset\.body/.test(html) &&
    /modal\.reset/.test(html) && /s\.modal === 'reset'/.test(html) &&
    /Reset demo data/.test(enSettings) && /This restores the seed/.test(enSettings),
  "button + confirm modal");
const searchOverlay = html.slice(html.indexOf("show={!!v.searchOpen}"), html.indexOf("show={!!v.modal.on}"));
check("Search overlay clicks stay inside the panel",
  /onClick=\{v\.h\.closeSearch\}/.test(searchOverlay) &&
    /className="flow-open-pop"[\s\S]*onClick=\{v\.h\.stop\}/.test(searchOverlay),
  "stopPropagation on search pop");
check("SANDBOX tooltip string present",
  /chrome\.sandboxTip/.test(html) && /this\.t\('chrome\.sandbox'\)/.test(rootSource) &&
    enChrome.includes("Simulated gateway. Live payment processing pending Qatar commercial registration."),
  "SANDBOX hover tooltip");
check("No Peppol or VAT in public HTML",
  !/Peppol/i.test(html) && !/\bVAT\b/i.test(html) && !/Peppol/i.test(payPage) && !/\bVAT\b/i.test(payPage),
  "React dashboard and pay route");
check("Simulated labels on Payment Setup and Connected Apps",
  /ui\.pay\.gatewaySub/.test(html) && /money settles straight to you/.test(enUi) &&
    /ui\.conn\.oneGw/.test(html) && /One simulated gateway in this phase/.test(enUi) &&
    /ui\.pay\.liveNote/.test(rootSource) && /Live mode is still simulated\. Payment processing pending Qatar commercial registration\./.test(enUi) &&
    /ui\.det\.simConn/.test(html) && /Simulated connection/.test(enUi),
  "Payment Setup / Connected Apps");
check("getVatRate still 0 after Stage 6",
  getVatRate() === 0,
  String(getVatRate()));
resetStore();
resetGateway();
const staleLedger = JSON.parse(JSON.stringify(live()));
staleLedger.transactions = staleLedger.transactions.filter(txn => {
  const n = Number(String(txn.id).replace(/^txn_/, ""));
  return n >= 1 && n <= 20;
});
const staleIn = staleLedger.transactions
  .filter(txn => txn.direction === "in" && txn.status !== "pending" && txn.dayOffset >= -29 && txn.dayOffset <= 0)
  .reduce((sum, txn) => sum + txn.amountMinor, 0);
check("Older saved ledgers omit later seed rows",
  staleIn === 4651000,
  money(staleIn));
globalThis.localStorage.setItem("flow-live-v1", JSON.stringify(staleLedger));
hydrateFromStorage();
const restoredMonth = dashboardState().periods.month;
check("Hydrate restores missing seed rows and vs-prior %",
  getMoneyIn("month") === 5601000 &&
    getMoneyOut("month") === 3336500 &&
    getMoneyInPrevious("month") > 0 &&
    restoredMonth.moneyInShare === "+40%" &&
    restoredMonth.moneyOutShare === "-2%",
  "In " + money(getMoneyIn("month")) + " " + restoredMonth.moneyInShare +
    " · Out " + money(getMoneyOut("month")) + " " + restoredMonth.moneyOutShare);
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
  "- Merchant profile in the seed: CR-114820, phone +974 4012 8800, accounts@albidda.qa, Ahli Bank, account 001234567890, SWIFT AHLBQAQA. Opening balance is stored on bank_01 (QR 85,000 as of ANCHOR_DATE minus 30 days).",
  "- Four paid payment links are in the seed (collected QR 6,540, times paid 4). Subscription plans, checkout product price and saved report packs are not, so those lists start empty. Checkout drop-off uses labelled sample analytics in lib/data/sample-checkout.ts.",
  "- Shopify starts disconnected. Seed shopify transactions stay as historical rows; only new incoming after connect are tagged by the plugin.",
  "- Extra sample bank rows from connectSampleBank are labelled sample and store opening QR 0 so cash on hand does not change. Connected-banking UI is a static preview plus a UI-only walkthrough that does not write bankAccounts. Statement import history starts empty and is listed on the Banks Statements tab. Upload Statement defaults to the most recently imported live account, or New account when none exist. Live account cards open the same modal locked to that account.",
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
