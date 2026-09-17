import { dateFor } from "./seed";
import { offsetFromLabel } from "../format";

export type ParsedStatementRow = {
  dateRaw: string;
  description: string;
  signedMinor: number;
};

export type ParsedStatement = {
  rows: ParsedStatementRow[];
  skipped: number;
};

export type StatementSkipReasons = {
  badDate: number;
  missingFields: number;
};

const STATEMENT_MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  sept: 9,
  oct: 10,
  nov: 11,
  dec: 12
};

function offsetFromUtcParts(year: number, month: number, day: number): number | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }
  return Math.round((date.getTime() - dateFor(0).getTime()) / 86400000);
}

function monthFromToken(raw: string): number | null {
  const key = String(raw || "").toLowerCase();
  if (key.length !== 3 && key !== "sept") return null;
  const month = STATEMENT_MONTHS[key];
  return month || null;
}

/** Statement CSV dates only. Does not change UI label parsing in offsetFromLabel. */
export function parseStatementDate(raw: string): number | null {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) return offsetFromUtcParts(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const numbered = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(trimmed);
  if (numbered) return offsetFromUtcParts(Number(numbered[3]), Number(numbered[2]), Number(numbered[1]));

  const dayMonthYear = /^(\d{1,2})\s+([A-Za-z]{3,4})\s+(\d{4})$/.exec(trimmed);
  if (dayMonthYear) {
    const month = monthFromToken(dayMonthYear[2]);
    if (month) return offsetFromUtcParts(Number(dayMonthYear[3]), month, Number(dayMonthYear[1]));
  }

  const monthDayYear = /^([A-Za-z]{3,4})\s+(\d{1,2}),\s*(\d{4})$/.exec(trimmed);
  if (monthDayYear) {
    const month = monthFromToken(monthDayYear[1]);
    if (month) return offsetFromUtcParts(Number(monthDayYear[3]), month, Number(monthDayYear[2]));
  }

  return offsetFromLabel(trimmed);
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

function headerKey(raw: string): string {
  return String(raw || "").replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[\s_]+/g, "");
}

function signedMinor(raw: string): number | null {
  const text = String(raw || "").trim();
  if (!text) return null;
  const wrapped = /^\(.*\)$/.test(text);
  const digits = text.replace(/[^0-9.]/g, "");
  if (!digits || !/[0-9]/.test(digits)) return null;
  const n = Math.round(Math.abs(parseFloat(digits)) * 100);
  if (!Number.isFinite(n) || n === 0) return null;
  const leadingMinus = /^-/.test(text.replace(/\s/g, ""));
  return wrapped || leadingMinus ? -n : n;
}

function unsignedMinor(raw: string): number | null {
  const n = signedMinor(raw);
  if (n == null) return null;
  return Math.abs(n);
}

/** Client-side CSV parse. Dates stay raw for parseStatementDate. */
export function parseBankStatementCsv(text: string): ParsedStatement {
  const lines = String(text || "").replace(/^\uFEFF/, "").split(/\r\n|\n|\r/);
  const nonempty = lines.map(line => line.trim()).filter(line => line.length > 0);
  if (!nonempty.length) return { rows: [], skipped: 0 };

  const header = splitCsvLine(nonempty[0]).map(headerKey);
  const dateIdx = header.indexOf("date");
  const descIdx = header.indexOf("description") >= 0 ? header.indexOf("description") : header.indexOf("desc");
  const amountIdx = header.indexOf("amount") >= 0 ? header.indexOf("amount") : header.indexOf("amt");
  const debitIdx = header.indexOf("debit");
  const creditIdx = header.indexOf("credit");
  const hasHeader = dateIdx >= 0 && descIdx >= 0 && (amountIdx >= 0 || debitIdx >= 0 || creditIdx >= 0);
  const body = hasHeader ? nonempty.slice(1) : nonempty;
  const col = hasHeader
    ? { date: dateIdx, desc: descIdx, amount: amountIdx, debit: debitIdx, credit: creditIdx }
    : { date: 0, desc: 1, amount: 2, debit: -1, credit: -1 };

  const rows: ParsedStatementRow[] = [];
  let skipped = 0;
  for (const line of body) {
    const cells = splitCsvLine(line);
    const dateRaw = String(cells[col.date] || "").trim();
    const description = String(cells[col.desc] || "").trim();
    let signed: number | null = null;
    if (col.amount >= 0) {
      signed = signedMinor(cells[col.amount] || "");
    } else {
      const debit = col.debit >= 0 ? unsignedMinor(cells[col.debit] || "") : null;
      const credit = col.credit >= 0 ? unsignedMinor(cells[col.credit] || "") : null;
      if (debit != null && credit != null) signed = null;
      else if (credit != null) signed = credit;
      else if (debit != null) signed = -debit;
    }
    if (!dateRaw || !description || signed == null) {
      skipped += 1;
      continue;
    }
    rows.push({ dateRaw, description, signedMinor: signed });
  }
  return { rows, skipped };
}
