"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent, ReactNode } from "react";
import { getStore } from "../../lib/data/store";
import type { CheckoutField, CheckoutPage, PaymentLink } from "../../lib/data/types";
import { formatMoney, parseMoneyInput } from "../../lib/format";
import { defaultDial, GCC_DIALS } from "../../lib/pay/gcc";
import {
  checkoutBySlug, emailError, getPayRevision, getServerPayRevision,
  initializePayStore, linkUnavailable, sandboxOutcome, submitPayment, subscribePayStore
} from "../../lib/pay/session";
import { checkoutPageUnavailable } from "../../lib/data/spine";
import type { PayResult } from "../../lib/pay/session";
import { CheckoutModal } from "./checkout-modal";

function splitPhone(raw: string, countryDial: string): { dial: string; local: string } {
  const trimmed = String(raw || "").trim();
  const hit = GCC_DIALS.find(row => trimmed.startsWith(row.dial));
  if (hit) return { dial: hit.dial, local: trimmed.slice(hit.dial.length).trim() };
  return { dial: countryDial, local: trimmed };
}

type Branding = Pick<CheckoutPage, "supportEmail" | "supportPhone" | "logoDataUrl">;
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
  return <div className="block"><h2>Share this on:</h2><div className="share">
    <a aria-label="Share on WhatsApp" href={"https://wa.me/?text=" + text + "%20" + url} target="_blank" rel="noopener noreferrer"><Icon path="M3.4 16.6l.9-3.2a6.2 6.2 0 1 1 2.4 2.3l-3.3.9ZM7.6 7.4c.3-.1.6 0 .8.3l.7 1.2c.1.3.1.6-.1.8l-.5.5a4.6 4.6 0 0 0 2.3 2.3l.5-.5c.2-.2.5-.2.8-.1l1.2.7c.3.2.4.5.3.8" /></a>
    <a aria-label="Share on Facebook" href={"https://www.facebook.com/sharer/sharer.php?u=" + url} target="_blank" rel="noopener noreferrer"><Icon path="M12.4 6.4H14V3.6h-2.2a3.2 3.2 0 0 0-3.2 3.2v1.8H6.8v2.9h1.8v6.9h3v-6.9h2.2l.4-2.9h-2.6V7.2c0-.5.3-.8.8-.8Z" /></a>
    <a aria-label="Share on X" href={"https://twitter.com/intent/tweet?url=" + url + "&text=" + text} target="_blank" rel="noopener noreferrer"><Icon path="M3.6 3.6h3.6l4 5.4 4.4-5.4h1.6l-5.2 6.4 5.6 7.4h-3.6l-4.2-5.6-4.6 5.6H3.6l5.4-6.6L3.6 3.6Z" /></a>
    <a aria-label="Share by email" href={"mailto:?subject=" + text + "&body=" + url}><Icon path="M3 6.2h14v7.6H3V6.2Zm0 .4 7 4.6 7-4.6" /></a>
  </div></div>;
}

function MerchantCopy({ branding, merchant, title, description }: { branding: Branding; merchant: string; title: string; description: string }) {
  return <div className="copy">
    <div className="copy-inner">
    <div className="brand"><span className="logo">{branding.logoDataUrl ? <img src={branding.logoDataUrl} alt="" /> : "Logo"}</span><div className="biz">{merchant}</div></div>
    <h1>{title}</h1>
    <div className="rule" />
    {description && <div className="desc">{description}</div>}
    <div className="meta"><ShareButtons />
      {(branding.supportEmail || branding.supportPhone) && <div className="block"><h2>Contact Us:</h2><div className="contact">
        {branding.supportEmail && <a className="contact-row" href={"mailto:" + branding.supportEmail}><Icon contact path="M3 6.2h14v7.6H3V6.2Zm0 .4 7 4.6 7-4.6" /><span>{branding.supportEmail}</span></a>}
        {branding.supportPhone && <a className="contact-row" href={"tel:" + branding.supportPhone.replace(/\s+/g, "")}><Icon contact path="M6.2 3.4h2.2l1.1 2.8-1.5 1.1a8.4 8.4 0 0 0 3.7 3.7l1.1-1.5 2.8 1.1v2.2a1.4 1.4 0 0 1-1.5 1.4A11.6 11.6 0 0 1 4.8 4.9a1.4 1.4 0 0 1 1.4-1.5Z" /><span>{branding.supportPhone}</span></a>}
      </div></div>}
      <div className="block"><h2>Terms & Conditions</h2>
        <p className="terms">You agree to share information entered on this page with {merchant} (owner of this page) and Flow, in line with applicable law.</p>
      </div>
    </div>
    </div>
  </div>;
}

function FlowFooter({ email }: { email: string }) {
  const reportHref = email
    ? "mailto:" + email + "?subject=" + encodeURIComponent("Report this payment page")
    : "mailto:?subject=" + encodeURIComponent("Report this payment page");
  return <div className="copy-foot">
    <div className="copy-inner">
    <div className="flow">
      <div className="flow-mark"><svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 4.5h10M3 8h6.5M3 11.5h4" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" /></svg><span>Flow</span></div>
      <p>Want to create a page like this? <span style={{ color: "var(--accent)", fontWeight: 600 }}>Get started with Flow Payment Pages</span></p>
      <a className="report" href={reportHref}>Report Page</a>
    </div>
    </div>
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

function SuccessCard({ result, email, phone, receiptAuto, showCustomer, showRef = true }: {
  result: Extract<PayResult, { status: "success" }>;
  email?: string;
  phone?: string;
  receiptAuto?: boolean;
  showCustomer?: boolean;
  showRef?: boolean;
}) {
  const contact = [email, phone].filter(Boolean).join(" · ");
  return <div className="card paid-card" role="status">
    <div className="paid-hero">
      <span className="paid-check" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 10.6 8.3 14 15.2 6.6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2>Paid</h2>
      <div className="rule" />
      <div className="note ok">Payment received</div>
      <div className="paid-amt">{formatMoney(result.amountMinor, getStore().merchant.currency)}</div>
    </div>
    <div className="paid-meta">
      <div className="paid-row"><span className="paid-k">Merchant</span><span className="paid-v">{result.merchant}</span></div>
      {showCustomer && contact ? <div className="paid-row"><span className="paid-k">Payer</span><span className="paid-v">{contact}</span></div> : null}
      {showRef ? <div className="paid-row"><span className="paid-k">{"Reference "}</span><span className="paid-v paid-ref">{result.reference}</span></div> : null}
      {receiptAuto && email ? <div className="paid-receipt">A receipt was sent to {email}</div> : null}
    </div>
    <div className="paid-foot">Secured by Flow · SkipCash · SANDBOX</div>
  </div>;
}

function linkPayerEmail(link: PaymentLink): string {
  if (link.customerEmail) return link.customerEmail;
  const store = getStore();
  const client = link.clientId ? store.clients.find(row => row.id === link.clientId) : undefined;
  if (client?.email) return client.email;
  return store.teamMembers.find(member => member.role === "Owner")?.email || "";
}

function LinkPay({ slug, link, outcome, receiptTxn, merchant }: {
  slug: string;
  link: PaymentLink;
  outcome?: string;
  receiptTxn?: { amountMinor: number; id: string };
  merchant: string;
}) {
  const blocked = linkUnavailable(link.id);
  const currency = getStore().merchant.currency;
  const [state, setState] = useState<PayResult | { status: "idle" | "processing" }>({ status: "idle" });
  const [open, setOpen] = useState(() => !blocked && !receiptTxn);
  const split = splitPhone(link.customerPhone || "", defaultDial(getStore().merchant.country));
  const [phone, setPhone] = useState(split.local);
  const [dial, setDial] = useState(split.dial);
  const [amountText, setAmountText] = useState(() => (link.amountMinor / 100).toFixed(2));
  const busy = useRef(false);
  const processing = state.status === "processing";
  // simulatePayment marks the link pending before settlement. Keep the gateway
  // up for this payer instead of treating that as "already used".
  const unavailable = state.status === "idle" ? blocked : null;
  const charged = link.partialPayment ? (parseMoneyInput(amountText) || link.amountMinor) : link.amountMinor;
  const failure = state.status === "declined" || state.status === "timeout" || state.status === "error" ? state : null;
  const email = linkPayerEmail(link);

  async function pay() {
    if (busy.current || unavailable) return;
    if (link.partialPayment && charged <= 0) {
      setState({ status: "error", message: "Enter an amount" });
      return;
    }
    if (link.partialPayment && charged > link.amountMinor) {
      setState({ status: "error", message: "Cannot exceed " + formatMoney(link.amountMinor, currency) });
      return;
    }
    if (emailError(email)) {
      setState({ status: "error", message: emailError(email) });
      return;
    }
    busy.current = true;
    setState({ status: "processing" });
    const result = await submitPayment(slug, email, sandboxOutcome(outcome || null), charged);
    setState(result);
    busy.current = false;
    if (result.status === "success") setOpen(false);
  }

  if (receiptTxn || state.status === "success") {
    const result = state.status === "success"
      ? state
      : { status: "success" as const, amountMinor: receiptTxn!.amountMinor, merchant, reference: txnReference(link.referenceId, receiptTxn!.id) };
    return <div className="link-pay"><SuccessCard result={result} email={email} phone={(dial + " " + phone).trim()} showRef={true} /></div>;
  }

  return <div className="link-pay">
    {unavailable ? <div className="card"><div className="fields"><div className="note">{unavailable}</div></div></div> : null}
    {!unavailable && !open ? <div className="card pay-card">
      <CardHeading>Pay</CardHeading>
      <div className="fields">
        {link.partialPayment ? <div className="field">
          <label htmlFor="pay-amount">Amount<span className="req">*</span></label>
          <div className="box"><span className="chip">{currency === "QAR" ? "QR" : currency}</span>
            <input id="pay-amount" inputMode="decimal" value={amountText} onChange={event => setAmountText(event.target.value)} />
          </div>
        </div> : <div className="note">{formatMoney(link.amountMinor, currency)}{link.description ? " · " + link.description : ""}</div>}
        {failure && <div className="note err" role="alert" data-payment-state={failure.status}>{failure.message}</div>}
      </div>
      <div className="foot stacked">
        <button className="pay" type="button" onClick={() => setOpen(true)}>{"Pay " + formatMoney(charged, currency)}</button>
      </div>
    </div> : null}
    {open && !unavailable && <CheckoutModal
      merchant={merchant}
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
  </div>;
}

function PaymentForm({ slug, fields, amountMinor, payLabel, unavailable, outcome, editableAmount, initialEmail, initialPhone, afterPay, redirectUrl, receiptAuto, receiptCustomer, receiptRef }: {
  slug: string; fields: CheckoutField[]; amountMinor: number; payLabel: string; unavailable: string | null; outcome?: string;
  editableAmount: boolean; initialEmail: string; initialPhone: string;
  afterPay?: "message" | "redirect"; redirectUrl?: string; receiptAuto?: boolean; receiptCustomer?: boolean; receiptRef?: boolean;
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
    if (result.status === "success") {
      setOpen(false);
      const href = String(redirectUrl || "").trim();
      if (afterPay === "redirect" && /^https?:\/\//i.test(href)) window.location.assign(href);
    }
  }

  function submit(event: FormEvent) { event.preventDefault(); openCheckout(); }
  if (state.status === "success") return <SuccessCard result={state} email={emailValue()} phone={(dial + " " + phone).trim()} receiptAuto={receiptAuto} showCustomer={receiptCustomer} showRef={receiptRef !== false} />;
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
  const { page, link } = revision ? checkoutBySlug(slug) : { page: undefined, link: undefined };
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!revision) return;
    const dark = page?.theme === "dark";
    const shell = document.querySelector(".shell");
    if (dark) {
      document.documentElement.setAttribute("data-pay-theme", "dark");
      shell?.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-pay-theme");
      shell?.removeAttribute("data-theme");
    }
    return () => {
      document.documentElement.removeAttribute("data-pay-theme");
      shell?.removeAttribute("data-theme");
    };
  }, [revision, page?.theme]);
  if (!revision) return <div className="note">Loading checkout…</div>;
  const store = getStore();
  const merchant = store.merchant.businessName;
  const email = store.teamMembers.find(member => member.role === "Owner")?.email || "";
  const branding: Branding = page ? { ...page, supportEmail: page.supportEmail || email } : { supportEmail: email, supportPhone: "", logoDataUrl: null };
  const title = page?.productName || link?.description || "Page not found";
  const description = page?.description || (!link && !page ? "This simulated checkout is not in this browser. Open the link from the same Flow session, or it was created in another profile." : "");
  const amountMinor = page?.amountMinor ?? link?.amountMinor ?? 0;
  const fields = page?.fields.length ? page.fields : defaultFields;
  const unavailable = page ? checkoutPageUnavailable(page) : link ? linkUnavailable(link.id) : "No payment is available on this link.";
  const receiptTxn = receipt ? store.transactions.find(txn => txn.id === (link?.txnId || page?.txnIds.at(-1)) && txn.status !== "pending") : undefined;
  const receiptProps = {
    receiptAuto: page ? page.receiptAuto !== false : false,
    showCustomer: !!page?.receiptCustomer,
    showRef: page ? !!page.receiptRef : true
  };
  if (link && !page) {
    return <LinkPay slug={slug} link={link} outcome={outcome} receiptTxn={receiptTxn} merchant={merchant} />;
  }
  return <div className="grid">
    <MerchantCopy branding={branding} merchant={merchant} title={title} description={description} />
    <div className="pay-col">
      {receiptTxn ? <SuccessCard result={{ status: "success", amountMinor: receiptTxn.amountMinor, merchant, reference: txnReference(link?.referenceId, receiptTxn.id) }} {...receiptProps} /> : <PaymentForm slug={slug} fields={fields} amountMinor={amountMinor} payLabel={page?.payLabel || "Pay"} unavailable={unavailable} outcome={outcome} editableAmount={!!link?.partialPayment} initialEmail={link?.customerEmail || ""} initialPhone={link?.customerPhone || ""} afterPay={page?.afterPay} redirectUrl={page?.redirectUrl} receiptAuto={receiptProps.receiptAuto} receiptCustomer={receiptProps.showCustomer} receiptRef={receiptProps.showRef} />}
    </div>
    <FlowFooter email={branding.supportEmail} />
  </div>;
}

function txnReference(referenceId: string | null | undefined, fallback: string): string {
  return referenceId || fallback;
}
