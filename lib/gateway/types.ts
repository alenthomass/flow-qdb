export type PaymentOutcome = "success" | "decline" | "timeout" | "partial";

/** SkipCash statusId: 0 new, 1 pending, 2 paid, 3 canceled, 4 failed, 5 rejected, 6 refunded, 7 pending refund, 8 refund failed. */
export type SkipCashStatusId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type SkipCashStatus =
  | "new"
  | "pending"
  | "paid"
  | "canceled"
  | "failed"
  | "rejected"
  | "refunded"
  | "pending refund"
  | "refund failed";

export const SKIP_CASH_STATUS: Record<SkipCashStatusId, SkipCashStatus> = {
  0: "new",
  1: "pending",
  2: "paid",
  3: "canceled",
  4: "failed",
  5: "rejected",
  6: "refunded",
  7: "pending refund",
  8: "refund failed"
};

export interface PaymentCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreatePaymentLinkRequest {
  amountMinor: number;
  currency: "QAR" | "AED";
  description?: string;
  customer?: PaymentCustomer;
  merchantTransactionId?: string;
}

export interface PaymentRecord {
  id: string;
  payUrl: string;
  amountMinor: number;
  currency: "QAR" | "AED";
  statusId: SkipCashStatusId;
  status: SkipCashStatus;
  merchantTransactionId: string | null;
  createdDayOffset: number;
}

export interface Settlement {
  id: string;
  paymentId: string;
  amountMinor: number;
  dayOffset: number;
}

/** SkipCash webhook body field names (PaymentId, Amount, StatusId, TransactionId, Custom1, VisaId). */
export interface SkipCashWebhookPayload {
  paymentId: string;
  amount: string;
  statusId: SkipCashStatusId;
  transactionId: string | null;
  custom1: string | null;
  visaId: string | null;
}

export interface WebhookResult {
  paymentId: string;
  statusId: SkipCashStatusId;
  status: SkipCashStatus;
  amountMinor: number;
  merchantTransactionId: string | null;
  settlementDayOffset: number | null;
}

export interface PaymentGateway {
  createPaymentLink(input: CreatePaymentLinkRequest): Promise<PaymentRecord>;
  getPaymentStatus(id: string): Promise<PaymentRecord>;
  ensurePayment(record: PaymentRecord): PaymentRecord;
  simulatePayment(id: string, outcome: PaymentOutcome): Promise<SkipCashWebhookPayload>;
  listSettlements(): Promise<Settlement[]>;
  handleWebhook(payload: unknown): Promise<WebhookResult>;
}
