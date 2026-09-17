import { hydrateStore as hydrateFromStorage } from "./hydrate";
import { dashboardState } from "./view";

export { appendTransaction, persistStore, removeBankAccount, resetStore } from "./store";
export { hydrateStore as hydrateFromStorage } from "./hydrate";
export { bankView, dashboardSnapshot, dashboardState, bankLogoSrc } from "./view";
export {
  EXTRACT_DELAY_MS,
  SAMPLE_BILL,
  SAMPLE_BILLS,
  extractBill,
  extractDelayMs,
  extractedBillForm
} from "./sample-bill";
export { CONNECTED_BANKING_PREVIEW, QATAR_BANKS, SAMPLE_BANKS, SAMPLE_CHECKOUT_ANALYTICS, SAMPLE_SHOPIFY_ORDER } from "./sample-checkout";
export { offsetFromLabel, dateInputValue, previousMonthLabel, formatDate } from "../format";
export {
  SETTLEMENT_DELAY_MS,
  addClient,
  addSubscriber,
  cancelRecurringInvoice,
  cancelSubscriber,
  cancelSubscriptionPlan,
  checkoutPageBySlug,
  confirmMatch,
  connectSampleBank,
  importBankStatement,
  createTag,
  connectShopify,
  createInvoice,
  createPaymentLink,
  createRecurringInvoice,
  peekNextInvoiceNumber,
  createSubscriptionPlan,
  generatePayslips,
  deactivatePaymentLink,
  defaultPayrollPeriod,
  duplicateInvoice,
  ingestShopifyOrder,
  pauseRecurringInvoice,
  pauseSubscriber,
  paymentLinkById,
  payPublishedCheckout,
  payrollPostedFor,
  payslipsForPeriod,
  checkoutPageUnavailable,
  postPayroll,
  publishCheckoutPage,
  recurringNextOffsets,
  removeTag,
  renameTag,
  setTagParent,
  resolveApproval,
  saveCheckoutSettings,
  saveMerchantProfile,
  runSimulatedBilling,
  sendRecurringInvoice,
  setApprovalLimit,
  setRolePermission,
  setSmartCheckout,
  settleBilling,
  settleCheckoutPayment,
  settlePayment,
  simulatePayment,
  updateClient
} from "./spine";
export { exportTallyXml, simulateZohoSync } from "./tally-export";
export { resetGateway } from "../gateway/index";

if (typeof window !== "undefined") {
  hydrateFromStorage();
  (window as unknown as { FLOW_DATA: unknown }).FLOW_DATA = dashboardState();
}
