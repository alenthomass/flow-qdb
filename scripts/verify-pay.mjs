import assert from 'node:assert/strict';
import { appendFileSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { act, create } from 'react-test-renderer';
import PayCheckout from '../app/pay/pay-checkout.tsx';
import { getStore, resetStore } from '../lib/data/store.ts';
import { seed } from '../lib/data/seed.ts';
import { hydrateStore } from '../lib/data/hydrate.ts';
import { createPaymentLink, publishCheckoutPage } from '../lib/data/spine.ts';
import { getMoneyIn, getNet, getNetSeries, getProfitAndLoss, getMatchRate, getOpenMatches } from '../lib/data/selectors.ts';
import { resetGateway } from '../lib/gateway/index.ts';
import { emailError, getPayRevision, subscribePayStore, submitPayment } from '../lib/pay/session.ts';
import { formatMoney } from '../lib/format.ts';
import { runInNewContext } from 'node:vm';

const lines = [];
const pass = message => { lines.push('- PASS ' + message); console.log(message); };
const saved = new Map();
globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value), removeItem: key => saved.delete(key) };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
function at(slug, outcome = 'success') {
  globalThis.location = { pathname: '/pay/' + slug, search: '?outcome=' + outcome, origin: 'http://localhost:3000', href: 'http://localhost:3000/pay/' + slug + '?outcome=' + outcome };
  globalThis.window = { location: globalThis.location };
}
at('test');
resetStore();
resetGateway();

// Reproduce the saved-store bug: existing transactions, only one new link.
const added = await createPaymentLink({ amountMinor: seed.invoices[0].amountMinor, description: 'Hydration regression fixture' });
const stale = structuredClone(getStore());
stale.paymentLinks = [added];
saved.set('flow-live-v1', JSON.stringify(stale));
hydrateStore();
const links = getStore().paymentLinks;
assert.equal(links.length, seed.paymentLinks.length + 1);
assert.equal(links.filter(row => row.id === added.id).length, 1);
assert.equal(links.reduce((sum, row) => sum + row.amountMinor * row.uses, 0), 654000);
assert.equal(links.reduce((sum, row) => sum + row.uses, 0), 4);
hydrateStore();
assert.equal(getStore().paymentLinks.length, 5);
assert.equal(getStore().transactions.length, seed.transactions.length);
pass('Saved-store migration restores 4 paid seed links: QR 6,540 collected, 4 times paid; created link retained; ledger unchanged; migration idempotent');

// Execute emitted assets, as served, without opening a browser.
for (const stored of [null, stale]) {
  const storage = new Map(stored ? [['flow-live-v1', JSON.stringify(stored)]] : []);
  const context = {
    window: {}, structuredClone, console, URLSearchParams,
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) }
  };
  runInNewContext(readFileSync(new URL('../public/flow-data.js', import.meta.url), 'utf8'), context);
  runInNewContext(readFileSync(new URL('../public/flow-store.js', import.meta.url), 'utf8'), context);
  assert.equal(context.window.FLOW_DATA.links.reduce((sum, row) => sum + row.amount * row.uses, 0), 6540);
  assert.equal(context.window.FLOW_DATA.links.reduce((sum, row) => sum + row.uses, 0), 4);
}
pass('Generated data/store assets expose QR 6,540 and 4 paid links for fresh and older saved sessions (no deployed-browser verification)');

resetStore();
resetGateway();
const link = await createPaymentLink({ amountMinor: seed.invoices[6].amountMinor, description: 'React handler fixture', invoiceId: seed.invoices[6].id });
at(link.id);
let renderer;
await act(async () => { renderer = create(createElement(PayCheckout, { slug: link.id })); });
const treeText = () => JSON.stringify(renderer.toJSON());
const payButton = () => renderer.root.findByProps({ className: 'pay' });
const emailInput = () => renderer.root.findByProps({ type: 'email' });
const before = { moneyIn: getMoneyIn('month'), net: getNet('month'), total: getMatchRate().total, count: getStore().transactions.length };
const phoneInput = () => renderer.root.findByProps({ type: 'tel' });
const continueButton = () => renderer.root.findByProps({ className: 'pay-continue' });
assert.ok(emailError('') && emailError('broken@') && !emailError('payer@example.com'));
await act(async () => { payButton().props.onClick(); });
assert.ok(treeText().includes('Enter a valid email'));
assert.equal(emailInput().props['aria-invalid'], true);
assert.equal(getStore().transactions.length, before.count);
await act(async () => { emailInput().props.onChange({ target: { value: 'broken@' } }); });
await act(async () => { payButton().props.onClick(); });
assert.ok(treeText().includes('Enter a valid email'));
pass('Actual React onClick displays a field-level error for empty and malformed email, without calling the payment spine');
await act(async () => { emailInput().props.onChange({ target: { value: 'payer@example.com' } }); });
await act(async () => { phoneInput().props.onChange({ target: { value: '55551234' } }); });
await act(async () => { payButton().props.onClick(); });
assert.ok(treeText().includes('Price Summary') && treeText().includes('Payment Options'));
let notifications = 0;
const unsubscribe = subscribePayStore(() => notifications++);
const revisionBefore = getPayRevision();
await act(async () => { continueButton().props.onClick(); continueButton().props.onClick(); });
assert.ok(treeText().includes('Processing…'));
assert.equal(continueButton().props.disabled, true);
assert.equal(getMoneyIn('month'), before.moneyIn);
const operation = submitPayment(link.id, 'payer@example.com');
assert.strictEqual(operation, submitPayment(link.id, 'payer@example.com'));
await act(async () => { await operation; });
assert.ok(treeText().includes('Payment received'));
assert.ok(treeText().includes(getStore().merchant.businessName));
assert.ok(treeText().includes('Reference '));
assert.ok(treeText().includes(formatMoney(link.amountMinor, seed.merchant.currency)));
assert.equal(getStore().transactions.length, before.count + 1);
assert.equal(getMoneyIn('month'), before.moneyIn + link.amountMinor);
assert.equal(getNet('month'), before.net + link.amountMinor);
assert.equal(getNet('month'), getProfitAndLoss('month').netProfit);
assert.equal(getNetSeries('month').values.at(-1), getNet('month'));
assert.equal(getMatchRate().total, before.total + 1);
assert.equal(getMatchRate().matched + getOpenMatches().length, getMatchRate().total);
assert.ok(notifications >= 2 && getPayRevision() > revisionBefore);
unsubscribe();
await act(async () => { renderer.unmount(); });
pass('Actual React Pay handler processes once, settles through the existing spine, displays amount/merchant/reference, and notifies subscribers at pending and settled transitions');
pass('Payment updates Money In, Home Net, chart, P&L and match denominator consistently; duplicate submissions do not duplicate the transaction');

for (const outcome of ['decline', 'timeout']) {
  const failureLink = await createPaymentLink({ amountMinor: seed.invoices[0].amountMinor, description: outcome + ' fixture' });
  at(failureLink.id, outcome);
  const count = getStore().transactions.length;
  const moneyIn = getMoneyIn('month');
  await act(async () => { renderer = create(createElement(PayCheckout, { slug: failureLink.id, outcome })); });
  await act(async () => { emailInput().props.onChange({ target: { value: 'payer@example.com' } }); });
  await act(async () => { phoneInput().props.onChange({ target: { value: '55551234' } }); });
  await act(async () => { payButton().props.onClick(); });
  await act(async () => { continueButton().props.onClick(); });
  assert.equal(renderer.root.findByProps({ 'data-payment-state': outcome === 'decline' ? 'declined' : 'timeout' }).props['data-payment-state'], outcome === 'decline' ? 'declined' : 'timeout');
  assert.equal(getStore().transactions.length, count);
  assert.equal(getMoneyIn('month'), moneyIn);
  assert.equal(payButton().props.disabled, false);
  await act(async () => { renderer.unmount(); });
}
pass('Decline and timeout have distinct React states, permit retry, and create no ledger inflow');

const page = publishCheckoutPage({ productName: 'Published checkout fixture', description: '', amountMinor: seed.invoices[0].amountMinor });
for (const outcome of ['decline', 'timeout', 'success']) {
  at(page.slug, outcome);
  const moneyIn = getMoneyIn('month');
  const result = await submitPayment(page.slug, 'payer@example.com', outcome);
  assert.equal(result.status, outcome === 'decline' ? 'declined' : outcome);
  assert.equal(getMoneyIn('month'), moneyIn + (outcome === 'success' ? page.amountMinor : 0));
}
pass('Published checkout uses the existing checkout spine for success and the mock gateway URL scenarios for decline/timeout');

const source = readFileSync(new URL('../app/pay/pay-checkout.tsx', import.meta.url), 'utf8');
assert.ok(source.includes('useSyncExternalStore') && source.includes('onClick='));
assert.ok(!/new Function|innerHTML|\.onclick\s*=|dashboardSnapshot|addEventListener|unpkg|sc-if|sc-for/.test(source));
assert.ok(!/pay\/:slug/.test(readFileSync(new URL('../next.config.js', import.meta.url), 'utf8')));
pass('Pay route uses React handlers and useSyncExternalStore; no legacy HTML runtime, unpkg dependency, or focus/storage listeners');
resetStore();
resetGateway();
appendFileSync(new URL('../docs/data-verification.md', import.meta.url), '\n## Stage A React checkout verification\n\n' + lines.join('\n') + '\n\nNo browser, visual-parity, or deployed-environment verification was attempted. External logo/font availability was not verified.\n');
