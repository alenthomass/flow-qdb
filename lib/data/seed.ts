import type { ActivityLog, Client, Seed, Transaction } from "./types";

function midnight(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export const ANCHOR_DATE = midnight(new Date());

export function dateFor(dayOffset: number): Date {
  const date = new Date(ANCHOR_DATE.getTime());
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date;
}

function emailFor(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
  return slug + "@mail.qa";
}

const ownerName = "Noora Al Ansari";
const accountantName = "Priya Menon";

const transactions: Transaction[] = [
  { id: "txn_01", dayOffset: -29, counterparty: "Noor Interiors", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 154000, branchId: "br_01", invoiceId: "inv_0145" },
  { id: "txn_02", dayOffset: -28, counterparty: "Noor Interiors refund", source: "link", direction: "out", type: "refund", tag: "Sales", status: "refunded", amountMinor: 154000, branchId: "br_01", invoiceId: "inv_0145" },
  { id: "txn_03", dayOffset: -27, counterparty: "Ahli Bank fees", source: "bank", direction: "out", type: "expense", tag: "Fees", status: "settled", amountMinor: 220000, branchId: "br_01", invoiceId: null },
  { id: "txn_04", dayOffset: -26, counterparty: "Kahramaa", source: "bank", direction: "out", type: "expense", tag: "Utilities", status: "settled", amountMinor: 118000, branchId: "br_01", invoiceId: null },
  { id: "txn_05", dayOffset: -24, counterparty: "Doha Events LLC", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 890000, branchId: "br_02", invoiceId: "inv_0143" },
  { id: "txn_06", dayOffset: -22, counterparty: "Karak & Co", source: "cash", direction: "out", type: "expense", tag: "Supplies", status: "settled", amountMinor: 64000, branchId: "br_02", invoiceId: null },
  { id: "txn_07", dayOffset: -20, counterparty: "Meta Ads", source: "bank", direction: "out", type: "expense", tag: "Marketing", status: "settled", amountMinor: 240000, branchId: "br_01", invoiceId: null },
  { id: "txn_08", dayOffset: -18, counterparty: "Online orders (6)", source: "shopify", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 645000, branchId: "br_02", invoiceId: null },
  { id: "txn_09", dayOffset: -15, counterparty: "Monthly payroll", source: "bank", direction: "out", type: "payroll", tag: "Salaries", status: "settled", amountMinor: 1966500, branchId: "br_01", invoiceId: null },
  { id: "txn_10", dayOffset: -12, counterparty: "Mohammed Rashid", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 98000, branchId: "br_02", invoiceId: null },
  { id: "txn_11", dayOffset: -9, counterparty: "Souq Waqif Supplies", source: "cash", direction: "out", type: "expense", tag: "Supplies", status: "settled", amountMinor: 89000, branchId: "br_02", invoiceId: null },
  { id: "txn_12", dayOffset: -7, counterparty: "Gulf Warehousing", source: "bank", direction: "out", type: "expense", tag: "Rent", status: "settled", amountMinor: 360000, branchId: "br_02", invoiceId: null },
  { id: "txn_13", dayOffset: -5, counterparty: "Qatar Retail Group", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "pending", amountMinor: 630000, branchId: "br_01", invoiceId: "inv_0142" },
  { id: "txn_14", dayOffset: -4, counterparty: "Fatima Al-Kuwari", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 215000, branchId: "br_01", invoiceId: "inv_0146" },
  { id: "txn_15", dayOffset: -3, counterparty: "Online orders (14)", source: "shopify", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 1240000, branchId: "br_01", invoiceId: null },
  { id: "txn_16", dayOffset: -2, counterparty: "Ooredoo Business", source: "bank", direction: "out", type: "expense", tag: "Utilities", status: "settled", amountMinor: 125000, branchId: "br_02", invoiceId: null },
  { id: "txn_17", dayOffset: -1, counterparty: "Al Meera Trading", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 482000, branchId: "br_01", invoiceId: "inv_0144" },
  { id: "txn_18", dayOffset: -19, counterparty: "Online orders (9)", source: "shopify", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 428000, branchId: "br_01", invoiceId: null },
  { id: "txn_19", dayOffset: -11, counterparty: "West Bay Catering", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 312000, branchId: "br_01", invoiceId: "inv_0149" },
  { id: "txn_20", dayOffset: -6, counterparty: "Msheireb Boutiques", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 187000, branchId: "br_02", invoiceId: "inv_0150" }
];

const invoiceClients = [
  { id: "cli_01", name: "Qatar Retail Group", branchId: "br_01" },
  { id: "cli_02", name: "Doha Events LLC", branchId: "br_01" },
  { id: "cli_03", name: "Al Meera Trading", branchId: "br_01" },
  { id: "cli_04", name: "Noor Interiors", branchId: "br_01" },
  { id: "cli_05", name: "Fatima Al-Kuwari", branchId: "br_01" },
  { id: "cli_06", name: "Gulf Petro Services", branchId: "br_01" },
  { id: "cli_07", name: "Lusail Hospitality", branchId: "br_01" },
  { id: "cli_08", name: "Mohammed Rashid", branchId: "br_02" },
  { id: "cli_09", name: "West Bay Catering", branchId: "br_01" },
  { id: "cli_10", name: "Msheireb Boutiques", branchId: "br_02" }
];

const clients: Client[] = invoiceClients.map(client => ({
  ...client,
  email: emailFor(client.name)
}));

function activityWhat(txn: Transaction): string {
  const dirhams = txn.amountMinor / 100;
  const amount = dirhams.toLocaleString("en-US");
  if (txn.type === "refund") return "Refund posted, QR " + amount + ", " + txn.counterparty;
  if (txn.type === "payroll") return "Payroll paid, QR " + amount;
  if (txn.direction === "in") return "Payment received, QR " + amount + ", " + txn.counterparty;
  return "Payment sent, QR " + amount + ", " + txn.counterparty;
}

const activityLog: ActivityLog[] = transactions
  .map(txn => ({
    id: "act_" + txn.id,
    kind: txn.type === "payroll" || txn.type === "expense" ? "payments" : "payments",
    dayOffset: txn.dayOffset,
    actor: txn.source === "shopify" || txn.source === "skipcash" ? "System" : "Noora Al Ansari",
    what: activityWhat(txn)
  }))
  .concat([
    { id: "act_inv_0142", kind: "edits", dayOffset: -20, actor: "Noora Al Ansari", what: "Invoice INV-0142 sent" },
    { id: "act_inv_0147", kind: "edits", dayOffset: -20, actor: "Noora Al Ansari", what: "Invoice INV-0147 sent" },
    { id: "act_inv_0143", kind: "edits", dayOffset: -30, actor: "Noora Al Ansari", what: "Invoice INV-0143 sent" }
  ])
  .sort((a, b) => b.dayOffset - a.dayOffset || a.id.localeCompare(b.id));

export const seed: Seed = {
  merchant: {
    businessName: "Al Bidda Trading W.L.L.",
    legalEntity: "Limited Liability Company (W.L.L.)",
    crNumber: "CR-114820",
    taxRegistrationNumber: null,
    vatRegistered: false,
    country: "QA",
    currency: "QAR",
    industry: "Retail and e-commerce",
    address: "Building 42, Al Sadd, Doha, Qatar",
    ownerName,
    accountantName,
    plan: { tier: "Starter", monthlyPrice: 3900, txnLimit: 5000 }
  },
  branches: [
    { id: "br_01", name: "Doha" },
    { id: "br_02", name: "Al Wakrah" }
  ],
  employees: [
    { id: "emp_01", name: "Rashid Al-Mannai", role: "Operations", monthlySalary: 950000, branchId: "br_01" },
    { id: "emp_02", name: "Priya Menon", role: "Accounts", monthlySalary: 670000, branchId: "br_01" },
    { id: "emp_03", name: "Samir Haddad", role: "Warehouse", monthlySalary: 450000, branchId: "br_02" }
  ],
  payrollRuns: [
    {
      id: "pay_01",
      periodOffset: -15,
      employeeIds: ["emp_01", "emp_02", "emp_03"],
      deductionRate: 0.05,
      status: "paid",
      transactionId: "txn_09"
    }
  ],
  transactions,
  invoices: [
    { id: "inv_0142", number: "INV-0142", clientId: "cli_01", amountMinor: 630000, issuedOffset: -20, dueOffset: -8, sentAt: -20, viewedAt: -18, branchId: "br_01" },
    { id: "inv_0143", number: "INV-0143", clientId: "cli_02", amountMinor: 890000, issuedOffset: -30, dueOffset: -12, sentAt: -30, viewedAt: -28, branchId: "br_01" },
    { id: "inv_0144", number: "INV-0144", clientId: "cli_03", amountMinor: 482000, issuedOffset: -6, dueOffset: 8, sentAt: -6, viewedAt: -5, branchId: "br_01" },
    { id: "inv_0145", number: "INV-0145", clientId: "cli_04", amountMinor: 154000, issuedOffset: -33, dueOffset: -19, sentAt: -33, viewedAt: -31, branchId: "br_01" },
    { id: "inv_0146", number: "INV-0146", clientId: "cli_05", amountMinor: 215000, issuedOffset: -9, dueOffset: 5, sentAt: -9, viewedAt: -8, branchId: "br_01" },
    { id: "inv_0147", number: "INV-0147", clientId: "cli_06", amountMinor: 920000, issuedOffset: -20, dueOffset: -6, sentAt: -20, viewedAt: -16, branchId: "br_01" },
    { id: "inv_0148", number: "INV-0148", clientId: "cli_07", amountMinor: 540000, issuedOffset: -8, dueOffset: 6, sentAt: -8, viewedAt: -7, branchId: "br_01" },
    { id: "inv_0149", number: "INV-0149", clientId: "cli_09", amountMinor: 312000, issuedOffset: -18, dueOffset: -4, sentAt: -18, viewedAt: -17, branchId: "br_01" },
    { id: "inv_0150", number: "INV-0150", clientId: "cli_10", amountMinor: 187000, issuedOffset: -9, dueOffset: 5, sentAt: -9, viewedAt: -8, branchId: "br_02" }
  ],
  clients,
  paymentLinks: [
    { id: "link_txn_01", payUrl: "/pay/link_txn_01", amountMinor: 154000, description: "Noor Interiors", clientId: "cli_04", invoiceId: "inv_0145", status: "paid", createdOffset: -29, uses: 1, expiry: "-", txnId: "txn_01" },
    { id: "link_txn_10", payUrl: "/pay/link_txn_10", amountMinor: 98000, description: "Mohammed Rashid", clientId: "cli_08", invoiceId: null, status: "paid", createdOffset: -12, uses: 1, expiry: "-", txnId: "txn_10" },
    { id: "link_txn_14", payUrl: "/pay/link_txn_14", amountMinor: 215000, description: "Fatima Al-Kuwari", clientId: "cli_05", invoiceId: "inv_0146", status: "paid", createdOffset: -4, uses: 1, expiry: "-", txnId: "txn_14" },
    { id: "link_txn_20", payUrl: "/pay/link_txn_20", amountMinor: 187000, description: "Msheireb Boutiques", clientId: "cli_10", invoiceId: "inv_0150", status: "paid", createdOffset: -6, uses: 1, expiry: "-", txnId: "txn_20" }
  ],
  exportHistory: [],
  checkoutPages: [],
  subscriptionPlans: [],
  subscribers: [],
  upcomingCharges: [],
  shopify: { connected: false, shopDomain: "" },
  smartCheckout: { on: false, walletDetect: true, retryOnDecline: true },
  matchProposals: [
    { id: "mp_01", transactionId: "txn_13", invoiceId: "inv_0142", confidence: 0.94, reason: "Exact amount and reference match, one day apart.", status: "open" },
    { id: "mp_02", transactionId: "txn_02", invoiceId: "inv_0145", confidence: 0.88, reason: "Refund of a paid invoice for the same client and amount.", status: "open" },
    { id: "mp_03", transactionId: "txn_10", invoiceId: null, confidence: 0.52, reason: "Payment link with no matching invoice. Log as a direct sale?", status: "open" }
  ],
  bankAccounts: [
    { id: "bank_01", bank: "Ahli Bank", label: "Ahli Bank current account", currency: "QAR", openingBalanceMinor: 8500000, asOfOffset: -30 }
  ],
  gatewayAccounts: [
    { id: "gw_01", provider: "SkipCash", label: "SkipCash", status: "live" },
    { id: "gw_02", provider: "Shopify", label: "Shopify", status: "connected" }
  ],
  teamMembers: [
    { id: "tm_00", employeeId: "", name: ownerName, email: ownerName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") + "@albidda.qa", role: "Owner", lastSeenOffset: 0 },
    { id: "tm_01", employeeId: "emp_01", name: "Rashid Al-Mannai", email: emailFor("Rashid Al-Mannai"), role: "Staff", lastSeenOffset: -1 },
    { id: "tm_02", employeeId: "emp_02", name: accountantName, email: emailFor(accountantName), role: "Staff", lastSeenOffset: -2 },
    { id: "tm_03", employeeId: "emp_03", name: "Samir Haddad", email: emailFor("Samir Haddad"), role: "Staff", lastSeenOffset: -3 }
  ],
  activityLog
};
