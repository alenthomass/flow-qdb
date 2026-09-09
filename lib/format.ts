import { dateFor } from "./data/seed";
import type { CurrencyCode } from "./data/types";

const EXPONENT: Record<string, number> = { QAR: 2, AED: 2 };
const PREFIX: Record<string, string> = { QAR: "QR ", AED: "AED " };

export function formatMoney(amount: number, currency: CurrencyCode, options: { trimWhole?: boolean } = {}): string {
  const exp = EXPONENT[currency] ?? 2;
  const abs = Math.abs(Math.trunc(amount));
  const prefix = PREFIX[currency] ?? currency + " ";
  if (abs === 0) return prefix + "0";
  const sign = amount < 0 ? "-" : "";
  const factor = 10 ** exp;
  const major = Math.floor(abs / factor);
  const minor = abs % factor;
  const grouped = major.toLocaleString("en-US");
  if (minor === 0 && options.trimWhole) return sign + prefix + grouped;
  const frac = minor.toString().padStart(exp, "0");
  return sign + prefix + grouped + "." + frac;
}

export function formatDate(dayOffset: number): string {
  return dateFor(dayOffset).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

export function offsetFromLabel(label: string): number | null {
  const trimmed = String(label || "").trim();
  if (!trimmed) return null;
  for (let offset = -400; offset <= 1; offset++) {
    if (formatDate(offset) === trimmed) return offset;
  }
  return null;
}
