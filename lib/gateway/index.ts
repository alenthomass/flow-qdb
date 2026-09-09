import { clearMockSkipCashStorage, createMockSkipCash } from "./mock-skipcash";
import type { PaymentGateway } from "./types";

export type GatewayImpl = "mock-skipcash";

/** Sole switch for which PaymentGateway implementation the app uses. */
export const GATEWAY: GatewayImpl = "mock-skipcash";

let instance: PaymentGateway | null = null;

export function getGateway(): PaymentGateway {
  if (!instance) {
    if (GATEWAY !== "mock-skipcash") {
      throw new Error("Unknown gateway implementation: " + GATEWAY);
    }
    instance = createMockSkipCash();
  }
  return instance;
}

export function resetGateway(): void {
  instance = null;
  clearMockSkipCashStorage();
}

export type {
  CreatePaymentLinkRequest,
  PaymentCustomer,
  PaymentGateway,
  PaymentOutcome,
  PaymentRecord,
  Settlement,
  SkipCashStatus,
  SkipCashStatusId,
  SkipCashWebhookPayload,
  WebhookResult
} from "./types";
export { SKIP_CASH_STATUS } from "./types";
