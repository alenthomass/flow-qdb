# Overnight log — Phase 1 dashboard

Started 10 Sept 2026. No browser verification (explicitly out of scope).
Figures and pass/fail below are from commands that were actually run.

## Part 1 — Port the whole UI to React

- Status: complete
- Commands run: `npx tsc --noEmit`, `npm run build`, `npm run verify:data` (all passed after the port)
- Approach: extract `class Component` to `lib/dashboard/component.js`, convert `<x-dc>` markup to JSX in `app/dashboard/view.tsx`, subscribe through `useSyncExternalStore` (same pattern as `/pay`). `applyStore` refreshes from `dashboardState()`. `bindStoreEvents` (focus/storage) removed. `public/flow.dc.html` deleted.
- `/` First Load after the port was 82.7 kB JS / ~197 kB. Routes: `/`, `/pay`, `/pay/[slug]`, `/pay/[slug]/receipt`, `/api/flow-data`.

## Part 2 — Click-found bugs

- Status: complete (verified via `npm run verify:data` only, not a browser)
- All 16 items already had checks and passed after the React port. Clean-seed cash on hand is QR 98,145 (opening 85,000 + 13,145). Home Net = Reports = QR 13,145. Outstanding QR 20,900 / 3. Match 9 + 3 = 12.

## Part 3 — Remaining Phase 1 features

- Status: complete
- (a–c) Subscriptions, Shopify connect, sample bank connect were already on the spine and stayed wired.
- (d) Recurring invoices: empty seed, create/send/pause/cancel through `lib/data/spine.ts`, Start schedule bound in the Recurring tab.
- (e) Permissions and approval limits persist on the store. Pending approvals start empty (none in the seed).
- (f) Manage Tags rename updates ledger rows. Remove of a tag still on transactions toasts the spine error.
- Commands: `npx tsc --noEmit` passed. `npm run build` passed (`/` 84.6 kB / ~200 kB First Load). `npm run verify:data` passed, including new recurring / tag / permission / approval checks. `docs/data-verification.md` was rewritten by that run.

## Part 4 — Integrity pass

- Status: complete
- `assertPhase1Invariants()` runs from `dashboardState()` and after every store `persist()`.
- `docs/interaction-inventory.md` rewritten for the React app (static walk of handlers, not a live click of every control).
- No VAT / Peppol in dashboard or pay sources (`verify:data` already checks).
- Simulated surfaces keep existing Simulated / sample / sandbox labels.
- Light/dark: theme toggle writes `localStorage`; appearance was not checked in a browser.

## Could not verify

- Light/dark appearance of ported screens in a real browser
- Clipboard write in a real browser
- Cross-tab store updates (focus/storage listeners are forbidden)
- Any click path in a real browser
