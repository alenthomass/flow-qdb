# Interaction inventory

Walk of the React dashboard (`/` → `app/dashboard/view.tsx` + `lib/dashboard/component.js`). No silent no-ops: every control either mutates, navigates, shows an explicit empty/sample state, or toasts why it did not do the labelled work.

**Method.** Static walk of `dests()` routes, chrome, modals and detail panes. Behaviour is classified from the bound handler and the spine it calls. Not a live click of every control, and not a browser pass.

**Source of truth.** `lib/data/seed.ts` via `dashboardState()`. Money is integer fils through `formatMoney`. Invoice status is derived. Recurring schedules, approval requests and extra bank connections are not in the seed.

---

## Demo-critical

| Location | Control | Behaviour | Notes |
| --- | --- | --- | --- |
| Home | Greeting + Needs Your Attention Confirm / Reject | **works** | Confirm/reject mutates the match queue, match rate and derived invoice status. Zero state: “You're all caught up”. |
| Home | Matching Status Review | **works** (hidden when 0 open) | Opens Match My Payments. Footer copy follows open count. |
| Home | Matching Status % / N of 12 / progress bar | **works** (display) | Live `getMatchRate()`. |
| Home | Quick Actions: Send Payment Link | **works** (modal) | `createPaymentLink` → shareable `/pay/{id}` URL. |
| Home | Quick Actions: Scan Bill | **works** (modal) | Sample bills extract after a gated delay. Save appends an outflow through the store. Barzan is labelled simulated. |
| Home | Quick Actions: Log Expense | **works** (modal) | Appends an outflow; Home Net / Reports P&L recompute. |
| Home | Quick Actions: Create Invoice | **works** (modal) | `createInvoice`. Due date required (default today+14). Who owes me / Outstanding follow the new row. |
| Home | Payment link / New invoice (header) | **works** | Same modals. |
| Home | 24h / 7 days / 30 days | **works** | Home period only. Reports keep their own 30-day window. |
| Home | Recent Activity row / View all | **works** | Detail / All Transactions. |
| Get Paid → Payment Links | New link | **works** | Store + `/pay` URL. Seed has 4 paid links. |
| Get Paid → Payment Links | Copy | **works** (clipboard when available) | Falls back to a toast if clipboard is missing. |
| Get Paid → Payment Links | Simulate payment | **works** | Gateway outcomes; settle lifts Money In. |
| Get Paid → Payment Links | Deactivate | **works** | Status Deactivated. |
| Get Paid → Payment Page | Publish | **works** | `/pay/{slug}`. Empty title → “Page title is required”. |
| Get Paid → Subscriptions | New plan | **works** | Plan, optional subscriber, upcoming charge. Simulated billing appends pending then settle. |
| Get Paid → Subscriptions | Pause / Cancel | **works** | Spine; cancel stops upcoming charges. |
| Get Paid → Payment Setup | Sandbox / Live | **works** (local flag) | Live copy: “Live mode is still simulated…”. |
| Get Paid → Payment Setup | Send a test payment | **toast only** | “Sandbox test payment of QR 1.00 sent” — no ledger row. Explicit sandbox toast, not a silent no-op. |
| Get Paid overview | Smart Checkout | **works** | Persists `setSmartCheckout`. Analytics are labelled sample. |
| Get Paid → Shopify Store | Connect | **works** | Starts disconnected. Simulated OAuth; new sample order tagged `shopify`. Seed Shopify rows are not rewritten. |
| Get Paid → Connect Your Bank | Connect sample bank | **works** | Labelled sample; opening QR 0 so cash on hand does not change. |
| Money In & Out → All Transactions | Filters, row open | **works** | Export is toast (“CSV is sample-only”). |
| Money In & Out → Match My Payments | Review / Confirm / Reject / Undo | **works** | Same queue as Home. |
| Money In & Out → Scan a Bill | Sample + save | **works** | File input starts the same extract path. |
| Money In & Out → Bank Activity | Display | **works** | Cash on hand = opening + non-pending signed. Caption “Cash on hand”. |
| Invoices → New Invoice | Create / Draft | **works** | Store invoices; status derived. |
| Invoices → All Invoices | Row, New invoice | **works** | Duplicate creates a draft with due +14. |
| Invoices → Reminders | Remind | **works** | Toast includes the client name. List is sent/viewed/overdue/awaiting settlement only. |
| Invoices → Recurring | Start schedule / Send now / Pause / Cancel | **works** | Seed starts empty. Create needs client + amount. Next three offsets come from the running row. |
| Invoices → Clients | Cards | **works** | Lifetime totals from invoices. |
| Sync to Books → Tally Export | Export XML | **works** | Downloads XML for the bound From/To range. History is stored. Pending rows omitted. |
| Sync to Books → Zoho Sync | Sync now | **works** | Labelled simulated push; history row. |
| Reports → Am I making money? | P&L + stat cards | **works** (display) | Independent 30-day period; net equals Home month net (`getNet`). |
| Reports → Who owes me? | Ageing + rows | **works** (display) | Equals Outstanding. |
| Reports → Who owes me? | Chase all overdue | **toast only** | “Reminders queued for overdue invoices”. |
| Reports → What do I hand my accountant? | Download pack | **toast only** | No ZIP in this phase. Tally XML is the file export. |
| Settings → Account | Reset demo data | **works** | Confirm modal; restores seed; keeps Tally From/To. |

---

## Secondary

| Location | Control | Behaviour | Notes |
| --- | --- | --- | --- |
| Chrome | Sidebar, hubs, tabs, back | **works** | Route/tab only. |
| Chrome | Search | **works** | In-app list. |
| Chrome | Theme toggle | **works** | `localStorage` `flow-theme`. Light/dark pixels not checked in a browser. |
| Chrome | Account menu | **works** | Jumps to Settings tabs. Sign out toasts and stays in the sandbox. |
| Chrome | SANDBOX pill | **works** | Tooltip: simulated gateway, CR pending. |
| Get Paid → Payment Setup | Accent / other gateway CTAs | **works** / **toast** | Coming-soon gateways toast “not available in Phase 1”. |
| Get Paid → Payment Page | Builder fields, receipts, page settings | **works** (local page model) | Logo upload toasts sample-only. |
| Invoices → Reminders | Schedule toggles | **works** (local) | Prefs only; send uses the invoice list. |
| Team → Members | Invite, edit | **works** (local team row) | Invite is not a seed member; next `applyStore` restores ledger team. |
| Team → Permissions | Role matrix | **works** | `setRolePermission` persists. Empty seed uses the default 7-row template. |
| Team → Approvals | Limit inputs / Approve / Decline | **works** | Limits persist. Owner is “No limit”. Pending list starts empty. |
| Team → Activity | Kind filters | **works** | From `activityLog`. |
| Payroll → Employees | Add / edit | **works** (local) | Same applyStore caveat as Members. |
| Payroll → Payslips | Post to Transactions | **works** | Blocks a second post for August 2026. Generate payslips is toast-only (no slip files). |
| Payroll → Deductions | WHT / royalty fields | **works** (local rates) | No VAT field. |
| Settings → Account | Name, email, password, notifications, Save | **works** (local) | Password is sandbox theatre. |
| Settings → Tags | Rename / Remove | **works** | Rename rewrites ledger tags. Remove fails with a toast if any txn still uses the tag. |
| Settings → Security | 2FA / biometric | **works** (local) | Sign out session / Roll keys toast. |
| Settings → Billing | Downgrade / Upgrade / Contact sales | **toast only** | Sample-only notes. |
| Settings → Profile | Fields + Save | **toast; fields display-only** | Inputs are `value` from the merchant profile with no `onChange`. Save toasts “Changes saved”. Explicit, not silent. |
| Connected Apps | Manage | **works** | Navigates to the matching setup tab. |
| Reports → Spend / Cash / Branches | Lists and runway | **works** (display) | |
| Modals | Cancel / backdrop | **works** | Help / page settings / receipts close without a second persist path. |

---

## Cosmetic

| Location | Control | Behaviour |
| --- | --- | --- |
| Home | Matching Status check icon, attention badge | Display; badge hidden at zero. |
| Reports | Saved reports empty, ageing QR 0 colour | Empty state is copy-only. Zero buckets use default ink. |
| Header | Logo → Home | Works. |
| Help modal / toasts | Works | Auto-dismiss ~2.6s. |

---

## Toast-only or display-only (labelled)

These have a click target. None pretend to have finished the labelled side effect without saying so.

| Location | Control | What the user sees |
| --- | --- | --- |
| Payment Setup / gateway detail | Send a test payment | Sandbox toast, no txn |
| Payment page | Share, Logo Upload | Sample-only toast |
| All Transactions / Activity / Accountant pack / Payslips | Export / Download pack / Generate | Sample-only or queued toast |
| Reports | Turn on monthly send, Chase all overdue | Toast |
| Invoice list | Send reminders (bulk) | “Reminders queued…” |
| Zoho / gateway | Disconnect | Sample-only toast |
| Settings | Profile Save, session Sign out, Roll keys, billing CTAs | Toast; profile fields do not edit the merchant record |
| Header | Sign out | Stays signed in |
| Employee detail | Payslip Download | “Download queued” |

**Unbound display (not silent: they are read-only values)**

| Location | Control |
| --- | --- |
| Settings → Profile | Business name, legal entity, tax registration, industry, address, currency |
| Tax tab | Not registered copy; no Peppol, no VAT rate editor |
| Accountant pack | Period / format inputs |

**Legitimate empty (nothing in the seed)**

| Location | Why empty |
| --- | --- |
| Recurring “Running now” / next three | No schedules stored until Start schedule |
| Team approvals “Waiting on you” | No approval requests in the seed |
| Subscription plans | Not in the seed |
| Saved reports | Packs not in the seed |
| Checkout pages | Not in the seed |
| Needs Your Attention | Empty after every confirm |

---

## Simulated surfaces

Every simulated path is labelled in the UI:

- SANDBOX chip + tooltip (gateway, Qatar CR pending)
- SkipCash / bank / Zoho / Shopify “Simulated” or “Simulated connection”
- Smart Checkout sample analytics note
- Sample bank copy (“Sample data. Live bank feeds…”)
- Shopify “Simulated OAuth”
- Live mode note: still simulated
- Help modal: “Simulated: SkipCash, Ahli Bank, Zoho Books, Shopify”
- Coming soon gateways stay “Coming soon”

---

## Invariants (runtime)

`assertPhase1Invariants()` runs from `dashboardState()` and after every store `persist()`:

- Home 30-day Net = Reports net profit
- Who owes me = Outstanding
- Hub “N unpaid” = Outstanding count
- matched + open = total
- Payroll net = linked ledger row
- Cash on hand = opening + non-pending signed movement
- Invoice status vs linked transactions

No VAT / Peppol strings in `app/dashboard` or `app/pay` sources.

---

## Route map

| Section | Tabs |
| --- | --- |
| Home | (single) |
| Get Paid | Overview, Payment Links, Payment Page, Subscriptions, Payment Setup, Connect Your Bank, Shopify Store |
| Money In & Out | Overview, All Transactions, Match My Payments, Scan a Bill, Bank Activity |
| Invoices | Overview, All Invoices, New Invoice, Reminders, Recurring, Clients |
| Sync to Books | Tally Export, Zoho Sync, Tax |
| Connected Apps | Payment Gateways, Banks, Accounting & Platforms |
| Reports | P&L, Spend, Cash, Who owes me, Branches, Accountant pack |
| Your Team | Members, Approval Limits, Permissions, Activity |
| Payroll | Payslips, Employees, Deductions |
| Settings | Business Profile, Account, Manage Tags, Billing, Security |

---

## Could not verify

- Light and dark appearance in a real browser
- Clipboard write in a real browser
- Cross-tab store updates (focus/storage listeners are out of scope)
