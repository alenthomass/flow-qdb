"use client";

import { Fragment } from "react";
import { sx } from "./chrome";

export type InvoicePreviewLine = {
  label: string;
  qty?: string;
  unit?: string;
  amt: string;
  note?: string;
};

export type InvoicePreviewProps = {
  number: string;
  client: string;
  clientAddress?: string;
  businessName?: string;
  sellerAddress?: string;
  taxReg?: string;
  issued?: string;
  due?: string;
  status?: string;
  chip?: string;
  lines: InvoicePreviewLine[];
  subtotal?: string;
  taxAmt?: string;
  showTax?: boolean;
  discount?: string;
  total: string;
  partialPayment?: boolean;
  attachments?: { name: string }[];
  payLabel?: string;
  reference?: string;
  notes?: string;
  bankName?: string;
  accountName?: string;
  iban?: string;
};

function brandInitials(name: string) {
  const cleaned = String(name || "")
    .replace(/\b(w\.?l\.?l\.?|l\.?l\.?c\.?|ltd\.?|inc\.?)\b/gi, " ")
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  return "";
}

function locationFromAddress(address: string) {
  const parts = String(address || "").split(",").map(part => part.trim()).filter(Boolean);
  if (parts.length >= 2) return parts.slice(-2).join(", ");
  return parts[0] || "";
}

function statusTone(status?: string) {
  const label = String(status || "");
  if (/paid|settled|success/i.test(label)) return { fg: "var(--pos)", bg: "var(--pos-soft)" };
  if (/overdue|refunded|error|canceled/i.test(label)) return { fg: "var(--neg)", bg: "var(--neg-soft)" };
  return { fg: "var(--warn)", bg: "var(--warn-soft)" };
}

function discountValue(discount?: string) {
  const raw = String(discount || "").trim();
  if (!raw) return "";
  const numeric = raw.replace(/[^0-9.]/g, "");
  if (!numeric || Number(numeric) <= 0) return "";
  return raw.replace(/^\-\s*/, "");
}

export function InvoicePreview({
  number,
  client,
  clientAddress,
  businessName,
  sellerAddress,
  taxReg,
  issued,
  due,
  status,
  lines,
  subtotal,
  discount,
  total,
  partialPayment,
  reference,
  notes,
  bankName,
  accountName,
  iban
}: InvoicePreviewProps) {
  const rows = Array.isArray(lines) ? lines : [];
  const trn = String(taxReg || "").trim();
  const address = String(sellerAddress || "").trim();
  const billedAddress = String(clientAddress || "").trim();
  const seller = String(businessName || "").trim();
  const initials = brandInitials(seller);
  const location = locationFromAddress(address);
  const po = String(reference || "").trim();
  const memo = String(notes || "").trim();
  const bank = String(bankName || "").trim();
  const account = String(accountName || "").trim();
  const ibanValue = String(iban || "").trim();
  const disc = discountValue(discount);
  const tone = statusTone(status);
  const billedName = String(client || "").trim();
  const billedPlaceholder = !billedName || /^select or add a client$/i.test(billedName);

  return (
    <div className="flow-invoice-live" style={sx("background:var(--divider); border:1px solid var(--line); border-radius:11px; padding:26px")}>
      <div style={sx("font-size:12px; font-weight:650; color:var(--ink-4); letter-spacing:.04em")}>WHAT YOUR CLIENT SEES</div>
      <div className="flow-invoice-doc">
        <header className="flow-invoice-band">
          <span className="flow-invoice-glow is-band" aria-hidden="true" />
          <div className="flow-invoice-brand">
            {!!initials && (
              <div className="flow-invoice-mark" aria-hidden="true">{initials}</div>
            )}
            <div className="flow-invoice-seller">
              {!!seller && <div className="flow-invoice-seller-name">{seller}</div>}
              {!!address && <div className="flow-invoice-seller-meta">{address}</div>}
              {!!trn && <div className="flow-invoice-seller-meta">TRN {trn}</div>}
            </div>
          </div>
          <div className="flow-invoice-id">
            <div className="flow-invoice-eyebrow">Invoice</div>
            <div className="flow-invoice-number">{number}</div>
            {!!status && (
              <span
                className="flow-invoice-status"
                style={sx("color:" + tone.fg + "; background:" + tone.bg)}
              >
                {status}
              </span>
            )}
          </div>
        </header>

        <div className="flow-invoice-body">
          <section className="flow-invoice-meta">
            <div>
              <div className="flow-invoice-kicker">Billed to</div>
              <div className="flow-invoice-meta-name">{billedPlaceholder ? "—" : billedName}</div>
              {!!billedAddress && <div className="flow-invoice-meta-copy">{billedAddress}</div>}
            </div>
            <div>
              {!!po && (
                <>
                  <div className="flow-invoice-kicker">Reference</div>
                  <div className="flow-invoice-meta-name">{po}</div>
                </>
              )}
            </div>
            <div className="flow-invoice-dates">
              <div className="flow-invoice-kicker">Dates</div>
              <div className="flow-invoice-date-row">
                <span>Invoice date</span>
                <span className="flow-invoice-num">{issued || "—"}</span>
              </div>
              <div className="flow-invoice-date-row">
                <span>Due date</span>
                <span className="flow-invoice-num">{due || "—"}</span>
              </div>
            </div>
          </section>

          <section className="flow-invoice-table" aria-label="Line items">
            <div className="flow-invoice-thead">
              <span>Description</span>
              <span>Qty</span>
              <span>Unit price</span>
              <span>Amount</span>
            </div>
            {rows.map((row, idx) => (
              <Fragment key={row.label + idx}>
                <div className="flow-invoice-trow">
                  <span>
                    <span className="flow-invoice-tdesc">{row.label}</span>
                    {!!String(row.note || "").trim() && (
                      <span className="flow-invoice-tnote">{row.note}</span>
                    )}
                  </span>
                  <span className="flow-invoice-num">{row.qty || "1"}</span>
                  <span className="flow-invoice-num">{row.unit || row.amt}</span>
                  <span className="flow-invoice-num">{row.amt}</span>
                </div>
              </Fragment>
            ))}
          </section>

          <section className="flow-invoice-close">
            <div className="flow-invoice-paynote">
              <p>Please settle by the due date above. Bank details are listed below.</p>
              {!!partialPayment && (
                <span className="flow-invoice-partial">Partial payments allowed</span>
              )}
            </div>
            <aside className="flow-invoice-total">
              <span className="flow-invoice-glow is-total" aria-hidden="true" />
              {!!subtotal && (
                <div className="flow-invoice-total-row">
                  <span>Subtotal</span>
                  <span className="flow-invoice-num">{subtotal}</span>
                </div>
              )}
              {!!disc && (
                <div className="flow-invoice-total-row is-discount">
                  <span>Discount</span>
                  <span className="flow-invoice-num">−{disc}</span>
                </div>
              )}
              <div className="flow-invoice-total-due">
                <span>Total due</span>
                <strong className="flow-invoice-num">{total}</strong>
              </div>
            </aside>
          </section>

          <footer className="flow-invoice-foot">
            <div>
              <div className="flow-invoice-kicker">Payment details</div>
              {!!bank && (
                <div className="flow-invoice-payline">
                  <span>Bank</span>
                  <span>{bank}</span>
                </div>
              )}
              {!!account && (
                <div className="flow-invoice-payline">
                  <span>Account name</span>
                  <span>{account}</span>
                </div>
              )}
              {!!ibanValue && (
                <div className="flow-invoice-payline">
                  <span>IBAN</span>
                  <span className="flow-invoice-num">{ibanValue}</span>
                </div>
              )}
            </div>
            <div>
              <div className="flow-invoice-kicker">Notes</div>
              <div className="flow-invoice-meta-copy">{memo || "—"}</div>
            </div>
          </footer>

          <div className="flow-invoice-signoff">
            <span>{[seller, location].filter(Boolean).join(" · ")}</span>
            <span>Generated by Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
