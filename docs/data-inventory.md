# Data inventory

Scan of `app/` and `components/`, plus the live mock store the dashboard actually renders (`public/flow.dc.html`). Amounts in the seed are integer minor units. `ANCHOR_DATE` is `2026-08-09`.

`npx tsc --noEmit` passes.

## app/ and components/

| File | Line | Literal | Entity | Remaining |
| --- | --- | --- | --- | --- |
| `app/layout.js` | 3 | `"Payments and finance dashboard for Qatar businesses"` | none (page metadata) | Yes. Product copy, not a merchant record. |
| `app/page.js` | — | none | — | No |
| `components/` | — | directory does not exist | — | No |

## Replaced from `lib/data/seed.ts` and selectors

These inline arrays were removed from `public/flow.dc.html`. The page reads `public/flow-data.js`, generated from `dashboardState()` in `lib/data/view.ts`.

| Previous file | Previous lines | Literals | Entity | Remaining |
| --- | --- | --- | --- | --- |
| `public/flow.dc.html` | 3291–3308 | txn amounts `4820` … `-2200`, dates `9 Aug`–`1 Aug`, parties, tags, sources, statuses | `transactions`, `ledgerEntries`, `settlements` | No. Status Pending/Refunded derived from settlement status and ledger kind. |
| `public/flow.dc.html` | 3310–3312 | attention `6300` / `-890` / `1540` and confidence notes | `matchProposals` | Partial. See unmatched attention row below. |
| `public/flow.dc.html` | 3314–3318 | links `2150`, `750`, `4200` | `paymentLinks` | No |
| `public/flow.dc.html` | 3329–3335 | invoices `INV-0142`–`INV-0146` and stored statuses | `invoices`, `invoiceLineItems` | Status is no longer stored. `getInvoiceStatus` derives it. `INV-0142` was stored `Sent` and is now `Overdue` (due `5 Aug`, no settled allocation). |
| `public/flow.dc.html` | 3336–3340 | clients names, emails, phones, totals `41200`, `26800`, `18400` | `customers` | Partial. Lifetime totals are not on the customer record. Screen now shows the sum of that customer's invoice line items (`18800`, `15550`, `9020`). Previous lifetime figures were not carried. |
| `public/flow.dc.html` | 3341–3350 | team and employee rows, salaries `9000`, `6500`, `5200` | `teamMembers`, `employees`, `payrollRuns` | Partial. Clock times (`09:14`) were not stored. Last-seen is date-only (`Today`, `8 Aug`, `6 Aug`). |
| `public/flow.dc.html` | 3358–3369 | activity log | `activityLog` via `getRecentActivity` | Partial. Times of day dropped. Text amounts inside `what` are still the original strings. |
| `public/flow.dc.html` | 3370–3384 | auto-matches and open matches | `matchProposals`, `settlements` | Partial. `INV-0147?` is not an invoice. That proposal has no `invoiceId`. |
| `public/flow.dc.html` | 3243–3245 | `vat: '0'`, `Noora Al-Ansari`, `noora@flow.qa` | `merchant` (`getVatRate` = 0 for QA), `teamMembers` owner | `wht: '5'` and `royalty: '5'` remain. |
| `public/flow.dc.html` | hero `6300` | pending settlement | `settlements` `setl_001` via `getUnmatchedSettlements` | No |
| `public/flow.dc.html` | hero net | `inflow + outflow` | `ledgerEntries` via `getBalance` and `getBalanceSeries` | No. Both end at `14180` QAR. |

Merchant record is `inRide`, country `QA`, currency `QAR`, VAT-unregistered. Account card business name reads `merchant.legalName`.

## Remaining — not resolved, not invented

| File | Line | Literal | Entity | Remaining |
| --- | --- | --- | --- | --- |
| `public/flow.dc.html` | 932, 1018, 1755, 2403 | `Desert Bloom`, `Desert Bloom WLL` in payment-page, Zoho, and settings input copy | merchant | Yes. Static template copy. Not rewritten. Account menu now uses `inRide`. |
| `public/flow.dc.html` | 3244 | `wht: '5'`, `royalty: '5'` | none in seed | Yes. No withholding or royalty source. `getVatRate` only covers VAT. |
| `public/flow.dc.html` | 3253–3264 | payment pages: views `412`/`156`, paid `38`/`21`, amount `24700`/`6300`, titles, emails | none | Yes. No page-analytics entity. |
| `public/flow.dc.html` | 3319–3328 | plans `350`/`3600`, MRR `8400`/`2100`, subscribers | none | Yes. |
| `public/flow.dc.html` | 3351–3356 | sync log items `42`, `38`, `120`, `31` and error counts | none | Yes. Overlaps activity text, but counts are not ledger rows. |
| `public/flow.dc.html` | attention (removed) | `-890`, `81%`, “Untagged expense, we suggest Supplies.” | none | Yes. Not a settlement allocation. Dropped rather than faked as a match. |
| `public/flow.dc.html` | match `mt3` | `INV-0147?` | invoice | Yes. No such invoice. Proposal left without `invoiceId`. |
| `public/flow.dc.html` | 3385–3408 | reports, branches `128400`/`41900`, staff `6`/`3`, checkout price `145`, reminder labels | none | Yes. |
| `public/flow.dc.html` | ~3896 and ~4003 | cash forecast `8.2`/`12.4`/… (thousands) | none | Yes. Not `getBalanceSeries`. |
| `public/flow.dc.html` | 4306–4307 | `+18.2%`, `-4.1%` | period comparison | Yes. Ledger does not contain a prior period that yields these rates. |
| `public/flow.dc.html` | 4911, 5012 | `+12.4%`, `+12.4% vs last week` | period comparison | Yes. Same reason. Pending amount itself is wired. |
| `public/flow.dc.html` | 4927 | `46%`, `2,340 of 5,000 transactions used` | plan usage | Yes. |
| `public/flow.dc.html` | account menu | plan `Starter`, limit `QR 50,000`, last login time | none | Yes. |
| `public/flow.dc.html` | activity `act_007` | “Invited Sara Mansour as Accountant” | team | Yes. Sara Mansour is not a `teamMembers` row. Text kept as a log line only. |
| `public/flow.dc.html` | activity `act_009` | approval limit `QR 10,000` | none | Yes. |
| ledger vs payroll | `led_008` vs `payrollRuns` | bank payroll `-14500` vs salary gross `20700` | `ledgerEntries`, `payrollRuns` | Yes. Both kept. `getPayrollTotals` uses `payrollRuns` only. Not forced to match. |
| `public/flow.dc.html` | clients | previous totals `41200`, `26800`, `18400` | customers | Yes. Not reconstructable from invoices or transactions. |
