import { offsetFromLabel as parseDateLabel } from "../format";
import { dateFor } from "./seed";
import { appendActivity, appendExportRecord, getStore } from "./store";
import type { ExportRecord, Transaction } from "./types";

export interface TallyExportFile {
  xml: string;
  filename: string;
  items: number;
  fromOffset: number;
  toOffset: number;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tallyDate(offset: number): string {
  const date = dateFor(offset);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return String(year) + month + day;
}

function majorAmount(amountMinor: number): string {
  return (amountMinor / 100).toFixed(2);
}

export function offsetFromLabel(label: string): number | null {
  const trimmed = String(label || "").trim();
  if (!trimmed) return null;
  if (/^\d{8}$/.test(trimmed)) {
    for (let offset = -400; offset <= 1; offset++) {
      if (tallyDate(offset) === trimmed) return offset;
    }
  }
  return parseDateLabel(trimmed);
}

export function resolveTallyRange(fromLabel?: string, toLabel?: string): { fromOffset: number; toOffset: number } {
  const fromOffset = fromLabel ? offsetFromLabel(fromLabel) : -29;
  const toOffset = toLabel ? offsetFromLabel(toLabel) : 0;
  return {
    fromOffset: fromOffset ?? -29,
    toOffset: toOffset ?? 0
  };
}

function bankLedger(txn: Transaction): string {
  const account = getStore().bankAccounts[0];
  if (txn.source === "bank") return account ? account.bank : "Bank";
  if (txn.source === "skipcash") return "SkipCash";
  if (txn.source === "shopify") return "Shopify";
  if (txn.source === "link") return "Payment Link";
  if (txn.source === "cash") return "Cash";
  return "Bank";
}

function plLedger(txn: Transaction): string {
  if (txn.type === "sale" || txn.type === "refund") return "Sales";
  if (txn.type === "payroll") return "Salaries";
  return txn.tag;
}

function voucherType(txn: Transaction): string {
  return txn.direction === "in" ? "Receipt" : "Payment";
}

function ledgerEntry(name: string, debit: boolean, amountMinor: number, costCentre?: string): string {
  const amount = debit ? "-" + majorAmount(amountMinor) : majorAmount(amountMinor);
  const cost = costCentre
    ? [
      "        <CATEGORYALLOCATIONS.LIST>",
      "          <CATEGORY>Primary Cost Category</CATEGORY>",
      "          <COSTCENTREALLOCATIONS.LIST>",
      "            <NAME>" + xmlEscape(costCentre) + "</NAME>",
      "            <AMOUNT>" + amount + "</AMOUNT>",
      "          </COSTCENTREALLOCATIONS.LIST>",
      "        </CATEGORYALLOCATIONS.LIST>"
    ].join("\n") + "\n"
    : "";
  return [
    "      <ALLLEDGERENTRIES.LIST>",
    "        <LEDGERNAME>" + xmlEscape(name) + "</LEDGERNAME>",
    "        <ISDEEMEDPOSITIVE>" + (debit ? "Yes" : "No") + "</ISDEEMEDPOSITIVE>",
    "        <AMOUNT>" + amount + "</AMOUNT>",
    cost + "      </ALLLEDGERENTRIES.LIST>"
  ].join("\n");
}

function voucherXml(txn: Transaction): string {
  const type = voucherType(txn);
  const date = tallyDate(txn.dayOffset);
  const narration = txn.type + " · " + txn.counterparty + " · " + txn.tag;
  const party = bankLedger(txn);
  const books = plLedger(txn);
  const debitBooks = txn.direction === "out";
  const entries = debitBooks
    ? ledgerEntry(books, true, txn.amountMinor, txn.tag) + "\n" + ledgerEntry(party, false, txn.amountMinor)
    : ledgerEntry(party, true, txn.amountMinor) + "\n" + ledgerEntry(books, false, txn.amountMinor, txn.tag);
  return [
    "    <TALLYMESSAGE xmlns:UDF=\"TallyUDF\">",
    "      <VOUCHER VCHTYPE=\"" + type + "\" ACTION=\"Create\" OBJVIEW=\"Accounting Voucher View\">",
    "        <DATE>" + date + "</DATE>",
    "        <EFFECTIVEDATE>" + date + "</EFFECTIVEDATE>",
    "        <VOUCHERTYPENAME>" + type + "</VOUCHERTYPENAME>",
    "        <PARTYLEDGERNAME>" + xmlEscape(txn.counterparty) + "</PARTYLEDGERNAME>",
    "        <NARRATION>" + xmlEscape(narration) + "</NARRATION>",
    "        <REFERENCE>" + xmlEscape(txn.id) + "</REFERENCE>",
    entries,
    "      </VOUCHER>",
    "    </TALLYMESSAGE>"
  ].join("\n");
}

export function transactionsInTallyRange(fromOffset: number, toOffset: number): Transaction[] {
  const start = Math.min(fromOffset, toOffset);
  const end = Math.max(fromOffset, toOffset);
  return getStore().transactions
    .filter(txn => txn.status !== "pending" && txn.dayOffset >= start && txn.dayOffset <= end)
    .slice()
    .sort((a, b) => a.dayOffset - b.dayOffset || a.id.localeCompare(b.id));
}

export function buildTallyExport(fromLabel?: string, toLabel?: string): TallyExportFile {
  const range = resolveTallyRange(fromLabel, toLabel);
  const rows = transactionsInTallyRange(range.fromOffset, range.toOffset);
  const company = getStore().merchant.businessName;
  const fromStamp = tallyDate(range.fromOffset);
  const toStamp = tallyDate(range.toOffset);
  const xml = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<ENVELOPE>",
    "  <HEADER>",
    "    <VERSION>1</VERSION>",
    "    <TALLYREQUEST>Import</TALLYREQUEST>",
    "    <TYPE>Data</TYPE>",
    "    <ID>Vouchers</ID>",
    "  </HEADER>",
    "  <BODY>",
    "    <DESC>",
    "      <STATICVARIABLES>",
    "        <SVCURRENTCOMPANY>" + xmlEscape(company) + "</SVCURRENTCOMPANY>",
    "      </STATICVARIABLES>",
    "    </DESC>",
    "    <DATA>",
    ...rows.map(voucherXml),
    "    </DATA>",
    "  </BODY>",
    "</ENVELOPE>",
    ""
  ].join("\n");
  return {
    xml,
    filename: "flow-tally-export-" + fromStamp + "-" + toStamp + ".xml",
    items: rows.length,
    fromOffset: range.fromOffset,
    toOffset: range.toOffset
  };
}

function logExport(row: ExportRecord, what: string): ExportRecord {
  appendActivity({
    id: "act_" + row.id,
    kind: "sync",
    dayOffset: 0,
    actor: getStore().merchant.ownerName,
    what
  });
  return row;
}

export function recordTallyExport(file: TallyExportFile): ExportRecord {
  return logExport(appendExportRecord({
    id: "exp_tally_" + Date.now(),
    kind: "tally",
    target: "Tally XML",
    dayOffset: 0,
    items: file.items,
    status: "Success",
    filename: file.filename,
    simulated: false,
    errors: 0
  }), file.items + " vouchers exported to Tally XML (" + file.filename + ")");
}

export function exportTallyXml(fromLabel?: string, toLabel?: string): TallyExportFile {
  const file = buildTallyExport(fromLabel, toLabel);
  recordTallyExport(file);
  return file;
}

export function simulateZohoSync(): ExportRecord {
  const rows = transactionsInTallyRange(-29, 0);
  return logExport(appendExportRecord({
    id: "exp_zoho_" + Date.now(),
    kind: "zoho",
    target: "Zoho Books (simulated)",
    dayOffset: 0,
    items: rows.length,
    status: "Simulated",
    filename: null,
    simulated: true,
    errors: 0
  }), rows.length + " items pushed to Zoho Books (simulated)");
}
