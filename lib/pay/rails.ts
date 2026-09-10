/** Payer-facing processing fee. The SkipCash sandbox does not charge the customer. */
export function payerFeeMinor(_amountMinor: number): number {
  return 0;
}

export type PayRailId = "cards" | "applepay" | "naps";

export interface PayRail {
  id: PayRailId;
  label: string;
  hint: string;
  brands: string[];
}

export const PAY_RAILS: PayRail[] = [
  { id: "cards", label: "Cards", hint: "Visa · Mastercard", brands: ["visa", "mastercard"] },
  { id: "applepay", label: "Apple Pay", hint: "Wallet", brands: ["applepay"] },
  { id: "naps", label: "NAPS", hint: "Scan to pay", brands: ["naps"] }
];
