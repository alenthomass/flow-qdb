"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import { getStore } from "../../lib/data/store";
import type { CheckoutField, CheckoutPage } from "../../lib/data/types";
import { formatMoney, parseMoneyInput } from "../../lib/format";
import { defaultDial, GCC_DIALS } from "../../lib/pay/gcc";

function splitPhone(raw: string, countryDial: string): { dial: string; local: string } {
  const trimmed = String(raw || "").trim();
  const hit = GCC_DIALS.find(row => trimmed.startsWith(row.dial));
  if (hit) return { dial: hit.dial, local: trimmed.slice(hit.dial.length).trim() };
  return { dial: countryDial, local: trimmed };
}
import {
  checkoutBySlug, emailError, getPayRevision, getServerPayRevision,
  initializePayStore, linkUnavailable, sandboxOutcome, submitPayment, subscribePayStore
} from "../../lib/pay/session";
import type { PayResult } from "../../lib/pay/session";
import { CheckoutModal } from "./checkout-modal";

type Branding = Pick<CheckoutPage, "supportEmail" | "supportPhone" | "terms" | "logoDataUrl">;
const defaultFields: CheckoutField[] = [
  { label: "Amount", kind: "price" },
  { label: "Email", kind: "mail" },
  { label: "Phone", kind: "phone" }
];

function withRequiredContact(fields: CheckoutField[]): CheckoutField[] {
  const next = fields.slice();
  if (!next.some(field => field.kind === "mail")) next.push({ label: "Email", kind: "mail" });
  if (!next.some(field => field.kind === "phone")) next.push({ label: "Phone", kind: "phone" });
  if (!next.some(field => field.kind === "price" || /^amount$/i.test(field.label))) {
    next.unshift({ label: "Amount", kind: "price" });
  }
  return next;
}

function Icon({ path, contact = false }: { path: string; contact?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={contact ? { flex: "0 0 16px" } : undefined} aria-hidden="true">
    <path d={path} stroke={contact ? "var(--ink-5)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function ShareButtons() {
  const [url, setUrl] = useState("");
  useEffect(() => { setUrl(encodeURIComponent(window.location.href)); }, []);
  const text = encodeURIComponent("Pay · Flow");
  return <div className="block"><h2>Share this on</h2><div className="share">
    <a aria-label="Share on Facebook" href={"https://www.facebook.com/sharer/sharer.php?u=" + url} target="_blank" rel="noopener noreferrer"><Icon path="M12.4 6.4H14V3.6h-2.2a3.2 3.2 0 0 0-3.2 3.2v1.8H6.8v2.9h1.8v6.9h3v-6.9h2.2l.4-2.9h-2.6V7.2c0-.5.3-.8.8-.8Z" /></a>
    <a aria-label="Share on X" href={"https://twitter.com/intent/tweet?url=" + url + "&text=" + text} target="_blank" rel="noopener noreferrer"><Icon path="M3.6 3.6h3.6l4 5.4 4.4-5.4h1.6l-5.2 6.4 5.6 7.4h-3.6l-4.2-5.6-4.6 5.6H3.6l5.4-6.6L3.6 3.6Z" /></a>
    <a aria-label="Share on WhatsApp" href={"https://wa.me/?text=" + text + "%20" + url} target="_blank" rel="noopener noreferrer"><Icon path="M3.4 16.6l.9-3.2a6.2 6.2 0 1 1 2.4 2.3l-3.3.9ZM7.6 7.4c.3-.1.6 0 .8.3l.7 1.2c.1.3.1.6-.1.8l-.5.5a4.6 4.6 0 0 0 2.3 2.3l.5-.5c.2-.2.5-.2.8-.1l1.2.7c.3.2.4.5.3.8" /></a>
    <a aria-label="Share by email" href={"mailto:?subject=" + text + "&body=" + url}><Icon path="M3 6.2h14v7.6H3V6.2Zm0 .4 7 4.6 7-4.6" /></a>
  </div></div>;
}

function MerchantCopy({ branding, merchant, title, description }: { branding: Branding; merchant: string; title: string; description: string }) {
  return <div className="copy">
    <div className="brand"><span className="logo">{branding.logoDataUrl ? <img src={branding.logoDataUrl} alt="" /> : "Logo"}</span><div className="biz">{merchant}</div></div>
    <h1>{title}</h1>{description && <div className="desc">{description}</div>}
    <div className="meta"><ShareButtons />
      {(branding.supportEmail || branding.supportPhone) && <div className="block"><h2>Contact us</h2><div className="contact">
        {branding.supportEmail && <div className="contact-row"><Icon contact path="M3 6.2h14v7.6H3V6.2Zm0 .4 7 4.6 7-4.6" /><span>{branding.supportEmail}</span></div>}
        {branding.supportPhone && <div className="contact-row"><Icon contact path="M6.2 3.4h2.2l1.1 2.8-1.5 1.1a8.4 8.4 0 0 0 3.7 3.7l1.1-1.5 2.8 1.1v2.2a1.4 1.4 0 0 1-1.5 1.4A11.6 11.6 0 0 1 4.8 4.9a1.4 1.4 0 0 1 1.4-1.5Z" /><span>{branding.supportPhone}</span></div>}
      </div></div>}
    </div>
  </div>;
}

function FlowFooter({ branding, merchant }: { branding: Branding; merchant: string }) {
  return <div className="legal">
    {branding.terms && <div className="terms">By paying you agree to share these details with {merchant}, in line with applicable law.</div>}
    <div className="flow"><div className="flow-mark"><svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 4.5h10M3 8h6.5M3 11.5h4" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" /></svg><span>Flow</span></div><p>Want a payment page like this for your business?<br />Visit <span style={{ color: "var(--accent)", fontWeight: 600 }}>Flow Payment Pages</span> to get started.</p></div>
  </div>;
}

function CardBrands() {
  return <span className="brands">
    <span className="mark"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Visa%20Inc.%20logo%20(2021%E2%80%93present).svg" alt="VISA" /></span>
    <span className="mark"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Mastercard-logo.svg" alt="MASTERCARD" /></span>
    <span className="mark"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Apple%20Pay%20logo.svg" alt="APPLE PAY" /></span>
    <span className="mark" style={{ padding: "0 8px" }}><span style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".03em", color: "#15151A" }}>NAPS</span></span>
  </span>;
}

function CardHeading({ children }: { children: ReactNode }) {
  return <div className="card-head"><h2>{children}</h2><div className="rule" /></div>;
}

function SuccessCard({ result }: { result: Extract<PayResult, { status: "success" }> }) {
  return <div className="card" role="status"><CardHeading>Paid</CardHeading><div className="fields">
    <div className="note ok">Payment received</div>
    <div style={{ fontFamily: "Clash Display,Urbanist,sans-serif", fontSize: 28, fontWeight: 600, letterSpacing: "-.03em" }}>{formatMoney(result.amountMinor, getStore().merchant.currency)}</div>
    <div className="note">{result.merchant}</div><div className="note">Reference {result.reference}</div>
  </div></div>;
}

function PaymentForm({ slug, fields, amountMinor, payLabel, unavailable, outcome, editableAmount, initialEmail, initialPhone }: {
  slug: string; fields: CheckoutField[]; amountMinor: number; payLabel: string; unavailable: string | null; outcome?: string;
  editableAmount: boolean; initialEmail: string; initialPhone: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<PayResult | { status: "idle" | "processing" }>({ status: "idle" });
  const [open, setOpen] = useState(false);
  const split = splitPhone(initialPhone, defaultDial(getStore().merchant.country));
  const [phone, setPhone] = useState(split.local);
  const [dial, setDial] = useState(split.dial);
  const [amountText, setAmountText] = useState(() => (amountMinor / 100).toFixed(2));
  const busy = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const currency = getStore().merchant.currency;
  const listedAmount = formatMoney(amountMinor, currency);
  const processing = state.status === "processing";
  const shownFields = unavailable && !processing ? [{ label: "Amount", kind: "price" }] : withRequiredContact(fields);

  function currentAmountMinor(): number {
    if (!editableAmount) return amountMinor;
    return parseMoneyInput(amountText);
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    const charged = currentAmountMinor();
    if (editableAmount) {
      if (charged <= 0) nextErrors.amount = "Enter an amount";
      else if (charged > amountMinor) nextErrors.amount = "Cannot exceed " + listedAmount;
    }
    shownFields.forEach((field, index) => {
      if (field.kind === "price" || /^amount$/i.test(field.label)) return;
      if (field.kind === "phone") {
        if (!phone.trim()) nextErrors[String(index)] = "Enter a phone number";
        return;
      }
      const value = values[String(index)] || (field.kind === "mail" ? initialEmail : "");
      if (field.kind === "mail") {
        if (emailError(value)) nextErrors[String(index)] = emailError(value);
      } else if (!field.optional && !value.trim()) nextErrors[String(index)] = "Enter " + field.label.toLowerCase();
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      if (first === "amount") form.current?.querySelector<HTMLInputElement>("#pay-amount")?.focus();
      else form.current?.querySelector<HTMLInputElement>("#pay-field-" + first)?.focus();
      return false;
    }
    return true;
  }

  function emailValue(): string {
    const mail = shownFields.find(field => field.kind === "mail");
    const index = mail ? shownFields.indexOf(mail) : -1;
    return (index >= 0 ? values[String(index)] : "") || initialEmail;
  }

  function openCheckout() {
    if (busy.current || unavailable) return;
    if (!validate()) return;
    setOpen(true);
  }

  async function pay() {
    if (busy.current || unavailable) return;
    busy.current = true;
    setState({ status: "processing" });
    const result = await submitPayment(slug, emailValue(), sandboxOutcome(outcome || null), currentAmountMinor());
    setState(result);
    busy.current = false;
    if (result.status === "success") setOpen(false);
  }

  function submit(event: FormEvent) { event.preventDefault(); openCheckout(); }
  if (state.status === "success") return <SuccessCard result={state} />;
  const failure = state.status === "declined" || state.status === "timeout" || state.status === "error" ? state : null;
  const charged = currentAmountMinor() || amountMinor;
  const payText = processing ? "Processing…" : payLabel + " " + formatMoney(charged, currency);
  return <>
    <form ref={form} className="card pay-card" noValidate onSubmit={submit} aria-busy={processing}>
      <CardHeading>Payment Details</CardHeading><div className="fields">
        {shownFields.map((field, index) => {
          const amount = field.kind === "price" || /^amount$/i.test(field.label);
          const id = amount ? "pay-amount" : "pay-field-" + index;
          const mailValue = field.kind === "mail" ? (values[String(index)] ?? initialEmail) : (values[String(index)] || "");
          return <div className="field" key={id}>
            <label htmlFor={amount && !editableAmount ? undefined : id}>{field.label || (amount ? "Amount" : "Field")}{(!amount || editableAmount) && (!field.optional || field.kind === "mail" || field.kind === "phone") && <span className="req">*</span>}</label>
            {amount && !editableAmount ? <div className="box locked"><span className="chip">{currency === "QAR" ? "QR" : currency}</span><span>{listedAmount.replace(/^(QR|AED) /, "")}</span></div> : amount ? <div className="box"><span className="chip">{currency === "QAR" ? "QR" : currency}</span><input id={id} inputMode="decimal" value={amountText} disabled={processing} aria-invalid={!!errors.amount} onChange={event => { setAmountText(event.target.value); setErrors(current => ({ ...current, amount: "" })); }} /></div> : field.kind === "phone" ? <div className="box phone-box">
              <select aria-label="Country code" disabled={processing} value={dial} onChange={event => setDial(event.target.value)}>
                {GCC_DIALS.map(row => <option key={row.dial} value={row.dial}>{row.label}</option>)}
              </select>
              <input id={id} type="tel" placeholder="0000 0000" autoComplete="tel" required disabled={processing} value={phone} aria-invalid={!!errors[String(index)]} aria-describedby={errors[String(index)] ? id + "-error" : undefined} onChange={event => {
                setPhone(event.target.value);
                setErrors(current => ({ ...current, [String(index)]: "" }));
              }} />
            </div> : <div className="box"><input id={id} type={field.kind === "mail" ? "email" : "text"} placeholder={field.kind === "mail" ? "name@company.com" : ""} autoComplete={field.kind === "mail" ? "email" : "off"} required={!field.optional || field.kind === "mail"} disabled={processing} value={mailValue} aria-invalid={!!errors[String(index)]} aria-describedby={errors[String(index)] ? id + "-error" : undefined} onChange={event => {
              setValues(current => ({ ...current, [String(index)]: event.target.value }));
              setErrors(current => ({ ...current, [String(index)]: "" }));
            }} /></div>}
            {(errors[String(index)] || (amount && errors.amount)) && <div id={id + "-error"} className="note err" role="alert">{amount ? errors.amount : errors[String(index)]}</div>}
          </div>;
        })}
        {unavailable && !processing && <div className="note">{unavailable}</div>}
        {failure && !open && <div className="note err" role="alert" data-payment-state={failure.status}>{failure.message}</div>}
      </div>
      <div className="foot stacked">
        <CardBrands />
        <span className="secured">Secured by SkipCash · SANDBOX</span>
        {(!unavailable || processing) && <button className="pay" type="button" disabled={processing} onClick={openCheckout}>{payText}</button>}
      </div>
    </form>
    {open && <CheckoutModal
      merchant={getStore().merchant.businessName}
      currency={currency}
      amountMinor={charged}
      phone={(dial + " " + phone).trim()}
      onPhone={value => {
        const next = splitPhone(value, dial);
        setDial(next.dial);
        setPhone(next.local);
      }}
      processing={processing}
      error={failure ? failure.message : null}
      errorState={failure ? failure.status : null}
      onClose={() => { if (!processing) setOpen(false); }}
      onPay={() => { void pay(); }}
    />}
  </>;
}

export default function PayCheckout({ slug, outcome, receipt = false }: { slug: string; outcome?: string; receipt?: boolean }) {
  const revision = useSyncExternalStore(subscribePayStore, getPayRevision, getServerPayRevision);
  useEffect(() => { initializePayStore(); }, []);
  if (!revision) return <div className="note">Loading checkout…</div>;
  const store = getStore();
  const { page, link } = checkoutBySlug(slug);
  const merchant = store.merchant.businessName;
  const email = store.teamMembers.find(member => member.role === "Owner")?.email || "";
  const branding: Branding = page ? { ...page, supportEmail: page.supportEmail || email } : { supportEmail: email, supportPhone: "", terms: !!link, logoDataUrl: null };
  const title = page?.productName || link?.description || "Page not found";
  const description = page?.description || (!link && !page ? "This simulated checkout is not in this browser. Open the link from the same Flow session, or it was created in another profile." : "");
  const amountMinor = page?.amountMinor ?? link?.amountMinor ?? 0;
  const fields = page?.fields.length ? page.fields : defaultFields;
  const unavailable = page ? null : link ? linkUnavailable(link.id) : "No payment is available on this link.";
  const receiptTxn = receipt ? store.transactions.find(txn => txn.id === (link?.txnId || page?.txnIds.at(-1)) && txn.status !== "pending") : undefined;
  return <>
    <div className="grid"><MerchantCopy branding={branding} merchant={merchant} title={title} description={description} />
      {receiptTxn ? <SuccessCard result={{ status: "success", amountMinor: receiptTxn.amountMinor, merchant, reference: txnReference(link?.referenceId, receiptTxn.id) }} /> : <PaymentForm slug={slug} fields={fields} amountMinor={amountMinor} payLabel={page?.payLabel || "Pay"} unavailable={unavailable} outcome={outcome} editableAmount={!!link?.partialPayment} initialEmail={link?.customerEmail || ""} initialPhone={link?.customerPhone || ""} />}
    </div><FlowFooter branding={branding} merchant={merchant} />
  </>;
}

function txnReference(referenceId: string | null | undefined, fallback: string): string {
  return referenceId || fallback;
}
