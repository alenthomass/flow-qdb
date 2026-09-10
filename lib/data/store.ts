import { seed } from "./seed";
import type {
  ActivityLog,
  ApprovalRequest,
  BankAccount,
  CheckoutPage,
  Client,
  ExportRecord,
  Invoice,
  MatchProposal,
  PaymentLink,
  RecurringInvoice,
  RolePermissionRow,
  Seed,
  ShopifyConnection,
  SmartCheckoutConfig,
  Subscriber,
  SubscriptionPlan,
  Transaction,
  UpcomingCharge
} from "./types";

const STORAGE_KEY = "flow-live-v1";

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionRow[] = [
  { area: "Dashboard", owner: "full", accountant: "full", staff: "full" },
  { area: "Transactions", owner: "full", accountant: "full", staff: "view" },
  { area: "Invoicing", owner: "full", accountant: "full", staff: "full" },
  { area: "Payments & gateways", owner: "full", accountant: "view", staff: "none" },
  { area: "Accounting sync", owner: "full", accountant: "full", staff: "none" },
  { area: "Payroll", owner: "full", accountant: "view", staff: "none" },
  { area: "Team & billing", owner: "full", accountant: "none", staff: "none" }
];

function cloneSeed(): Seed {
  const next = structuredClone(seed);
  if (!next.rolePermissions.length) {
    next.rolePermissions = DEFAULT_ROLE_PERMISSIONS.map(row => ({ ...row }));
  }
  return next;
}

function emptyExtras(): Pick<
  Seed,
  "checkoutPages" | "subscriptionPlans" | "subscribers" | "upcomingCharges" | "shopify" | "smartCheckout" | "recurringInvoices" | "approvalRequests" | "rolePermissions" | "approvalLimits"
> {
  return {
    checkoutPages: [],
    subscriptionPlans: [],
    subscribers: [],
    upcomingCharges: [],
    shopify: { connected: false, shopDomain: "" },
    smartCheckout: { on: false, walletDetect: true, retryOnDecline: true },
    recurringInvoices: [],
    approvalRequests: [],
    rolePermissions: DEFAULT_ROLE_PERMISSIONS.map(row => ({ ...row })),
    approvalLimits: {}
  };
}

function withDefaults(row: Seed): Seed {
  const base = cloneSeed();
  return {
    ...base,
    ...row,
    invoices: (row.invoices && row.invoices.length) ? row.invoices : base.invoices,
    clients: (row.clients && row.clients.length) ? row.clients : base.clients,
    paymentLinks: (row.paymentLinks && row.paymentLinks.length) ? row.paymentLinks : base.paymentLinks,
    checkoutPages: row.checkoutPages || [],
    subscriptionPlans: row.subscriptionPlans || [],
    subscribers: row.subscribers || [],
    upcomingCharges: row.upcomingCharges || [],
    shopify: row.shopify || emptyExtras().shopify,
    smartCheckout: row.smartCheckout || emptyExtras().smartCheckout,
    bankAccounts: row.bankAccounts || base.bankAccounts,
    recurringInvoices: row.recurringInvoices || [],
    approvalRequests: row.approvalRequests || [],
    rolePermissions: (row.rolePermissions && row.rolePermissions.length) ? row.rolePermissions : emptyExtras().rolePermissions,
    approvalLimits: row.approvalLimits || {}
  };
}

let live: Seed = cloneSeed();

let afterPersist: (() => void) | null = null;
let persistAssertQueued = false;

export function setAfterPersist(fn: (() => void) | null): void {
  afterPersist = fn;
}

function persist(): void {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(live));
    } catch {
      /* sandbox quota */
    }
  }
  if (!afterPersist || persistAssertQueued) return;
  persistAssertQueued = true;
  const defer = typeof queueMicrotask === "function"
    ? queueMicrotask
    : (fn: () => void) => { Promise.resolve().then(fn); };
  defer(() => {
    persistAssertQueued = false;
    if (afterPersist) afterPersist();
  });
}

export function hydrateFromStorage(): Seed | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    live = withDefaults(JSON.parse(raw) as Seed);
    return live;
  } catch {
    return null;
  }
}

export function persistStore(): void {
  persist();
}

export function getStore(): Seed {
  return live;
}

export function getTransactions(): Transaction[] {
  return live.transactions;
}

export function getInvoices(): Invoice[] {
  return live.invoices;
}

export function getClients(): Client[] {
  return live.clients;
}

export function appendClient(client: Client): Client {
  live.clients = [client, ...live.clients];
  persist();
  return client;
}

export function getMatchProposals(): MatchProposal[] {
  return live.matchProposals;
}

export function resetStore(): Seed {
  live = cloneSeed();
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return live;
}

export function appendTransaction(txn: Transaction): Transaction {
  live.transactions = [txn, ...live.transactions];
  persist();
  return txn;
}

export function replaceTransaction(id: string, patch: Partial<Transaction>): Transaction | undefined {
  let next: Transaction | undefined;
  live.transactions = live.transactions.map(txn => {
    if (txn.id !== id) return txn;
    next = Object.assign({}, txn, patch, { id: txn.id });
    return next;
  });
  persist();
  return next;
}

export function appendInvoice(invoice: Invoice): Invoice {
  live.invoices = [invoice, ...live.invoices];
  persist();
  return invoice;
}

export function replaceInvoice(id: string, patch: Partial<Invoice>): Invoice | undefined {
  let next: Invoice | undefined;
  live.invoices = live.invoices.map(invoice => {
    if (invoice.id !== id) return invoice;
    next = Object.assign({}, invoice, patch, { id: invoice.id });
    return next;
  });
  persist();
  return next;
}

export function appendMatchProposal(proposal: MatchProposal): MatchProposal {
  live.matchProposals = [proposal, ...live.matchProposals];
  persist();
  return proposal;
}

export function replaceMatchProposal(id: string, patch: Partial<MatchProposal>): MatchProposal | undefined {
  let next: MatchProposal | undefined;
  live.matchProposals = live.matchProposals.map(proposal => {
    if (proposal.id !== id) return proposal;
    next = Object.assign({}, proposal, patch, { id: proposal.id });
    return next;
  });
  persist();
  return next;
}

export function appendActivity(entry: ActivityLog): ActivityLog {
  live.activityLog = [entry, ...live.activityLog];
  persist();
  return entry;
}

export function getPaymentLinks(): PaymentLink[] {
  return live.paymentLinks;
}

export function appendPaymentLink(link: PaymentLink): PaymentLink {
  live.paymentLinks = [link, ...live.paymentLinks];
  persist();
  return link;
}

export function replacePaymentLink(id: string, patch: Partial<PaymentLink>): PaymentLink | undefined {
  let next: PaymentLink | undefined;
  live.paymentLinks = live.paymentLinks.map(link => {
    if (link.id !== id) return link;
    next = Object.assign({}, link, patch, { id: link.id });
    return next;
  });
  persist();
  return next;
}

export function getExportHistory(): ExportRecord[] {
  return live.exportHistory;
}

export function appendExportRecord(row: ExportRecord): ExportRecord {
  live.exportHistory = [row, ...live.exportHistory];
  persist();
  return row;
}

export function appendCheckoutPage(page: CheckoutPage): CheckoutPage {
  live.checkoutPages = [page, ...live.checkoutPages];
  persist();
  return page;
}

export function replaceCheckoutPage(id: string, patch: Partial<CheckoutPage>): CheckoutPage | undefined {
  let next: CheckoutPage | undefined;
  live.checkoutPages = live.checkoutPages.map(page => {
    if (page.id !== id) return page;
    next = Object.assign({}, page, patch, { id: page.id });
    return next;
  });
  persist();
  return next;
}

export function appendSubscriptionPlan(plan: SubscriptionPlan): SubscriptionPlan {
  live.subscriptionPlans = [plan, ...live.subscriptionPlans];
  persist();
  return plan;
}

export function replaceSubscriptionPlan(id: string, patch: Partial<SubscriptionPlan>): SubscriptionPlan | undefined {
  let next: SubscriptionPlan | undefined;
  live.subscriptionPlans = live.subscriptionPlans.map(plan => {
    if (plan.id !== id) return plan;
    next = Object.assign({}, plan, patch, { id: plan.id });
    return next;
  });
  persist();
  return next;
}

export function appendSubscriber(row: Subscriber): Subscriber {
  live.subscribers = [row, ...live.subscribers];
  persist();
  return row;
}

export function replaceSubscriber(id: string, patch: Partial<Subscriber>): Subscriber | undefined {
  let next: Subscriber | undefined;
  live.subscribers = live.subscribers.map(row => {
    if (row.id !== id) return row;
    next = Object.assign({}, row, patch, { id: row.id });
    return next;
  });
  persist();
  return next;
}

export function appendUpcomingCharge(row: UpcomingCharge): UpcomingCharge {
  live.upcomingCharges = [row, ...live.upcomingCharges];
  persist();
  return row;
}

export function replaceUpcomingCharge(id: string, patch: Partial<UpcomingCharge>): UpcomingCharge | undefined {
  let next: UpcomingCharge | undefined;
  live.upcomingCharges = live.upcomingCharges.map(row => {
    if (row.id !== id) return row;
    next = Object.assign({}, row, patch, { id: row.id });
    return next;
  });
  persist();
  return next;
}

export function replaceShopify(patch: Partial<ShopifyConnection>): ShopifyConnection {
  live.shopify = Object.assign({}, live.shopify, patch);
  persist();
  return live.shopify;
}

export function replaceSmartCheckout(patch: Partial<SmartCheckoutConfig>): SmartCheckoutConfig {
  live.smartCheckout = Object.assign({}, live.smartCheckout, patch);
  persist();
  return live.smartCheckout;
}

export function appendBankAccount(account: BankAccount): BankAccount {
  live.bankAccounts = [...live.bankAccounts, account];
  persist();
  return account;
}

export function appendRecurringInvoice(row: RecurringInvoice): RecurringInvoice {
  live.recurringInvoices = [row, ...live.recurringInvoices];
  persist();
  return row;
}

export function replaceRecurringInvoice(id: string, patch: Partial<RecurringInvoice>): RecurringInvoice | undefined {
  let next: RecurringInvoice | undefined;
  live.recurringInvoices = live.recurringInvoices.map(row => {
    if (row.id !== id) return row;
    next = Object.assign({}, row, patch, { id: row.id });
    return next;
  });
  persist();
  return next;
}

export function replaceRolePermissions(rows: RolePermissionRow[]): RolePermissionRow[] {
  live.rolePermissions = rows.map(row => ({ ...row }));
  persist();
  return live.rolePermissions;
}

export function replaceApprovalLimits(limits: Record<string, number | null>): Record<string, number | null> {
  live.approvalLimits = { ...limits };
  persist();
  return live.approvalLimits;
}

export function appendApprovalRequest(row: ApprovalRequest): ApprovalRequest {
  live.approvalRequests = [row, ...live.approvalRequests];
  persist();
  return row;
}

export function replaceApprovalRequest(id: string, patch: Partial<ApprovalRequest>): ApprovalRequest | undefined {
  let next: ApprovalRequest | undefined;
  live.approvalRequests = live.approvalRequests.map(row => {
    if (row.id !== id) return row;
    next = Object.assign({}, row, patch, { id: row.id });
    return next;
  });
  persist();
  return next;
}
