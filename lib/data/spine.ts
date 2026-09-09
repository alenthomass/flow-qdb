import { getGateway } from "../gateway/index";
import type { PaymentOutcome } from "../gateway/index";
import {
  appendActivity,
  appendBankAccount,
  appendCheckoutPage,
  appendClient,
  appendInvoice,
  appendMatchProposal,
  appendPaymentLink,
  appendSubscriber,
  appendSubscriptionPlan,
  appendTransaction,
  appendUpcomingCharge,
  getStore,
  replaceCheckoutPage,
  replaceMatchProposal,
  replacePaymentLink,
  replaceShopify,
  replaceSmartCheckout,
  replaceSubscriber,
  replaceSubscriptionPlan,
  replaceTransaction,
  replaceUpcomingCharge
} from "./store";
import { SAMPLE_BANKS, SAMPLE_SHOPIFY_ORDER } from "./sample-checkout";
import { getPayrollNet } from "./selectors";
import { monthYearLabel } from "../format";
import type {
  CheckoutPage,
  Client,
  Invoice,
  InvoiceLine,
  PaymentLink,
  PlanInterval,
  Subscriber,
  SubscriptionPlan,
  TxnSource,
  UpcomingCharge
} from "./types";

export const SETTLEMENT_DELAY_MS = 1200;

export interface CreateLinkInput {
  amountMinor: number;
  description: string;
  clientId?: string | null;
  invoiceId?: string | null;
  expiry?: string;
}

function ownerContact(): { firstName: string; lastName: string; email: string } {
  const merchant = getStore().merchant;
  const owner = getStore().teamMembers.find(member => member.role === "Owner");
  const parts = merchant.ownerName.split(" ").filter(Boolean);
  return {
    firstName: parts[0] || merchant.ownerName,
    lastName: parts.slice(1).join(" ") || parts[0] || merchant.ownerName,
    email: owner?.email || getStore().clients[0]?.email || ""
  };
}

export async function createPaymentLink(input: CreateLinkInput): Promise<PaymentLink> {
  const store = getStore();
  const invoice = input.invoiceId ? store.invoices.find(row => row.id === input.invoiceId) : undefined;
  const clientId = input.clientId || invoice?.clientId || null;
  const client = clientId ? store.clients.find(row => row.id === clientId) : undefined;
  const owner = ownerContact();
  const names = (client?.name || store.merchant.ownerName).split(" ").filter(Boolean);
  const record = await getGateway().createPaymentLink({
    amountMinor: input.amountMinor,
    currency: store.merchant.currency,
    description: input.description,
    merchantTransactionId: invoice?.number,
    customer: {
      firstName: names[0] || owner.firstName,
      lastName: names.slice(1).join(" ") || owner.lastName,
      email: client?.email || owner.email
    }
  });
  const link: PaymentLink = {
    id: record.id,
    payUrl: record.payUrl,
    amountMinor: input.amountMinor,
    description: input.description || "Payment",
    clientId,
    invoiceId: invoice?.id || null,
    status: "active",
    createdOffset: 0,
    uses: 0,
    expiry: input.expiry || "-",
    txnId: null
  };
  appendPaymentLink(link);
  return link;
}

export function paymentLinkById(id: string): PaymentLink | undefined {
  return getStore().paymentLinks.find(row => row.id === id);
}

function ensureGatewayPayment(link: PaymentLink): void {
  getGateway().ensurePayment({
    id: link.id,
    payUrl: link.payUrl || "/pay/" + link.id,
    amountMinor: link.amountMinor,
    currency: getStore().merchant.currency,
    statusId: 0,
    status: "new",
    merchantTransactionId: link.invoiceId,
    createdDayOffset: link.createdOffset
  });
}

export async function simulatePayment(linkId: string, outcome: PaymentOutcome) {
  const link = getStore().paymentLinks.find(row => row.id === linkId);
  if (!link) throw new Error("Payment link not found: " + linkId);
  ensureGatewayPayment(link);
  const gateway = getGateway();
  const payload = await gateway.simulatePayment(linkId, outcome);
  const result = await gateway.handleWebhook(payload);

  if (result.statusId !== 2) {
    replacePaymentLink(linkId, { status: result.statusId === 5 ? "rejected" : "failed" });
    return { pending: false, txnId: null as string | null, delayMs: 0, reference: payload.visaId, amountMinor: result.amountMinor };
  }

  const client = link.clientId ? getStore().clients.find(row => row.id === link.clientId) : undefined;
  const invoice = link.invoiceId ? getStore().invoices.find(row => row.id === link.invoiceId) : undefined;
  const txnId = "txn_link_" + link.id.replace(/-/g, "").slice(0, 10);
  appendTransaction({
    id: txnId,
    dayOffset: 0,
    counterparty: client?.name || link.description,
    source: "link",
    direction: "in",
    type: "sale",
    tag: "Sales",
    status: "pending",
    amountMinor: result.amountMinor,
    branchId: invoice?.branchId || "br_01",
    invoiceId: link.invoiceId
  });
  appendActivity({
    id: "act_" + txnId,
    kind: "payments",
    dayOffset: 0,
    actor: "System",
    what: "Payment received, QR " + (result.amountMinor / 100).toLocaleString("en-US") + ", " + (client?.name || link.description)
  });
  appendMatchProposal({
    id: "mp_" + txnId,
    transactionId: txnId,
    invoiceId: link.invoiceId,
    confidence: invoice ? 0.93 : 0.52,
    reason: invoice
      ? "Payment link amount matches " + invoice.number + (client ? " for " + client.name : "") + "."
      : "Payment link with no matching invoice. Log as a direct sale?",
    status: "open"
  });
  replacePaymentLink(linkId, { status: "pending", txnId, uses: 1 });
  return { pending: true, txnId, delayMs: SETTLEMENT_DELAY_MS, reference: payload.visaId || txnId, amountMinor: result.amountMinor };
}

export function settlePayment(linkId: string): void {
  const link = getStore().paymentLinks.find(row => row.id === linkId);
  if (!link?.txnId) return;
  replaceTransaction(link.txnId, { status: "settled" });
  replacePaymentLink(linkId, { status: "paid" });
}

export function confirmMatch(proposalId: string): void {
  replaceMatchProposal(proposalId, { status: "confirmed" });
}

export function deactivatePaymentLink(linkId: string): PaymentLink | undefined {
  const link = getStore().paymentLinks.find(row => row.id === linkId);
  if (!link) throw new Error("Payment link not found: " + linkId);
  if (link.status === "paid" || link.status === "pending") return link;
  return replacePaymentLink(linkId, { status: "deactivated" });
}

function slugify(text: string): string {
  return String(text || "page")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "page";
}

function uniqueSlug(base: string, existing: string[]): string {
  const root = slugify(base);
  if (!existing.includes(root)) return root;
  let n = 2;
  while (existing.includes(root + "-" + n)) n += 1;
  return root + "-" + n;
}

function intervalOffset(interval: PlanInterval): number {
  if (interval === "Week") return 7;
  if (interval === "Quarter") return 90;
  if (interval === "Year") return 365;
  return 30;
}

function postInbound(opts: {
  id: string;
  counterparty: string;
  source: TxnSource;
  amountMinor: number;
  invoiceId: string | null;
  branchId?: string;
  reason: string;
}): void {
  appendTransaction({
    id: opts.id,
    dayOffset: 0,
    counterparty: opts.counterparty,
    source: opts.source,
    direction: "in",
    type: "sale",
    tag: "Sales",
    status: "pending",
    amountMinor: opts.amountMinor,
    branchId: opts.branchId || "br_01",
    invoiceId: opts.invoiceId
  });
  appendActivity({
    id: "act_" + opts.id,
    kind: "payments",
    dayOffset: 0,
    actor: "System",
    what: "Payment received, QR " + (opts.amountMinor / 100).toLocaleString("en-US") + ", " + opts.counterparty
  });
  if (opts.source !== "shopify") {
    appendMatchProposal({
      id: "mp_" + opts.id,
      transactionId: opts.id,
      invoiceId: opts.invoiceId,
      confidence: opts.invoiceId ? 0.93 : 0.52,
      reason: opts.reason,
      status: "open"
    });
  }
}

export interface PublishCheckoutInput {
  productName: string;
  description: string;
  amountMinor: number;
  slug?: string;
  logoDataUrl?: string | null;
  accent?: string;
  id?: string;
  supportEmail?: string;
  supportPhone?: string;
  terms?: boolean;
  payLabel?: string;
  fields?: { label: string; kind: string; optional?: boolean }[];
}

function defaultCheckoutFields() {
  return [
    { label: "Amount", kind: "price", optional: false },
    { label: "Email", kind: "mail", optional: false }
  ];
}

export function publishCheckoutPage(input: PublishCheckoutInput): CheckoutPage {
  if (!input.productName || !String(input.productName).trim()) {
    throw new Error("Checkout page needs a product name");
  }
  if (!input.amountMinor || input.amountMinor <= 0) {
    throw new Error("Checkout page needs a price");
  }
  const store = getStore();
  const existing = input.id ? store.checkoutPages.find(page => page.id === input.id) : undefined;
  const others = store.checkoutPages.filter(page => page.id !== existing?.id).map(page => page.slug);
  const slug = uniqueSlug(input.slug || input.productName, others);
  const fields = (input.fields && input.fields.length ? input.fields : existing?.fields || defaultCheckoutFields())
    .map(field => ({
      label: String(field.label || "Field").trim() || "Field",
      kind: String(field.kind || "text"),
      optional: !!(field as { optional?: boolean }).optional
    }));
  const page: CheckoutPage = {
    id: existing?.id || "pp_" + Date.now().toString(36),
    slug,
    productName: String(input.productName).trim(),
    description: input.description || "",
    amountMinor: input.amountMinor,
    currency: store.merchant.currency,
    logoDataUrl: input.logoDataUrl ?? existing?.logoDataUrl ?? null,
    accent: input.accent || existing?.accent || "#17171C",
    published: true,
    views: existing?.views ?? 0,
    paidCount: existing?.paidCount ?? 0,
    createdOffset: existing?.createdOffset ?? 0,
    txnIds: existing?.txnIds ?? [],
    supportEmail: (input.supportEmail ?? existing?.supportEmail ?? ownerContact().email).trim(),
    supportPhone: (input.supportPhone ?? existing?.supportPhone ?? "").trim(),
    terms: input.terms ?? existing?.terms ?? true,
    payLabel: String(input.payLabel ?? existing?.payLabel ?? "Pay").trim() || "Pay",
    fields
  };
  if (existing) replaceCheckoutPage(existing.id, page);
  else appendCheckoutPage(page);
  return getStore().checkoutPages.find(row => row.id === page.id) || page;
}

export function checkoutPageBySlug(slug: string): CheckoutPage | undefined {
  return getStore().checkoutPages.find(page => page.slug === slug && page.published);
}

export async function payPublishedCheckout(slug: string) {
  const page = checkoutPageBySlug(slug);
  if (!page) throw new Error("Checkout page not found: " + slug);
  replaceCheckoutPage(page.id, { views: page.views + 1 });
  const record = await getGateway().createPaymentLink({
    amountMinor: page.amountMinor,
    currency: page.currency,
    description: page.productName,
    customer: ownerContact()
  });
  const payload = await getGateway().simulatePayment(record.id, "success");
  const result = await getGateway().handleWebhook(payload);
  if (result.statusId !== 2) {
    return { pending: false, txnId: null as string | null, delayMs: 0, pageId: page.id, reference: payload.visaId, amountMinor: result.amountMinor };
  }
  const txnId = "txn_chk_" + record.id.replace(/-/g, "").slice(0, 10);
  postInbound({
    id: txnId,
    counterparty: page.productName,
    source: "skipcash",
    amountMinor: result.amountMinor,
    invoiceId: null,
    reason: "Hosted checkout payment for " + page.productName + "."
  });
  const latest = getStore().checkoutPages.find(row => row.id === page.id);
  replaceCheckoutPage(page.id, {
    paidCount: (latest?.paidCount ?? page.paidCount) + 1,
    txnIds: (latest?.txnIds ?? page.txnIds).concat([txnId])
  });
  return { pending: true, txnId, delayMs: SETTLEMENT_DELAY_MS, pageId: page.id, reference: payload.visaId || txnId, amountMinor: result.amountMinor };
}

export function settleCheckoutPayment(txnId: string): void {
  replaceTransaction(txnId, { status: "settled" });
}

export interface CreatePlanInput {
  name: string;
  amountMinor: number;
  interval: PlanInterval;
  description?: string;
  customerName?: string;
}

export async function createSubscriptionPlan(input: CreatePlanInput): Promise<SubscriptionPlan> {
  if (!input.name || !String(input.name).trim()) throw new Error("Plan needs a name");
  if (!input.amountMinor || input.amountMinor <= 0) throw new Error("Plan needs an amount");
  const store = getStore();
  const slug = uniqueSlug(input.name, store.subscriptionPlans.map(plan => plan.slug));
  const plan: SubscriptionPlan = {
    id: "plan_" + Date.now().toString(36),
    name: String(input.name).trim(),
    amountMinor: input.amountMinor,
    interval: input.interval || "Month",
    description: input.description || "",
    customerName: input.customerName || "",
    status: "active",
    createdOffset: 0,
    slug,
    signupUrl: "/pay/" + slug
  };
  appendSubscriptionPlan(plan);
  if (input.customerName && String(input.customerName).trim()) {
    addSubscriber(plan.id, String(input.customerName).trim());
  }
  return plan;
}

export function addSubscriber(planId: string, name: string, email?: string): Subscriber {
  const plan = getStore().subscriptionPlans.find(row => row.id === planId);
  if (!plan) throw new Error("Plan not found: " + planId);
  if (plan.status === "canceled") throw new Error("Plan is canceled");
  const subscriber: Subscriber = {
    id: "sub_" + Date.now().toString(36),
    planId,
    name: name || "Subscriber",
    email: email || "",
    status: "active",
    createdOffset: 0,
    nextChargeOffset: intervalOffset(plan.interval)
  };
  appendSubscriber(subscriber);
  appendUpcomingCharge({
    id: "chg_" + subscriber.id,
    planId,
    subscriberId: subscriber.id,
    amountMinor: plan.amountMinor,
    dayOffset: subscriber.nextChargeOffset,
    status: "upcoming",
    txnId: null
  });
  return subscriber;
}

export function pauseSubscriber(subscriberId: string): Subscriber | undefined {
  const row = getStore().subscribers.find(item => item.id === subscriberId);
  if (!row) throw new Error("Subscriber not found: " + subscriberId);
  getStore().upcomingCharges
    .filter(charge => charge.subscriberId === subscriberId && charge.status === "upcoming")
    .forEach(charge => replaceUpcomingCharge(charge.id, { status: "canceled" }));
  return replaceSubscriber(subscriberId, { status: "paused" });
}

export function cancelSubscriber(subscriberId: string): Subscriber | undefined {
  const row = getStore().subscribers.find(item => item.id === subscriberId);
  if (!row) throw new Error("Subscriber not found: " + subscriberId);
  getStore().upcomingCharges
    .filter(charge => charge.subscriberId === subscriberId && charge.status === "upcoming")
    .forEach(charge => replaceUpcomingCharge(charge.id, { status: "canceled" }));
  return replaceSubscriber(subscriberId, { status: "canceled" });
}

export function cancelSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
  const plan = getStore().subscriptionPlans.find(row => row.id === planId);
  if (!plan) throw new Error("Plan not found: " + planId);
  getStore().subscribers
    .filter(row => row.planId === planId && row.status === "active")
    .forEach(row => cancelSubscriber(row.id));
  return replaceSubscriptionPlan(planId, { status: "canceled" });
}

export async function runSimulatedBilling(chargeId: string) {
  const charge = getStore().upcomingCharges.find(row => row.id === chargeId);
  if (!charge || charge.status !== "upcoming") throw new Error("Upcoming charge not found: " + chargeId);
  const subscriber = getStore().subscribers.find(row => row.id === charge.subscriberId);
  const plan = getStore().subscriptionPlans.find(row => row.id === charge.planId);
  if (!subscriber || subscriber.status !== "active") throw new Error("Subscriber is not active");
  if (!plan || plan.status !== "active") throw new Error("Plan is not active");
  const record = await getGateway().createPaymentLink({
    amountMinor: charge.amountMinor,
    currency: getStore().merchant.currency,
    description: plan.name,
    customer: {
      firstName: subscriber.name.split(" ")[0] || subscriber.name,
      lastName: subscriber.name.split(" ").slice(1).join(" ") || subscriber.name,
      email: subscriber.email || ownerContact().email
    }
  });
  const payload = await getGateway().simulatePayment(record.id, "success");
  const result = await getGateway().handleWebhook(payload);
  if (result.statusId !== 2) {
    replaceUpcomingCharge(chargeId, { status: "canceled" });
    return { pending: false, txnId: null as string | null, delayMs: 0 };
  }
  const txnId = "txn_sub_" + record.id.replace(/-/g, "").slice(0, 10);
  postInbound({
    id: txnId,
    counterparty: subscriber.name,
    source: "skipcash",
    amountMinor: result.amountMinor,
    invoiceId: null,
    reason: "Simulated billing for " + plan.name + "."
  });
  replaceUpcomingCharge(chargeId, { status: "paid", txnId, dayOffset: 0 });
  const nextOffset = intervalOffset(plan.interval);
  replaceSubscriber(subscriber.id, { nextChargeOffset: nextOffset });
  appendUpcomingCharge({
    id: "chg_" + subscriber.id + "_" + Date.now().toString(36),
    planId: plan.id,
    subscriberId: subscriber.id,
    amountMinor: plan.amountMinor,
    dayOffset: nextOffset,
    status: "upcoming",
    txnId: null
  });
  return { pending: true, txnId, delayMs: SETTLEMENT_DELAY_MS };
}

export function settleBilling(txnId: string): void {
  replaceTransaction(txnId, { status: "settled" });
}

export function setSmartCheckout(on: boolean, extras?: { walletDetect?: boolean; retryOnDecline?: boolean }) {
  return replaceSmartCheckout(Object.assign({ on }, extras || {}));
}

export function connectShopify(shopDomain: string): { connected: boolean; shopDomain: string } {
  const domain = String(shopDomain || "").trim();
  if (!domain) throw new Error("Store URL is required");
  return replaceShopify({ connected: true, shopDomain: domain });
}

export function ingestShopifyOrder() {
  if (!getStore().shopify.connected) throw new Error("Shopify is not connected");
  const sample = SAMPLE_SHOPIFY_ORDER;
  if (getStore().transactions.some(txn => txn.counterparty === sample.counterparty)) {
    throw new Error("Sample Shopify order is already on the ledger");
  }
  const txnId = "txn_shop_" + Date.now().toString(36);
  appendTransaction({
    id: txnId,
    dayOffset: 0,
    counterparty: sample.counterparty,
    source: "shopify",
    direction: "in",
    type: "sale",
    tag: sample.tag,
    status: "settled",
    amountMinor: sample.amountMinor,
    branchId: sample.branchId,
    invoiceId: null
  });
  appendActivity({
    id: "act_" + txnId,
    kind: "payments",
    dayOffset: 0,
    actor: "System",
    what: "Payment received, QR " + (sample.amountMinor / 100).toLocaleString("en-US") + ", " + sample.counterparty
  });
  return getStore().transactions.find(txn => txn.id === txnId);
}

export interface CreateInvoiceInput {
  clientId?: string | null;
  clientName?: string;
  amountMinor: number;
  dueOffset: number;
  issuedOffset?: number;
  draft?: boolean;
  lines?: InvoiceLine[];
}

function nextInvoiceIdentity(): { id: string; number: string } {
  let max = 0;
  for (const invoice of getStore().invoices) {
    const n = parseInt(String(invoice.number).replace(/\D/g, ""), 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  const next = max + 1;
  const pad = String(next).padStart(4, "0");
  return { id: "inv_" + pad, number: "INV-" + pad };
}

export function addClient(input: { name: string; email?: string; branchId?: string }): Client {
  const name = String(input.name || "").trim();
  if (!name) throw new Error("Client name is required");
  const existing = getStore().clients.find(client => client.name === name);
  if (existing) return existing;
  return appendClient({
    id: "cli_" + Date.now().toString(36),
    name,
    email: input.email || "",
    branchId: input.branchId || getStore().branches[0]?.id || "br_01"
  });
}

function resolveInvoiceClient(input: { clientId?: string | null; clientName?: string }): Client {
  if (input.clientId) {
    const found = getStore().clients.find(client => client.id === input.clientId);
    if (found) return found;
  }
  const name = String(input.clientName || "").trim();
  if (!name) throw new Error("Client is required");
  return addClient({ name });
}

export function createInvoice(input: CreateInvoiceInput): Invoice {
  if (!Number.isFinite(input.dueOffset)) throw new Error("Due date is required");
  if (!Number.isFinite(input.amountMinor) || input.amountMinor <= 0) throw new Error("Amount is required");
  const client = resolveInvoiceClient(input);
  const identity = nextInvoiceIdentity();
  const draft = !!input.draft;
  const issuedOffset = input.issuedOffset != null ? input.issuedOffset : 0;
  const invoice: Invoice = {
    id: identity.id,
    number: identity.number,
    clientId: client.id,
    amountMinor: Math.round(input.amountMinor),
    issuedOffset,
    dueOffset: input.dueOffset,
    sentAt: draft ? null : 0,
    viewedAt: null,
    branchId: client.branchId,
    lines: input.lines && input.lines.length ? input.lines.map(line => ({
      description: line.description,
      quantity: line.quantity,
      unitMinor: line.unitMinor
    })) : undefined
  };
  appendInvoice(invoice);
  appendActivity({
    id: "act_" + invoice.id,
    kind: "edits",
    dayOffset: 0,
    actor: getStore().merchant.ownerName,
    what: draft ? "Invoice " + invoice.number + " saved as draft" : "Invoice " + invoice.number + " sent"
  });
  return invoice;
}

export function duplicateInvoice(invoiceId: string): Invoice {
  const source = getStore().invoices.find(invoice => invoice.id === invoiceId);
  if (!source) throw new Error("Invoice not found: " + invoiceId);
  return createInvoice({
    clientId: source.clientId,
    amountMinor: source.amountMinor,
    dueOffset: 14,
    issuedOffset: 0,
    draft: true,
    lines: source.lines
  });
}

function offsetsForMonthLabel(label: string): { from: number; to: number } | null {
  const wanted = String(label || "").trim();
  if (!wanted) return null;
  let from: number | null = null;
  let to: number | null = null;
  for (let offset = -400; offset <= 400; offset++) {
    if (monthYearLabel(offset) === wanted) {
      if (from == null) from = offset;
      to = offset;
    }
  }
  if (from == null || to == null) return null;
  return { from, to };
}

export function defaultPayrollPeriod(): string {
  const run = getStore().payrollRuns[0];
  return monthYearLabel(run ? run.periodOffset : -15);
}

export function payrollPostedFor(periodLabel: string): boolean {
  const range = offsetsForMonthLabel(periodLabel);
  if (!range) return false;
  return getStore().transactions.some(txn =>
    txn.type === "payroll" && txn.tag === "Salaries" && txn.status !== "pending"
    && txn.dayOffset >= range.from && txn.dayOffset <= range.to
  );
}

export function postPayroll(periodLabel?: string): { alreadyPosted: boolean; period: string; txnId?: string } {
  const period = String(periodLabel || "").trim();
  if (!period) throw new Error("Period is required");
  if (payrollPostedFor(period)) {
    return { alreadyPosted: true, period };
  }
  const range = offsetsForMonthLabel(period);
  const dayOffset = range ? Math.min(0, range.to) : 0;
  const amountMinor = getPayrollNet("pay_01");
  const txn = appendTransaction({
    id: "txn_pay_" + Date.now().toString(36),
    dayOffset,
    counterparty: "Monthly payroll",
    source: "bank",
    direction: "out",
    type: "payroll",
    tag: "Salaries",
    status: "settled",
    amountMinor,
    branchId: getStore().branches[0]?.id || "br_01",
    invoiceId: null
  });
  appendActivity({
    id: "act_" + txn.id,
    kind: "payments",
    dayOffset,
    actor: getStore().merchant.ownerName,
    what: "Payroll paid, QR " + (amountMinor / 100).toLocaleString("en-US")
  });
  return { alreadyPosted: false, period, txnId: txn.id };
}

export function connectSampleBank(bankId: string) {
  const sample = SAMPLE_BANKS.find(row => row.id === bankId);
  if (!sample) throw new Error("Sample bank not found: " + bankId);
  if (getStore().bankAccounts.some(row => row.id === sample.id)) {
    return getStore().bankAccounts.find(row => row.id === sample.id);
  }
  return appendBankAccount({
    id: sample.id,
    bank: sample.bank,
    label: sample.label,
    currency: getStore().merchant.currency,
    openingBalanceMinor: 0,
    asOfOffset: 0,
    sample: true
  });
}

export type { UpcomingCharge };

