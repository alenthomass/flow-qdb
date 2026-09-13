"use client";

import { sx } from "./chrome";

export type PayslipPreviewProps = {
  businessName?: string;
  sellerAddress?: string;
  crNumber?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  employeeName: string;
  role?: string;
  period: string;
  issued?: string;
  method?: string;
  gross: string;
  deduction: string;
  net: string;
  pctText?: string;
  bankName?: string;
  accountName?: string;
  iban?: string;
  accountNumber?: string;
  swiftCode?: string;
  t?: (key: string, vars?: Record<string, string | number>) => string;
  display?: (text: string | number) => string;
};

function brandInitials(name: string): string {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

export function PayslipPreview({
  businessName,
  sellerAddress,
  crNumber,
  sellerPhone,
  sellerEmail,
  employeeName,
  role,
  period,
  issued,
  method,
  gross,
  deduction,
  net,
  pctText,
  bankName,
  accountName,
  iban,
  accountNumber,
  swiftCode,
  t,
  display
}: PayslipPreviewProps) {
  const L = (key: string, en: string) => (t ? t(key) : en);
  const D = (text: string | number) => (display ? display(text) : String(text ?? ""));
  const seller = String(businessName || "").trim();
  const address = String(sellerAddress || "").trim();
  const cr = String(crNumber || "").trim();
  const phone = String(sellerPhone || "").trim();
  const mail = String(sellerEmail || "").trim();
  const initials = brandInitials(seller);
  const who = String(employeeName || "").trim();
  const job = String(role || "").trim();
  const paidBy = String(method || "").trim();
  const bank = String(bankName || "").trim();
  const account = String(accountName || "").trim();
  const ibanValue = String(iban || "").trim();
  const accountNo = String(accountNumber || "").trim();
  const swift = String(swiftCode || "").trim();

  return (
    <div className="flow-invoice-live" dir="ltr" style={sx("background:var(--divider); border:1px solid var(--line); border-radius:11px; padding:26px")}>
      <div style={sx("font-size:12px; font-weight:650; color:var(--ink-4); letter-spacing:.04em")}>{L("ui.payr.slipSees", "WHAT THE EMPLOYEE SEES")}</div>
      <div className="flow-invoice-doc flow-payslip-doc">
        <header className="flow-invoice-band">
          <span className="flow-invoice-glow is-band" aria-hidden="true" />
          <div className="flow-invoice-brand">
            {!!initials && (
              <div className="flow-invoice-mark" aria-hidden="true">{initials}</div>
            )}
            <div className="flow-invoice-seller">
              {!!seller && <div className="flow-invoice-seller-name">{seller}</div>}
              {!!address && <div className="flow-invoice-seller-meta">{address}</div>}
              {!!cr && <div className="flow-invoice-seller-meta">{/^cr\b/i.test(cr) ? cr : "CR " + cr}</div>}
            </div>
          </div>
          <div className="flow-invoice-id">
            <div className="flow-invoice-eyebrow">{L("ui.payr.slipTitle", "Payslip")}</div>
            <div className="flow-invoice-number">{period ? D(period) : "—"}</div>
          </div>
        </header>

        <div className="flow-invoice-body">
          <section className="flow-invoice-meta">
            <div>
              <div className="flow-invoice-kicker">{L("ui.payr.slipFor", "Employee")}</div>
              <div className="flow-invoice-meta-name">{who || "—"}</div>
              {!!job && <div className="flow-invoice-meta-copy">{job}</div>}
              {!!paidBy && <div className="flow-invoice-meta-copy">{L("ui.payr.paidBy", "Paid by")} · {paidBy}</div>}
            </div>
            <div className="flow-invoice-dates">
              <div className="flow-invoice-kicker">{L("pages.common.period", "Period")}</div>
              <div className="flow-invoice-date-row">
                <span>{L("ui.payr.slipIssued", "Issued")}</span>
                <span className="flow-invoice-num">{issued ? D(issued) : "—"}</span>
              </div>
            </div>
          </section>

          <section className="flow-invoice-table" aria-label={L("ui.payr.break", "Breakdown preview")}>
            <div className="flow-invoice-thead">
              <span>{L("ui.invPrev.desc", "Description")}</span>
              <span />
              <span />
              <span>{L("ui.invPrev.amount", "Amount")}</span>
            </div>
            <div className="flow-invoice-trow">
              <span><span className="flow-invoice-tdesc">{L("ui.payr.base", "Base salaries")}</span></span>
              <span />
              <span />
              <span className="flow-invoice-num">{D(gross)}</span>
            </div>
            <div className="flow-invoice-trow">
              <span>
                <span className="flow-invoice-tdesc">{L("ui.payr.ded", "Deductions")}</span>
                {!!pctText && <span className="flow-invoice-tnote">{pctText}</span>}
              </span>
              <span />
              <span />
              <span className="flow-invoice-num">−{D(deduction)}</span>
            </div>
          </section>

          <section className="flow-invoice-close">
            <div className="flow-invoice-paynote">
              <p>{L("ui.payr.slipNote", "This payslip is for your records. Confirm figures with payroll before filing.")}</p>
            </div>
            <aside className="flow-invoice-total">
              <span className="flow-invoice-glow is-total" aria-hidden="true" />
              <div className="flow-invoice-total-due">
                <span>{L("ui.payr.net", "Net to pay")}</span>
                <strong className="flow-invoice-num">{D(net)}</strong>
              </div>
            </aside>
          </section>

          <footer className="flow-invoice-foot">
            <div>
              <div className="flow-invoice-kicker">{L("ui.invPrev.payDetails", "Payment details")}</div>
              {!!bank && (
                <div className="flow-invoice-payline">
                  <span>{L("ui.invPrev.bank", "Bank")}</span>
                  <span>{bank}</span>
                </div>
              )}
              {!!account && (
                <div className="flow-invoice-payline">
                  <span>{L("ui.invPrev.acctName", "Account name")}</span>
                  <span>{account}</span>
                </div>
              )}
              {!!accountNo && (
                <div className="flow-invoice-payline">
                  <span>{L("ui.invPrev.acctNo", "Account number")}</span>
                  <span className="flow-invoice-num">{accountNo}</span>
                </div>
              )}
              {!!ibanValue && (
                <div className="flow-invoice-payline">
                  <span>{L("ui.invPrev.iban", "IBAN")}</span>
                  <span className="flow-invoice-num">{ibanValue}</span>
                </div>
              )}
              {!!swift && (
                <div className="flow-invoice-payline">
                  <span>{L("ui.invPrev.swift", "SWIFT / BIC")}</span>
                  <span className="flow-invoice-num">{swift}</span>
                </div>
              )}
            </div>
            <div>
              <div className="flow-invoice-kicker">{L("ui.emp.slips", "Payslips")}</div>
              <div className="flow-invoice-meta-copy">{period ? D(period) : "—"}</div>
            </div>
          </footer>

          <div className="flow-invoice-signoff">
            <span>
              {[seller, address].filter(Boolean).join(" · ")}
              {!!(phone || mail) && (
                <>
                  <br />
                  {[phone, mail].filter(Boolean).join(" · ")}
                </>
              )}
            </span>
            <span>{L("ui.invPrev.generated", "Generated by Flow")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
