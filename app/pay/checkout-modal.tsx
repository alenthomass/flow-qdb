"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { formatMoney } from "../../lib/format";
import type { CurrencyCode } from "../../lib/data/types";
import { PAY_RAILS, payerFeeMinor, type PayRailId } from "../../lib/pay/rails";

function BrandMark({ name }: { name: string }) {
  if (name === "visa") return <span className="mark"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Visa%20Inc.%20logo%20(2021%E2%80%93present).svg" alt="VISA" /></span>;
  if (name === "mastercard") return <span className="mark"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Mastercard-logo.svg" alt="MASTERCARD" /></span>;
  if (name === "applepay") return <span className="mark"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Apple%20Pay%20logo.svg" alt="APPLE PAY" /></span>;
  return <span className="mark" style={{ padding: "0 8px" }}><span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".03em", color: "#15151A" }}>NAPS</span></span>;
}

function SandboxQr({ value }: { value: string }) {
  const size = 21;
  const cells: boolean[] = [];
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  for (let i = 0; i < size * size; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    const finder = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
    const ring = finder && (x === 0 || y === 0 || x === 6 || y === 6 || x === size - 1 || y === size - 1 || x === size - 7 || y === size - 7);
    const core = finder && x >= 2 && x <= 4 && y >= 2 && y <= 4;
    const core2 = finder && x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4;
    const core3 = finder && x >= 2 && x <= 4 && y >= size - 5 && y <= size - 3;
    h = Math.imul(h ^ i, 16777619);
    cells.push(ring || core || core2 || core3 || (!finder && (h & 3) === 0));
  }
  const pix = 7;
  return (
    <svg width={size * pix} height={size * pix} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" style={{ borderRadius: 8, background: "#fff" }}>
      {cells.map((on, i) => on ? <rect key={i} x={i % size} y={Math.floor(i / size)} width="1" height="1" fill="#17171C" /> : null)}
    </svg>
  );
}

export function CheckoutModal({
  merchant,
  currency,
  amountMinor,
  phone,
  onPhone,
  processing,
  error,
  errorState,
  onClose,
  onPay
}: {
  merchant: string;
  currency: CurrencyCode;
  amountMinor: number;
  phone: string;
  onPhone: (value: string) => void;
  processing: boolean;
  error: string | null;
  errorState?: string | null;
  onClose: () => void;
  onPay: () => void;
}) {
  const [rail, setRail] = useState<PayRailId>("cards");
  const [editingPhone, setEditingPhone] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", save: false });
  const fee = payerFeeMinor(amountMinor);
  const total = amountMinor + fee;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (processing) return;
    onPay();
  }

  return (
    <div className="ck-scrim" role="dialog" aria-modal="true" aria-labelledby="ck-title">
      <div className="ck-modal">
        <div className="ck-head">
          <div id="ck-title">Checkout</div>
          <div style={{ flex: 1 }} />
          <button type="button" className="ck-icon" aria-label="Close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 3 6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="ck-split">
          <aside className="ck-left">
            <div className="ck-brand">
              <span className="ck-logo">F</span>
              <div>
                <div className="ck-merchant">{merchant}</div>
                <div className="ck-secured-mini">Secured by Flow</div>
              </div>
            </div>
            <div className="ck-summary">
              <h2>Price Summary</h2>
              <div className="ck-row"><span>Amount</span><span>{formatMoney(amountMinor, currency)}</span></div>
              <div className="ck-row"><span>Processing fee</span><span>{formatMoney(fee, currency)}</span></div>
              <div className="ck-row ck-total"><span>Total</span><span>{formatMoney(total, currency)}</span></div>
            </div>
            <div className="ck-using">
              <span>Using as </span>
              {editingPhone ? (
                <input className="ck-phone-edit" value={phone} onChange={e => onPhone(e.target.value)} onBlur={() => setEditingPhone(false)} autoFocus />
              ) : (
                <button type="button" className="ck-phone" onClick={() => setEditingPhone(true)}>{phone || "add phone"}</button>
              )}
            </div>
            <div className="ck-foot-left">Secured by Flow</div>
          </aside>
          <section className="ck-right">
            <h2>Payment Options</h2>
            <div className="ck-rails">
              {PAY_RAILS.map(option => (
                <button type="button" key={option.id} className={"ck-rail" + (rail === option.id ? " on" : "")} onClick={() => setRail(option.id)}>
                  <span className="ck-rail-copy">
                    <span className="ck-rail-label">{option.label}</span>
                    <span className="ck-rail-hint">{option.hint}</span>
                  </span>
                  <span className="ck-rail-brands">{option.brands.map(brand => <BrandMark key={brand} name={brand} />)}</span>
                </button>
              ))}
            </div>
            <form className="ck-detail" onSubmit={submit}>
              {rail === "naps" && (
                <div className="ck-qr">
                  <SandboxQr value={merchant + String(amountMinor)} />
                  <div className="ck-qr-copy">Scan with any NAPS app</div>
                </div>
              )}
              {rail === "applepay" && (
                <div className="ck-wallet">Confirm this payment with Apple Pay on this device.</div>
              )}
              {rail === "cards" && (
                <div className="ck-card-fields">
                  <label>
                    <span>Card Number</span>
                    <input inputMode="numeric" autoComplete="cc-number" placeholder="ACCT-000003" value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} />
                  </label>
                  <div className="ck-card-row">
                    <label>
                      <span>MM/YY</span>
                      <input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} />
                    </label>
                    <label>
                      <span>CVV</span>
                      <input inputMode="numeric" autoComplete="cc-csc" placeholder="CVV" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} />
                    </label>
                  </div>
                  <label className="ck-save">
                    <input type="checkbox" checked={card.save} onChange={e => setCard(c => ({ ...c, save: e.target.checked }))} />
                    Save this card for faster checkout
                  </label>
                </div>
              )}
              {error && <div className="note err" role="alert" data-payment-state={errorState}>{error}</div>}
              <button className="pay-continue" type="submit" disabled={processing} onClick={event => {
                event?.preventDefault?.();
                if (!processing) onPay();
              }}>
                {processing ? "Processing…" : rail === "cards" ? "Continue" : "Pay " + formatMoney(total, currency)}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
