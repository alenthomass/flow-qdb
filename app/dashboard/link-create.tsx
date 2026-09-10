"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { getStore } from "../../lib/data/store";
import { createPaymentLink } from "../../lib/data/spine";
import { getOutstandingInvoices } from "../../lib/data/selectors";
import type { PaymentLink, PaymentLinkNote } from "../../lib/data/types";
import { dateInputValue, formatMoney, parseMoneyInput } from "../../lib/format";
import { defaultDial, GCC_DIALS } from "../../lib/pay/gcc";
import { publishDashStore } from "../../lib/dashboard/session";
import { Hoverable, sx } from "./chrome";

const field = "width:100%; padding:11px 13px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13.5px; background:var(--panel); color:var(--ink); font-family:inherit";
const label = "font-size:12px; font-weight:600; color:var(--ink-3); margin-bottom:6px";

function Switch({ on, onClick, label: name }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={name} onClick={onClick} style={sx(
      "position:relative; width:42px; height:24px; flex:0 0 42px; border-radius:13px; padding:0; border:1px solid " +
      (on ? "transparent" : "var(--line)") + "; background:" +
      (on ? "linear-gradient(180deg,var(--ink-2),var(--ink-block))" : "var(--toggle-off)")
    )}>
      <span style={sx(
        "position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:#FFFFFF; box-shadow:0 1px 3px rgba(0,0,0,.3); transform:translateX(" +
        (on ? "18px" : "0") + "); transition:transform .28s cubic-bezier(.32,.72,0,1)"
      )} />
    </button>
  );
}

function shareUrl(link: PaymentLink): string {
  if (typeof location !== "undefined" && location.origin) {
    return location.origin + "/pay/" + link.id;
  }
  return link.payUrl || "/pay/" + link.id;
}

export function LinkCreateForm({ onClose }: { onClose: () => void }) {
  const store = getStore();
  const currency = store.merchant.currency;
  const chip = currency === "QAR" ? "QR" : currency;
  const clients = store.clients;
  const invoices = getOutstandingInvoices();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [dial, setDial] = useState(defaultDial(store.merchant.country));
  const [phone, setPhone] = useState("");
  const [notifySms, setNotifySms] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [noExpiry, setNoExpiry] = useState(true);
  const [expiry, setExpiry] = useState(dateInputValue(14));
  const [partialPayment, setPartialPayment] = useState(false);
  const [notes, setNotes] = useState<PaymentLinkNote[]>([{ key: "", value: "" }]);
  const [clientId, setClientId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState<PaymentLink | null>(null);

  const amountMinor = parseMoneyInput(amount);
  const canSubmit = amountMinor > 0 && !busy;

  const url = useMemo(() => (created ? shareUrl(created) : ""), [created]);
  const waHref = "https://wa.me/?text=" + encodeURIComponent("Pay " + (created ? formatMoney(created.amountMinor, currency) : "") + " — " + url);
  const mailHref = "mailto:" + encodeURIComponent(email) + "?subject=" + encodeURIComponent("Payment request from " + store.merchant.businessName) + "&body=" + encodeURIComponent("Please pay using this Flow link:\n\n" + url);

  function setNote(index: number, patch: Partial<PaymentLinkNote>) {
    setNotes(current => current.map((note, i) => i === index ? { ...note, ...patch } : note));
  }

  function onInvoice(id: string) {
    setInvoiceId(id);
    const invoice = invoices.find(row => row.id === id);
    if (!invoice) return;
    setAmount((invoice.amountMinor / 100).toFixed(2));
    setClientId(invoice.clientId);
    setReferenceId(invoice.number);
  }

  function onClient(id: string) {
    setClientId(id);
    const client = clients.find(row => row.id === id);
    if (client?.email && !email) setEmail(client.email);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError("");
    try {
      const link = await createPaymentLink({
        amountMinor,
        description: description.trim(),
        clientId: clientId || null,
        invoiceId: invoiceId || null,
        expiry: noExpiry ? "-" : expiry,
        customerEmail: email.trim() || null,
        notifyEmail: notifyEmail && !!email.trim(),
        customerPhone: phone.trim() ? dial + " " + phone.trim() : null,
        phoneDial: dial,
        notifySms: notifySms && !!phone.trim(),
        referenceId: referenceId.trim() || null,
        partialPayment,
        notes
      });
      publishDashStore();
      setCreated(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create payment link");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (created) {
    return (
      <div style={sx("display:flex; flex-direction:column; gap:16px")}>
        <div>
          <div style={sx("font-size:13px; font-weight:650")}>Link ready to share</div>
          <div style={sx("font-size:12.5px; color:var(--ink-4); margin-top:4px")}>{formatMoney(created.amountMinor, currency)}{created.description ? " · " + created.description : ""}</div>
        </div>
        <div style={sx("display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:10px; padding:4px 4px 4px 12px; background:var(--surface)")}>
          <div style={sx("flex:1; min-width:0; font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap")}>{url}</div>
          <button type="button" onClick={() => { void copy(); }} style={sx("flex:0 0 auto; font-size:12.5px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); padding:8px 12px; border-radius:8px")}>{copied ? "Copied" : "Copy"}</button>
        </div>
        <div>
          <div style={sx(label)}>Share</div>
          <div style={sx("display:flex; gap:8px; flex-wrap:wrap")}>
            <a href={waHref} target="_blank" rel="noopener noreferrer" style={sx("font-size:12.5px; font-weight:600; padding:9px 14px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink); text-decoration:none")}>WhatsApp</a>
            <a href={mailHref} style={sx("font-size:12.5px; font-weight:600; padding:9px 14px; border-radius:9px; border:1px solid var(--line); background:var(--btn-light); color:var(--ink); text-decoration:none")}>Email</a>
          </div>
        </div>
        <button type="button" onClick={onClose} style={sx("font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:10px 20px; border-radius:9px")}>Done</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={sx("display:flex; flex-direction:column; gap:16px")} noValidate>
      <label style={sx("display:block")}>
        <div style={sx(label)}>Amount<span style={sx("color:var(--neg)")}> *</span></div>
        <div style={sx("display:flex; align-items:center; border:1px solid var(--line); border-radius:10px; overflow:hidden; background:var(--panel)")}>
          <span style={sx("padding:11px 12px; font-size:12.5px; font-weight:700; color:var(--ink-3); background:var(--chip); border-right:1px solid var(--divider)")}>{chip}</span>
          <input style={sx("flex:1; min-width:0; border:none; outline:none; background:transparent; padding:11px 13px; font-size:13.5px; font-family:inherit")} inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" aria-required="true" />
        </div>
      </label>

      <label style={sx("display:block")}>
        <div style={sx(label)}>Payment For</div>
        <input style={sx(field)} value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this for?" />
      </label>

      <div>
        <div style={sx("font-size:12px; font-weight:650; color:var(--ink-2); margin-bottom:10px")}>Customer Details</div>
        <div style={sx("display:flex; flex-direction:column; gap:12px")}>
          <label style={sx("display:block")}>
            <div style={sx(label)}>Email</div>
            <input style={sx(field)} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" />
          </label>
          <label style={sx("display:flex; align-items:center; gap:10px; font-size:12.5px; color:var(--ink-2)")}>
            <input type="checkbox" checked={notifyEmail} disabled={!email.trim()} onChange={e => setNotifyEmail(e.target.checked)} />
            Notify via Email
          </label>
          <label style={sx("display:block")}>
            <div style={sx(label)}>Phone</div>
            <div style={sx("display:flex; gap:8px")}>
              <select aria-label="Country code" style={sx("width:118px; padding:11px 8px; border:1px solid var(--line); border-radius:10px; outline:none; font-size:13px; background:var(--panel)")} value={dial} onChange={e => setDial(e.target.value)}>
                {GCC_DIALS.map(row => <option key={row.dial} value={row.dial}>{row.label}</option>)}
              </select>
              <input style={sx(field)} type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0000 0000" />
            </div>
          </label>
          <label style={sx("display:flex; align-items:center; gap:10px; font-size:12.5px; color:var(--ink-2)")}>
            <input type="checkbox" checked={notifySms} disabled={!phone.trim()} onChange={e => setNotifySms(e.target.checked)} />
            Notify via SMS
          </label>
        </div>
      </div>

      <label style={sx("display:block")}>
        <div style={sx(label)}>Reference ID</div>
        <input style={sx(field)} value={referenceId} onChange={e => setReferenceId(e.target.value)} placeholder="Invoice or job number" />
        <div style={sx("font-size:11.5px; color:var(--ink-4); margin-top:5px")}>Used for matching. An invoice number (e.g. INV-0144) links this payment automatically.</div>
      </label>

      <div>
        <div style={sx(label)}>Link Expiry</div>
        <label style={sx("display:flex; align-items:center; gap:10px; font-size:12.5px; color:var(--ink-2); margin-bottom:8px")}>
          <input type="checkbox" checked={noExpiry} onChange={e => setNoExpiry(e.target.checked)} />
          No Expiry
        </label>
        {!noExpiry && <input style={sx(field)} type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />}
      </div>

      <div style={sx("display:flex; align-items:center; gap:12px")}>
        <div style={sx("flex:1")}>
          <div style={sx("font-size:13px; font-weight:600")}>Partial Payment</div>
          <div style={sx("font-size:12px; color:var(--ink-4); margin-top:2px")}>Allow the customer to pay less than the full amount</div>
        </div>
        <Switch on={partialPayment} onClick={() => setPartialPayment(v => !v)} label="Partial Payment" />
      </div>

      <div>
        <div style={sx(label)}>Notes</div>
        <div style={sx("display:flex; flex-direction:column; gap:8px")}>
          {notes.map((note, index) => (
            <div key={index} style={sx("display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr) 32px; gap:8px")}>
              <input style={sx(field)} value={note.key} onChange={e => setNote(index, { key: e.target.value })} placeholder="Key" />
              <input style={sx(field)} value={note.value} onChange={e => setNote(index, { value: e.target.value })} placeholder="Value" />
              <Hoverable as="button" type="button" aria-label="Remove note" onClick={() => setNotes(current => current.length === 1 ? [{ key: "", value: "" }] : current.filter((_, i) => i !== index))} style={sx("border-radius:9px; border:1px solid var(--line); color:var(--ink-4)")}>×</Hoverable>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setNotes(current => current.concat({ key: "", value: "" }))} style={sx("margin-top:8px; font-size:12.5px; font-weight:600; color:var(--ink-2)")}>Add note</button>
      </div>

      <label style={sx("display:block")}>
        <div style={sx(label)}>Client (optional)</div>
        <select style={sx(field)} value={clientId} onChange={e => onClient(e.target.value)}>
          <option value="">None</option>
          {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
        </select>
      </label>
      <label style={sx("display:block")}>
        <div style={sx(label)}>Invoice (optional)</div>
        <select style={sx(field)} value={invoiceId} onChange={e => onInvoice(e.target.value)}>
          <option value="">None</option>
          {invoices.map(invoice => {
            const name = clients.find(client => client.id === invoice.clientId)?.name || "";
            return <option key={invoice.id} value={invoice.id}>{invoice.number} · {name} · {formatMoney(invoice.amountMinor, currency, { trimWhole: true })}</option>;
          })}
        </select>
      </label>

      {error && <div role="alert" style={sx("font-size:12.5px; color:var(--neg)")}>{error}</div>}

      <button type="submit" disabled={!canSubmit} style={sx(
        "font-size:13px; font-weight:650; color:var(--on-accent); background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 6px 16px var(--accent-shadow); padding:11px 20px; border-radius:9px; opacity:" +
        (canSubmit ? "1" : ".45") + "; cursor:" + (canSubmit ? "pointer" : "default")
      )}>{busy ? "Creating…" : "Create Payment Link"}</button>
    </form>
  );
}
