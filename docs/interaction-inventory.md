# Interaction inventory

Stage 0 audit of the live dashboard (`/` → `public/flow.dc.html`). No fix code in this stage.

**Method.** Static walk of every `dests()` route and sub-tab, plus chrome (sidebar, header, search, modals, detail panes). Behaviour is classified from the bound handler, not from a live click of every control. Toast-only handlers are recorded as **dead (toast only)** — they have a click handler, but they do not do the work a user would reasonably expect.

**AGENTS.md.** Not present in this repo at audit time. Data rules used from the running project: seed/selectors are source of truth; Home Net must equal Reports net profit; Who owes me must equal Outstanding; do not invent seed figures.

**Seed lists that start empty.** Payment links, subscription plans, payment-page analytics, saved report packs. Creating a link or plan appends local UI state only; it does not go through a gateway or update the ledger.

---

## Demo-critical

Controls on the core demo path (pay → ledger → match → books) or Beat 1 screens later stages must make real.

| Location | Control | Behaviour | Expected |
| --- | --- | --- | --- |
| Home | Greeting + Needs Your Attention Confirm / Reject | **works** | Confirm/reject mutates match queue, match rate, invoice derived status. Zero state: “You're all caught up”. |
| Home | Matching Status Review | **works** (hidden when 0 open) | Opens Match My Payments. Footer “Everything is matched” / “1 still needs a look” / “N still need a look”. |
| Home | Matching Status % / N of 12 / progress bar | **works** (display) | Live match rate; bar eases after confirm/reject. |
| Home | Quick Actions: Send Payment Link | **works** (modal) | Opens New payment link modal. Submit appends a local `links` row; **does not** call a gateway, mint a URL, or write a ledger row. |
| Home | Quick Actions: Scan Bill | **works** (modal) | Opens Scan a bill modal. “Use a sample bill” fills canned fields instantly. Save appends a local txn; **does not** wait, extract from a file, or recompute selectors. |
| Home | Quick Actions: Log Expense | **works** (modal) | Appends a local txn; date hardcoded “9 Aug”; **does not** flow through `lib/data` selectors, so Home Net / Reports P&L stay on seed. |
| Home | Quick Actions: Create Invoice | **works** (modal) | Creates a draft invoice in local state; Who owes me / Outstanding stay on seed until wired. |
| Home | Payment link / New invoice (header) | **works** (same modals) | Same as Quick Actions. |
| Home | 24h / 7 days / 30 days | **works** | Switches Home period, chart, Money In/Out/Net. Reports stay on their own 30-day window. |
| Home | Recent Activity row | **works** | Opens transaction detail. |
| Home | Recent Activity View all | **works** | Goes to All Transactions. |
| Home | Auto-matched KPI | **works** (display) | `%` and `N open` / `1 open` from live match. |
| Get Paid → Payment Links | New link | **works** (modal, local only) | User expects a shareable SkipCash link and later a payment on the ledger. Today: toast “created and copied”, no clipboard write, no gateway, no simulate-payment control. List starts empty. |
| Get Paid → Payment Links | Copy | **dead (toast only)** | “Link copied to clipboard” — no clipboard API, no URL on the row. |
| Get Paid → Payment Links | Description | **works** | Opens link detail. Detail Copy/Deactivate also toast-only. |
| Get Paid → Payment Page | New payment page | **works** (builder) | Editor stores title, fields, branding in `pp` state. Publish marks the page Published in-app. |
| Get Paid → Payment Page | Publish page | **opens empty-ish published view** | User expects a shareable customer route. There is no public URL, no pay action, no ledger write. Preview is in-dashboard only. |
| Get Paid → Payment Page | Copy link / Share | **dead (toast only)** | Copy does not write clipboard; Share says sample-only. |
| Get Paid → Payment Page | Logo (builder) | **dead (no handler)** | Dashed “Logo” tile has no upload handler. Payment Setup Upload is toast-only. |
| Get Paid → Subscriptions | New plan | **works** (modal, local only) | Plan appears in the list. No customer, no upcoming charges, no simulated billing run. Seed plans empty. |
| Get Paid → Subscriptions | Copy signup link | **dead (toast only)** | “Signup link copied”. |
| Get Paid → Subscriptions | Plan row | **works** | Opens plan detail. Add subscriber mutates local subscribers. Pause / Cancel / Deactivate toast-only (`h.copy`). |
| Get Paid → Payment Setup | Sandbox / Live | **works** (local flag) | Toggles `env`. Live does not talk to a real gateway. |
| Get Paid → Payment Setup | Send a test payment | **dead (toast only)** | “Sandbox test payment of QR 1.00 sent” — no txn, no pending, no match. |
| Get Paid → Payment Setup | Manage connection | **works** | Opens SkipCash gateway detail. Send test / Disconnect there are toast-only. |
| Get Paid overview | Smart Checkout card | **works** (expand + toggles) | Expands sample analytics; wallet-detect / retry toggles flip local `toggles`. Not a payment workflow. No “on” that changes checkout behaviour. |
| Get Paid → Shopify Store | Store URL / checkout map / currency | **dead (no persist)** | Uncontrolled inputs; Connected is hardcoded. No OAuth. Domain is leftover `desertbloom.myshopify.com`. |
| Get Paid → Shopify Store | Sync products / Test mode | **works** (local toggles) | Flip only. Incoming txns are not tagged `shopify` by this screen. |
| Get Paid → Connect Your Bank | Connected Ahli card | **works** (display) | Copy already says sample data. |
| Get Paid → Connect Your Bank | Connect another bank | **dead (toast only)** | “Bank linking is sample-only”. No onboarding steps. |
| Money In & Out → All Transactions | Filters, clear, row open | **works** | Filters local `txns`. Export toast-only. |
| Money In & Out → Match My Payments | Review / Confirm / Reject / Undo | **works** | Same mutation path as Home attention. |
| Money In & Out → Scan a Bill | Upload a bill | **works** (opens modal) | Modal does not accept an image/PDF. Sample bill is instant canned fill. |
| Money In & Out → Scan a Bill | What we pull out | **works** (display of canned `scan`) | Not extraction. |
| Money In & Out → Bank Activity | Display | **works** | Sample bank figures from seed. |
| Invoices → New Invoice (page) | Client picker, line items, Create / Draft | **works** (local invoices) | Creates invoice in UI state. Preview still says Peppol-ready. |
| Invoices → All Invoices | Row, New invoice | **works** | Detail Send reminder / Duplicate / Void toast-only (`h.copy`). |
| Invoices → All Invoices | Send reminders / Export | **dead (toast only)** | No messages, no file. |
| Sync to Books → Tally Export | Export XML | **dead (toast only)** | “Tally XML export queued”. No file, no cost centre, no history write. From/To inputs are not bound. |
| Sync to Books → Tally Export | Export history | **opens empty state** | “No export history is stored.” |
| Sync to Books → Zoho Sync | Sync now | **dead (toast only)** | “Syncing with Zoho Books…” — no success state, no history row. |
| Sync to Books → Zoho Sync | Disconnect | **dead (toast only)** | |
| Sync to Books → Zoho Sync | Sync log rows | **works** | Open detail. Re-run / Export toast-only. |
| Reports → Am I making money? | P&L + stat cards | **works** (display) | Independent 30-day period; net equals Home month net. |
| Reports → Who owes me? | Ageing buckets + rows | **works** (display) | Equals Outstanding. QR 0 buckets use default ink, not red. |
| Reports → Who owes me? | Chase all overdue | **dead (toast only)** | |
| Reports → What do I hand my accountant? | Download pack | **dead (toast only)** | No ZIP. Saved reports empty state is copy-only. |
| Reports → What do I hand my accountant? | Turn on monthly send | **dead (toast only)** (`h.copy`) | |
| Settings → Account | Reset demo data | **missing** | No control. After a rehearsal, matches stay confirmed. |

---

## Secondary

Useful screens that work for browsing, or that mutate local UI without touching the ledger/gateway.

| Location | Control | Behaviour | Expected |
| --- | --- | --- | --- |
| Chrome | Sidebar nav, hub cards, tabs, back | **works** | Route/tab changes. |
| Chrome | Search | **works** | Filters in-app search list. |
| Chrome | Theme toggle | **works** | Light/dark + `localStorage`. |
| Chrome | Account menu → Profile / Security / Billing | **works** | Jumps to Settings tabs. |
| Chrome | Sign out | **dead (toast only)** | Stays signed in. Reasonable for a sandbox; still a fake exit. |
| Chrome | SANDBOX pill | **works** (display) | No tooltip. User cannot tell *what* is simulated. |
| Home | Chart hover | **works** | Tooltip/dot. |
| Home | KPI cards Money In / Out / Outstanding | **works** (display) | Outstanding from seed invoices. |
| Get Paid → Payment Setup | Accent swatches / hex / picker | **works** | Local brand colour. |
| Get Paid → Payment Setup | Other gateway CTAs | **dead (toast)** | “X is not available in Phase 1”. |
| Get Paid → Payment Page | Title, description, fields, pay label, receipts, page settings | **works** (local) | Settings persist in `pp` / `ps` / `rc`. |
| Get Paid → Payment Page | Share icons | **dead (toast only)** | Same `h.copy`. |
| Invoices → Reminders | Schedule toggles | **works** (local) | Remind (per row) toast-only. |
| Invoices → Recurring | Recurring toggle | **works** (local flag) | Every/Ends inputs unbound. “No recurring invoices are stored.” |
| Invoices → Clients | Client cards | **works** | Opens client detail. |
| Invoices → Create | Add client | **works** (local client list) | |
| Team → Members | Invite, row, edit save | **works** (local team) | |
| Team → Permissions | Role matrices | **works** (local `perms`) | |
| Team → Approvals | Approve / Decline | **works** if `approvals` has rows | Seed has none → empty. |
| Team → Activity | Kind filters | **works** | |
| Payroll → Employees | Add / edit employee | **works** (local) | |
| Payroll → Payslips | Generate | **dead (toast only)** | No slip records. Post to Transactions also toast (`h.export`). |
| Payroll → Deductions | VAT / WHT / royalty fields | **works** (local `rates`) | VAT wording on a QA unregistered merchant. |
| Settings → Account | Name, email, password, notifications, Save | **works** (local) | Password is sandbox theatre. |
| Settings → Tags | Remove tag | **works** | Strips tag from list; does not retag txns. |
| Settings → Security | 2FA / biometric toggles | **works** (local) | Sign out session / Roll keys toast-only. |
| Settings → Billing | Downgrade / Upgrade / Contact sales | **dead (toast only)** | |
| Settings → Profile | Fields + Save changes | **dead (toast; fields unbound)** | Save toasts “Changes saved”; inputs have no `onChange`, so edits vanish. |
| Connected Apps | Manage on SkipCash / bank / Tally / Zoho / Shopify | **works** | Navigates to the matching setup tab. |
| Reports → Where is money leaking? | Category / vendor lists | **works** (display) | |
| Reports → Will I have enough? | Runway + forecast | **works** (display) | |
| Reports → How is each branch doing? | Branch rows | **works** | Opens branch detail. |
| Detail panes | Transaction / invoice / match / member / etc. | **works** (open/close) | Several action buttons inside details are toast-only (see Cosmetic / dead list). |
| Modals | Cancel / backdrop / Escape | **works** | |
| Modals | Primary CTA | **works** for link, expense, scan, invoice, plan, member, employee; **closes only** for help, page settings, receipts | Page/receipt settings save as close, not a separate persist path. |

---

## Cosmetic

Display, copy, or chrome that does not change money or routing.

| Location | Control | Behaviour | Expected |
| --- | --- | --- | --- |
| Home | Matching Status check icon | **works** (display) | |
| Home | Needs Your Attention count badge | **works** | Hidden at zero. |
| Get Paid | SkipCash “This month / Settling / Settled share” | **works** (display from seed `gateways`) | |
| Reports | Saved reports muted placeholder | **works** (empty state) | Heading + 12-month copy + ghost row. No fake packs. |
| Reports | Ageing QR 0 colour | **works** | Default ink when bucket is zero. |
| Header | Logo → Home | **works** | |
| More menu (mobile overflow) | **works** | Opens extra nav. |
| Help modal | **works** | About this build. |
| Toast | **works** | Auto-dismiss ~2.6s. |

---

## Needs a decision

Do not guess product intent.

| Location | Control | Why it is unclear |
| --- | --- | --- |
| Get Paid → Payment Setup | Live | Should Live be blocked with a registration message, or a labelled simulation of “live mode”? Qatar CR is pending; a Live switch that only flips a chip is misleading. |
| Invoice / Tax screens | Peppol-ready, Default tax rate, “E-invoicing ready” | Stage 6 says strip VAT/Peppol from UI. Keep `getVatRate() = 0` in logic. Whether Tax & e-invoicing tab remains at all is a product call. |
| Payroll deductions | “VAT (goods & services)” with “Qatar has no VAT yet” | Same as above vs payroll WHT which may still be real for QA. |
| Shopify | Hardcoded `desertbloom.myshopify.com` and “Connected” | Merchant is Al Bidda. Is this leftover copy to replace, or a second sample store? |
| Payment links Copy | Toast without clipboard | Is a fake toast enough for demo, or must `navigator.clipboard` run? |
| Sign out | Toast, session remains | Sandbox-only is fine; or should it reset to a locked splash? |
| New invoice modal vs Invoices → New Invoice page | Two create paths | Modal is quick; full page has line items. Which is canonical for the demo spine? |
| Match Review “Review” on a row | Opens match detail | vs Confirm on Home which stays on Home. Intentional? |
| Reports Download pack | Toast vs real ZIP | Stage 3 specifies Tally XML, not the accountant ZIP. Is the pack still toast in Phase 1? |
| Settings Profile Save | Toast, fields not bound | Bind to merchant profile, or treat as display-only and disable Save? |
| “Post to Transactions” on payslips | Toast `h.export` | Should generating slips append salary txns (would break seed payroll identity unless designed)? |
| Gateway “Manage connection” vs Connected Apps | Two doors to the same SkipCash detail | Fine, or should one be read-only? |

---

## Dead or toast-only (full list)

These have a click target. None perform the labelled side effect.

| Location | Control | Handler today |
| --- | --- | --- |
| Get Paid / Payment Setup / gateway detail | Send a test payment | `h.testTxn` toast |
| Payment links, payment page, plan, invoice, member, sub | Copy / Copy link | `h.copy` toast, no clipboard |
| Payment page | Share | `h.note` sample-only |
| Payment Setup | Logo Upload | `h.note` sample-only |
| Connect Your Bank | Connect another bank | `h.note` sample-only |
| All Transactions / All Invoices / Activity / Accountant pack / Payslips / sync detail | Export / Download pack / Re-run | `h.export` toast |
| Tally | Export XML | `h.tallyExport` toast |
| Zoho | Sync now | `h.syncNow` toast |
| Zoho / gateway | Disconnect | `h.note` / `h.copy` |
| Invoices | Send reminders, Remind, Chase all overdue | `h.note` |
| Reports | Turn on monthly send | `h.copy` |
| Invoice detail | Send reminder, Duplicate, Void | `h.copy` |
| Plan / sub / member / gateway detail | Deactivate, Pause, Cancel subscription | `h.copy` |
| Payslips | Generate, Post to Transactions | `h.generatePayslips` / `h.export` toast |
| Settings | Profile Save, session Sign out, Roll keys, Billing upgrade/downgrade/sales | `h.note` |
| Employee detail | Payslip Download | `h.note` “Download queued” |
| Header | Sign out | `h.signOut` toast |

**No handler at all**

| Location | Control |
| --- | --- |
| Payment page builder | Logo tile |
| Tally Export | From / To date fields (`value` only) |
| Tax & e-invoicing | Tax registration, Default tax rate (`value` only) |
| Settings → Profile | All profile fields (`value` only) |
| Shopify | Store URL, Checkout maps to, Currency (`defaultValue`) |
| Recurring invoices | Every, Ends (`defaultValue` / placeholder) |
| Accountant pack | Period, Format inputs (`value` / `defaultValue`) |
| Home period | Active 24h/7d/30d button has no `onClick` (correct; it is the selected state) |

**Missing**

| Location | Control |
| --- | --- |
| Payment link detail | Simulate payment (success / decline / timeout / partial) |
| Settings → Account | Reset demo data |
| Scan a Bill | File input for image/PDF; processing wait; per-field confidence |
| Checkout | Public shareable pay route |
| Subscriptions | Upcoming charges list, cancel that stops simulated billing |
| Shopify | OAuth-style connect that can start from disconnected |
| Bank | Onboarding that can start from disconnected |

**Opens empty state (legitimate)**

| Location | Why empty |
| --- | --- |
| Payment Links list | `reports`/`links` not in seed |
| Subscription plans list | plans not in seed |
| Saved reports | packs not in seed |
| Tally export history | not stored |
| Recurring “Running now” | no schedules in seed |
| Team approvals | no pending caps in seed |
| Needs Your Attention / Matching Status | empty after all confirms (correct) |

**Navigates wrong**

None found. Hub Manage buttons land on the matching Get Paid / Sync tab. Home Review lands on Match My Payments.

**Console errors**

Not verified in a browser session in this stage. Known Next noise: requests for `/{{ chart.src }}` before the SVG data URI binds (404 in `next dev` logs). Not classified as a user-facing control failure.

---

## Route map (for later stages)

| Section | Tabs |
| --- | --- |
| Home | (single) |
| Get Paid | Overview hub, Payment Links, Payment Page, Subscriptions, Payment Setup, Connect Your Bank, Shopify Store |
| Money In & Out | Overview hub, All Transactions, Match My Payments, Scan a Bill, Bank Activity |
| Invoices | Overview hub, All Invoices, New Invoice, Reminders, Recurring, Clients |
| Sync to Books | Tally Export, Zoho Sync, Tax & e-invoicing |
| Connected Apps | Payment Gateways, Banks, Accounting & Platforms |
| Reports | P&L, Spend, Cash, Who owes me, Branches, Accountant pack |
| Your Team | Members, Approval Limits, Permissions, Activity |
| Payroll | Payslips, Employees, Deductions |
| Settings | Business Profile, Account, Manage Tags, Billing, Security |

Mobile Home / Activity / Invoices duplicate a subset of the same handlers.
