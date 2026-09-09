import { hydrateFromStorage } from "./store";
import { dashboardState } from "./view";

export { appendTransaction, hydrateFromStorage, persistStore, resetStore } from "./store";
export { dashboardSnapshot, dashboardState } from "./view";
export {
  EXTRACT_DELAY_MS,
  SAMPLE_BILL,
  SAMPLE_BILLS,
  extractBill,
  extractDelayMs,
  extractedBillForm
} from "./sample-bill";
export { SAMPLE_BANKS, SAMPLE_CHECKOUT_ANALYTICS, SAMPLE_SHOPIFY_ORDER } from "./sample-checkout";
export { offsetFromLabel } from "../format";
export {
  SETTLEMENT_DELAY_MS,
  addSubscriber,
  cancelSubscriber,
  cancelSubscriptionPlan,
  checkoutPageBySlug,
  confirmMatch,
  connectSampleBank,
  connectShopify,
  createPaymentLink,
  createSubscriptionPlan,
  deactivatePaymentLink,
  ingestShopifyOrder,
  pauseSubscriber,
  payPublishedCheckout,
  publishCheckoutPage,
  runSimulatedBilling,
  setSmartCheckout,
  settleBilling,
  settleCheckoutPayment,
  settlePayment,
  simulatePayment
} from "./spine";
export { exportTallyXml, simulateZohoSync } from "./tally-export";
export { resetGateway } from "../gateway/index";

if (typeof window !== "undefined") {
  hydrateFromStorage();
  (window as unknown as { FLOW_DATA: unknown }).FLOW_DATA = dashboardState();
}
