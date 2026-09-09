import { getGateway } from "../gateway/index";
import type { PaymentOutcome } from "../gateway/index";
import {
  appendActivity,
  appendMatchProposal,
  appendPaymentLink,
  appendTransaction,
  getStore,
  replaceMatchProposal,
  replacePaymentLink,
  replaceTransaction
} from "./store";
import type { PaymentLink } from "./types";

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

export async function simulatePayment(linkId: string, outcome: PaymentOutcome) {
  const gateway = getGateway();
  const payload = await gateway.simulatePayment(linkId, outcome);
  const result = await gateway.handleWebhook(payload);
  const link = getStore().paymentLinks.find(row => row.id === linkId);
  if (!link) throw new Error("Payment link not found: " + linkId);

  if (result.statusId !== 2) {
    replacePaymentLink(linkId, { status: result.statusId === 5 ? "rejected" : "failed" });
    return { pending: false, txnId: null as string | null, delayMs: 0 };
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
  return { pending: true, txnId, delayMs: SETTLEMENT_DELAY_MS };
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
