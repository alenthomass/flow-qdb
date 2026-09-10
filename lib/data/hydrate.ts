import { seed } from "./seed";
import { appendPaymentLink, getStore, hydrateFromStorage } from "./store";

// Earlier saved sessions can have a nonempty array containing only newly
// created links. The store's empty-array default does not repair that case.
export function hydrateStore() {
  const hydrated = hydrateFromStorage();
  const store = getStore();
  const ids = new Set(store.paymentLinks.map(link => link.id));
  const missing = seed.paymentLinks.filter(link => !ids.has(link.id) &&
    store.transactions.some(txn => txn.id === link.txnId));
  for (const link of missing.toReversed()) appendPaymentLink(structuredClone(link));
  return hydrated;
}
