import { getStore } from "../data/store";
import { hydrateStore } from "../data/hydrate";
import { addSubscriber, checkoutPageBySlug, checkoutPageUnavailable, ensureInvoicePaymentLink, paymentLinkById, payPublishedCheckout, settleCheckoutPayment, settlePayment, simulatePayment } from "../data/spine";
import { offsetFromLabel } from "../format";
import type { PaymentOutcome } from "../gateway/index";
import type { SubscriptionPlan } from "../data/types";

// The legacy store mutates in place. Publish a stable revision after each
// operation rather than passing a mutable Seed object to useSyncExternalStore.
let revision = 0;
let initialized = false;
const listeners = new Set<() => void>();
export const getPayRevision = () => revision;
export const getServerPayRevision = () => 0;
export function subscribePayStore(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function publish() {
  revision += 1;
  listeners.forEach(listener => listener());
}
export function initializePayStore() {
  if (initialized) return;
  hydrateStore();
  initialized = true;
  publish();
}

export function emailError(value: string): string {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter a valid email";
}

export function checkoutBySlug(slug: string) {
  const page = checkoutPageBySlug(slug);
  if (page) return { page, link: undefined, plan: undefined };
  let link = paymentLinkById(slug);
  if (!link) {
    const invoice = getStore().invoices.find(row => row.number === slug);
    if (invoice) link = ensureInvoicePaymentLink(invoice);
  }
  if (!link) {
    const plan = getStore().subscriptionPlans.find(row => row.slug === slug);
    if (plan) return { page: undefined, link: undefined, plan };
  }
  return { page: undefined, link, plan: undefined };
}

export function planUnavailable(plan: SubscriptionPlan): string | null {
  if (plan.status === "canceled") {
    return "This simulated subscription is no longer accepting signups.";
  }
  return null;
}

export function subscribeToPlan(slug: string, name: string, email: string) {
  const plan = getStore().subscriptionPlans.find(row => row.slug === slug);
  if (!plan) throw new Error("This simulated checkout is not in this browser.");
  const blocked = planUnavailable(plan);
  if (blocked) throw new Error(blocked);
  const trimmed = String(name || "").trim();
  if (!trimmed) throw new Error("Enter a name");
  const mailErr = emailError(email);
  if (mailErr) throw new Error(mailErr);
  const subscriber = addSubscriber(plan.id, trimmed, String(email || "").trim());
  publish();
  return { subscriber, plan };
}

export function linkUnavailable(slug: string): string | null {
  const link = paymentLinkById(slug);
  if (!link) return "Checkout is not available.";
  const expiry = offsetFromLabel(link.expiry);
  if (link.status === "deactivated" || link.status === "expired" || (expiry !== null && expiry < 0)) {
    return "This simulated payment link is no longer accepting payments.";
  }
  if (link.status === "paid" || link.status === "pending" || link.txnId) {
    return "This simulated link has already been used.";
  }
  return null;
}

export type PayResult =
  | { status: "success"; amountMinor: number; merchant: string; reference: string }
  | { status: "declined" | "timeout" | "error"; message: string };

export function sandboxOutcome(value: string | null): PaymentOutcome {
  return value === "decline" || value === "timeout" ? value : "success";
}

const inFlight = new Map<string, Promise<PayResult>>();
export function submitPayment(slug: string, email: string, outcome: PaymentOutcome = "success", paidMinor?: number): Promise<PayResult> {
  if (emailError(email)) return Promise.resolve({ status: "error", message: emailError(email) });
  const running = inFlight.get(slug);
  if (running) return running;
  const work = runPayment(slug, outcome, paidMinor).finally(() => { inFlight.delete(slug); });
  inFlight.set(slug, work);
  return work;
}

async function runPayment(slug: string, outcome: PaymentOutcome, paidMinor?: number): Promise<PayResult> {
  try {
    const { page, link, plan } = checkoutBySlug(slug);
    if (plan) return { status: "error", message: "Use Subscribe to start this plan." };
    if (!page && !link) return { status: "error", message: "Checkout is not available." };
    if (link) {
      const message = linkUnavailable(link.id);
      if (message) return { status: "error", message };
    }
    if (page) {
      const message = checkoutPageUnavailable(page);
      if (message) return { status: "error", message };
    }
    const result = page ? await payPublishedCheckout(page.slug, paidMinor) : await simulatePayment(link!.id, outcome, paidMinor);
    publish();
    if (!result.pending || !result.txnId) {
      const status = link ? paymentLinkById(link.id)?.status : null;
      if (status === "rejected" || outcome === "decline") return { status: "declined", message: "Payment declined. Please try again." };
      if (status === "failed" || outcome === "timeout") return { status: "timeout", message: "Payment timed out. Please try again." };
      return { status: "error", message: "Payment was not recorded." };
    }
    // Settlement belongs to the operation, not the component lifecycle. It
    // continues if the payer navigates away while the processing view is up.
    await new Promise(resolve => setTimeout(resolve, result.delayMs));
    if (page) settleCheckoutPayment(result.txnId);
    else settlePayment(link!.id);
    publish();
    return { status: "success", amountMinor: result.amountMinor, merchant: getStore().merchant.businessName, reference: result.reference || result.txnId };
  } catch (error) {
    publish();
    return { status: "error", message: error instanceof Error ? error.message : "Payment was not recorded." };
  }
}
