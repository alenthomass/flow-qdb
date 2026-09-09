import { seed } from "./seed";
import type { ActivityLog, ExportRecord, Invoice, MatchProposal, PaymentLink, Seed, Transaction } from "./types";

function cloneSeed(): Seed {
  return structuredClone(seed);
}

let live: Seed = cloneSeed();

export function getStore(): Seed {
  return live;
}

export function getTransactions(): Transaction[] {
  return live.transactions;
}

export function getInvoices(): Invoice[] {
  return live.invoices;
}

export function getMatchProposals(): MatchProposal[] {
  return live.matchProposals;
}

export function resetStore(): Seed {
  live = cloneSeed();
  return live;
}

export function appendTransaction(txn: Transaction): Transaction {
  live.transactions = [txn, ...live.transactions];
  return txn;
}

export function replaceTransaction(id: string, patch: Partial<Transaction>): Transaction | undefined {
  let next: Transaction | undefined;
  live.transactions = live.transactions.map(txn => {
    if (txn.id !== id) return txn;
    next = Object.assign({}, txn, patch, { id: txn.id });
    return next;
  });
  return next;
}

export function appendInvoice(invoice: Invoice): Invoice {
  live.invoices = [invoice, ...live.invoices];
  return invoice;
}

export function replaceInvoice(id: string, patch: Partial<Invoice>): Invoice | undefined {
  let next: Invoice | undefined;
  live.invoices = live.invoices.map(invoice => {
    if (invoice.id !== id) return invoice;
    next = Object.assign({}, invoice, patch, { id: invoice.id });
    return next;
  });
  return next;
}

export function appendMatchProposal(proposal: MatchProposal): MatchProposal {
  live.matchProposals = [proposal, ...live.matchProposals];
  return proposal;
}

export function replaceMatchProposal(id: string, patch: Partial<MatchProposal>): MatchProposal | undefined {
  let next: MatchProposal | undefined;
  live.matchProposals = live.matchProposals.map(proposal => {
    if (proposal.id !== id) return proposal;
    next = Object.assign({}, proposal, patch, { id: proposal.id });
    return next;
  });
  return next;
}

export function appendActivity(entry: ActivityLog): ActivityLog {
  live.activityLog = [entry, ...live.activityLog];
  return entry;
}

export function getPaymentLinks(): PaymentLink[] {
  return live.paymentLinks;
}

export function appendPaymentLink(link: PaymentLink): PaymentLink {
  live.paymentLinks = [link, ...live.paymentLinks];
  return link;
}

export function replacePaymentLink(id: string, patch: Partial<PaymentLink>): PaymentLink | undefined {
  let next: PaymentLink | undefined;
  live.paymentLinks = live.paymentLinks.map(link => {
    if (link.id !== id) return link;
    next = Object.assign({}, link, patch, { id: link.id });
    return next;
  });
  return next;
}

export function getExportHistory(): ExportRecord[] {
  return live.exportHistory;
}

export function appendExportRecord(row: ExportRecord): ExportRecord {
  live.exportHistory = [row, ...live.exportHistory];
  return row;
}
