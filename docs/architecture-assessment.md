# Flow dashboard UI architecture

Static read of the current tree. No port was started. No layout, styling, seed, or application code was changed. Click behaviour was not verified in a browser.

## Hypothesis

**Mostly confirmed, with two corrections.**

The merchant dashboard is a single Design Components document, `public/flow.dc.html`. Markup inside `<x-dc>` uses `{{ }}` interpolation, `<sc-if>`, `<sc-for>`, and attributes such as `onClick="{{ a.confirm }}"`. `public/support.js` is a generated **dc-runtime**. On boot it:

1. Loads React 18.3.1 and ReactDOM from unpkg (`loadReactUmd`).
2. Parses `<x-dc>` plus `script[data-dc-script]`.
3. Compiles the template to `React.createElement` trees (`compileTemplate` / `walkElement`).
4. Evaluates the logic class with `new Function` (`evalDcLogic`) and requires `class Component extends DCLogic`.
5. Mounts one `StreamableComponent` host. Each render calls `this.logic.renderVals()` and feeds the returned object to the compiled template.

`{{ }}` is not string-replaced into raw HTML. `compileAttr` turns a whole-attribute `{{ path }}` into `resolve(vals, path)`. Event names are remapped (`onclick` → `onClick`) and the resolved value is passed as a React prop. If the path is missing, the handler is `undefined` and the control looks clickable (global `button { cursor: pointer }`) but does nothing.

**Correction 1.** There is a second, independent UI: `public/pay.html`. It does not load `support.js`, has no `<x-dc>`, and does not evaluate a `Component` class. Next rewrites `/pay/:slug` and `/pay/:slug/receipt` to that file (`next.config.js` `beforeFiles`).

**Correction 2.** `app/page.js` is a Next App Router stub that returns `null`. `/` is rewritten to `/flow.dc.html` before that page runs. The dashboard React tree is the unpkg copy loaded by dc-runtime, not the Next `react@19` dependency.

---

## 1. Files, roles, and sizes

Sizes from `wc -c` / `wc -l` on this tree. Bytes are UTF-8 file size.

| File | Bytes | Lines | Role |
|---|---:|---:|---|
| `public/flow.dc.html` | 544,797 | 6,003 | Dashboard template + in-page logic class |
| `public/support.js` | 69,150 | 1,911 | Generated dc-runtime (`new Function`, template compile, boot) |
| `public/flow-store.js` | 101,771 | 2,475 | Browser bundle of `lib/data/browser.ts` (store, selectors, spine, gateway) |
| `public/flow-data.js` | 29,302 | 1 | One-shot `window.FLOW_DATA = {…}` snapshot for first paint |
| `public/pay.html` | 20,885 | 335 | Public checkout; vanilla `innerHTML` + `onclick` |
| `lib/data/store.ts` | 7,899 | 295 | In-memory seed + `localStorage` key `flow-live-v1` |
| `lib/data/view.ts` | 25,308 | 717 | `dashboardState()` / `dashboardSnapshot()` |
| `lib/data/selectors.ts` | 12,822 | 329 | Period maths; reads `getStore()` |
| `lib/data/spine.ts` | 24,547 | 697 | Mutations (`confirmMatch`, `payPublishedCheckout`, …) |
| `lib/data/browser.ts` | 1,412 | 52 | Window exports; sets `FLOW_DATA` after hydrate |
| `app/page.js` | 50 | 3 | Unused route body (`return null`) |
| `app/layout.js` | 331 | 12 | Next chrome; not the dashboard shell |
| `next.config.js` | 376 | 15 | Rewrites `/` and `/pay/:slug` |

Split of `public/flow.dc.html` (Python length of those slices):

- Markup before the logic script: 383,344 bytes, 3,369 lines.
- `<x-dc>` inner HTML: 382,594 bytes, 3,351 lines.
- `script[data-dc-script]` body (`class Component extends DCLogic`): 160,111 bytes, 2,632 lines.
- `public/pay.html` inline script: 13,058 bytes, 237 lines.

There is no `dc-runtime/` source in this repo. `support.js` says it is generated (`cd dc-runtime && bun run build`). No other product HTML templates exist under `public/`.

Script order on the dashboard:

```
support.js → flow-data.js → flow-store.js
```

`flow-store.js` then calls `hydrateFromStorage()` and overwrites `window.FLOW_DATA` with `dashboardState()`. The Component constructor copies that object into `this.state`. `pay.html` loads only `flow-store.js`.

Rewrites (`next.config.js`):

- `/` → `/flow.dc.html`
- `/pay/:slug` → `/pay.html`
- `/pay/:slug/receipt` → `/pay.html` (same file; no receipt branch in the script)

`npm run build` / `predev` emit `public/flow-data.js` from selectors (`scripts/emit-flow-data.mjs`) and copy `public/` as static files. The HTML is not compiled by Next.

---

## 2. Screens, tabs, and modals

**Method.** Counted from `dests().D` / `dests().HUBS`, the `NAV` array in `renderVals()`, `pageVals` tab flags, `show.*` / `pt.*` / `tt.*` (and siblings) `sc-if` branches, `headFor()` detail types, and the `MODAL` map. Nothing was added that is not in those objects or those `sc-if`s.

### Top-level pages (10)

From `NAV` in `renderVals()` (also the sidebar). `data-props.startPage` lists nine of these and omits `team`; the running nav still includes Team.

| `state.page` | Label |
|---|---|
| `dashboard` | Home |
| `payments` | Get Paid |
| `transactions` | Money In & Out |
| `invoicing` | Invoices |
| `accounting` | Sync to Books |
| `connections` | Connected Apps |
| `reports` | Reports |
| `team` | Your Team |
| `payroll` | Payroll |
| `settings` | Settings |

`show.dashboard`, `show.transactions`, and `show.invoicing` are off on mobile (`vw <= 780`). Those three have separate bodies: `mob.home`, `mob.txns`, `mob.invoices`.

### Hub overviews (6)

`HUBS = ['payments', 'transactions', 'invoicing', 'connections', 'reports', 'team']`. Default tab is `hub`. Template: `hub.show` card grid. Accounting, payroll, settings, and Home have no hub.

### Inner tabs from `dests().D` (39)

| Section | Keys | Count |
|---|---|---:|
| payments | links, checkout, subs, gateway, bank, shopify | 6 |
| transactions | all, matching, scan, bank | 4 |
| invoicing | all, create, reminders, recurring, clients | 5 |
| accounting | tally, zoho, tax | 3 |
| connections | gateways, banks, platforms | 3 |
| reports | overview, spend, cash, receivables, branches, pack | 6 |
| team | members, approvals, permissions, audit | 4 |
| payroll | payslips, employees, tax | 3 |
| settings | profile, account, tags, billing, security | 5 |

The tab strip prepends `['hub', 'Overview']` for hub sections, so those six sections show one more tab than `D` lists. Dashboard has no `D` entry and no tab strip.

Each `D` key has a matching `sc-if` (`pt.checkout`, `tt.matching`, `it.create`, …).

### Payment Page builder (3 views, under `pt.checkout`)

`state.ppView`: `list` (`ppList.show`), `edit` (`ppList.edit`), `published` (`ppList.published`). These replace the checkout tab body; they are not extra `D` keys.

### Detail panes (13 kinds)

From `headFor()` / `pageVals` `det.*`: `txn`, `invoice`, `link`, `plan`, `sub`, `match`, `client`, `synclog`, `gateway`, `report`, `member`, `branch`, `employee`. One overlay (`detail.on`), not 13 routes.

### Modals (11 kinds)

From the `MODAL` object and `modal.*` `sc-if`s: `link`, `scan`, `expense`, `invoice`, `plan`, `member`, `employee`, `help`, `pageSettings`, `receipts`, `reset`. `employee` also serves edit when `editEmp` is set.

### Chrome (not pages)

Sidebar, header, tab strip, hub back link, desktop flyout, user menu, search overlay (`searchOpen`), mobile more sheet (`moreOpen`), toast, pay-label editor overlay (`pp.payLabelEditing`).

### Public checkout (1 document)

`public/pay.html` only. `/pay/:slug/receipt` is the same document; there is no receipt `if` in that script.

### Totals (do not add these into one “screen” number)

- 10 top-level pages
- 6 hub overviews
- 39 inner tabs
- 3 checkout-builder views
- 3 mobile-only list bodies
- 13 detail kinds
- 11 modal kinds
- 1 public checkout document

In-app places `go()` / `tabH()` can land: **1 (Home) + 6 hubs + 39 tabs = 46**, with checkout occupying three of those slots as list/edit/published.

---

## 3. Event binding

### Dashboard (`flow.dc.html` + dc-runtime)

`renderVals()` (called every host render) builds a flat `vals` object: `h`, `att`, `det`, `pp`, nav rows, and `pageVals()`. Handlers are functions on that object.

`onClick="{{ a.confirm }}"` is compiled to `props.onClick = resolve(vals, "a.confirm")`. React then binds it. There is no `addEventListener` for those controls.

Stable instances go through `this.memo(bag, key, make)`. Many `pageVals` handlers are new arrows every render (`confirm: () => this.confirmMatch(m.id)`).

If `resolve` misses, React gets `onClick={undefined}`.

### Working example: Confirm on a match proposal

Home attention row (`public/flow.dc.html`):

```html
<button onClick="{{ a.confirm }}">Confirm</button>
```

`renderVals` sets `att.items[].confirm` to `this.resolveAtt(a.id, true)`, which memos `() => this.applyReview(id, 'confirm', null, true)`.

Match detail uses `onClick="{{ det.o.confirm }}"` → `() => this.confirmMatch(m.id)` → `applyReview(id, 'confirm', …)`.

`applyReview` (same file):

1. `FlowStore.confirmMatch(id)` when the action is not `reject`.
2. `this.applyStore({ detail: null, … })`.
3. Toast “Match confirmed”.

`FlowStore.confirmMatch` is `confirmMatch` in `lib/data/spine.ts`: `replaceMatchProposal(proposalId, { status: "confirmed" })`.

`getOpenMatches()` in `lib/data/selectors.ts` keeps `status === "open"` only. `dashboardSnapshot()` then rebuilds `matches` / `attention` / `matchRate`. Seed has three open proposals (`mp_01`, `mp_02`, `mp_03` in `lib/data/seed.ts`).

This path is wired in source. It was **not** clicked in a browser here.

### Broken / dead-looking example: Pay on `/pay`

`/pay/:slug` is **not** the dashboard Component. `public/pay.html` builds the card with `innerHTML`, then `bindPay` does `document.getElementById("pay").onclick = …`.

When the `#pay` button is in the DOM, that `onclick` calls `FlowStore.payPublishedCheckout(slug)` (published page) or `FlowStore.simulatePayment(link.id, "success")` (active payment link). Those functions exist on the `flow-store.js` export object (`lib/data/spine.ts`).

What the current files actually do:

1. **Seed has no live checkout.** `seed.checkoutPages` is `[]`. `checkoutPageBySlug` only returns a **published** page.
2. **Every seed payment link is already `paid`.** `link_txn_01`, `link_txn_10`, `link_txn_14`, `link_txn_20` in `lib/data/seed.ts`. For `paid` / `pending` / existing `txnId`, `pay.html` sets `hidePay: true` (“This simulated link has already been used.”).
3. **Unknown slug** (including `/pay` with no second path segment): “Page not found”, `hidePay: true`.
4. **`/pay/:slug/receipt`** uses the same script and does not special-case `receipt`.
5. **When `#pay` is rendered**, `bindPay` requires a valid email if a non-optional `mail` field exists (default checkout fields include required Email). Empty email focuses the field, shows “Enter a valid email”, and returns. The button stays on screen.
6. **Dashboard builder “Pay” is not checkout.** Under `ppList.edit`, the dark Pay control is `onClick="{{ pp.editPayLabel }}"` — it edits the label. It does not open `/pay` and does not charge.

So in this tree the public Pay control is bound when it exists, but seed URLs never show it, and a shown button can no-op on email validation. A working `#pay` needs a newly created active link or a published checkout page in the same origin’s `localStorage` (`flow-live-v1`).

Not verified in a browser: click, clipboard open of `/pay/…`, email gate, or `simulatePayment` settlement.

---

## 4. Selectors: live store, snapshotted UI

`getStore()` in `lib/data/store.ts` is a mutable `live` object. Selectors and `dashboardState()` always read that object when they run. There is no React context, no store subscription, and no `useSyncExternalStore`.

UI numbers live on **Component state**:

1. **First paint.** Constructor copies `window.FLOW_DATA` (static `flow-data.js`, then overwritten by `flow-store.js` after hydrate).
2. **After a mutation that remembers to refresh.** `applyStore()` calls `FlowStore.dashboardSnapshot()` → `dashboardState()` → selectors → `setState(patch)`.
3. **Cross-tab / refocus.** `bindStoreEvents()` (from `renderVals()`) listens for `storage` on `flow-live-v1` and `focus`, then hydrate + `applyStore`.

`dests()` / `pageVals()` / `renderVals()` recompute from `this.state` on every host render. They do not call selectors themselves.

`FLOW_DATA` is not a live binding. After boot, the dashboard ignores it unless something copies a new snapshot into state.

If a mutation writes the store but skips `applyStore`, the UI stays on the last snapshot. Confirm match does call `applyStore`. `pay.html` never calls `applyStore`; the dashboard updates only if that tab gets `focus` or a `storage` event.

---

## 5. React port estimate (not started)

Reuse unchanged: `lib/data/store.ts`, `lib/data/selectors.ts`, `lib/data/spine.ts`, and the existing `FlowStore` / `dashboardSnapshot` façade.

### Rough component count

If each counted surface becomes a component, plus shared chrome:

- Shell: AppShell, Sidebar, Header, TabBar, BottomNav, HubGrid, DetailHost, ModalHost, Search, Toast — about **10**
- Section roots: **10**
- Hub grids: **6**
- Tab bodies: **39**
- Checkout builder views: **3**
- Mobile list bodies: **3**
- Detail kinds: **13**
- Modals: **11**
- Tables / KPI / chart / match cards shared: about **8–12**
- Public checkout: about **3** (page, pay card, paid state)

**About 100–110** if split 1:1 with the template; **about 45–70** if tables and forms are shared. That is a sizing guess from the counts above, not a measured refactor.

### Incremental

- **`/pay` first.** Already a separate document that only talks to `FlowStore`. A Next (or React) route can replace `pay.html` without touching dc-runtime. Receipt can become a real branch (`/pay/:slug/receipt` already rewrites here).
- **One hub at a time** only after a React shell owns routing and calls `dashboardSnapshot()` / `applyStore`-equivalents. `x-import` in `support.js` could host islands, but the mega `vals` object still has to supply every `{{ }}` the remaining template uses.
- Seed, selectors, and spine can stay. New components should read snapshots or `getStore()` the same way `applyStore` does today.

### Must move together

`support.js` compile + `evalDcLogic` + `class Component` + `dests()` / `renderVals()` / `pageVals()` + the `sc-if` tree in `flow.dc.html` are one evaluation unit. You cannot delete one `show.*` branch without either leaving a hole in `vals` or keeping the god-object. A real dashboard port is a cut-over of that unit, not a file-by-file rewrite of `sc-if`s.

---

## 6. Risks of staying on this runtime

Grounded in files above:

- **`new Function`.** Logic and `x-import` JS run through the Function constructor (`evalDcLogic`, external modules). CSP `unsafe-eval` and supply-chain risk. The HTML logic is not TypeScript-checked (`npx tsc` never sees it).
- **No component boundaries.** One class, one `state`, one `renderVals()`. A throw in `renderVals` is caught by the host and replaced with a placeholder; there is no per-screen isolation.
- **`dests()` / `renderVals()` god-object.** `dests()` rebuilds the full `D` map on every call; `renderVals` calls it several times per render and allocates nav, hubs, charts, and handlers. Easy to ship a stale `memo()` closure or an unbound `{{ h.missing }}`.
- **Handler memoization.** `memo` caches forever by string key. Fine for `go('payments','links')`; risky if a memoized function closes over a stale row.
- **Dead or misleading clicks.** Missing paths → no handler. Toast-only `h.*` methods still look like actions. Dashboard Pay is a label editor. Seed `/pay/link_*` hides Pay.
- **Two Reacts.** Next depends on React 19; the dashboard boots React 18 from unpkg. Offline / CDN failure: `loadReactUmd` rejects and the page does not boot (`[dc] failed to load React or boot`).
- **Static HTML on every Next build.** `flow.dc.html` / `pay.html` / `flow-store.js` are copied, not bundled with the App Router. `app/page.js` hides that `/` is not a React route.
- **Split brain.** `FLOW_DATA` (emit), Component state, and `getStore()` can diverge until `applyStore`. `pay.html` writes the store without notifying the open dashboard except via `focus` / `storage`.
- **Checkout isolation.** Public pay is a second product surface with its own DOM and no shared components. `/receipt` is a rewrite only.

---

## Not verified

- No browser, no `next dev`, no click on Confirm or Pay.
- Whether `unpkg` React loads in this environment.
- Whether `navigator.clipboard.writeText` succeeds for `/pay/…` copy.
- Whether `storage` fires when `pay.html` and the dashboard share an origin.
- Runtime cost of `renderVals()` (not profiled).

`docs/interaction-inventory.md` describes an older wiring (toast-only copy, no `/pay` route). This report is the current tree only.
