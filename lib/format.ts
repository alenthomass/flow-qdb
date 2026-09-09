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

export function dateInputValue(dayOffset: number): string {
  const date = dateFor(dayOffset);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export function previousMonthLabel(): string {
  const today = dateFor(0);
  const prev = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
  return prev.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function monthYearLabel(dayOffset: number): string {
  return dateFor(dayOffset).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}

export function offsetFromLabel(label: string): number | null {
  const trimmed = String(label || "").trim();
  if (!trimmed) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      return null;
    }
    return Math.round((date.getTime() - dateFor(0).getTime()) / 86400000);
  }
  for (let offset = -400; offset <= 400; offset++) {
    if (formatDate(offset) === trimmed) return offset;
  }
  return null;
}
