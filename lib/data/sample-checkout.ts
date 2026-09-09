/** Sample Beat 1 fixtures. Not merchant history. Not in the seed. */

export const SAMPLE_CHECKOUT_ANALYTICS = {
  note: "Sample analytics. Checkout drop-off is not stored for this merchant.",
  steps: [
    { label: "Opened checkout", percent: 100 },
    { label: "Entered details", percent: 64 },
    { label: "Paid", percent: 41 }
  ]
};

export const SAMPLE_SHOPIFY_ORDER = {
  counterparty: "Shopify sample order #1042",
  amountMinor: 18500,
  tag: "Sales" as const,
  branchId: "br_01"
};

export const SAMPLE_BANKS = [
  { id: "bank_qnb", bank: "Qatar National Bank", label: "QNB current account (sample)" },
  { id: "bank_dukhan", bank: "Dukhan Bank", label: "Dukhan current account (sample)" }
];
