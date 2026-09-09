import type {
  CreatePaymentLinkRequest,
  PaymentGateway,
  PaymentOutcome,
  PaymentRecord,
  Settlement,
  SkipCashStatusId,
  SkipCashWebhookPayload,
  WebhookResult
} from "./types";
import { SKIP_CASH_STATUS } from "./types";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, ch => {
    const n = Math.random() * 16 | 0;
    return (ch === "x" ? n : (n & 0x3) | 0x8).toString(16);
  });
}

function majorString(amountMinor: number): string {
  return (amountMinor / 100).toFixed(2);
}

function parseAmountMinor(amount: string | number): number {
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function hostedPayUrl(id: string): string {
  const origin = typeof location !== "undefined" && location.origin ? location.origin : "";
  return origin + "/pay/" + id;
}

function asWebhook(payload: unknown): SkipCashWebhookPayload {
  if (!payload || typeof payload !== "object") throw new Error("SkipCash webhook body is missing");
  const row = payload as Record<string, unknown>;
  const paymentId = String(row.paymentId ?? row.PaymentId ?? "");
  const statusRaw = row.statusId ?? row.StatusId;
  const statusId = Number(statusRaw) as SkipCashStatusId;
  if (!paymentId) throw new Error("SkipCash webhook PaymentId is missing");
  if (!(statusId in SKIP_CASH_STATUS)) throw new Error("SkipCash webhook StatusId is unknown: " + String(statusRaw));
  return {
    paymentId,
    amount: String(row.amount ?? row.Amount ?? ""),
    statusId,
    transactionId: row.transactionId == null && row.TransactionId == null ? null : String(row.transactionId ?? row.TransactionId),
    custom1: row.custom1 == null && row.Custom1 == null ? null : String(row.custom1 ?? row.Custom1),
    visaId: row.visaId == null && row.VisaId == null ? null : String(row.visaId ?? row.VisaId)
  };
}

export function createMockSkipCash(): PaymentGateway {
  const payments = new Map<string, PaymentRecord>();
  const settlements: Settlement[] = [];

  return {
    async createPaymentLink(input: CreatePaymentLinkRequest): Promise<PaymentRecord> {
      await delay(300 + Math.floor(Math.random() * 601));
      const skipCashRequest = {
        Uid: uuid(),
        KeyId: "00000000-0000-0000-0000-000000000001",
        Amount: majorString(input.amountMinor),
        FirstName: input.customer?.firstName ?? "",
        LastName: input.customer?.lastName ?? "",
        Phone: input.customer?.phone ?? "",
        Email: input.customer?.email ?? "",
        TransactionId: input.merchantTransactionId ?? "",
        Custom1: input.description ?? ""
      };
      const id = uuid();
      const record: PaymentRecord = {
        id,
        payUrl: hostedPayUrl(id),
        amountMinor: input.amountMinor,
        currency: input.currency,
        statusId: 0,
        status: SKIP_CASH_STATUS[0],
        merchantTransactionId: skipCashRequest.TransactionId || null,
        createdDayOffset: 0
      };
      payments.set(id, record);
      return { ...record };
    },

    async getPaymentStatus(id: string): Promise<PaymentRecord> {
      const record = payments.get(id);
      if (!record) throw new Error("SkipCash payment not found: " + id);
      return { ...record };
    },

    async simulatePayment(id: string, outcome: PaymentOutcome): Promise<SkipCashWebhookPayload> {
      const record = payments.get(id);
      if (!record) throw new Error("SkipCash payment not found: " + id);
      let statusId: SkipCashStatusId = 2;
      let amountMinor = record.amountMinor;
      if (outcome === "decline") statusId = 5;
      else if (outcome === "timeout") statusId = 4;
      else if (outcome === "partial") {
        statusId = 2;
        amountMinor = Math.max(1, Math.round(record.amountMinor / 2));
      }
      return {
        paymentId: record.id,
        amount: majorString(amountMinor),
        statusId,
        transactionId: record.merchantTransactionId,
        custom1: null,
        visaId: outcome === "success" || outcome === "partial" ? "sim_" + record.id.slice(0, 8) : null
      };
    },

    async listSettlements(): Promise<Settlement[]> {
      return settlements.map(row => ({ ...row }));
    },

    async handleWebhook(payload: unknown): Promise<WebhookResult> {
      const hook = asWebhook(payload);
      const record = payments.get(hook.paymentId);
      if (!record) throw new Error("SkipCash payment not found: " + hook.paymentId);
      const amountMinor = parseAmountMinor(hook.amount) || record.amountMinor;
      record.statusId = hook.statusId;
      record.status = SKIP_CASH_STATUS[hook.statusId];
      record.amountMinor = amountMinor;
      let settlementDayOffset: number | null = null;
      if (hook.statusId === 2) {
        const lag = 1 + Math.floor(Math.random() * 2);
        settlementDayOffset = record.createdDayOffset + lag;
        settlements.push({
          id: "stl_" + record.id,
          paymentId: record.id,
          amountMinor,
          dayOffset: settlementDayOffset
        });
      }
      return {
        paymentId: record.id,
        statusId: record.statusId,
        status: record.status,
        amountMinor,
        merchantTransactionId: record.merchantTransactionId,
        settlementDayOffset
      };
    }
  };
}
