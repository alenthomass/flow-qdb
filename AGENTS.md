# Flow dashboard

Prototype for a GCC payments and finance-ops product. Demo merchant is
a Qatari SME. Currency QAR, no VAT (merchant is not VAT registered).

## Data rules (non-negotiable)

- One source of truth: lib/data/seed.ts. No component holds a business value.
- All money is integer minor units. All display goes through formatMoney.
- All dates are dayOffset integers relative to ANCHOR_DATE. No absolute dates.
- Invoice status is DERIVED in selectors, never stored on the invoice.
- Refunds are direction "out" and must reduce revenue.
- Pending transactions are excluded from Money In and from Revenue.
- Reports uses its own 30-day period, independent of the Home toggle.
- Home Net must equal Reports net profit for the same period.
- "Who owes me" must equal Outstanding.
- matched + openMatches must equal total.

## Before you finish any task

1. npx tsc --noEmit must pass.
2. npm run build must pass. A syntax error must never reach the browser.
3. Update docs/data-verification.md with recomputed figures.
4. If a number you produce differs from what the task predicted, stop
   and report it. Do not adjust the seed to make it match.

## Do not

- Change layout, styling or copy tone unless asked.
- Shrink a time window to make a label true. Fix the label.
- Invent data to fill a gap. Report the gap.
