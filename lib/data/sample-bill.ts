import { formatDate, formatMoney } from "../format";
import { seed } from "./seed";
import type { Transaction, TxnSource } from "./types";

export interface BillLine {
  description: string;
  amountMinor: number;
}

export interface BillConfidence {
  vendor: number;
  date: number;
  total: number;
  tax: number;
  tag: number;
  lines: number;
}

export interface ExtractedBill {
  id: string;
  filename: string;
  mime: string;
  vendor: string;
  dayOffset: number;
  amountMinor: number;
  taxMinor: number;
  tag: string;
  source: TxnSource;
  branchId: string;
  lines: BillLine[];
  confidence: BillConfidence;
}

export const EXTRACT_DELAY_MIN_MS = 1500;
export const EXTRACT_DELAY_MAX_MS = 2500;
export const EXTRACT_DELAY_MS = 1800;

/** Demo scan targets. Distinct from seed counterparties (no Barzan Water, no Al Maha Stationery). */
export const SAMPLE_BILLS: ExtractedBill[] = [
  {
    id: "bill_barzan",
    filename: "barzan-water.pdf",
    mime: "application/pdf",
    vendor: "Barzan Water",
    dayOffset: 0,
    amountMinor: 118000,
    taxMinor: 0,
    tag: "Utilities",
    source: "bank",
    branchId: "br_01",
    lines: [
      { description: "18.9L bottled water", amountMinor: 89000 },
      { description: "Delivery", amountMinor: 29000 }
    ],
    confidence: {
      vendor: 0.96,
      date: 0.93,
      total: 0.98,
      tax: 0.91,
      tag: 0.94,
      lines: 0.9
    }
  },
  {
    id: "bill_almaha",
    filename: "al-maha-stationery.svg",
    mime: "image/svg+xml",
    vendor: "Al Maha Stationery",
    dayOffset: -1,
    amountMinor: 34000,
    taxMinor: 0,
    tag: "Supplies",
    source: "bank",
    branchId: "br_01",
    lines: [
      { description: "A4 copy paper", amountMinor: 18000 },
      { description: "Printer toner", amountMinor: 16000 }
    ],
    confidence: {
      vendor: 0.92,
      date: 0.88,
      total: 0.95,
      tax: 0.84,
      tag: 0.89,
      lines: 0.86
    }
  }
];

/** First sample, kept for Stage -1 scan-save identity. */
export const SAMPLE_BILL: Omit<Transaction, "id"> = {
  dayOffset: SAMPLE_BILLS[0].dayOffset,
  counterparty: SAMPLE_BILLS[0].vendor,
  source: SAMPLE_BILLS[0].source,
  direction: "out",
  type: "expense",
  tag: SAMPLE_BILLS[0].tag,
  status: "settled",
  amountMinor: SAMPLE_BILLS[0].amountMinor,
  branchId: SAMPLE_BILLS[0].branchId,
  invoiceId: null
};

export function extractDelayMs(): number {
  return EXTRACT_DELAY_MIN_MS + Math.floor(Math.random() * (EXTRACT_DELAY_MAX_MS - EXTRACT_DELAY_MIN_MS + 1));
}

export function extractBill(ref?: string | null): ExtractedBill {
  const key = String(ref || "").trim().toLowerCase();
  const match = SAMPLE_BILLS.find(bill => {
    if (bill.id === ref || bill.filename === ref) return true;
    if (!key) return false;
    const stem = bill.filename.toLowerCase().replace(/\.[a-z0-9]+$/, "");
    return bill.id.toLowerCase() === key ||
      bill.filename.toLowerCase() === key ||
      key.includes(stem) ||
      key.includes(bill.vendor.toLowerCase());
  });
  return structuredClone(match || SAMPLE_BILLS[0]);
}

function pct(value: number): string {
  return Math.round(value * 100) + "%";
}

export function extractedBillForm(bill: ExtractedBill) {
  const currency = seed.merchant.currency;
  return {
    form: {
      scanVendor: bill.vendor,
      scanAmount: formatMoney(bill.amountMinor, currency),
      scanDate: formatDate(bill.dayOffset),
      scanTag: bill.tag,
      scanTax: formatMoney(bill.taxMinor, currency),
      scanOffset: bill.dayOffset
    },
    lines: bill.lines.map(line => ({
      description: line.description,
      amount: formatMoney(line.amountMinor, currency)
    })),
    conf: {
      vendor: pct(bill.confidence.vendor),
      date: pct(bill.confidence.date),
      total: pct(bill.confidence.total),
      tax: pct(bill.confidence.tax),
      tag: pct(bill.confidence.tag),
      lines: pct(bill.confidence.lines)
    }
  };
}
