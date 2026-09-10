import { FlowStore } from "./flow-api";

export class Component {
  props = {};
  onState = null;
  setState(update) {
    const patch = typeof update === "function" ? update(this.state) : update;
    if (!patch) return;
    this.state = Object.assign({}, this.state, patch);
    if (typeof this.onState === "function") this.onState(this.state);
  }

  state = {
    theme: (() => { try { return localStorage.getItem('flow-theme') || null; } catch (e) { return null; } })() || this.props.theme || 'light',
    page: this.props.startPage || 'dashboard',
    hoverIdx: null,
    rates: { wht: String((((typeof window !== 'undefined' && window.FLOW_DATA) || {}).figures || {}).deductionRate != null ? Math.round((((typeof window !== 'undefined' && window.FLOW_DATA) || {}).figures || {}).deductionRate * 100) : 0), royalty: '0' },
    acctName: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).acctName || '',
    acctEmail: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).acctEmail || '',
    acctPw: '',
    acctPwShow: false,
    notifPrefs: { payments: 'both', overdue: 'email', sync: 'app' },
    smartOpen: false,
    shopifyOauth: 'idle',
    bankOnboarding: 0,
    bankPick: null,
    ppLogo: '',
    upcomingCharges: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).upcomingCharges || [],
    shopify: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).shopify || { connected: false, shopDomain: '', disconnected: true, orderCount: 0, sampleReady: false },
    smartCheckout: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).smartCheckout || { on: false, walletDetect: true, retryOnDecline: true },
    checkoutPages: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).checkoutPages || [],
    sampleBanks: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).sampleBanks || [],
    env: 'test',
    ppView: 'list',
    ppPages: [],
    ppEditing: null,
    ps: { slug: '', slugCustom: false, theme: 'light', expiry: 'none', after: 'message' },
    rc: { auto: true, showCustomer: false, ref: false },
    pp: {
      title: 'Eid Gift Hampers 2026', desc: 'Pre-order a hamper for pickup from our Doha store between 12 and 18 March.',
      email: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).acctEmail || '', phone: '', terms: true, published: false,
      fields: [
        { label: 'Amount', kind: 'price', locked: true },
        { label: 'Email', kind: 'mail', locked: true },
        { label: 'Phone', kind: 'phone' }
      ]
    },
    userMenu: false,
    fly: null, flyTop: 0, flyLeft: 90,
    vw: typeof window !== 'undefined' ? window.innerWidth : 1440,
    tab: {},
    detail: null,
    tf: 'month',
    reportsTf: 'month',
    modal: null,
    scanDone: false,
    scanBusy: false,
    scanLines: [],
    scanConf: {},
    toast: '',
    ppPublishError: '',
    invDueError: '',
    search: '',
    filter: { source: 'All', status: 'All', tag: 'All', range: 'All time' },
    form: { planInterval: 'Month', memberRole: 'Staff', expTag: 'Supplies', recEvery: 'Month' },
    toggles: { autoSync: true, recurring: false, twofa: true, biometric: false, testMode: true, productSync: true, combined: false, walletDetect: true, retry: true },
    tags: ['Sales', 'Supplies', 'Rent', 'Salaries', 'Utilities', 'Marketing', 'Fees'],
    txns: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).txns || [],
    attention: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).attention || [],
    links: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).links || [],
    merchantName: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).merchantName || '',
    ownerName: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).ownerName || '',
    accountantName: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).accountantName || '',
    figures: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).figures || { balance: 0, pending: 0 },
    periods: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).periods || null,
    matchRate: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).matchRate || { matched: 0, total: 0, percent: 0 },
    usage: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).usage || { pct: '0%', label: '' },
    profile: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).profile || {},
    plan: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).plan || { tier: '', price: '' },
    invoiceTotals: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).invoiceTotals || { outstanding: 0, outstandingCount: 0, overdue: 0, overdueCount: 0, invoiced: 0, invoicedCount: 0 },
    ageing: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).ageing || { buckets: [], rows: [] },
    showTax: !!((typeof window !== 'undefined' && window.FLOW_DATA) || {}).showTax,
    plans: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).plans || [],
    subscribers: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).subscribers || [],
    invoices: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).invoices || [],
    reminderInvoices: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).reminderInvoices || [],
    clients: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).clients || [],
    team: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).team || [],
    employees: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).employees || [],
    syncLog: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).syncLog || [],
    exportHistory: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).exportHistory || [],
    zoho: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).zoho || { hasLast: false, line: '' },
    actType: 'all',
    history: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).history || [],
    autoMatches: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).autoMatches || [],
    autoOpen: false,
    matchDone: 0,
    matches: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).matches || [],
    reports: [],
    branches: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).branches || [],
    branchId: 'br_01',
    conns: { skipcash: true, bank: true, zoho: true, shopify: !!(((typeof window !== 'undefined' && window.FLOW_DATA) || {}).shopify || {}).connected },
    providers: [
      { n: 'Dibsy', s: 'Coming soon' }, { n: 'Tap', s: 'Coming soon' }, { n: 'Telr', s: 'Coming soon' },
      { n: 'SADAD', s: 'Coming soon' }, { n: 'MyFatoorah', s: 'Coming soon' },
      { n: 'QPay', s: 'Requires existing Qatari bank account.' }, { n: 'Fatora', s: 'Coming soon' },
      { n: 'Noqoody', s: 'Coming soon' }, { n: 'PayTabs', s: 'Coming soon' }
    ],
    checkout: { name: '', desc: '', price: '', accent: 'var(--accent)' },
    gateways: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).gateways || { skipcash: {}, shopify: {} },
    bank: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).bank || {},
    scan: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).scan || {},
    sampleBills: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).sampleBills || [],
    linkClients: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).linkClients || [],
    linkInvoices: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).linkInvoices || [],
    periodFrom: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).periodFrom || '',
    periodTo: ((typeof window !== 'undefined' && window.FLOW_DATA) || {}).periodTo || '',
    reminders: [
      { id: 'rm1', label: '3 days before due', on: true },
      { id: 'rm2', label: 'On the due date', on: true },
      { id: 'rm3', label: '3 days overdue', on: true },
      { id: 'rm4', label: '14 days overdue', on: false }
    ]
  };

  // ---------- helpers ----------
  fmt(n) { const s = n < 0 ? '-' : ''; return s + 'QR ' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  fmt0(n) { const s = n < 0 ? '-' : ''; return s + 'QR ' + Math.abs(n).toLocaleString('en-US'); }
  memo(bag, key, make) { this[bag] = this[bag] || {}; return this[bag][key] || (this[bag][key] = make()); }
  fh(k) { return this.memo('_fh', k, () => (e) => { const v = e.target.value; this.setState(s => ({ form: Object.assign({}, s.form, { [k]: v }) })); }); }
  forms(keys) { const o = {}; keys.forEach(k => o[k] = this.fh(k)); return o; }
  fhAll(keys) { keys.forEach(k => this.fh(k)); }
  go(page, tab) { return this.memo('_nav', page + '|' + (tab || ''), () => () => { clearTimeout(this._flyT); this.setState(s => ({ page, detail: null, fly: null, moreOpen: false, tab: tab ? Object.assign({}, s.tab, { [page]: tab }) : s.tab })); }); }
  tabH(page, tab) { return this.memo('_tab', page + '::' + tab, () => () => this.setState(s => ({ tab: Object.assign({}, s.tab, { [page]: tab }), detail: null }))); }
  open(type, id) { return this.memo('_open', type + ':' + id, () => () => this.setState({ detail: { type, id } })); }
  toast(msg) { clearTimeout(this._tt); this.setState({ toast: msg }); this._tt = setTimeout(() => this.setState({ toast: '' }), 2600); }
  toggle(k) { return this.memo('_tg', k, () => () => this.setState(s => ({ toggles: Object.assign({}, s.toggles, { [k]: !s.toggles[k] }) }))); }
  openModal(kind) {
    return this.memo('_md', kind, () => () => this.setState(s => {
      // opening in "add" mode always starts from a clean form
      const KEYS = {
        employee: ['empName', 'empRole', 'empSalary', 'empMethod'],
        member: ['memberName', 'memberEmail', 'memberRole'],
        link: ['linkAmount', 'linkDesc', 'linkExpiry', 'linkClient', 'linkInvoice'],
        invoice: ['invClient', 'invAmount', 'invDue'],
        plan: ['planName', 'planAmount', 'planInterval', 'planDesc', 'planCustomer'],
        expense: ['expAmount', 'expParty', 'expTag'],
        scan: ['scanVendor', 'scanAmount', 'scanDate', 'scanTag', 'scanTax', 'scanOffset']
      };
      const form = Object.assign({}, s.form);
      (KEYS[kind] || []).forEach(k => { delete form[k]; });
      if (kind === 'scan') clearTimeout(this._scanT);
      if (kind === 'invoice' && typeof FlowStore !== 'undefined' && FlowStore.dateInputValue) {
        form.invDue = FlowStore.dateInputValue(14);
      }
      return { modal: kind, scanDone: false, scanBusy: false, scanLines: [], scanConf: {}, editEmp: null, form, invDueError: '' };
    }));
  }
  tabOf(page, dflt) { return this.state.tab[page] || dflt; }

  tabList(page, items) {
    const cur = this.tabOf(page, items[0][0]);
    const { D } = this.dests();
    const IC = this.icons();
    const HUBICON = 'M6.4 3h2.2a1.4 1.4 0 0 1 1.4 1.4v2.2A1.4 1.4 0 0 1 8.6 8H6.4A1.4 1.4 0 0 1 5 6.6V4.4A1.4 1.4 0 0 1 6.4 3ZM13.4 3h2.2A1.4 1.4 0 0 1 17 4.4v2.2A1.4 1.4 0 0 1 15.6 8h-2.2A1.4 1.4 0 0 1 12 6.6V4.4A1.4 1.4 0 0 1 13.4 3ZM6.4 11h2.2a1.4 1.4 0 0 1 1.4 1.4v2.2A1.4 1.4 0 0 1 8.6 16H6.4A1.4 1.4 0 0 1 5 14.6v-2.2A1.4 1.4 0 0 1 6.4 11ZM13.4 11h2.2a1.4 1.4 0 0 1 1.4 1.4v2.2A1.4 1.4 0 0 1 15.6 16h-2.2A1.4 1.4 0 0 1 12 14.6v-2.2A1.4 1.4 0 0 1 13.4 11Z';
    return items.map(([key, label]) => {
      const on = cur === key;
      const e = (D[page] || []).find(x => x[0] === key);
      const d = key === 'hub' ? HUBICON : (e ? IC[e[3]] : '');
      return {
        key, label, on, off: !on, go: this.tabH(page, key),
        hasIcon: !!d, d: d || '',
        style: 'display:inline-flex; align-items:center; flex:0 0 auto; gap:7px; padding:11px 12px 12px; font-size:13px; white-space:nowrap; border-bottom:2px solid ' + (on ? 'var(--accent)' : 'transparent') + '; transition:color .15s ease, border-color .15s ease; font-weight:' + (on ? '600' : '500') + '; color:' + (on ? 'var(--ink)' : 'var(--ink-4)')
      };
    });
  }

  filtered() {
    const { search, filter } = this.state;
    const q = search.trim().toLowerCase();
    return this.sortedTxns().filter(t =>
      (!q || t.party.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q) || t.src.toLowerCase().includes(q)) &&
      (filter.source === 'All' || t.src === filter.source) &&
      (filter.status === 'All' || t.status === filter.status) &&
      (filter.tag === 'All' || t.tag === filter.tag) &&
      (filter.range === 'All time' || this.inRange(t.d, filter.range)));
  }

  sortedTxns() {
    return (this.state.txns || []).slice().sort((a, b) => (b.offset || 0) - (a.offset || 0) || String(a.id).localeCompare(String(b.id)));
  }

  slugify(text) {
    return String(text || 'page').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'page';
  }

  pageSlug(st) {
    const ps = (st && st.ps) || {};
    if (ps.slugCustom && String(ps.slug || '').trim()) return this.slugify(ps.slug);
    return this.slugify((st && st.pp && st.pp.title) || '');
  }

  applyStore(extra) {
    const live = typeof FlowStore !== "undefined" && FlowStore.dashboardState ? FlowStore.dashboardState() : {};
    const snap = {
      txns: live.txns, invoices: live.invoices, periods: live.periods, figures: live.figures,
      invoiceTotals: live.invoiceTotals, ageing: live.ageing, usage: live.usage, matchRate: live.matchRate,
      history: live.history, branches: live.branches, gateways: live.gateways, bank: live.bank,
      links: live.links, linkClients: live.linkClients, linkInvoices: live.linkInvoices,
      matches: live.matches, autoMatches: live.autoMatches, reminderInvoices: live.reminderInvoices,
      attention: live.attention, scan: live.scan,       sampleBills: live.sampleBills, clients: live.clients, team: live.team, employees: live.employees,
      exportHistory: live.exportHistory, syncLog: live.syncLog, zoho: live.zoho,
      checkoutPages: live.checkoutPages, plans: live.plans, subscribers: live.subscribers,
      upcomingCharges: live.upcomingCharges, shopify: live.shopify, smartCheckout: live.smartCheckout,
      sampleBanks: live.sampleBanks, banks: live.banks, merchantName: live.merchantName,
      ownerName: live.ownerName, accountantName: live.accountantName, acctName: live.acctName,
      acctEmail: live.acctEmail, profile: live.profile, plan: live.plan, showTax: live.showTax,
      recurringInvoices: live.recurringInvoices, rolePermissions: live.rolePermissions,
      approvalLimits: live.approvalLimits, approvalRequests: live.approvalRequests,
      ledgerTags: live.ledgerTags
    };
    const patch = Object.assign({}, extra || {}, snap);
    if (snap.shopify) patch.conns = Object.assign({}, this.state.conns, { shopify: !!snap.shopify.connected });
    this.setState(patch);
  }

  dueOffsetFrom(raw) {
    if (raw == null || String(raw).trim() === '') return null;
    if (typeof FlowStore !== 'undefined' && FlowStore.offsetFromLabel) {
      return FlowStore.offsetFromLabel(String(raw));
    }
    return null;
  }

  persistCreatedInvoice(opts) {
    const dueRaw = opts && opts.dueRaw;
    const dueOffset = this.dueOffsetFrom(dueRaw);
    if (dueRaw == null || String(dueRaw).trim() === '' || dueOffset == null) {
      return { error: 'Due date is required' };
    }
    if (typeof FlowStore === 'undefined' || !FlowStore.createInvoice) {
      return { error: 'Could not create invoice' };
    }
    try {
      const invoice = FlowStore.createInvoice({
        clientName: opts.clientName,
        amountMinor: Math.round((opts.amountMajor || 0) * 100),
        dueOffset: dueOffset,
        draft: !!opts.draft,
        lines: opts.lines || []
      });
      return { invoice };
    } catch (err) {
      return { error: (err && err.message) || 'Could not create invoice' };
    }
  }

  duplicateStoredInvoice(id) {
    if (typeof FlowStore === 'undefined' || !FlowStore.duplicateInvoice) {
      this.toast('Could not duplicate invoice');
      return;
    }
    try {
      const invoice = FlowStore.duplicateInvoice(id);
      this.applyStore({ detail: { type: 'invoice', id: invoice.id } });
      this.toast('Invoice duplicated');
    } catch (err) {
      this.toast((err && err.message) || 'Could not duplicate invoice');
    }
  }

  sendInvoiceReminder(name) {
    this.toast('Reminder sent to ' + (name || 'the client'));
  }

  postPayrollToLedger() {
    const period = (this.state.form && this.state.form.payrollPeriod)
      || (typeof FlowStore !== 'undefined' && FlowStore.defaultPayrollPeriod && FlowStore.defaultPayrollPeriod())
      || '';
    if (typeof FlowStore === 'undefined' || !FlowStore.postPayroll) {
      this.toast('Could not post payroll');
      return;
    }
    try {
      const result = FlowStore.postPayroll(period);
      if (result.alreadyPosted) {
        this.toast('Already posted for ' + result.period);
        return;
      }
      this.applyStore();
      this.toast('Payroll posted to Transactions');
    } catch (err) {
      this.toast((err && err.message) || 'Could not post payroll');
    }
  }

  bindStoreEvents() {
    return;
  }

  startExtract(ref) {
    clearTimeout(this._scanT);
    if (typeof FlowStore === 'undefined' || !FlowStore.extractBill) {
      const scan = this.state.scan || {};
      this.setState(st => ({
        scanBusy: false,
        scanDone: true,
        form: Object.assign({}, st.form, {
          scanVendor: scan.vendor || '',
          scanAmount: scan.amount || '',
          scanDate: scan.date || '',
          scanTag: 'Utilities',
          scanOffset: scan.dayOffset
        })
      }));
      return;
    }
    this.setState({ scanBusy: true, scanDone: false, scanLines: [], scanConf: {} });
    const delay = FlowStore.extractDelayMs ? FlowStore.extractDelayMs() : (FlowStore.EXTRACT_DELAY_MS || 1800);
    const self = this;
    this._scanT = setTimeout(function() { self.applyExtracted(ref); }, delay);
  }

  applyExtracted(ref) {
    if (typeof FlowStore === 'undefined' || !FlowStore.extractBill) return;
    const bill = FlowStore.extractBill(ref);
    const mapped = FlowStore.extractedBillForm ? FlowStore.extractedBillForm(bill) : { form: {}, lines: [], conf: {} };
    this.setState(st => ({
      scanBusy: false,
      scanDone: true,
      scanLines: mapped.lines || [],
      scanConf: mapped.conf || {},
      form: Object.assign({}, st.form, mapped.form || {})
    }));
  }

  downloadNamedFile(name, body, mime) {
    if (typeof document === 'undefined' || typeof Blob === 'undefined') return;
    const blob = new Blob([body], { type: mime || 'application/xml' });
    const href = (typeof URL !== 'undefined' && URL.createObjectURL) ? URL.createObjectURL(blob) : '';
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    a.download = name;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      a.remove();
      if (typeof URL !== 'undefined' && URL.revokeObjectURL) URL.revokeObjectURL(href);
    }, 500);
  }

  runTallyExport() {
    if (typeof FlowStore === 'undefined' || !FlowStore.exportTallyXml) {
      this.toast('Tally XML export queued');
      return;
    }
    const file = FlowStore.exportTallyXml(this.state.periodFrom, this.state.periodTo);
    this.applyStore();
    this.downloadNamedFile(file.filename, file.xml, 'application/xml');
    this.toast('Downloaded ' + file.filename);
  }

  runZohoSync() {
    if (typeof FlowStore === 'undefined' || !FlowStore.simulateZohoSync) {
      this.toast('Syncing with Zoho Books…');
      return;
    }
    FlowStore.simulateZohoSync();
    this.applyStore();
    this.toast('Zoho Books sync simulated');
  }

  inRange(label, range) {
    // sample ledger runs across Aug 2026; "today" is 9 Aug
    const M = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const m = /^(\d{1,2})\s+([A-Za-z]{3})/.exec(String(label || ''));
    if (!m) return true;
    const day = parseInt(m[1], 10), mon = M[m[2]];
    if (mon === undefined) return true;
    const today = new Date(2026, 7, 9), when = new Date(2026, mon, day);
    const days = Math.round((today - when) / 86400000);
    if (range === 'Last 7 days') return days >= 0 && days <= 7;
    if (range === 'Last 30 days') return days >= 0 && days <= 30;
    if (range === 'This month') return mon === 7;
    return true;
  }

  row(t) {
    return Object.assign({}, t, {
      amt: this.fmt(t.amount), isIn: t.amount > 0, isOut: t.amount <= 0,
      srcAbbr: t.src.slice(0, 2).toUpperCase(), open: this.open('txn', t.id),
      isSettled: t.status === 'Settled', isPending: t.status === 'Pending', isRefunded: t.status === 'Refunded'
    });
  }

  setFilter(key, val) { return this.memo('_flt', key + '=' + val, () => () => this.setState(s => ({ filter: Object.assign({}, s.filter, { [key]: val }) }))); }
  filterOpts(key, list) {
    const cur = this.state.filter[key];
    return list.map(v => {
      const on = cur === v;
      return {
        label: v, on, off: !on, go: this.setFilter(key, v),
        style: 'font-size:12px; font-weight:' + (on ? '650' : '500') + '; padding:6px 12px; border-radius:8px; white-space:nowrap; transition:background .15s ease, color .15s ease, border-color .15s ease; color:' + (on ? 'var(--on-block)' : 'var(--ink-3)') + '; background:' + (on ? 'var(--btn-dark)' : 'var(--btn-light)') + '; border:1px solid ' + (on ? 'transparent' : 'var(--line)')
      };
    });
  }

  filterMenu(key, list, label) {
    const cur = this.state.filter[key];
    const active = cur !== 'All' && cur !== 'All time';
    const open = this.state.filterOpen === key;
    return {
      label, value: cur, active, open,
      chipStyle: 'display:inline-flex; align-items:center; gap:7px; padding:8px 13px; border-radius:9px; font-size:12.5px; font-weight:' + (active ? '650' : '500') + '; white-space:nowrap; transition:background .15s ease, border-color .15s ease; color:' + (active ? 'var(--on-block)' : 'var(--ink-2)') + '; background:' + (active ? 'var(--btn-dark)' : 'var(--btn-light)') + '; border:1px solid ' + (active ? 'transparent' : 'var(--line)'),
      caret: active ? 'var(--on-block)' : 'var(--ink-4)',
      toggle: this.memo('_fm', key, () => () => this.setState(s => ({ filterOpen: s.filterOpen === key ? null : key }))),
      options: list.map(v => ({
        label: v, on: v === cur,
        go: this.memo('_fmset', key + v, () => () => this.setState(s => ({ filter: Object.assign({}, s.filter, { [key]: v }), filterOpen: null })))
      }))
    };
  }

  retag(id, tag) { return this.memo('_rt', id + tag, () => () => { this.setState(s => ({ txns: s.txns.map(t => t.id === id ? Object.assign({}, t, { tag }) : t) })); this.toast('Tag updated'); }); }

  submitModal = () => {
    const s = this.state, f = s.form, k = s.modal;
    const num = v => Math.abs(parseFloat(String(v || '').replace(/[^0-9.]/g, '')) || 0);
    const appendOut = (txn) => {
      if (typeof FlowStore !== 'undefined' && FlowStore.appendTransaction) {
        FlowStore.appendTransaction(txn);
        this.applyStore({ modal: null });
        return;
      }
      const row = {
        id: txn.id, d: f.scanDate || f.expDate || '', offset: txn.dayOffset,
        amount: -(txn.amountMinor / 100), type: txn.type, src: 'Bank',
        party: txn.counterparty, tag: txn.tag, status: 'Settled',
        branchId: txn.branchId, invoiceId: txn.invoiceId
      };
      this.setState(st => ({ txns: [row].concat(st.txns || []), modal: null }));
    };
    if (k === 'link') {
      const amountMinor = Math.round((num(f.linkAmount) || 500) * 100);
      const desc = f.linkDesc || 'Payment';
      const finish = (payUrl, copied) => {
        this.applyStore({ modal: null });
        this.toast(copied ? 'Payment link created and copied' : 'Payment link created');
      };
      if (typeof FlowStore !== 'undefined' && FlowStore.createPaymentLink) {
        FlowStore.createPaymentLink({
          amountMinor,
          description: desc,
          clientId: f.linkClient || null,
          invoiceId: f.linkInvoice || null,
          expiry: f.linkExpiry || '-'
        }).then(link => {
          const clip = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
          if (clip && link.payUrl) {
            Promise.resolve(navigator.clipboard.writeText(link.payUrl)).then(() => finish(link.payUrl, true)).catch(() => finish(link.payUrl, false));
          } else {
            finish(link.payUrl, false);
          }
        }).catch(() => this.toast('Could not create payment link'));
        return;
      }
      const l = { id: 'l' + Date.now(), amount: amountMinor / 100, desc, status: 'Active', created: '', uses: 0, expiry: f.linkExpiry || '-', payUrl: '' };
      this.setState(st => ({ links: [l].concat(st.links), modal: null }));
      this.toast('Payment link created');
    } else if (k === 'expense') {
      appendOut({
        id: 'txn_exp_' + Date.now(),
        dayOffset: 0,
        counterparty: f.expParty || 'Expense',
        source: 'cash',
        direction: 'out',
        type: 'expense',
        tag: f.expTag || 'Supplies',
        status: 'settled',
        amountMinor: Math.round((num(f.expAmount) || 200) * 100),
        branchId: 'br_01',
        invoiceId: null
      });
      this.toast('Expense logged');
    } else if (k === 'scan') {
      if (s.scanBusy) return;
      const bill = typeof FlowStore !== 'undefined' && FlowStore.extractBill
        ? FlowStore.extractBill(f.scanVendor)
        : (typeof FlowStore !== 'undefined' && FlowStore.SAMPLE_BILL ? FlowStore.SAMPLE_BILL : { dayOffset: 0, source: 'bank', amountMinor: 118000, counterparty: 'Vendor', tag: 'Utilities' });
      const amountMinor = Math.round((num(f.scanAmount) || ((bill.amountMinor || 0) / 100)) * 100);
      let offset = f.scanOffset != null && f.scanOffset !== '' ? Number(f.scanOffset) : NaN;
      if (!Number.isFinite(offset) && typeof FlowStore !== 'undefined' && FlowStore.offsetFromLabel) {
        const parsed = FlowStore.offsetFromLabel(String(f.scanDate || ''));
        if (parsed != null) offset = parsed;
      }
      if (!Number.isFinite(offset)) offset = bill.dayOffset != null ? bill.dayOffset : 0;
      appendOut({
        id: 'txn_scan_' + Date.now(),
        dayOffset: offset,
        counterparty: f.scanVendor || bill.vendor || bill.counterparty || 'Vendor',
        source: bill.source || 'bank',
        direction: 'out',
        type: 'expense',
        tag: f.scanTag || bill.tag || 'Utilities',
        status: 'settled',
        amountMinor,
        branchId: bill.branchId || 'br_01',
        invoiceId: null
      });
      this.toast('Bill saved to Transactions');
    } else if (k === 'invoice') {
      const clientName = String(f.invClient || '').trim();
      if (!clientName) { this.toast('Pick a client first'); return; }
      const amountMajor = num(f.invAmount);
      if (!amountMajor) { this.toast('Add an amount'); return; }
      const saved = this.persistCreatedInvoice({
        clientName,
        amountMajor,
        dueRaw: f.invDue,
        draft: true,
        lines: amountMajor ? [{ description: 'Invoice', quantity: 1, unitMinor: Math.round(amountMajor * 100) }] : []
      });
      if (saved.error) {
        this.setState({ invDueError: saved.error });
        return;
      }
      this.applyStore({ modal: null, invDueError: '' });
      this.toast('Invoice created as draft');
    } else if (k === 'plan') {
      if (!f.planName || !String(f.planName).trim() || !num(f.planAmount)) { this.toast('Add a plan name and amount'); return; }
      if (typeof FlowStore !== 'undefined' && FlowStore.createSubscriptionPlan) {
        const self = this;
        FlowStore.createSubscriptionPlan({
          name: String(f.planName).trim(),
          amountMinor: Math.round(num(f.planAmount) * 100),
          interval: f.planInterval || 'Month',
          description: f.planDesc || '',
          customerName: f.planCustomer || ''
        }).then(function (plan) {
          const clip = typeof navigator !== 'undefined' && navigator.clipboard && plan && plan.signupUrl;
          self.applyStore({ modal: null });
          if (clip) Promise.resolve(navigator.clipboard.writeText(plan.signupUrl)).catch(function () {});
          self.toast('Plan created, signup link ready');
        }).catch(function () { self.toast('Could not create plan'); });
        return;
      }
      const slug = String(f.planName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
      const p = {
        id: 'p' + Date.now(), name: String(f.planName).trim(), amount: num(f.planAmount),
        interval: f.planInterval || 'Month', desc: f.planDesc || '', subs: 0, mrr: 0,
        slug: slug || 'plan'
      };
      this.setState(st => ({ plans: [p].concat(st.plans), modal: null })); this.toast('Plan created, signup link ready');
    } else if (k === 'member') {
      const m = { id: 'm' + Date.now(), name: f.memberName || 'New member', email: f.memberEmail || 'name@company.qa', role: f.memberRole || 'Staff', last: 'Invite sent' };
      this.setState(st => ({ team: st.team.concat([m]), modal: null })); this.toast('Invite sent');
    } else if (k === 'employee') {
      if (s.editEmp) {
        const id = s.editEmp;
        this.setState(st => ({
          employees: st.employees.map(x => x.id === id ? Object.assign({}, x, {
            name: f.empName || x.name, role: f.empRole || x.role,
            salary: num(f.empSalary) || x.salary, method: f.empMethod || x.method
          }) : x),
          modal: null, editEmp: null
        }));
        this.toast('Employee updated');
      } else {
        const e = { id: 'e' + Date.now(), name: f.empName || 'New employee', role: f.empRole || 'Staff', salary: num(f.empSalary) || 5000, method: f.empMethod || 'Bank transfer' };
        this.setState(st => ({ employees: st.employees.concat([e]), modal: null })); this.toast('Employee added');
      }
    } else if (k === 'reset') {
      this.runResetDemo();
    } else { this.setState({ modal: null }); }
  };

  runResetDemo() {
    if (typeof FlowStore !== 'undefined') {
      if (FlowStore.resetStore) FlowStore.resetStore();
      if (FlowStore.resetGateway) FlowStore.resetGateway();
    }
    this.applyStore({
      modal: null,
      detail: null,
      shopifyOauth: 'idle',
      bankOnboarding: 0,
      bankPick: null,
      ppView: 'list',
      ppPages: [],
      ppEditing: null,
      matchDone: 0,
      env: 'test'
    });
    this.toast('Demo data restored');
  }

  copyPayUrl(url) {
    let text = url || '';
    const origin = typeof location !== 'undefined' ? location.origin : '';
    if (text && !/^https?:\/\//.test(text)) text = origin + (text.charAt(0) === '/' ? text : '/' + text);
    const clip = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
    if (clip && text) {
      Promise.resolve(navigator.clipboard.writeText(text)).then(() => this.toast('Link copied to clipboard')).catch(() => this.toast('Link copied to clipboard'));
      return;
    }
    this.toast(text ? 'Link copied to clipboard' : 'No link to copy');
  }

  runSimulate(linkId, outcome) {
    if (typeof FlowStore === 'undefined' || !FlowStore.simulatePayment) {
      this.toast('Gateway is not available');
      return;
    }
    const self = this;
    FlowStore.simulatePayment(linkId, outcome).then(result => {
      self.applyStore();
      if (!result || !result.pending) {
        self.toast(outcome === 'success' || outcome === 'partial' ? 'Payment was not recorded' : 'Payment ' + outcome);
        return;
      }
      self.toast('Payment received, pending settlement');
      const delay = result.delayMs || 1200;
      setTimeout(() => {
        if (FlowStore.settlePayment) FlowStore.settlePayment(linkId);
        self.applyStore();
        self.toast('Payment settled');
      }, delay);
    }).catch(err => self.toast((err && err.message) || 'Could not simulate payment'));
  }

  deactivateLink(linkId) {
    if (typeof FlowStore === 'undefined' || !FlowStore.deactivatePaymentLink) {
      this.toast('Could not deactivate link');
      return;
    }
    FlowStore.deactivatePaymentLink(linkId);
    this.applyStore({ detail: null });
    this.toast('Link deactivated');
  }

  publishCheckout() {
    if (typeof FlowStore === 'undefined' || !FlowStore.publishCheckoutPage) {
      this.toast('Could not publish page');
      return;
    }
    const st = this.state;
    const priceField = (st.pp.fields || []).find(x => x.kind === 'price');
    const major = Math.abs(parseFloat(String((priceField && priceField.unitPrice) || '').replace(/[^0-9.]/g, '')) || 0);
    const amountMinor = Math.round(major * 100);
    if (!String(st.pp.title || '').trim()) {
      this.setState({ ppPublishError: 'Page title is required' });
      return;
    }
    if (!amountMinor) {
      this.setState({ ppPublishError: 'Amount is required' });
      return;
    }
    try {
      const page = FlowStore.publishCheckoutPage({
        id: st.ppEditing || undefined,
        productName: st.pp.title,
        description: st.pp.desc || '',
        amountMinor,
        slug: this.pageSlug(st),
        logoDataUrl: st.ppLogo || null,
        accent: st.brandColor || '#17171C',
        supportEmail: st.pp.email || '',
        supportPhone: st.pp.phone || '',
        terms: st.pp.terms !== false,
        payLabel: st.pp.payLabel || 'Pay',
        fields: (st.pp.fields || []).map(function (field) {
          return { label: field.label, kind: field.kind, optional: !!field.optional };
        })
      });
      const origin = typeof location !== 'undefined' ? location.origin : '';
      this.applyStore({
        pp: Object.assign({}, st.pp, { published: true }),
        ppEditing: page.id,
        ppView: 'published',
        ppPages: (st.ppPages || []).concat([]),
        ppPublishError: '',
        ps: Object.assign({}, st.ps, { slug: page.slug, slugCustom: true })
      });
      this.copyPayUrl(origin + '/pay/' + page.slug);
      this.toast('Page published');
    } catch (err) {
      this.toast((err && err.message) || 'Could not publish page');
    }
  }

  runBilling(chargeId) {
    if (typeof FlowStore === 'undefined' || !FlowStore.runSimulatedBilling) {
      this.toast('Billing is not available');
      return;
    }
    const self = this;
    FlowStore.runSimulatedBilling(chargeId).then(function (result) {
      self.applyStore();
      if (!result || !result.pending) {
        self.toast('Charge was not recorded');
        return;
      }
      self.toast('Charge received, pending settlement');
      setTimeout(function () {
        if (FlowStore.settleBilling) FlowStore.settleBilling(result.txnId);
        self.applyStore();
        self.toast('Charge settled');
      }, result.delayMs || 1200);
    }).catch(function () { self.toast('Could not run billing'); });
  }

  toggleSmartCheckout() {
    const on = !((this.state.smartCheckout || {}).on);
    if (typeof FlowStore !== 'undefined' && FlowStore.setSmartCheckout) {
      FlowStore.setSmartCheckout(on);
      this.applyStore();
      return;
    }
    this.setState(st => ({ smartCheckout: Object.assign({}, st.smartCheckout, { on }) }));
  }

  onLinkInvoice = (e) => {
    const id = e.target.value;
    const inv = (this.state.linkInvoices || []).find(x => x.id === id);
    this.setState(s => ({
      form: Object.assign({}, s.form, {
        linkInvoice: id,
        linkClient: inv ? inv.clientId : s.form.linkClient,
        linkAmount: inv ? String(inv.amount) : s.form.linkAmount
      })
    }));
  };

  applyReview(id, action, invNo, stay) {
    if (action !== 'reject' && typeof FlowStore !== 'undefined' && FlowStore.confirmMatch) {
      FlowStore.confirmMatch(id);
      this.applyStore({
        detail: null,
        page: stay ? this.state.page : 'transactions',
        tab: stay ? this.state.tab : Object.assign({}, this.state.tab, { transactions: 'matching' })
      });
      this.toast(invNo ? 'Linked to ' + invNo : 'Match confirmed');
      return;
    }
    this.setState(s => {
      const match = (s.matches || []).find(m => m.id === id) || (s.attention || []).find(a => a.id === id) || {};
      const drop = (list) => (list || []).filter(x => x.id !== id);
      const attention = drop(s.attention);
      const matches = drop(s.matches);
      const matchRate = this.matchRateFrom(s.matchRate, matches, attention);
      if (action === 'reject') {
        return { attention, matches, matchRate, detail: stay ? s.detail : null, page: stay ? s.page : 'transactions', tab: stay ? s.tab : Object.assign({}, s.tab, { transactions: 'matching' }) };
      }
      const invLabel = invNo || match.inv;
      const linked = invLabel && invLabel !== 'No invoice';
      const prevConf = typeof match.conf === 'number' ? match.conf : parseInt(match.conf, 10) || 0;
      const confirmed = Object.assign({}, match, { id: 'c' + id, sourceId: id, inv: invLabel, when: 'Just now', conf: 100, prevConf, why: match.why || match.note });
      return {
        attention,
        matches,
        matchRate,
        autoMatches: [confirmed].concat(s.autoMatches || []),
        invoices: (s.invoices || []).map(i => linked && (i.no === invLabel || i.id === match.invoiceId) ? Object.assign({}, i, { status: 'Paid', outstanding: 0, daysLate: 0 }) : i),
        txns: (s.txns || []).map(t => match.txnId && t.id === match.txnId && t.status === 'Pending' ? Object.assign({}, t, { status: 'Settled' }) : t),
        figures: Object.assign({}, s.figures, { pending: match.pending ? Math.max(0, (s.figures.pending || 0) - Math.abs(match.amount || 0)) : (s.figures && s.figures.pending) }),
        matchDone: (s.matchDone || 0) + 1,
        detail: stay ? null : null,
        page: stay ? s.page : 'transactions',
        tab: stay ? s.tab : Object.assign({}, s.tab, { transactions: 'matching' })
      };
    });
    this.toast(action === 'reject' ? 'Sent back for review' : (invNo ? 'Linked to ' + invNo : 'Match confirmed'));
  }
  matchRateFrom(rate, matches, attention) {
    const total = rate && rate.total != null ? rate.total : 0;
    const seen = {};
    let open = 0;
    (attention || []).concat(matches || []).forEach(row => {
      if (!row || !row.id || seen[row.id]) return;
      seen[row.id] = true;
      open += 1;
    });
    const matched = Math.max(0, total - open);
    return { matched, total, percent: total ? Math.round((matched / total) * 100) : 0, open };
  }
  liveMatch() {
    if (this.props.emptyState) {
      const total = (this.state.matchRate && this.state.matchRate.total) || 0;
      return { openItems: [], open: 0, total, matched: total, percent: total ? 100 : 0 };
    }
    const rate = this.matchRateFrom(this.state.matchRate, this.state.matches, this.state.attention);
    const seen = {};
    const openItems = [];
    (this.state.attention || []).concat(this.state.matches || []).forEach(row => {
      if (!row || !row.id || seen[row.id]) return;
      seen[row.id] = true;
      openItems.push(row);
    });
    return Object.assign({ openItems }, rate);
  }
  resolveAtt(id, ok) {
    return this.memo('_att', id + ok, () => () => this.applyReview(id, ok ? 'confirm' : 'reject', null, true));
  }

  periodOf() {
    const tf = this.state.tf || 'month';
    return (this.state.periods && this.state.periods[tf]) || { moneyIn: 0, moneyOut: 0, pending: 0, net: 0, series: { labels: [], values: [] } };
  }
  reportsPeriod() {
    const tf = this.state.reportsTf || 'month';
    return (this.state.periods && this.state.periods[tf]) || { moneyIn: 0, moneyOut: 0, pending: 0, net: 0, label: 'Last 30 days', series: { labels: [], values: [] }, pnl: {}, branches: [], runway: {}, spend: { tags: [], vendors: [] }, forecast: [], range: '' };
  }
  series() {
    const boxed = this.periodOf().series;
    if (boxed && boxed.values && boxed.values.length) {
      const v = boxed.values.slice();
      const net = this.periodOf().net;
      v[v.length - 1] = net;
      return { v, l: boxed.labels.slice() };
    }
    const tf = this.state.tf;
    const labels = tf === 'day'
      ? ['9a', '11a', '1p', '3p', '5p', '7p', '9p', 'Now']
      : tf === 'month'
        ? ['W1', '', 'W2', '', 'W3', '', 'W4', '', 'W5', 'Now']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Now'];
    return { v: new Array(labels.length).fill(0), l: labels };
  }

  chart() {
    const { v, l } = this.series();
    const W = 720, H = 190, PAD = 22;
    const series = this.periodOf().series;
    const scale = series.scale || { min: 0, max: 1, ticks: [] };
    const yFor = value => H - PAD - ((value - scale.min) / (scale.max - scale.min)) * (H - PAD - 20);
    const pts = v.map((y, i) => [(i / (v.length - 1)) * W, yFor(y)]);
    const n = pts.length, dx = [], slope = [], m = [];
    for (let i = 0; i < n - 1; i++) { dx.push(pts[i + 1][0] - pts[i][0]); slope.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0])); }
    m.push(slope[0]);
    for (let i = 1; i < n - 1; i++) {
      if (slope[i - 1] * slope[i] <= 0) m.push(0);
      else {
        const w1 = 2 * dx[i] + dx[i - 1], w2 = dx[i] + 2 * dx[i - 1];
        m.push((w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]));
      }
    }
    m.push(slope[n - 2]);
    let d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (let i = 0; i < n - 1; i++) {
      const t = dx[i] / 3;
      d += ' C' + (pts[i][0] + t).toFixed(1) + ' ' + (pts[i][1] + m[i] * t).toFixed(1) +
           ',' + (pts[i + 1][0] - t).toFixed(1) + ' ' + (pts[i + 1][1] - m[i + 1] * t).toFixed(1) +
           ',' + pts[i + 1][0].toFixed(1) + ' ' + pts[i + 1][1].toFixed(1);
    }
    const endY = pts[n - 1][1].toFixed(1);
    d += ' L' + (W + 4) + ' ' + endY;
    const area = d + ' L' + (W + 4) + ' ' + H + ' L0 ' + H + ' Z';
    const hi = this.state.hoverIdx;
    const idx = hi === null || hi === undefined ? v.length - 1 : Math.max(0, Math.min(v.length - 1, hi));
    const p = pts[idx];
    const valueText = (series.valueTexts || [])[idx] || '';
    const gridVals = scale.ticks.map(tick => {
      const yy = yFor(tick.value);
      return { y: yy.toFixed(1), top: ((yy / H) * 100).toFixed(2) + '%', label: tick.label, zero: tick.value === 0 };
    });
    const grids = gridVals.filter(g => !g.zero).map(g => '<path d="M0 ' + g.y + 'H' + W + '" stroke="rgba(255,255,255,.08)" stroke-width="1" stroke-dasharray="2 7" fill="none"/>').join('');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 190" preserveAspectRatio="none">' +
      '<defs>' +
        '<linearGradient id="flowg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#8FE9C2" stop-opacity=".26"/>' +
          '<stop offset="45%" stop-color="#8FE9C2" stop-opacity=".10"/>' +
          '<stop offset="100%" stop-color="#8FE9C2" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<linearGradient id="flowline" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#FFFFFF" stop-opacity=".75"/>' +
          '<stop offset="62%" stop-color="#B6F0D6"/>' +
          '<stop offset="100%" stop-color="#5FE0AC"/>' +
        '</linearGradient>' +
      '</defs>' +
      grids +
      '<path d="' + area + '" fill="url(#flowg)"/>' +
      '<path d="' + d + '" fill="none" stroke="url(#flowline)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="butt" vector-effect="non-scaling-stroke"/>' +
      '<line x1="' + p[0].toFixed(1) + '" y1="0" x2="' + p[0].toFixed(1) + '" y2="190" stroke="rgba(255,255,255,.22)" stroke-width="1" stroke-dasharray="3 5"/>' +
      '</svg>';
    return {
      line: d, area, labels: l.map(t => ({ t, axisStyle: this.state.tf === 'month' ? 'flex:1; min-width:0; white-space:nowrap' : '' })),
      gridVals,
      marker: { x: p[0].toFixed(1), y: p[1].toFixed(1), value: valueText },
      dot: { left: ((p[0] / W) * 100).toFixed(2) + '%', top: ((p[1] / H) * 100).toFixed(2) + '%' },
      tip: {
        left: 'clamp(6px, calc(' + ((p[0] / W) * 100).toFixed(2) + '% - 52px), calc(100% - 122px))',
        top: p[1] < 56
          ? 'calc(' + ((p[1] / H) * 100).toFixed(2) + '% + 16px)'
          : 'calc(' + ((p[1] / H) * 100).toFixed(2) + '% - 42px)',
        value: valueText
      },
      src: 'data:image/svg+xml,' + encodeURIComponent(svg)
    };
  }
  componentDidMount() {
    this._onResize = () => {
      const win = window.innerWidth || document.documentElement.clientWidth || 1280;
      let w = win;
      try {
        const el = document.querySelector('[data-theme]');
        const p = el && el.parentElement;
        const r = el ? el.getBoundingClientRect().width : 0;
        const pr = p ? p.getBoundingClientRect().width : 0;
        const m = Math.max(r, pr);
        // only trust the element once it has a real laid-out box
        if (m > 200) w = Math.round(m);
      } catch (e) {}
      if (w !== this.state.vw) this.setState({ vw: w });
    };
    window.addEventListener('resize', this._onResize);
    this._onResize();
    try {
      const el = (this.rootRef && this.rootRef.current) || document.querySelector('[data-theme]');
      if (el && typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(() => this._onResize());
        this._ro.observe(el);
      }
    } catch (e) {}
    requestAnimationFrame(() => this._onResize());
    setTimeout(() => this._onResize(), 0);
    setTimeout(() => this._onResize(), 120);
    try { document.title = 'Flow · Business banking dashboard'; } catch (e) {}
    this._onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.setState({ searchOpen: true });
      } else if (e.key === 'Escape') {
        this.setState(s => (s.modal ? { modal: null } : s.searchOpen ? { searchOpen: false, search: '' } : s.moreOpen ? { moreOpen: false } : s.userMenu ? { userMenu: false } : s.fly ? { fly: null, railOpen: false } : s.pickFor ? { pickFor: null } : s.detail ? { detail: null } : null));
      }
    };
    this._onPointer = (e) => {
      if (!this.state.userMenu) return;
      const t = e.target;
      if (t && t.closest && t.closest('[data-user-menu]')) return;
      this.setState({ userMenu: false });
    };
    window.addEventListener('keydown', this._onKey);
    document.addEventListener('pointerdown', this._onPointer, true);
    this.syncMatchFill(true);
  }
  componentDidUpdate() {
    this.syncMatchFill();
  }
  syncMatchFill(immediate) {
    const next = (this.liveMatch().percent || 0) + '%';
    const prev = this._matchFillW;
    this._matchFillW = next;
    const el = typeof document === 'undefined' ? null : document.querySelector('[data-match-fill]');
    if (!el) return;
    if (immediate || !prev || prev === next) {
      el.style.width = next;
      return;
    }
    el.style.transition = 'none';
    el.style.width = prev;
    void el.offsetWidth;
    el.style.transition = 'width .55s cubic-bezier(.32,.72,0,1)';
    el.style.width = next;
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('keydown', this._onKey);
    document.removeEventListener('pointerdown', this._onPointer, true);
    if (this._ro) this._ro.disconnect();
  }

  chartHover = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const n = this.series().v.length;
    const i = Math.round(((e.clientX - r.left) / r.width) * (n - 1));
    if (i !== this.state.hoverIdx) this.setState({ hoverIdx: i });
  };
  chartLeave = () => this.setState({ hoverIdx: null });

  headFor() {
    const d = this.state.detail;
    if (d) {
      const T = {
        txn: ['Transaction', 'Full record and history'], invoice: ['Invoice', 'Client-facing view and status'],
        link: ['Payment Link', 'Usage and sharing'], plan: ['Subscription Plan', 'Subscribers and revenue'],
        sub: ['Subscriber', 'Billing history and retries'], match: ['Match Review', 'Side-by-side comparison'],
        client: ['Client', 'Invoices and lifetime totals'], synclog: ['Sync Batch', 'Line-by-line results'],
        gateway: ['SkipCash', 'Keys, webhooks and health'], report: ['Saved Report', 'Re-run, edit or export'],
        member: ['Team Member', 'Permissions and activity'], branch: ['Branch', 'Settings and ledger'],
        employee: ['Employee', 'Payslips and salary history']
      }[d.type] || ['Details', ''];
      return { title: T[0], sub: T[1] };
    }
    return {
      dashboard: { title: 'Home', sub: 'Everything at a glance' },
      payments: { title: 'Get Paid', sub: 'Pick how you want money to reach you' },
      transactions: { title: 'Money In & Out', sub: 'Every payment and expense in one place' },
      invoicing: { title: 'Invoices', sub: 'Bill clients and get paid' },
      accounting: { title: 'Sync to Books', sub: 'Keep your accounting software up to date' },
      connections: { title: 'Connected Apps', sub: 'Everything Flow is plugged into' },
      reports: { title: 'Reports', sub: 'Six questions about your business, answered' },
      team: { title: 'Your Team', sub: 'Who can do what, and what they did' },
      payroll: { title: 'Payroll', sub: 'Pay your team and keep records' },
      settings: { title: 'Settings', sub: 'Your business, account and security' }
    }[this.state.page];
  }

  confirmMatch(id, inv) { this.applyReview(id, 'confirm', inv || null, false); }
  rejectMatch(id) { this.applyReview(id, 'reject', null, false); }
  undoMatch(id) {
    this.setState(s => {
      const done = (s.autoMatches || []).find(m => m.id === id);
      if (!done || !done.sourceId) return { autoMatches: (s.autoMatches || []).filter(m => m.id !== id), detail: null };
      const restored = Object.assign({}, done, { id: done.sourceId, conf: done.prevConf || 0 });
      const open = (s.matches || []).some(m => m.id === restored.id);
      return {
        autoMatches: s.autoMatches.filter(m => m.id !== id),
        matches: open ? s.matches : [restored].concat(s.matches || []),
        attention: (s.attention || []).some(a => a.id === restored.id) ? s.attention : [{ id: restored.id, amount: done.amount, d: done.d || done.when, src: done.src, note: done.note || ('Suggested match: ' + (done.inv || 'No invoice') + ', ' + (done.why || '')), conf: (done.prevConf || 0) + '%', inv: done.inv, invoiceId: done.invoiceId, txnId: done.txnId, pending: done.pending, why: done.why, party: done.party }].concat(s.attention || []),
        matchRate: this.matchRateFrom(s.matchRate, open ? s.matches : [restored].concat(s.matches || []), (s.attention || []).some(a => a.id === restored.id) ? s.attention : [{ id: restored.id }].concat(s.attention || [])),
        detail: null
      };
    });
    this.toast('Match undone');
  }

  pushNav(page, tab) {
    const key = page + '|' + tab;
    this._stack = this._stack || [];
    if (this._navKey && this._navKey !== key) this._stack.push(this._navKey);
    if (this._stack.length > 12) this._stack.shift();
    this._navKey = key;
  }
  navBack() {
    const prev = (this._stack || []).pop();
    if (!prev) { this.setState({ page: 'dashboard', detail: null }); return; }
    const [page, tab] = prev.split('|');
    this._navKey = null;
    this.setState(s => ({ page, detail: null, tab: Object.assign({}, s.tab, { [page]: tab }) }));
  }
  backLabel() {
    const prev = (this._stack || [])[this._stack.length - 1];
    if (!prev) return 'Home';
    const [page, tab] = prev.split('|');
    const { D } = this.dests();
    const SEC = { dashboard: 'Home', payments: 'Get Paid', transactions: 'Money In & Out', invoicing: 'Invoices', accounting: 'Sync to Books', connections: 'Connected Apps', reports: 'Reports', team: 'Your Team', payroll: 'Payroll', settings: 'Settings' };
    if (page === 'dashboard') return 'Home';
    if (tab === 'hub' || !tab) return (SEC[page] || 'Home') + ' overview';
    const e = (D[page] || []).find(x => x[0] === tab);
    return e ? e[1] : (SEC[page] || 'Home');
  }
  dflt(p) {
    const { D, HUBS } = this.dests();
    if (HUBS.indexOf(p) >= 0) return 'hub';
    return D[p] ? D[p][0][0] : 'hub';
  }
  dests() {
    const D = {
      payments: [
        ['links', 'Payment Links', 'Get paid without building a page', 'link'],
        ['checkout', 'Payment Page', 'A page customers open, fill in and pay on', 'page'],
        ['subs', 'Subscriptions', 'Charge customers automatically, on repeat', 'repeat'],
        ['gateway', 'Payment Setup', 'Your gateway, branding and test mode', 'gear'],
        ['bank', 'Connect Your Bank', 'Link your bank to see money as it arrives', 'bank'],
        ['shopify', 'Shopify Store', 'Take payments on your online store', 'store']
      ],
      transactions: [
        ['all', 'All Transactions', 'Every payment and expense in one list', 'list'],
        ['matching', 'Match My Payments', 'Confirm which payment belongs to which invoice', 'match'],
        ['scan', 'Scan a Bill', 'Photograph a receipt and log it in seconds', 'scan'],
        ['bank', 'Bank Activity', 'What your bank account is showing', 'bank']
      ],
      invoicing: [
        ['all', 'All Invoices', 'Paid, unpaid and drafts in one list', 'list'],
        ['create', 'New Invoice', 'Bill a client and get paid', 'doc'],
        ['reminders', 'Reminders', 'Automatic nudges for unpaid invoices', 'bell'],
        ['recurring', 'Recurring', 'Bill the same client every month', 'repeat'],
        ['clients', 'Clients', 'Contacts and what each one owes you', 'people']
      ],
      accounting: [
        ['tally', 'Tally Export', 'The file your accountant already works in', 'doc'],
        ['zoho', 'Zoho Sync', 'Two-way sync if you keep books in Zoho', 'repeat'],
        ['tax', 'Tax', 'Not registered for this merchant', 'cash']
      ],
      connections: [
        ['gateways', 'Payment Gateways', 'What is simulated, and what is on the way', 'card'],
        ['banks', 'Banks', 'Where your account activity comes from', 'bank'],
        ['platforms', 'Accounting & Platforms', 'Zoho, Tally and your online store', 'repeat']
      ],
      reports: [
        ['overview', 'Am I making money?', 'Income minus costs for the period', 'chart'],
        ['spend', 'Where is money leaking?', 'Spending broken down by label and vendor', 'tag'],
        ['cash', 'Will I have enough?', 'Runway and a simple forecast', 'cash'],
        ['receivables', 'Who owes me?', 'Unpaid invoices, oldest first', 'clock'],
        ['branches', 'How is each branch doing?', 'Side-by-side comparison', 'building'],
        ['pack', 'What do I hand my accountant?', 'A period pack, ready to file', 'doc']
      ],
      team: [
        ['members', 'Members', 'Invite people and set their role', 'people'],
        ['approvals', 'Approval Limits', 'Who can sign off how much', 'match'],
        ['permissions', 'Permissions', 'Turn access on and off per role', 'shield'],
        ['audit', 'Activity', 'A dated record of every action', 'clock']
      ],
      payroll: [
        ['payslips', 'Payslips', 'Monthly slips, totals and net to pay', 'doc'],
        ['employees', 'Employees', 'Salaries and how each person is paid', 'people'],
        ['tax', 'Deductions', 'What comes off each salary, worked out for you', 'cash']
      ],
      settings: [
        ['profile', 'Business Profile', 'Name, address and tax registration', 'building'],
        ['account', 'Account', 'Your name, email, password and notifications', 'gear'],
        ['tags', 'Manage Tags', 'The labels you group spending under', 'tag'],
        ['billing', 'Billing', 'What you pay for Flow, and when', 'cash'],
        ['security', 'Security', 'Two-step login, biometrics and active sessions', 'shield']
      ]
    };
    const HUBS = ['payments', 'transactions', 'invoicing', 'connections', 'reports', 'team'];
    return { D, HUBS };
  }

  icons() {
    if (this._icons) return this._icons;
    const IC = {
      card: 'M2.6 5.4h14.8a1.4 1.4 0 0 1 1.4 1.4M2.2 8.8h15.6M4 5.2h12a1.8 1.8 0 0 1 1.8 1.8v6a1.8 1.8 0 0 1-1.8 1.8H4a1.8 1.8 0 0 1-1.8-1.8V7A1.8 1.8 0 0 1 4 5.2Z',
      link: 'M8.2 11.8 11.8 8.2M7.4 13.4a2.6 2.6 0 0 1 0-3.7l1.5-1.5M12.6 6.6a2.6 2.6 0 0 1 3.7 3.7l-1.5 1.5M6.4 12.4l-1.5 1.5a2.6 2.6 0 0 0 3.7 3.7',
      repeat: 'M16.6 7a6.6 6.6 0 0 0-11.4.4M3.4 13a6.6 6.6 0 0 0 11.4-.4M14.5 3v4h-4M5.5 17v-4h4',
      bank: 'M3 8.2 10 4l7 4.2M4.6 8.2v7.4M15.4 8.2v7.4M3 16.4h14M7.6 11v3.2M12.4 11v3.2',
      page: 'M2.8 5.2a1.6 1.6 0 0 1 1.6-1.6h11.2a1.6 1.6 0 0 1 1.6 1.6v9.6a1.6 1.6 0 0 1-1.6 1.6H4.4a1.6 1.6 0 0 1-1.6-1.6V5.2ZM2.8 7.6h14.4M5.2 5.6h.02M7 5.6h.02M6 10.4h8M6 13h5',
      store: 'M4 7.4h12l-1 9.2a1.4 1.4 0 0 1-1.4 1.2H6.4A1.4 1.4 0 0 1 5 16.6L4 7.4ZM7.6 7.4V5.6a2.4 2.4 0 0 1 4.8 0v1.8',
      gear: 'M10 2.3l1.3 2.2 2.5-.4.6 2.4 2.2 1.3-1.2 2.2 1.2 2.2-2.2 1.3-.6 2.4-2.5-.4L10 17.7l-1.3-2.2-2.5.4-.6-2.4-2.2-1.3 1.2-2.2-1.2-2.2 2.2-1.3.6-2.4 2.5.4ZM10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z',
      list: 'M6.4 5.6h11M6.4 10h11M6.4 14.4h11M3.2 5.6h.02M3.2 10h.02M3.2 14.4h.02',
      match: 'm5.4 10.2 2.9 2.9 6.3-6.3M2.6 10a7.4 7.4 0 1 1 14.8 0 7.4 7.4 0 0 1-14.8 0Z',
      scan: 'M3 7.2V4.7A1.7 1.7 0 0 1 4.7 3h2.5M12.8 3h2.5A1.7 1.7 0 0 1 17 4.7v2.5M17 12.8v2.5a1.7 1.7 0 0 1-1.7 1.7h-2.5M7.2 17H4.7A1.7 1.7 0 0 1 3 15.3v-2.5M5.6 10h8.8',
      tag: 'M10.6 2.8H16a1.2 1.2 0 0 1 1.2 1.2v5.4a1.2 1.2 0 0 1-.35.85l-6.35 6.35a1.2 1.2 0 0 1-1.7 0L3.55 11.2a1.2 1.2 0 0 1 0-1.7l6.2-6.35ZM13.6 6.4h.02',
      chart: 'M4.6 16.6v-4.4M9.3 16.6V9M14 16.6V7.4M17.4 16.6V5.4',
      doc: 'M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM8.4 9.6h3.2M8.4 12.4h2.2M6.1 6.4h7.8',
      clock: 'M10 6v4.2l2.8 1.8M2.6 10a7.4 7.4 0 1 1 14.8 0 7.4 7.4 0 0 1-14.8 0Z',
      people: 'M13.6 17c0-2.6-1.6-4.2-3.6-4.2S6.4 14.4 6.4 17M10 4.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2ZM15.4 12.9c1.5.5 2.5 1.9 2.6 3.6M4.6 12.9C3.1 13.4 2.1 14.8 2 16.5',
      shield: 'M10 2.8 4.6 5v4.4c0 3.4 2.2 6.3 5.4 7.8 3.2-1.5 5.4-4.4 5.4-7.8V5L10 2.8Zm-2 7 1.6 1.7 3.2-3.4',
      cash: 'M10 5.4v9.2M12.4 7.6c0-1-1.1-1.8-2.4-1.8s-2.4.8-2.4 1.8S8.7 9.4 10 9.4s2.4.8 2.4 1.8-1.1 1.8-2.4 1.8-2.4-.8-2.4-1.8',
      bell: 'M7.4 16.2a2.6 2.6 0 0 0 5.2 0M15 12.6V9a5 5 0 0 0-10 0v3.6L3.6 14.6h12.8L15 12.6Z',
      grid: 'M3.4 3.4h5.6v5.6H3.4V3.4Zm7.6 0h5.6v5.6H11V3.4ZM3.4 11h5.6v5.6H3.4V11Zm7.6 0h5.6v5.6H11V11Z',
      building: 'M4.4 17V4.6A1.6 1.6 0 0 1 6 3h5.4a1.6 1.6 0 0 1 1.6 1.6V17M13 8.4h2.4A1.6 1.6 0 0 1 17 10v7M3 17h14M7.2 6.8h2.8M7.2 10h2.8M7.2 13.2h2.8'
    };
    this._icons = IC;
    return IC;
  }

  swTrack(on) {
    return 'position:relative; width:42px; height:24px; flex:0 0 42px; border-radius:13px; padding:0; border:1px solid ' + (on ? 'transparent' : 'var(--line)') + '; background:' + (on ? 'linear-gradient(180deg,var(--ink-2),var(--ink-block))' : 'var(--toggle-off)') + '; box-shadow:' + (on ? 'inset 0 1px 2px rgba(0,0,0,.25)' : 'none') + '; transition:background .28s cubic-bezier(.32,.72,0,1), border-color .28s ease, box-shadow .28s ease';
  }
  swKnob(on) {
    return 'position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:#FFFFFF; box-shadow:0 1px 3px rgba(0,0,0,.3); transform:translateX(' + (on ? '18px' : '0') + '); transition:transform .28s cubic-bezier(.32,.72,0,1), background .28s ease';
  }

  chip(status) {
    const map = {
      Paid: ['var(--pos)', 'var(--pos-soft)'], Settled: ['var(--pos)', 'var(--pos-soft)'], Success: ['var(--pos)', 'var(--pos-soft)'],
      Simulated: ['var(--ink-3)', 'var(--chip)'],
      'Awaiting Settlement': ['var(--ink-3)', 'var(--chip)'],
      Overdue: ['var(--neg)', 'var(--neg-soft)'], Refunded: ['var(--neg)', 'var(--neg-soft)'], Error: ['var(--neg)', 'var(--neg-soft)'],
      Active: ['var(--ink-2)', 'var(--chip)'], Connected: ['var(--ink-2)', 'var(--chip)'],
      Pending: ['var(--ink-3)', 'var(--chip)'], Viewed: ['var(--ink-3)', 'var(--chip)'], Retrying: ['var(--ink-3)', 'var(--chip)'], Partial: ['var(--ink-3)', 'var(--chip)'], Sandbox: ['var(--ink-3)', 'var(--chip)'],
      Deactivated: ['var(--ink-4)', 'var(--divider)'], Expired: ['var(--ink-4)', 'var(--divider)'], Canceled: ['var(--neg)', 'var(--neg-soft)'], Paused: ['var(--ink-3)', 'var(--chip)'],
      Draft: ['var(--ink-4)', 'var(--divider)'], Sent: ['var(--ink-2)', 'var(--chip)']
    };
    const c = map[status] || ['var(--ink-3)', 'var(--divider)'];
    return 'display:inline-block; font-size:12.5px; font-weight:600; letter-spacing:-.005em; white-space:nowrap; color:' + c[0];
  }

  pageVals(s, d) {
    const T = p => this.tabOf(p, this.dflt(p));
    const flags = (p, keys) => { const cur = T(p), o = {}; keys.forEach(k => o[k] = cur === k); return o; };

    const links = s.links.map(l => Object.assign({}, l, {
      amt: this.fmt(l.amount), chip: this.chip(l.status), open: this.open('link', l.id), uses: String(l.uses),
      copy: this.memo('_lcp', l.id, () => (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.copyPayUrl(l.payUrl); })
    }));
    const mrrAll = s.plans.reduce((a, p) => a + p.mrr, 0);
    const subsAll = s.plans.reduce((a, p) => a + p.subs, 0);
    const plans = s.plans.map(p => Object.assign({}, p, {
      copy: this.memo('_plc', p.id, () => (e) => { e.stopPropagation(); this.copyPayUrl(p.signupUrl || p.payUrl); }),
      amt: this.fmt0(p.amount) + ' / ' + String(p.interval || 'Month').toLowerCase(),
      every: (s.upcomingCharges || []).some(c => c.planId === p.id)
        ? 'Next charge ' + ((s.upcomingCharges || []).find(c => c.planId === p.id) || {}).when
        : (p.status === 'Canceled' ? 'Canceled' : 'No upcoming charge'),
      mrrT: this.fmt0(p.mrr), subsT: String(p.subs),
      share: Math.round((p.mrr / Math.max(mrrAll, 1)) * 100) + '%',
      open: this.open('plan', p.id)
    }));
    const subsSum = {
      mrr: this.fmt0(mrrAll), people: String(subsAll),
      plans: s.plans.length + (s.plans.length === 1 ? ' plan' : ' plans'),
      avg: this.fmt0(subsAll ? Math.round(mrrAll / subsAll) : 0)
    };
    const invoices = s.invoices.map(i => Object.assign({}, i, { amt: this.fmt(i.amount), chip: this.chip(i.status), open: this.open('invoice', i.id) }));
    const remindable = { Sent: 1, Viewed: 1, Overdue: 1, 'Awaiting Settlement': 1 };
    const reminderInvoices = (s.reminderInvoices && s.reminderInvoices.length ? s.reminderInvoices : invoices.filter(i => remindable[i.status])).map(i => Object.assign({}, i, {
      amt: this.fmt(i.amount), chip: this.chip(i.status),
      remind: this.memo('_irn', i.id, () => () => this.sendInvoiceReminder(i.client))
    }));
    const clients = s.clients.map(c => Object.assign({}, c, {
      total: this.fmt0(c.total), open: this.open('client', c.id),
      count: String(c.invoiceCount != null ? c.invoiceCount : s.invoices.filter(i => i.client === c.name).length),
      initials: c.name.split(' ').filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase()
    }));
    const team = s.team.map(m => Object.assign({}, m, { open: this.open('member', m.id), initials: m.name.split(' ').map(x => x[0]).join('') }));
    const employees = s.employees.map(e => Object.assign({}, e, {
      sal: this.fmt0(e.salary), open: this.open('employee', e.id),
      edit: this.memo('_eemp', e.id, () => (ev) => {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        this.setState(st => ({
          modal: 'employee', editEmp: e.id,
          form: Object.assign({}, st.form, { empName: e.name, empRole: e.role, empSalary: String(e.salary), empMethod: e.method })
        }));
      })
    }));
    const branches = s.branches.map(b => Object.assign({}, b, { rev: this.fmt0(b.revenue), staffT: String(b.staff), open: this.open('branch', b.id) }));
    const reports = s.reports.map(r => Object.assign({}, r, { open: this.open('report', r.id) }));
    const exportHistory = s.exportHistory || [];
    const exports = {
      any: exportHistory.length > 0,
      none: exportHistory.length === 0,
      rows: exportHistory.map(l => Object.assign({}, l, { chip: this.chip(l.status), open: this.open('synclog', l.id), itemsT: String(l.items), errT: String(l.errors) }))
    };
    const syncLog = (s.syncLog || []).map(l => Object.assign({}, l, { chip: this.chip(l.status), open: this.open('synclog', l.id), itemsT: String(l.items), errT: String(l.errors) }));
    const matches = s.matches.map(m => Object.assign({}, m, { amt: this.fmt(m.amount), confT: m.conf + '%', open: this.open('match', m.id), high: m.conf >= 85, low: m.conf < 85 }));

    const rows = this.filtered().map(t => Object.assign({}, this.row(t), { chip: this.chip(t.status) }));
    const tagTotals = s.tags.map(tg => {
      const list = s.txns.filter(t => t.tag === tg);
      const inn = list.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
      const out = list.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0);
      return { tag: tg, inT: this.fmt0(inn), outT: this.fmt0(Math.abs(out)), count: String(list.length), go: this.setFilter('tag', tg), bar: Math.min(100, Math.round((Math.max(inn, Math.abs(out)) / 20000) * 100)) + '%' };
    });

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekBuckets = weekDays.map((day, i) => {
      const offset = i - 6;
      const list = s.txns.filter(t => t.offset === offset);
      const inn = list.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
      const out = Math.abs(list.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0));
      return { day, inn, out };
    });
    const cfMax = Math.max(1, ...weekBuckets.map(b => Math.max(b.inn, b.out)));
    const cash = weekBuckets.map(b => ({ day: b.day, inH: (b.inn / cfMax * 130).toFixed(0) + 'px', outH: (b.out / cfMax * 130).toFixed(0) + 'px', inT: 'QR ' + Math.round(b.inn).toLocaleString('en-US') }));

    const det = {};
    if (d) {
      det.type = d.type;
      det.txn = d.type === 'txn'; det.invoice = d.type === 'invoice'; det.link = d.type === 'link'; det.plan = d.type === 'plan';
      det.sub = d.type === 'sub'; det.match = d.type === 'match'; det.client = d.type === 'client'; det.synclog = d.type === 'synclog';
      det.gateway = d.type === 'gateway'; det.report = d.type === 'report'; det.member = d.type === 'member'; det.branch = d.type === 'branch'; det.employee = d.type === 'employee';
      const find = (arr, id) => arr.find(x => x.id === id) || {};
      if (det.txn) { const t = find(s.txns, d.id); det.o = Object.assign({}, t, { amt: this.fmt(t.amount), chip: this.chip(t.status), isIn: t.amount > 0 }); }
      if (det.invoice) {
        const i = find(s.invoices, d.id);
        det.o = Object.assign({}, i, {
          amt: this.fmt(i.amount), chip: this.chip(i.status), taxAmt: this.fmt(0), total: this.fmt(i.amount),
          createdOn: i.issued || i.createdOn || '',
          sentOn: i.sentOn || '—',
          viewedOn: i.viewedOn || '—',
          sendReminder: this.memo('_irs', i.id, () => () => this.sendInvoiceReminder(i.client)),
          duplicate: this.memo('_idp', i.id, () => () => this.duplicateStoredInvoice(i.id)),
          voidInvoice: this.memo('_ivd', i.id, () => () => this.toast('Void is sample-only in this sandbox'))
        });
      }
      if (det.link) {
        const l = find(s.links, d.id);
        det.o = Object.assign({}, l, {
          amt: this.fmt(l.amount), chip: this.chip(l.status),
          url: l.url || (l.payUrl ? String(l.payUrl).replace(/^https?:\/\//, '') : 'pay.flow.qa/l/' + l.id),
          usesT: String(l.uses),
          copy: this.memo('_ldcp', l.id, () => () => this.copyPayUrl(l.payUrl)),
          canDeactivate: !!l.canDeactivate,
          deactivate: this.memo('_ldoff', l.id, () => () => this.deactivateLink(l.id)),
          showSimulate: s.env === 'test' && !!l.canSimulate,
          simSuccess: this.memo('_sims', l.id, () => () => this.runSimulate(l.id, 'success')),
          simDecline: this.memo('_simd', l.id, () => () => this.runSimulate(l.id, 'decline')),
          simTimeout: this.memo('_simt', l.id, () => () => this.runSimulate(l.id, 'timeout')),
          simPartial: this.memo('_simp', l.id, () => () => this.runSimulate(l.id, 'partial'))
        });
      }
      if (det.plan) { const p = find(s.plans, d.id); const plSubs = s.subscribers.filter(x => x.plan === p.id);
        const charges = (s.upcomingCharges || []).filter(c => c.planId === p.id);
        det.o = Object.assign({}, p, {
          amt: this.fmt0(p.amount), mrrT: this.fmt0(p.mrr), subsT: String(p.subs),
          url: p.url || (p.signupUrl ? String(p.signupUrl).replace(/^https?:\/\//, '') : ''),
          descOn: !!p.desc,
          noSubs: plSubs.length === 0,
          hasCharges: charges.length > 0,
          charges: charges.map(c => Object.assign({}, c, {
            run: this.memo('_bill', c.id, () => () => this.runBilling(c.id))
          })),
          copy: this.memo('_pdcp', p.id, () => () => this.copyPayUrl(p.signupUrl)),
          addSub: () => {
            const nm = ['Layla Hassan', 'Omar Farouk', 'Aisha Rahman', 'Yusuf Karim'][s.subscribers.length % 4];
            if (typeof FlowStore !== 'undefined' && FlowStore.addSubscriber) {
              FlowStore.addSubscriber(p.id, nm);
              this.applyStore();
              this.toast(nm + ' subscribed');
              return;
            }
            this.setState(st => ({
              subscribers: [{ id: 'sb' + Date.now(), name: nm, plan: p.id, since: 'today', next: '1 Oct', status: 'Active' }].concat(st.subscribers),
              plans: st.plans.map(x => x.id === p.id ? Object.assign({}, x, { subs: x.subs + 1, mrr: x.mrr + (x.interval === 'Year' ? Math.round(x.amount / 12) : x.amount) }) : x)
            }));
            this.toast(nm + ' subscribed');
          }
        }); det.subs = s.subscribers.filter(x => x.plan === p.id).map(x => Object.assign({}, x, { chip: this.chip(x.status), open: this.open('sub', x.id) })); }
      if (det.sub) { const x = find(s.subscribers, d.id); det.o = Object.assign({}, x, {
        chip: this.chip(x.status),
        canAct: x.status === 'Active' || x.canAct,
        pause: () => {
          if (typeof FlowStore !== 'undefined' && FlowStore.pauseSubscriber) {
            FlowStore.pauseSubscriber(x.id);
            this.applyStore({ detail: null });
            this.toast('Subscription paused');
          }
        },
        cancel: () => {
          if (typeof FlowStore !== 'undefined' && FlowStore.cancelSubscriber) {
            FlowStore.cancelSubscriber(x.id);
            this.applyStore({ detail: null });
            this.toast('Subscription canceled');
          }
        }
      }); }
      if (det.match) {
        const m = find(s.matches, d.id) || find(s.autoMatches, d.id) || {};
        const ro = !find(s.matches, d.id);
        det.o = Object.assign({}, m, {
          amt: this.fmt(m.amount || 0), confT: (m.conf || 0) + '%',
          why: m.why || 'Amount, reference and date all lined up, so Flow matched this on its own.',
          readonly: ro, live: !ro,
          confirm: () => this.confirmMatch(m.id),
          reject: () => this.rejectMatch(m.id),
          undo: () => this.undoMatch(m.id),
          pick: () => this.setState({ pickFor: m.id }),
          picking: s.pickFor === m.id,
          cancelPick: () => this.setState({ pickFor: null }),
          options: s.invoices.filter(i => i.status !== 'Paid' && i.status !== 'Draft').map(i => ({
            id: i.id, no: i.no, client: i.client, amt: this.fmt0(i.amount),
            choose: () => { this.setState({ pickFor: null }); this.confirmMatch(m.id, i.no); }
          }))
        });
      }
      if (det.client) { const c = find(s.clients, d.id); det.o = Object.assign({}, c, { totalT: this.fmt0(c.total) }); det.invoices = invoices.filter(i => i.client === c.name); }
      if (det.synclog) { const l = find(s.syncLog, d.id) || find(s.exportHistory || [], d.id); det.o = Object.assign({}, l, { chip: this.chip(l.status), itemsT: String(l.items), errT: String(l.errors) }); }
      if (det.report) det.o = find(s.reports, d.id);
      if (det.member) { const m = find(s.team, d.id); det.o = Object.assign({}, m, { initials: (m.name || '').split(' ').map(x => x[0]).join('') }); }
      if (det.branch) {
        const b = find(s.branches, d.id);
        const groupRev = s.branches.reduce((a, x) => a + x.revenue, 0) || 1;
        const maxRev = Math.max.apply(null, s.branches.map(x => x.revenue));
        det.o = Object.assign({}, b, {
          rev: this.fmt0(b.revenue), staffT: String(b.staff),
          share: Math.round(b.revenue / groupRev * 100) + '%',
          perHead: this.fmt0(b.staff ? Math.round(b.revenue / b.staff) : 0),
          compare: s.branches.map(x => ({
            name: x.name, rev: this.fmt0(x.revenue),
            nameStyle: 'font-size:13px; letter-spacing:-.01em; font-weight:' + (x.id === b.id ? '650' : '500') + '; color:' + (x.id === b.id ? 'var(--ink)' : 'var(--ink-3)'),
            barStyle: 'height:100%; border-radius:5px; width:' + Math.round(x.revenue / maxRev * 100) + '%; background:' + (x.id === b.id ? 'var(--btn-dark)' : 'var(--ink-6)')
          })),
          recent: this.sortedTxns().slice(0, 5).map(t => Object.assign({}, this.row(t), {
            amtStyle: "text-align:right; font-family:'Urbanist','Cairo',sans-serif; font-size:13.5px; font-weight:600; color:" + (t.amount > 0 ? 'var(--pos)' : 'var(--ink-2)')
          }))
        });
      }
      if (det.employee) { const e = find(s.employees, d.id); const rate = s.figures && s.figures.deductionRate != null ? s.figures.deductionRate : 0; const ded = Math.round(e.salary * rate); det.o = Object.assign({}, e, { sal: this.fmt0(e.salary), net: this.fmt0(e.salary - ded), ded: this.fmt0(ded) }); }
      det.o = det.o || {};
    }

    const SW = on => this.swTrack(on), KN = on => this.swKnob(on);
    const tg = k => ({ on: s.toggles[k], off: !s.toggles[k], go: this.toggle(k), Track: SW(!!s.toggles[k]), Knob: KN(!!s.toggles[k]) });

    const payrollTotal = s.figures && s.figures.payrollGross != null ? s.figures.payrollGross : s.employees.reduce((a, e) => a + e.salary, 0);

    const reportPeriod = this.reportsPeriod();
    const pnlSrc = reportPeriod.pnl || {};
    const pnlText = pnlSrc.formatted || {};
    const inn = pnlSrc.revenue != null ? pnlSrc.revenue : 0;
    const refunds = pnlSrc.refunds != null ? pnlSrc.refunds : 0;
    const outAll = reportPeriod.moneyOut != null ? reportPeriod.moneyOut : 0;
    const cogs = pnlSrc.costOfSales != null ? pnlSrc.costOfSales : 0;
    const payrollOut = pnlSrc.salaries != null ? pnlSrc.salaries : 0;
    const overhead = pnlSrc.overheads != null ? pnlSrc.overheads : 0;
    const netProfit = pnlSrc.netProfit != null ? pnlSrc.netProfit : (inn - cogs - payrollOut - overhead);
    const periodLabel = reportPeriod.label || "Last 30 days";
    const barW = n => Math.min(100, Math.round((n / Math.max(inn, 1)) * 100)) + '%';
    const pnl = {
      periodLabel: periodLabel.toLowerCase(),
      net: pnlText.netProfit,
      netColor: netProfit >= 0 ? 'var(--pos)' : 'var(--neg)',
      margin: (pnlSrc.margin != null ? pnlSrc.margin : Math.round((netProfit / Math.max(inn, 1)) * 100)) + '%',
      cards: [
        { label: 'REVENUE', val: pnlText.revenue, color: 'var(--ink)', note: periodLabel },
        { label: 'COST OF SALES', val: pnlText.costOfSalesCard, color: 'var(--ink)', note: 'Supplies and rent' },
        { label: 'OVERHEADS', val: pnlText.overheadsCard, color: 'var(--ink)', note: 'Utilities, marketing, fees' },
        { label: 'NET PROFIT', val: pnlText.netProfit, color: netProfit >= 0 ? 'var(--pos)' : 'var(--neg)', note: (pnlSrc.margin != null ? pnlSrc.margin : 0) + '% margin' }
      ],
      rows: [
        { label: 'Revenue', val: pnlText.revenue, bar: barW(inn), color: 'var(--pos)', weight: '650' },
        { label: 'Refunds', val: pnlText.refunds, bar: barW(refunds), color: 'var(--ink-2)', weight: '500' },
        { label: 'Cost of sales', val: pnlText.costOfSales, bar: barW(cogs), color: 'var(--ink-2)', weight: '500' },
        { label: 'Salaries', val: pnlText.salaries, bar: barW(payrollOut), color: 'var(--ink-2)', weight: '500' },
        { label: 'Overheads', val: pnlText.overheads, bar: barW(overhead), color: 'var(--ink-2)', weight: '500' }
      ]
    };

    const cashOnHand = reportPeriod.net != null ? reportPeriod.net : 0, burn = Math.round(outAll * 0.62);
    const runwayMonths = Math.floor(cashOnHand / Math.max(burn, 1));
    const runwaySrc = reportPeriod.runway || {};
    const runway = {
      cash: runwaySrc.cashText || this.fmt0(cashOnHand),
      burn: runwaySrc.burnText || this.fmt0(burn),
      burnLabel: runwaySrc.burnLabel || 'AVG NET BURN / MO',
      months: runwaySrc.months || (runwayMonths + (runwayMonths === 1 ? ' month' : ' months')),
      until: runwaySrc.until || 'From this period\'s money out'
    };

    const forecast = (reportPeriod.forecast && reportPeriod.forecast.length) ? reportPeriod.forecast : [];

    const spendSrc = reportPeriod.spend || {};
    const spend = {
      tags: (spendSrc.tags || []).map(tg => Object.assign({}, tg, { go: this.setFilter('tag', tg.tag) })),
      vendors: spendSrc.vendors || [],
      refunds: spendSrc.refundsText || this.fmt0(0),
      hasRefunds: !!spendSrc.hasRefunds,
      insight: spendSrc.insight || ''
    };

    const ageingSrc = s.ageing || { buckets: [], rows: [] };
    const ageing = {
      buckets: ageingSrc.buckets || [],
      rows: (ageingSrc.rows || []).map(i => Object.assign({}, i, {
        amt: i.amt || this.fmt(i.amount),
        chip: this.chip(i.status),
        open: this.open('invoice', i.id)
      }))
    };

    const pack = { period: reportPeriod.range || periodLabel, accountant: s.accountantName || '', items: [
      { label: 'Profit & loss summary', meta: 'PDF' },
      { label: 'Full transaction ledger', meta: 'CSV · ' + s.txns.length + ' lines' },
      { label: 'Invoices issued', meta: 'PDF + XML · ' + s.invoices.length },
      { label: 'Tax summary', meta: 'PDF' },
      { label: 'Bank reconciliation', meta: this.liveMatch().percent + '% matched' }
    ] };

    const branchRows = (reportPeriod.branches && reportPeriod.branches.length) ? reportPeriod.branches : s.branches;
    const revTotal = branchRows.reduce((a, b) => a + b.revenue, 0);
    const branchPerf = branchRows.map(b => Object.assign({}, b, {
      rev: this.fmt0(b.revenue), staffT: String(b.staff), open: this.open('branch', b.id),
      share: Math.round((b.revenue / revTotal) * 100) + '%'
    }));

    const PERM = (s.rolePermissions && s.rolePermissions.length) ? s.rolePermissions.map(row => [row.area, row.owner, row.accountant, row.staff]) : [
      ['Dashboard', 'full', 'full', 'full'], ['Transactions', 'full', 'full', 'view'],
      ['Invoicing', 'full', 'full', 'full'], ['Payments & gateways', 'full', 'view', 'none'],
      ['Accounting sync', 'full', 'full', 'none'], ['Payroll', 'full', 'view', 'none'],
      ['Team & billing', 'full', 'none', 'none']
    ];
    const PTONE = { full: 'var(--ink)', view: 'var(--ink-3)', none: 'var(--ink-5)' };
    const PWEIGHT = { full: '650', view: '600', none: '500' };
    const PSTYLE = {
      full: 'font-size:12.5px; font-weight:650; color:var(--ink)',
      view: 'font-size:12.5px; font-weight:600; color:var(--ink-3)',
      none: 'font-size:12.5px; font-weight:500; color:var(--ink-5)'
    };
    const PLABEL = { full: 'Full', view: 'View only', none: 'No access' };
    const perms = PERM.map(([area, a, b, c]) => ({
      area,
      cells: [a, b, c].map((lvl, ci) => {
        const key = area + '|' + ci;
        const cur = lvl;
        const set = (v) => {
          const role = ci === 0 ? 'owner' : ci === 1 ? 'accountant' : 'staff';
          if (typeof FlowStore !== 'undefined' && FlowStore.setRolePermission) {
            FlowStore.setRolePermission(area, role, v);
            this.applyStore({ permOpen: null });
          } else {
            this.setState(st => {
              const ov = Object.assign({}, st.permOverrides || {});
              ov[key] = v;
              return { permOverrides: ov, permOpen: null };
            });
          }
        };
        return {
          label: PLABEL[cur],
          style: 'display:inline-flex; align-items:center; gap:6px; padding:5px 8px; margin:0 -8px; border-radius:7px; transition:background .14s ease; font-size:12.5px; font-weight:' + PWEIGHT[cur] + '; color:' + PTONE[cur],
          caret: PTONE[cur],
          open: s.permOpen === key,
          go: this.memo('_perm', key, () => () => this.setState(st => ({ permOpen: st.permOpen === key ? null : key }))),
          options: ['full', 'view', 'none'].map(v => ({
            label: PLABEL[v], on: v === cur,
            style: 'width:100%; display:flex; align-items:center; gap:9px; padding:8px 12px; text-align:left; font-size:12.5px; transition:background .14s ease; font-weight:' + (v === cur ? '650' : '500') + '; color:' + (v === cur ? 'var(--ink)' : 'var(--ink-3)'),
            go: this.memo('_permset', key + v, () => () => set(v))
          }))
        };
      })
    }));

    const storedLimits = s.approvalLimits || {};
    const limits = s.team.map(m => {
      const stored = storedLimits[m.id];
      const cap = m.role === 'Owner' ? 'No limit' : (stored == null ? 'Not set' : String(stored / 100));
      return {
        id: m.id, name: m.name, role: m.role, cap,
        readOnly: m.role === 'Owner',
        setCap: this.memo('_lim', m.id, () => (e) => {
          if (m.role === 'Owner') { this.toast('Owner has no approval cap'); return; }
          const raw = String(e.target.value || '').trim();
          if (!raw || raw === 'Not set') {
            if (typeof FlowStore !== 'undefined' && FlowStore.setApprovalLimit) {
              FlowStore.setApprovalLimit(m.id, null);
              this.applyStore();
            }
            return;
          }
          const digits = raw.replace(/[^0-9.]/g, '');
          if (!digits) {
            this.toast('Enter an amount in QR');
            return;
          }
          const major = Number(digits);
          if (!Number.isFinite(major)) { this.toast('Enter an amount in QR'); return; }
          if (typeof FlowStore !== 'undefined' && FlowStore.setApprovalLimit) {
            FlowStore.setApprovalLimit(m.id, Math.round(major * 100));
            this.applyStore();
          }
        })
      };
    });
    const pendingList = s.approvalRequests || s.approvals || [];
    const pending = {
      count: String(pendingList.length), none: pendingList.length === 0,
      items: pendingList.map(p => ({
        id: p.id,
        amt: this.fmt0(p.amt),
        what: p.what, who: p.who, when: p.when,
        approve: this.memo('_apv', p.id + 'y', () => () => {
          if (typeof FlowStore !== 'undefined' && FlowStore.resolveApproval) FlowStore.resolveApproval(p.id, 'approved');
          this.applyStore();
          this.toast('Approved');
        }),
        reject: this.memo('_apv', p.id + 'n', () => () => {
          if (typeof FlowStore !== 'undefined' && FlowStore.resolveApproval) FlowStore.resolveApproval(p.id, 'declined');
          this.applyStore();
          this.toast('Declined');
        })
      }))
    };

    return {
      pt: flags('payments', ['gateway', 'checkout', 'links', 'subs', 'bank', 'shopify']),
      ct: flags('connections', ['gateways', 'banks', 'platforms']),
      tt: flags('transactions', ['all', 'matching', 'scan', 'bank']),
      it: flags('invoicing', ['create', 'all', 'recurring', 'reminders', 'clients']),
      at: flags('accounting', ['zoho', 'tally', 'tax']),
      rt: flags('reports', ['overview', 'cash', 'spend', 'receivables', 'pack', 'branches']),
      mt: flags('team', ['members', 'permissions', 'approvals', 'audit']),
      yt: flags('payroll', ['employees', 'payslips', 'tax']),
      st: flags('settings', ['profile', 'account', 'security', 'billing', 'tags']),
      links, linkClients: s.linkClients || [], linkInvoices: s.linkInvoices || [], plans, invoices, reminderInvoices, hasReminders: reminderInvoices.length > 0, clients, team, employees, branches, reports, syncLog, exports, zoho: s.zoho || { hasLast: false, line: '' }, matches, rows, tagTotals, cash, det,
      invoiceDue: { error: s.invDueError || '', errorOn: !!s.invDueError },
      pnl, runway, forecast, spend, ageing, pack, branchPerf, perms, limits, pending,
      providers: s.providers.map(p => Object.assign({}, p, { initial: p.n.slice(0, 2), note: p.s !== 'Coming soon', go: () => this.toast(p.n + ' is not available in Phase 1') })),
      history: s.history.filter(x => s.actType === 'all' || x.kind === s.actType).map(x => {
        const sys = x.who === 'System';
        const KL = { payments: 'Payment', sync: 'Sync', access: 'Access', edits: 'Edit' };
        return Object.assign({}, x, {
          kindLabel: KL[x.kind] || x.kind,
          kindStyle: 'justify-self:start; font-size:11px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; white-space:nowrap; color:var(--ink-5)',
          avatar: sys ? 'SY' : x.who.split(' ').filter(Boolean).slice(0, 2).map(c => c[0]).join('').toUpperCase(),
          avatarStyle: 'width:24px; height:24px; flex:0 0 24px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:9.5px; font-weight:700; letter-spacing:.02em; ' + (sys
            ? 'background:var(--ink-block); color:var(--on-block)'
            : 'background:var(--chip); color:var(--ink-3); border:1px solid var(--line)')
        });
      }),
      actNone: s.history.filter(x => s.actType === 'all' || x.kind === s.actType).length === 0,
      actFilters: [['all', 'All'], ['payments', 'Payments'], ['sync', 'Sync'], ['access', 'Access'], ['edits', 'Edits']].map(([k, label]) => {
        const on = s.actType === k;
        return {
          label, go: this.memo('_act', k, () => () => this.setState({ actType: k })),
          style: 'font-size:12px; font-weight:' + (on ? '650' : '500') + '; padding:6px 12px; border-radius:8px; transition:background .15s ease, color .15s ease; color:' + (on ? 'var(--on-block)' : 'var(--ink-3)') + '; background:' + (on ? 'var(--btn-dark)' : 'var(--btn-light)') + '; border:1px solid ' + (on ? 'transparent' : 'var(--line)')
        };
      }),
      actGo: {
        payments: () => this.setState(x => ({ page: 'team', detail: null, actType: 'payments', tab: Object.assign({}, x.tab, { team: 'audit' }) })),
        sync: () => this.setState(x => ({ page: 'team', detail: null, actType: 'sync', tab: Object.assign({}, x.tab, { team: 'audit' }) }))
      },
      subsAll: s.subscribers.map(x => Object.assign({}, x, { chip: this.chip(x.status), open: this.open('sub', x.id) })),
      reminders: s.reminders.map(r => ({ label: r.label, on: r.on, off: !r.on, Track: SW(!!r.on), Knob: KN(!!r.on), go: this.memo('_rmd', r.id, () => () => this.setState(st => ({ reminders: st.reminders.map(x => x.id === r.id ? Object.assign({}, x, { on: !x.on }) : x) }))) })),
      tgs: { autoSync: tg('autoSync'), twofa: tg('twofa'), biometric: tg('biometric'), testMode: tg('testMode'), productSync: tg('productSync'), combined: tg('combined'), walletDetect: tg('walletDetect'), retry: tg('retry'), recurring: tg('recurring') },
      fclear: {
        show: !(s.filter.source === 'All' && s.filter.status === 'All' && s.filter.tag === 'All' && s.filter.range === 'All time'),
        go: () => this.setState({ filter: { source: 'All', status: 'All', tag: 'All', range: 'All time' } })
      },
      fmenu: [
        this.filterMenu('source', ['All', 'SkipCash', 'Bank', 'Shopify', 'Link', 'Cash', 'Bill'], 'Source'),
        this.filterMenu('status', ['All', 'Settled', 'Pending', 'Refunded'], 'Status'),
        this.filterMenu('range', ['All time', 'Last 7 days', 'Last 30 days', 'This month'], 'Period'),
        this.filterMenu('tag', ['All', 'Sales', 'Supplies', 'Rent', 'Salaries', 'Utilities', 'Marketing', 'Fees'], 'Tag')
      ],
      fopts: { range: this.filterOpts('range', ['All time', 'Last 7 days', 'Last 30 days', 'This month']), source: this.filterOpts('source', ['All', 'SkipCash', 'Bank', 'Shopify', 'Link', 'Cash', 'Bill']), status: this.filterOpts('status', ['All', 'Settled', 'Pending', 'Refunded']), tag: this.filterOpts('tag', ['All'].concat(s.tags)) },
      empt: {
        rows: rows.length === 0,
        invoices: s.invoices.length === 0,
        reminders: reminderInvoices.length === 0,
        links: s.links.length === 0,
        plans: s.plans.length === 0,
        team: s.team.length === 0,
        employees: s.employees.length === 0,
        txnsAll: s.txns.length === 0,
        reports: s.reports.length === 0
      },
      counts: { rows: String(rows.length), total: String(s.txns.length), invoices: String(s.invoices.length), matches: String(this.liveMatch().open) },
      tagList: (s.ledgerTags && s.ledgerTags.length ? s.ledgerTags : s.tags).map(t => ({
        id: t,
        label: t,
        count: String(s.txns.filter(x => x.tag === t).length),
        value: (s.form && s.form['tag_' + t]) != null ? s.form['tag_' + t] : t,
        setName: this.memo('_tn', t, () => (e) => this.setState(st => ({ form: Object.assign({}, st.form, { ['tag_' + t]: e.target.value }) }))),
        rename: this.memo('_tr', t, () => () => {
          const next = ((this.state.form && this.state.form['tag_' + t]) || t).trim();
          if (!next || next === t) { this.toast(next === t ? 'Name is unchanged' : 'Tag name is required'); return; }
          if (typeof FlowStore === 'undefined' || !FlowStore.renameTag) return;
          try {
            const result = FlowStore.renameTag(t, next);
            this.applyStore();
            this.toast(result.count ? 'Renamed ' + t + ' to ' + next : 'Tag renamed');
          } catch (err) {
            this.toast((err && err.message) || 'Could not rename tag');
          }
        }),
        del: this.memo('_dt', t, () => () => {
          const count = s.txns.filter(x => x.tag === t).length;
          if (count > 0) {
            this.toast("Can't remove " + t + ': ' + count + (count === 1 ? ' item still uses it' : ' items still use it'));
            return;
          }
          if (typeof FlowStore !== 'undefined' && FlowStore.removeTag) {
            try { FlowStore.removeTag(t); } catch (err) { this.toast((err && err.message) || 'Could not remove tag'); return; }
          }
          this.setState(st => ({ tags: (st.tags || []).filter(x => x !== t) }));
          this.toast('Tag removed');
        })
      })),
      rec: (() => {
        const running = (s.recurringInvoices || []).filter(row => row.running);
        const interval = (s.form && s.form.recEvery) || 'Month';
        function labelFor(offset) {
          if (typeof FlowStore !== 'undefined' && FlowStore.formatDate) return FlowStore.formatDate(offset);
          if (typeof FlowStore !== 'undefined' && FlowStore.dateInputValue) return FlowStore.dateInputValue(offset);
          return 'Day +' + offset;
        }
        const nextLabels = running[0] && typeof FlowStore !== 'undefined' && FlowStore.recurringNextOffsets
          ? FlowStore.recurringNextOffsets({
              id: running[0].id,
              interval: running[0].interval,
              nextOffset: running[0].nextOffset,
              endsAfter: running[0].endsAfter,
              sentCount: running[0].sentCount,
              status: 'active'
            }).map(labelFor)
          : [];
        return {
          on: !!(s.toggles && s.toggles.recurring),
          every: interval,
          ends: (s.form && s.form.recEnds) || '',
          client: (s.form && s.form.recClient) || '',
          amount: (s.form && s.form.recAmount) || '',
          next: nextLabels.map(label => ({ label })),
          hasNext: nextLabels.length > 0,
          running: running.map(row => ({
            id: row.id,
            title: row.client + ' · ' + this.fmt0(row.amount) + ' / ' + String(row.interval || 'Month').toLowerCase(),
            next: 'Next ' + labelFor(row.nextOffset),
            send: this.memo('_rsend', row.id, () => () => {
              try {
                FlowStore.sendRecurringInvoice(row.id);
                this.applyStore();
                this.toast('Invoice sent from schedule');
              } catch (err) { this.toast((err && err.message) || 'Could not send'); }
            }),
            pause: this.memo('_rpause', row.id, () => () => {
              FlowStore.pauseRecurringInvoice(row.id);
              this.applyStore();
              this.toast('Schedule paused');
            }),
            cancel: this.memo('_rcan', row.id, () => () => {
              FlowStore.cancelRecurringInvoice(row.id);
              this.applyStore();
              this.toast('Schedule canceled');
            })
          })),
          none: running.length === 0,
          start: this.memo('_recstart', 'go', () => () => {
            const clientName = String((this.state.form && this.state.form.recClient) || '').trim();
            const amount = Number(String((this.state.form && this.state.form.recAmount) || '').replace(/[^0-9.]/g, ''));
            const endsRaw = String((this.state.form && this.state.form.recEnds) || '').trim();
            const endsAfter = endsRaw === '' ? null : Number(endsRaw);
            if (!clientName) { this.toast('Client is required'); return; }
            if (!Number.isFinite(amount) || amount <= 0) { this.toast('Amount is required'); return; }
            if (typeof FlowStore === 'undefined' || !FlowStore.createRecurringInvoice) {
              this.toast('Could not start schedule');
              return;
            }
            try {
              FlowStore.createRecurringInvoice({
                clientName,
                amountMinor: Math.round(amount * 100),
                interval: (this.state.form && this.state.form.recEvery) || 'Month',
                endsAfter: Number.isFinite(endsAfter) ? endsAfter : null
              });
              this.applyStore({ toggles: Object.assign({}, this.state.toggles, { recurring: true }) });
              this.toast('Recurring invoice scheduled');
            } catch (err) {
              this.toast((err && err.message) || 'Could not start schedule');
            }
          })
        };
      })(),
      subsSum,
      linkSum: (() => {
        const paidUses = s.links.reduce((a, l) => a + l.uses, 0);
        return {
          total: this.fmt0(s.links.reduce((a, l) => a + l.amount * l.uses, 0)),
          active: String(s.links.filter(l => l.status === 'Active').length),
          uses: String(paidUses)
        };
      })(),
      invSum: (() => {
        const tot = s.invoiceTotals || {};
        return {
          outstanding: this.fmt0(tot.outstanding || 0), unpaid: String(tot.outstandingCount || 0),
          paid: this.fmt0(tot.invoiced || 0), paidN: String(tot.invoicedCount || 0),
          overdue: this.fmt0(tot.overdue || 0), overdueN: String(tot.overdueCount || 0)
        };
      })(),
      co: s.checkout,
      payroll: (() => {
        const gross = s.figures.payrollGross != null ? s.figures.payrollGross : payrollTotal;
        const ded = s.figures.payrollDeductions != null ? s.figures.payrollDeductions : 0;
        const net = s.figures.payrollNet != null ? s.figures.payrollNet : gross - ded;
        const pct = s.figures.deductionRate != null ? s.figures.deductionRate : 0;
        const period = (s.form && s.form.payrollPeriod)
          || (typeof FlowStore !== 'undefined' && FlowStore.defaultPayrollPeriod && FlowStore.defaultPayrollPeriod())
          || '';
        const already = typeof FlowStore !== 'undefined' && FlowStore.payrollPostedFor
          ? !!FlowStore.payrollPostedFor(period)
          : false;
        const baseStyle = 'font-size:13px; font-weight:650; color:var(--on-block); background:var(--btn-dark); box-shadow:0 6px 16px var(--accent-shadow); padding:11px 18px; border-radius:9px';
        return {
          total: this.fmt0(gross), net: this.fmt0(net), count: String(s.figures.payrollCount || s.employees.length), deductions: this.fmt0(ded), pctText: (pct * 100).toFixed(pct * 100 % 1 ? 1 : 0) + '%',
          period,
          setPeriod: (e) => this.setState(st => ({ form: Object.assign({}, st.form, { payrollPeriod: e.target.value }) })),
          alreadyPosted: already,
          canPost: !already,
          postLabel: already ? ('Already posted for ' + period) : 'Post to Transactions',
          postStyle: already ? baseStyle + '; opacity:.55; pointer-events:none' : baseStyle,
          post: () => this.postPayrollToLedger()
        };
      })(),
      connStats: (() => {
        const all = ['skipcash', 'bank', 'zoho', 'tally', 'shopify'];
        const active = all.filter(k => k === 'tally' || s.conns[k]).length;
        return { active: String(active), attention: '', who: '', show: false };
      })(),
      connMan: {
        skipcash: this.go('payments', 'gateway'),
        bank: this.go('payments', 'bank'),
        tally: this.go('accounting', 'tally'),
        zoho: this.go('accounting', 'zoho'),
        shopify: this.go('payments', 'shopify')
      },
      smart: (() => {
        const cfg = s.smartCheckout || {};
        const analytics = cfg.analytics || (typeof FlowStore !== 'undefined' && FlowStore.SAMPLE_CHECKOUT_ANALYTICS) || { note: 'Sample analytics. Checkout drop-off is not stored for this merchant.', steps: [] };
        return {
          overview: s.page === 'payments',
          on: !!cfg.on,
          toggle: () => this.toggleSmartCheckout(),
          Track: this.swTrack(!!cfg.on),
          Knob: this.swKnob(!!cfg.on),
          note: analytics.note,
          steps: (analytics.steps || []).map(step => ({
            label: step.label,
            pct: step.percent + '%',
            bar: step.percent + '%'
          }))
        };
      })(),
      shopify: (() => {
        const sh = s.shopify || {};
        const step = s.shopifyOauth || 'idle';
        return {
          connected: !!sh.connected,
          disconnected: !sh.connected,
          shopDomain: sh.shopDomain || '',
          shopLine: sh.connected ? sh.shopDomain : 'Connect a store to tag new orders',
          appsLine: sh.connected ? String(sh.orderCount || 0) + ' orders on ledger' : 'Connect a store to tag new orders',
          idle: !sh.connected && step === 'idle',
          authorize: !sh.connected && step === 'authorize',
          pendingDomain: s.form.shopDomain || '',
          sampleReady: !!sh.sampleReady,
          orderCount: String(sh.orderCount || 0),
          plugin: sh.connected ? 'Connected · simulated' : 'Not connected',
          syncNote: sh.connected
            ? (sh.sampleReady ? 'Connected · simulated. Pull a sample order to tag a new Shopify sale.' : 'Connected · simulated. New incoming orders are tagged Shopify.')
            : 'Historical Shopify rows stay on the ledger. New ones are tagged after connect.',
          begin: () => {
            const domain = String((this.state.form || {}).shopDomain || '').trim();
            if (!domain) { this.toast('Add a store URL'); return; }
            this.setState({ shopifyOauth: 'authorize' });
          },
          cancel: () => this.setState({ shopifyOauth: 'idle' }),
          approve: () => {
            const domain = String((this.state.form || {}).shopDomain || '').trim();
            if (typeof FlowStore !== 'undefined' && FlowStore.connectShopify) {
              FlowStore.connectShopify(domain);
              this.applyStore({ shopifyOauth: 'idle' });
              this.toast('Shopify connected');
              return;
            }
            this.setState({ shopifyOauth: 'idle' });
          },
          ingest: () => {
            if (typeof FlowStore === 'undefined' || !FlowStore.ingestShopifyOrder) return;
            try {
              FlowStore.ingestShopifyOrder();
              this.applyStore();
              this.toast('Sample Shopify order recorded');
            } catch (err) {
              this.toast((err && err.message) || 'Could not pull sample order');
            }
          }
        };
      })(),
      bankOn: (() => {
        const step = s.bankOnboarding || 0;
        const choices = (s.sampleBanks || []).filter(b => !(s.bank.extra || []).some(x => x.id === b.id) && !(s.banks || []).some(x => x.id === b.id));
        return {
          idle: step === 0,
          pick: step === 1,
          consent: step === 2,
          picked: ((s.sampleBanks || []).find(b => b.id === s.bankPick) || {}).label || '',
          start: () => this.setState({ bankOnboarding: 1 }),
          choices: choices.map(b => ({
            label: b.label,
            go: this.memo('_bk', b.id, () => () => this.setState({ bankOnboarding: 2, bankPick: b.id }))
          })),
          confirm: () => {
            if (typeof FlowStore !== 'undefined' && FlowStore.connectSampleBank && s.bankPick) {
              FlowStore.connectSampleBank(s.bankPick);
              this.applyStore({ bankOnboarding: 0, bankPick: null });
              this.toast('Sample bank connected');
            }
          }
        };
      })(),
      gatewayOpen: this.open('gateway', 'skipcash')
    };
  }

  renderVals() {
    this.bindStoreEvents();
    const s = this.state, d = s.detail;
    const HUBS = this.dests().HUBS;
    const mob = s.vw <= 780;
    const rail = mob ? true : !!s.railOpen;
    const NAV = [
      ['dashboard', 'Home',
        'M12.8 3h2.6A1.6 1.6 0 0 1 17 4.6v2.6a1.6 1.6 0 0 1-1.6 1.6h-2.6a1.6 1.6 0 0 1-1.6-1.6V4.6A1.6 1.6 0 0 1 12.8 3ZM4.6 11.2h2.6a1.6 1.6 0 0 1 1.6 1.6v2.6A1.6 1.6 0 0 1 7.2 17H4.6A1.6 1.6 0 0 1 3 15.4v-2.6a1.6 1.6 0 0 1 1.6-1.6ZM12.8 11.2h2.6a1.6 1.6 0 0 1 1.6 1.6v2.6a1.6 1.6 0 0 1-1.6 1.6h-2.6a1.6 1.6 0 0 1-1.6-1.6v-2.6a1.6 1.6 0 0 1 1.6-1.6Z',
        'M4.6 3h2.6a1.6 1.6 0 0 1 1.6 1.6v2.6A1.6 1.6 0 0 1 7.2 8.8H4.6A1.6 1.6 0 0 1 3 7.2V4.6A1.6 1.6 0 0 1 4.6 3Z'],
      ['payments', 'Get Paid',
        'M4 5.2h12a1.8 1.8 0 0 1 1.8 1.8v6a1.8 1.8 0 0 1-1.8 1.8H4a1.8 1.8 0 0 1-1.8-1.8V7A1.8 1.8 0 0 1 4 5.2ZM5.2 12.2h3.2',
        'M2.2 8.6h15.6'],
      ['transactions', 'Money In & Out',
        'M13.9 3.4 17 6.5l-3.1 3.1M17 6.5H6.5a2.9 2.9 0 0 0-2.9 2.9M6.1 16.6 3 13.5l3.1-3.1M3 13.5h10.5a2.9 2.9 0 0 0 2.9-2.9',
        'M10 12.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z'],
      ['invoicing', 'Invoices',
        'M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM8.4 9.6h3.2M8.4 12.4h2.2',
        'M6.1 6.4h7.8'],
      ['accounting', 'Sync to Books',
        'M16.6 7a6.6 6.6 0 0 0-11.4.4M3.4 13a6.6 6.6 0 0 0 11.4-.4M14.5 3v4h-4M5.5 17v-4h4',
        'M10 8.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z'],
      ['connections', 'Connected Apps',
        'M10 7.1v2.6M9.1 10.4 5.6 12.7M10.9 10.4l3.5 2.3',
        'M10 3.1a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM4.3 12.7a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM15.7 12.7a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z'],
      ['reports', 'Reports',
        'M4.6 16.6v-4.4M9.3 16.6V9M17.4 16.6V5.4',
        'M14 16.6V7.4'],
      ['team', 'Your Team',
        'M13.6 17c0-2.6-1.6-4.2-3.6-4.2S6.4 14.4 6.4 17M15.4 12.9c1.5.5 2.5 1.9 2.6 3.6M4.6 12.9C3.1 13.4 2.1 14.8 2 16.5',
        'M10 4.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2ZM15.1 5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM4.9 5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z'],
      ['payroll', 'Payroll',
        'M3.4 16.8c.7-3.3 3.4-5.1 6.6-5.1s5.9 1.8 6.6 5.1',
        'M10 4.2a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Z'],
      ['settings', 'Settings',
        'M10 2.3l1.3 2.2 2.5-.4.6 2.4 2.2 1.3-1.2 2.2 1.2 2.2-2.2 1.3-.6 2.4-2.5-.4L10 17.7l-1.3-2.2-2.5.4-.6-2.4-2.2-1.3 1.2-2.2-1.2-2.2 2.2-1.3.6-2.4 2.5.4Z',
        'M10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z']
    ];
    const nav = NAV.map(([key, label, dpath, fpath]) => {
      const on = s.page === key || s.fly === key;
      return {
        key, label, d: dpath + ' ' + fpath, go: this.go(key, this.dflt(key)), ic: on ? 'var(--accent)' : 'var(--ink-4)',
        badge: '',
        labelStyle: rail ? 'flex:1; text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:inherit' : 'display:none',
        tile: 'width:' + (rail ? '40px' : '36px') + '; height:' + (rail ? '40px' : '36px') + '; flex:0 0 ' + (rail ? '40px' : '36px') + '; border-radius:11px; transition:background .18s ease; display:flex; align-items:center; justify-content:center; background:' + (on ? 'var(--accent-soft)' : 'transparent'),
        iconSize: '20',
        style: 'display:flex; align-items:center; gap:9px; padding:' + (rail ? '7px 10px' : '4px') + '; border-radius:' + (rail ? '11px' : '13px') + '; justify-content:' + (rail ? 'flex-start' : 'center') + '; width:' + (rail ? '100%' : '44px') + '; transition:width .52s cubic-bezier(.32,.72,0,1), background .22s ease, box-shadow .22s ease; font-size:13.5px; letter-spacing:-.01em; font-weight:' + (on ? '700' : '500') + '; color:' + (on ? 'var(--accent)' : 'var(--ink-2)') + '; background:' + (on ? 'var(--accent-soft)' : 'transparent') + ''
      };
    });

    const { D: DEST, HUBS: HUBKEYS } = this.dests();
    const TABS = {};
    Object.keys(DEST).forEach(k => {
      TABS[k] = (HUBKEYS.indexOf(k) >= 0 ? [['hub', 'Overview']] : []).concat(DEST[k].map(e => [e[0], e[1]]));
    });
    const tabItems = TABS[s.page];
    const ppFocus = s.page === 'payments' && this.tabOf('payments', this.dflt('payments')) === 'checkout' && (s.ppView === 'edit' || s.ppView === 'published');
    const tabs = { show: !!tabItems && !d && !ppFocus && this.tabOf(s.page, this.dflt(s.page)) !== 'hub' && !(mob && (s.page === 'transactions' || s.page === 'invoicing')), items: tabItems ? this.tabList(s.page, tabItems) : [] };

    const period = this.periodOf();
    const inflow = period.moneyIn;
    const outflow = period.moneyOut;
    const branchRaw = s.branches.find(b => b.id === s.branchId);
    const branch = Object.assign({}, branchRaw, this.props.businessName ? { name: this.props.businessName } : {});
    const live = this.liveMatch();
    const attList = live.openItems;
    const openN = live.open;
    const matchPct = live.percent;
    const autoN = live.matched;
    const totalN = live.total;

    const quick = [
      ['Send Payment Link', 'link',
        'M8.2 11.8a3 3 0 0 0 4.5.3l2.4-2.4a3 3 0 0 0-4.2-4.2l-1.3 1.3M11.8 8.2a3 3 0 0 0-4.5-.3L4.9 10.3a3 3 0 0 0 4.2 4.2l1.3-1.3',
        'M10 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z'],
      ['Scan Bill', 'scan',
        'M3 7.2V4.7A1.7 1.7 0 0 1 4.7 3h2.5M12.8 3h2.5A1.7 1.7 0 0 1 17 4.7v2.5M17 12.8v2.5a1.7 1.7 0 0 1-1.7 1.7h-2.5M7.2 17H4.7A1.7 1.7 0 0 1 3 15.3v-2.5',
        'M5.6 10h8.8'],
      ['Log Expense', 'expense',
        'M10 15.6V5.2M5.8 9.4 10 5.2l4.2 4.2',
        'M4.4 16.8h11.2'],
      ['Create Invoice', 'invoice',
        'M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM8.4 9.6h3.2M8.4 12.4h2.2',
        'M6.1 6.4h7.8']
    ].map(([label, kind, dp, fp]) => ({ label, d: dp + ' ' + fp, go: this.openModal(kind) }));

    const C = 2 * Math.PI * 38;
    const unpaidN = (s.invoiceTotals && s.invoiceTotals.outstandingCount) || 0;
    const outstanding = (s.invoiceTotals && s.invoiceTotals.outstanding) || 0;
    const kpis = [
      { label: 'Money In', val: period.moneyInText || this.fmt0(inflow), delta: period.moneyInShare || '', up: period.moneyInTrendPct > 0, down: period.moneyInTrendPct < 0, d: 'M10 15.4V6.2M6.2 10 10 6.2l3.8 3.8M10 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6Z' },
      { label: 'Money Out', val: period.moneyOutText || this.fmt0(Math.abs(outflow)), delta: period.moneyOutShare || '', up: period.moneyOutTrendPct > 0, down: period.moneyOutTrendPct < 0, d: 'M10 4.6v9.2M6.2 10l3.8 3.8L13.8 10M10 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6Z' },
      { label: 'Outstanding', val: this.fmt0(outstanding), delta: unpaidN + (unpaidN === 1 ? ' invoice' : ' invoices'), up: false, down: false, d: 'M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM6.1 6.4h7.8' },
      { label: 'Auto-matched', val: matchPct + '%', delta: openN === 1 ? '1 open' : openN + ' open', up: false, down: false, d: 'm6 10.2 2.9 2.9L14.4 7.6M10 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6Z' }
    ].map(k => Object.assign({}, k, { neutral: !k.up && !k.down && !!k.delta }));

    const MODAL = { pageSettings: ['Page settings', 'Save settings'], receipts: ['Payment receipts', 'Save'], link: ['New payment link', 'Create link'], scan: ['Scan a bill', 'Save to transactions'], expense: ['Log an expense', 'Log expense'], invoice: ['Create invoice', 'Create invoice'], plan: ['New subscription plan', 'Create plan'], member: ['Invite a team member', 'Send invite'], employee: ['Add an employee', 'Add employee'], help: ['About this build', 'Got it'], reset: ['Reset demo data', 'Reset demo data'] };
    const md = (s.modal === 'employee' && s.editEmp) ? ['Edit employee', 'Save changes'] : (MODAL[s.modal] || ['', '']);

    const vals = {
      kpis,
      mob: { on: mob, off: !mob, home: mob && !d && s.page === 'dashboard', txns: mob && !d && s.page === 'transactions', invoices: mob && !d && s.page === 'invoicing' },
      sty: {
        main: 'flex:1; min-width:0; margin-left:' + (mob ? 0 : 74) + 'px; display:flex; flex-direction:column; overflow:hidden; position:relative; background:var(--main-glow)',
        aside: 'position:absolute; left:0; top:0; bottom:0; z-index:30; width:' + (rail ? 252 : 74) + 'px; background:var(--sidebar), linear-gradient(var(--canvas-flat), var(--canvas-flat)); border-right:1px solid var(--line); display:flex; flex-direction:column; overflow:hidden; box-shadow:' + (rail ? '0 0 60px -12px rgba(0,0,0,.28)' : 'none') + '; transition:width .42s cubic-bezier(.32,.72,0,1), box-shadow .42s ease',
        railText: rail ? 'flex:1; text-align:left; white-space:nowrap; overflow:hidden; opacity:1; transform:none; transition:opacity .34s ease .12s, transform .44s cubic-bezier(.32,.72,0,1) .1s' : 'flex:1; text-align:left; white-space:nowrap; overflow:hidden; opacity:0; width:0; transform:translateX(-6px); pointer-events:none; transition:opacity .16s ease, transform .2s ease',
        railHead: rail ? 'height:82px; flex:0 0 82px; padding:0 18px; display:flex; align-items:center; gap:11px' : 'height:82px; flex:0 0 82px; padding:0 18px; display:flex; align-items:center; justify-content:center',
        logoTile: rail ? 'width:38px; height:38px; flex:0 0 38px; border-radius:12px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); display:flex; align-items:center; justify-content:center' : 'width:38px; height:38px; flex:0 0 38px; border-radius:12px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); display:flex; align-items:center; justify-content:center',
        railChip: rail ? 'margin-left:auto; font-size:9.5px; font-weight:700; letter-spacing:.08em; color:var(--ink-3); background:linear-gradient(165deg,var(--panel-3),var(--panel)); border:1px solid var(--line); padding:3px 6px; border-radius:5px' : 'display:none',
        logoIcon: '19',
        navWrap: rail ? 'flex:1; overflow-y:auto; overflow-x:hidden; padding:6px 12px 16px; display:flex; flex-direction:column; gap:3px; align-items:stretch; transition:gap .52s cubic-bezier(.32,.72,0,1), padding .52s cubic-bezier(.32,.72,0,1)' : 'flex:1; overflow-y:auto; overflow-x:hidden; padding:2px 12px 16px; display:flex; flex-direction:column; gap:5px; align-items:center; transition:gap .52s cubic-bezier(.32,.72,0,1), padding .52s cubic-bezier(.32,.72,0,1)',
        railBiz: rail ? 'padding:0 12px 10px; opacity:1; max-height:80px; overflow:hidden; transition:opacity .3s ease .16s, max-height .5s cubic-bezier(.32,.72,0,1)' : 'padding:0 12px 0; opacity:0; max-height:0; overflow:hidden; pointer-events:none; transition:opacity .14s ease, max-height .4s cubic-bezier(.32,.72,0,1)',
        railPlan: rail ? 'padding:12px; border-top:1px solid var(--line); opacity:1; max-height:140px; overflow:hidden; transition:opacity .3s ease .16s, max-height .5s cubic-bezier(.32,.72,0,1)' : 'padding:0 12px; opacity:0; max-height:0; overflow:hidden; pointer-events:none; transition:opacity .14s ease, max-height .4s cubic-bezier(.32,.72,0,1)',
        tabbarWrap: 'flex:0 0 auto; width:100%; border-bottom:1px solid var(--divider)',
        tabbar: mob ? 'padding:6px 16px 0; display:flex; align-items:center; gap:4px; overflow-x:auto; scrollbar-width:none' : 'width:100%; max-width:1248px; margin:0 auto; padding:6px 34px 0; display:flex; align-items:center; flex-wrap:nowrap; gap:4px; overflow-x:auto; scrollbar-width:none',
        content: ppFocus ? 'flex:1; overflow-y:auto; padding:0' : (mob ? 'flex:1; overflow-y:auto; padding:22px 16px 104px' : 'flex:1; overflow-y:auto; padding:30px 34px 76px'),
        contentInner: ppFocus ? 'width:100%; animation:flowIn .28s ease both' : 'max-width:1180px; margin:0 auto; animation:flowIn .28s ease both',
        grid2: mob ? 'display:grid; grid-template-columns:minmax(0,1fr); gap:16px; align-items:stretch' : 'display:grid; grid-template-columns:minmax(0,1.55fr) minmax(0,1fr); gap:22px; align-items:stretch',
        grid2b: mob ? 'display:grid; grid-template-columns:minmax(0,1fr); gap:16px; margin-top:16px; align-items:stretch' : 'display:grid; grid-template-columns:minmax(0,1.55fr) minmax(0,1fr); gap:22px; margin-top:22px; align-items:stretch',
        kpi: mob ? 'display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px' : 'display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-bottom:26px',
        greet: mob ? 'display:flex; flex-direction:column; align-items:stretch; gap:14px; margin-bottom:22px' : 'display:flex; align-items:flex-end; gap:18px; margin-bottom:34px',
        headerBar: 'flex:0 0 auto; width:100%; background:var(--panel-2); backdrop-filter:blur(22px) saturate(150%); -webkit-backdrop-filter:blur(22px) saturate(150%); border-bottom:1px solid var(--divider); position:relative; z-index:6',
        header: mob ? 'padding:14px 16px 10px; display:flex; align-items:center; gap:10px' : 'flex:0 0 auto; width:100%; max-width:1248px; margin:0 auto; padding:22px 34px 14px; display:flex; align-items:center; gap:14px'
      },
      bottomNav: [
        ['dashboard', 'Home', 'M12.8 3h2.6A1.6 1.6 0 0 1 17 4.6v2.6a1.6 1.6 0 0 1-1.6 1.6h-2.6a1.6 1.6 0 0 1-1.6-1.6V4.6A1.6 1.6 0 0 1 12.8 3ZM4.6 11.2h2.6a1.6 1.6 0 0 1 1.6 1.6v2.6A1.6 1.6 0 0 1 7.2 17H4.6A1.6 1.6 0 0 1 3 15.4v-2.6a1.6 1.6 0 0 1 1.6-1.6Z', 'M4.6 3h2.6a1.6 1.6 0 0 1 1.6 1.6v2.6A1.6 1.6 0 0 1 7.2 8.8H4.6A1.6 1.6 0 0 1 3 7.2V4.6A1.6 1.6 0 0 1 4.6 3Z'],
        ['transactions', 'Activity', 'M13.9 3.4 17 6.5l-3.1 3.1M17 6.5H6.5a2.9 2.9 0 0 0-2.9 2.9M6.1 16.6 3 13.5l3.1-3.1M3 13.5h10.5a2.9 2.9 0 0 0 2.9-2.9', 'M10 12.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z'],
        ['invoicing', 'Invoices', 'M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM8.4 9.6h3.2M8.4 12.4h2.2', 'M6.1 6.4h7.8'],
        ['payments', 'Pay', 'M4 5.2h12a1.8 1.8 0 0 1 1.8 1.8v6a1.8 1.8 0 0 1-1.8 1.8H4a1.8 1.8 0 0 1-1.8-1.8V7A1.8 1.8 0 0 1 4 5.2ZM5.2 12.2h3.2', 'M2.2 8.6h15.6']
      ].map(([key, short, dpath, fpath]) => ({
        key, short, d: dpath + ' ' + fpath, go: this.go(key, this.dflt(key)),
        ic: s.page === key && !s.moreOpen ? 'var(--accent)' : 'var(--ink-4)',
        style: 'flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:9px 2px 4px; font-size:10.5px; font-weight:' + (s.page === key ? '700' : '500') + '; color:' + (s.page === key && !s.moreOpen ? 'var(--accent)' : 'var(--ink-4)')
      })).concat([{
        key: 'more', short: 'More',
        d: 'M4 5h12M4 10h12M4 15h12',
        go: () => this.setState(x => ({ moreOpen: !x.moreOpen, userMenu: false })),
        ic: s.moreOpen ? 'var(--accent)' : 'var(--ink-4)',
        style: 'flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:9px 2px 4px; font-size:10.5px; font-weight:' + (s.moreOpen ? '700' : '500') + '; color:' + (s.moreOpen ? 'var(--accent)' : 'var(--ink-4)')
      }]),
      nav2: (() => {
        this.pushNav(s.page, this.tabOf(s.page, this.dflt(s.page)));
        return null;
      })(),
      rates: (() => {
        const r = s.rates || { wht: '0', royalty: '0' };
        const mk = k => (e) => this.setState(x => ({ rates: Object.assign({}, x.rates, { [k]: e.target.value.replace(/[^0-9.]/g, '') }) }));
        return {
          wht: r.wht, royalty: r.royalty,
          setwht: mk('wht'), setroyalty: mk('royalty'),
          save: () => this.toast('Rates saved, payroll figures updated')
        };
      })(),
      acct: (() => {
        const pw = s.acctPw || '';
        const strong = pw.length >= 8;
        return {
          name: s.acctName, email: s.acctEmail, pw,
          pwType: s.acctPwShow ? 'text' : 'password',
          pwLabel: s.acctPwShow ? 'Hide' : 'Show',
          hint: !pw ? 'Leave blank to keep your current password' : strong ? 'Strong enough' : 'Use at least 8 characters',
          hintColor: !pw ? 'var(--ink-5)' : strong ? 'var(--pos)' : 'var(--neg)',
          setName: (e) => this.setState({ acctName: e.target.value }),
          setEmail: (e) => this.setState({ acctEmail: e.target.value }),
          setPw: (e) => this.setState({ acctPw: e.target.value }),
          togglePw: () => this.setState(x => ({ acctPwShow: !x.acctPwShow })),
          save: () => {
            if (!/.+@.+\..+/.test(s.acctEmail)) { this.toast('That email does not look right'); return; }
            if (pw && pw.length < 8) { this.toast('Password needs at least 8 characters'); return; }
            this.setState({ acctPw: '', acctPwShow: false });
            this.toast(pw ? 'Account and password updated' : 'Account updated');
          }
        };
      })(),
      notif: [
        ['payments', 'Payments received'],
        ['overdue', 'Invoice overdue'],
        ['sync', 'Sync errors']
      ].map(([k, label]) => {
        const cur = (s.notifPrefs || {})[k] || 'both';
        return {
          label,
          options: [['both', 'Email + app'], ['email', 'Email'], ['app', 'App'], ['off', 'Off']].map(([v, ol]) => ({
            label: ol,
            style: 'font-size:11.5px; font-weight:' + (v === cur ? '650' : '500') + '; padding:5px 11px; border-radius:7px; white-space:nowrap; transition:background .15s ease, color .15s ease; color:' + (v === cur ? 'var(--on-block)' : 'var(--ink-4)') + '; background:' + (v === cur ? 'var(--btn-dark)' : 'transparent'),
            go: this.memo('_nt', k + v, () => () => this.setState(x => ({ notifPrefs: Object.assign({}, x.notifPrefs, { [k]: v }) })))
          }))
        };
      }),
      backNav: (() => {
        // Only inner pages of a hub section get a back link. A section landing
        // (its Overview, or a hub-less section's tabs) is a top level — the
        // sidebar is the way out, so never fall through to a history label.
        const inner = HUBS.indexOf(s.page) >= 0 && this.tabOf(s.page, this.dflt(s.page)) !== 'hub';
        const ppBuilder = s.page === 'payments' && this.tabOf('payments', this.dflt('payments')) === 'checkout' && s.ppView !== 'list';
        return {
          atHub: inner,
          show: !d && inner && !ppBuilder,
          label: 'Back to overview',
          go: this.tabH(s.page, 'hub')
        };
      })(),
      hub: (() => {
        const IC = this.icons();
        const { D, HUBS } = this.dests();
        const META = {
          transactions: { matching: this.liveMatch().open + ' need a look' },
          invoicing: { all: String((s.invoiceTotals && s.invoiceTotals.outstandingCount) || 0) + ' unpaid' },
          team: { members: s.team.length + ' people' },
          payroll: { employees: s.employees.length + ' on payroll' },
          reports: { branches: s.branches.length + ' branches' }
        };
        this._SEC = D; this._IC = IC;
        const list = D[s.page] || [];
        const onHub = !d && this.tabOf(s.page, this.dflt(s.page)) === 'hub' && list.length > 0;
        return {
          show: onHub,
          cards: list.map(([tab, title, desc, ic]) => ({
            title, desc, d: IC[ic] || IC.list,
            meta: (META[s.page] || {})[tab] || '',
            go: this.go(s.page, tab)
          })),
          back: { show: !d && list.length > 0 && HUBS.indexOf(s.page) >= 0 && !onHub && !(s.page === 'payments' && this.tabOf('payments', this.dflt('payments')) === 'checkout' && s.ppView !== 'list'), text: 'Back to ' + ((this.headFor() || {}).title || '') + ' overview', go: this.tabH(s.page, 'hub') }
        };
      })(),
      flyout: (() => {
        const SEC = this._SEC || {}, IC = this._IC || {};
        const k = s.fly, rows = k ? (SEC[k] || []) : [];
        const nItem = nav.find(n => n.key === k);
        const h = 74 + rows.length * 48;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
        const top = Math.max(14, Math.min(vh - h - 14, (s.flyTop || 100) - 16));
        return {
          show: !!k && rows.length > 0 && !mob,
          title: nItem ? nItem.label : '',
          style: 'position:fixed; z-index:60; left:' + (s.flyLeft || 90) + 'px; top:' + top + 'px; width:288px; background:var(--modal); backdrop-filter:blur(34px) saturate(165%); -webkit-backdrop-filter:blur(34px) saturate(165%); border:1px solid var(--glass-edge); border-radius:11px; box-shadow:0 36px 80px -34px rgba(0,0,0,.55); overflow:hidden; animation:flowIn .16s ease both',
          rows: rows.map(([tab, title, desc, ic]) => {
            const cur = s.page === k && this.tabOf(k, this.dflt(k)) === tab;
            return {
            short: title,
            ic: cur ? 'var(--accent)' : 'var(--ink-4)',
            style: 'width:100%; display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:11px; font-size:13.5px; letter-spacing:-.01em; transition:background .14s ease, color .14s ease; font-weight:' + (cur ? '650' : '500') + '; color:' + (cur ? 'var(--accent)' : 'var(--ink-2)') + '; background:' + (cur ? 'var(--accent-soft)' : 'transparent'),
            title, desc, d: IC[ic] || '',
            go: () => { clearTimeout(this._flyT); this.setState(st => ({ page: k, detail: null, fly: null, railOpen: false, tab: Object.assign({}, st.tab, { [k]: tab }) })); }
          }; }),
          keep: () => { clearTimeout(this._flyT); clearTimeout(this._railT); },
          close: () => this.setState({ fly: null, railOpen: false })
        };
      })(),
      env: (() => {
        const live = s.env === 'live';
        const b = on => 'font-size:12px; font-weight:650; letter-spacing:-.005em; padding:5px 14px; border-radius:8px; transition:background .16s ease, color .16s ease, box-shadow .16s ease; color:' + (on ? 'var(--on-block)' : 'var(--ink-4)') + '; background:' + (on ? 'var(--btn-dark)' : 'transparent') + '; box-shadow:' + (on ? '0 4px 10px -6px rgba(0,0,0,.5)' : 'none');
        return {
          live, test: !live,
          testStyle: b(!live), liveStyle: b(live),
          goTest: () => this.setState({ env: 'test' }),
          goLive: () => this.setState({ env: 'live' }),
          note: live ? 'Live mode is still simulated. Payment processing pending Qatar commercial registration.' : 'Sandbox keys are in use, so nothing here moves real money yet.'
        };
      })(),
      envLabel: 'SANDBOX',
      sandboxTip: !!s.sandboxTip,
      sandboxTipOn: () => this.setState({ sandboxTip: true }),
      sandboxTipOff: () => this.setState({ sandboxTip: false }),
      pp: (() => {
        const p = s.pp;
        const IC = {
          price: 'M10 5.4v9.2M12.4 7.6c0-1-1.1-1.8-2.4-1.8s-2.4.8-2.4 1.8S8.7 9.4 10 9.4s2.4.8 2.4 1.8-1.1 1.8-2.4 1.8-2.4-.8-2.4-1.8',
          mail: 'M3 6.2h14v7.6H3V6.2Zm0 .4 7 4.6 7-4.6',
          phone: 'M6.2 3.4h2.2l1.1 2.8-1.5 1.1a8.4 8.4 0 0 0 3.7 3.7l1.1-1.5 2.8 1.1v2.2a1.4 1.4 0 0 1-1.5 1.4A11.6 11.6 0 0 1 4.8 4.9a1.4 1.4 0 0 1 1.4-1.5Z',
          text: 'M5 5.4h10M5 10h10M5 14.6h6'
        };
        const fields = p.fields.map((fd, i) => ({
          label: fd.label,
          hint: fd.kind === 'price' ? 'Amount the customer pays' : fd.kind === 'mail' ? 'So you can send a receipt' : fd.kind === 'phone' ? 'For payment updates' : 'Free text answer',
          ph: fd.kind === 'price' ? 'QR 0.00' : fd.kind === 'mail' ? 'name@company.com' : fd.kind === 'phone' ? '+974 0000 0000' : 'Type here',
          d: IC[fd.kind] || IC.text,
          locked: !!fd.locked, removable: !fd.locked,
          reqMark: !!fd.locked || !fd.optional,
          amountNote: fd.kind === 'price'
            ? ((s.ppAmountMode || 'fixed') === 'qty' ? 'You set the price here; customers only choose the quantity.'
              : s.ppAmountMode === 'open' ? 'Customers enter the amount themselves.'
              : 'You set this price here; customers cannot change it.')
            : 'Filled in by the customer.',
          isPrice: fd.kind === 'price', notPrice: fd.kind !== 'price',
          rowStyle: 'position:relative; margin:0 -14px; padding:6px 14px; border-radius:10px; transition:background .15s ease, opacity .15s ease; opacity:' + (s.ppFieldDrag === i ? '.4' : '1') + '; cursor:grab',
          rowHover: s.ppFieldEdit === i ? 'background:transparent' : 'background:var(--panel-2)',
          dragStart: (e) => { e.dataTransfer.effectAllowed = 'move'; this.setState({ ppFieldDrag: i }); },
          dragOver: (e) => e.preventDefault(),
          dragEnd: () => this.setState({ ppFieldDrag: null }),
          drop: (e) => {
            e.preventDefault();
            const from = this.state.ppFieldDrag;
            if (from == null || from === i) return;
            this.setState(st => {
              const arr = st.pp.fields.slice();
              const [moved] = arr.splice(from, 1);
              arr.splice(i, 0, moved);
              return { ppFieldDrag: null, pp: Object.assign({}, st.pp, { fields: arr }) };
            });
          },
          qtyMode: fd.kind === 'price' && (s.ppAmountMode || 'fixed') === 'qty',
          fixedMode: fd.kind === 'price' && (s.ppAmountMode || 'fixed') === 'fixed',
          openMode: fd.kind === 'price' && s.ppAmountMode === 'open',
          unitPrice: (fd.unitPrice != null ? fd.unitPrice : ''),
          qty: fd.qty != null ? fd.qty : 1,
          optional: !!fd.optional,
          optionalLabel: fd.optional ? 'Remove optional item' : 'Make it optional item',
          toggleRequired: this.memo('_ppreq', String(i), () => () => this.setState(st => ({ pp: Object.assign({}, st.pp, { fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { optional: !x.optional }) : x) }) }))),
          reqTrack: 'position:relative; display:inline-block; width:30px; height:17px; border-radius:9px; transition:background .28s cubic-bezier(.32,.72,0,1), box-shadow .28s ease; background:' + (fd.optional ? 'var(--divider)' : 'var(--btn-dark)'),
          reqKnob: 'position:absolute; top:2px; left:2px; width:13px; height:13px; border-radius:50%; background:#FFFFFF; box-shadow:0 1px 3px rgba(0,0,0,.3); transition:transform .28s cubic-bezier(.32,.72,0,1); transform:translateX(' + (fd.optional ? '0' : '13px') + ')',
          setPrice: (e) => { const v = e.target.value; this.setState(st => ({ ppPublishError: '', pp: Object.assign({}, st.pp, { fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { unitPrice: v }) : x) }) })); },
          qtyUp: this.memo('_qu', String(i), () => () => this.setState(st => ({ pp: Object.assign({}, st.pp, { fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { qty: (x.qty || 1) + 1 }) : x) }) }))),
          qtyDown: this.memo('_qd', String(i), () => () => this.setState(st => ({ pp: Object.assign({}, st.pp, { fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { qty: Math.max(1, (x.qty || 1) - 1) }) : x) }) }))),
          moreOpen: s.ppFieldMore === i,
          moreToggle: this.memo('_ppfm', String(i), () => () => this.setState(st => ({ ppFieldMore: st.ppFieldMore === i ? null : i }))),
          addImage: this.memo('_ppai', String(i), () => () => this.setState(st => ({ ppFieldMore: null, pp: Object.assign({}, st.pp, { fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { hasImage: true }) : x) }) }))),
          addDesc: this.memo('_ppad', String(i), () => () => this.setState(st => ({ ppFieldMore: null, pp: Object.assign({}, st.pp, { fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { hasDesc: true }) : x) }) }))),
          toggleOptional: this.memo('_ppto', String(i), () => () => this.setState(st => ({ ppFieldMore: null, pp: Object.assign({}, st.pp, { fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { optional: !x.optional }) : x) }) }))),
          advanced: this.memo('_ppav', String(i), () => () => this.setState({ ppFieldMore: null, ppPriceMenu: false })),
          editing: s.ppFieldEdit === i, viewing: s.ppFieldEdit !== i,
          draft: s.ppFieldEdit === i ? (s.ppFieldDraft != null ? s.ppFieldDraft : fd.label) : fd.label,
          edit: this.memo('_ppfe', String(i), () => () => this.setState({ ppFieldEdit: i, ppFieldDraft: null })),
          setLabel: (e) => this.setState({ ppFieldDraft: e.target.value }),
          cancel: () => this.setState({ ppFieldEdit: null, ppFieldDraft: null }),
          save: () => this.setState(st => ({
            ppFieldEdit: null, ppFieldDraft: null,
            pp: Object.assign({}, st.pp, {
              fields: st.pp.fields.map((x, j) => j === i ? Object.assign({}, x, { label: (st.ppFieldDraft != null && st.ppFieldDraft !== '') ? st.ppFieldDraft : x.label }) : x)
            })
          })),
          remove: () => this.setState(st => ({ ppFieldEdit: null, ppFieldDraft: null, pp: Object.assign({}, st.pp, { fields: st.pp.fields.filter((_, j) => j !== i) }) }))
        }));
        const add = (kind, label) => () => this.setState(st => ({
          pp: Object.assign({}, st.pp, {
            fields: st.pp.fields.concat([{ label: label + ' ' + (st.pp.fields.filter(x => x.kind === kind).length + 1), kind }])
          })
        }));
        const set = k => e => { const v = e.target.value; this.setState(st => ({ pp: Object.assign({}, st.pp, { [k]: v }) })); };
        return {
          title: p.title, desc: p.desc, email: p.email, phone: p.phone,
          titleOut: p.title || 'Your page title', descOut: p.desc || 'A short line about what this payment is for.',
          setTitle: e => {
            const v = e.target.value;
            this.setState(st => {
              const patch = { pp: Object.assign({}, st.pp, { title: v }), ppPublishError: '' };
              if (!st.ps.slugCustom) patch.ps = Object.assign({}, st.ps, { slug: this.slugify(v) });
              return patch;
            });
          },
          setDesc: set('desc'), setEmail: set('email'), setPhone: set('phone'),
          fields, addText: add('text', 'Question'),
          priceMenu: {
            label: ({ fixed: 'Fixed amount', open: 'Customer decides', qty: 'Item with quantity' })[s.ppAmountMode || 'fixed'],
            open: !!s.ppPriceMenu,
            toggle: () => this.setState(st => ({ ppPriceMenu: !st.ppPriceMenu })),
            close: () => this.setState({ ppPriceMenu: false }),
            options: [
              ['fixed', 'Fixed amount', 'You set the price', 'M10 5v10M12.6 7.4c0-1.1-1.2-2-2.6-2s-2.6.9-2.6 2 1.2 2 2.6 2 2.6.9 2.6 2-1.2 2-2.6 2-2.6-.9-2.6-2'],
              ['open', 'Customer decides', 'They type any amount', 'M3.4 16.6c.7-3.3 3.4-5.1 6.6-5.1s5.9 1.8 6.6 5.1M10 3.4a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8'],
              ['qty', 'Item with quantity', 'Price times how many', 'M4 5.6h12M4 10h12M4 14.4h7M15 13v3.4M13.3 14.7h3.4']
            ].map(([k, label, sub, d]) => ({
              label, sub, d,
              go: this.memo('_ppp', k, () => () => this.setState(st => ({
                ppPriceMenu: false, ppAmountMode: k,
                ppFieldEdit: k === 'open' ? null : st.pp.fields.findIndex(x => x.kind === 'price'),
                ppFieldDraft: null
              })))
            }))
          },
          termsOn: !!p.terms, termsOff: !p.terms,
          termsTrack: this.swTrack(!!p.terms), termsKnob: this.swKnob(!!p.terms),
          toggleTerms: () => this.setState(st => ({ pp: Object.assign({}, st.pp, { terms: !st.pp.terms }) })),
          total: 'QR ' + p.fields.filter(x => x.kind === 'price').length * 0 + '0.00',
          url: ((typeof location !== 'undefined' && location.origin) ? location.origin : '') + '/pay/' + this.pageSlug(s),
          copyUrl: () => this.copyPayUrl(((typeof location !== 'undefined' && location.origin) ? location.origin : '') + '/pay/' + this.pageSlug(s)),
          hasLogo: !!s.ppLogo,
          noLogo: !s.ppLogo,
          logo: s.ppLogo || '',
          pickLogo: () => { const el = typeof document !== 'undefined' && document.getElementById('flow-page-logo'); if (el) el.click(); },
          onLogo: (e) => {
            const file = e.target && e.target.files && e.target.files[0];
            if (!file || !file.type || file.type.indexOf('image/') !== 0) { this.toast('Choose an image'); return; }
            const reader = new FileReader();
            const self = this;
            reader.onload = function () { self.setState({ ppLogo: String(reader.result || '') }); };
            reader.readAsDataURL(file);
          },
          headline: p.title || 'New payment page',
          ref: 'pp_' + ((p.title || 'new').toLowerCase().replace(/[^a-z0-9]/g, '') + 'x7k2').slice(0, 10),
          goalOn: !!p.goal, goalOff: !p.goal,
          goalTip: !!s.ppGoalTip,
          goalTipOn: () => this.setState({ ppGoalTip: true }),
          goalTipOff: () => this.setState({ ppGoalTip: false }),
          toggleGoal: () => this.setState(st => ({ pp: Object.assign({}, st.pp, { goal: st.pp.goal ? '' : '50,000' }) })),
          goal: p.goal || '',
          setGoal: e => { const v = e.target.value; this.setState(st => ({ pp: Object.assign({}, st.pp, { goal: v }) })); },
          goalNote: p.goal ? ('Toward ' + p.goal) : '',
          tools: [
            ['color', 'M4.4 15.6 9.2 3.6h1.6l4.8 12M6.2 11.4h7.6'],
            ['bold', 'M6.5 4h4.6a2.9 2.9 0 0 1 0 5.8H6.5V4Zm0 5.8h5.2a3.1 3.1 0 0 1 0 6.2H6.5V9.8Z'],
            ['italic', 'M12.4 4H8.2M11.8 16H7.6M11 4 9 16'],
            ['under', 'M6 3.6v5.8a4 4 0 0 0 8 0V3.6M5 16.6h10'],
            ['bullet', 'M7.6 5.6h9M7.6 10h9M7.6 14.4h9M4 5.6h.02M4 10h.02M4 14.4h.02'],
            ['number', 'M8 5.6h8.6M8 10h8.6M8 14.4h8.6M4 4.4v2.6M3.4 12.8h1.8l-1.8 2.2h1.8'],
            ['link', 'M8.2 11.8 11.8 8.2M7.4 13.4a2.6 2.6 0 0 1 0-3.7l1.5-1.5M12.6 6.6a2.6 2.6 0 0 1 3.7 3.7l-1.5 1.5']
          ].map(([k, d]) => ({
            d, go: () => {},
            style: 'width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; color:var(--ink-4); background:transparent; transition:background .14s ease, color .14s ease'
          })),
          share: [
            { d: 'M12.4 6.4H14V3.6h-2.2a3.2 3.2 0 0 0-3.2 3.2v1.8H6.8v2.9h1.8v6.9h3v-6.9h2.2l.4-2.9h-2.6V7.2c0-.5.3-.8.8-.8Z' },
            { d: 'M3.6 3.6h3.6l4 5.4 4.4-5.4h1.6l-5.2 6.4 5.6 7.4h-3.6l-4.2-5.6-4.6 5.6H3.6l5.4-6.6L3.6 3.6Z' },
            { d: 'M3.4 16.6l.9-3.2a6.2 6.2 0 1 1 2.4 2.3l-3.3.9ZM7.6 7.4c.3-.1.6 0 .8.3l.7 1.2c.1.3.1.6-.1.8l-.5.5a4.6 4.6 0 0 0 2.3 2.3l.5-.5c.2-.2.5-.2.8-.1l1.2.7c.3.2.4.5.3.8' }
          ],
          payLabel: p.payLabel || 'Pay',
          payLabelEditing: !!s.ppPayLabelEdit,
          payLabelDraft: s.ppPayLabelDraft != null ? s.ppPayLabelDraft : (p.payLabel || 'Pay'),
          editPayLabel: () => this.setState({ ppPayLabelEdit: true, ppPayLabelDraft: p.payLabel || 'Pay' }),
          setPayLabelDraft: (e) => this.setState({ ppPayLabelDraft: e.target.value }),
          cancelPayLabel: () => this.setState({ ppPayLabelEdit: false, ppPayLabelDraft: null }),
          savePayLabel: () => this.setState(st => ({
            ppPayLabelEdit: false, ppPayLabelDraft: null,
            pp: Object.assign({}, st.pp, { payLabel: (st.ppPayLabelDraft || 'Pay') })
          })),
          statusLabel: p.published ? 'Published' : 'Draft',
          publishLabel: p.published ? 'Update page' : 'Publish page',
          publish: () => this.publishCheckout(),
          publishError: s.ppPublishError || '',
          publishErrorOn: !!s.ppPublishError
        };
      })(),
      ps: (() => {
        const p = s.ps;
        const opt = (k, v) => ({ on: p[k] === v, go: () => this.setState(st => ({ ps: Object.assign({}, st.ps, { [k]: v }) })) });
        return {
          slug: (p.slugCustom && String(p.slug || '').trim()) ? p.slug : this.slugify(s.pp.title || p.slug),
          setSlug: e => {
            const v = e.target.value;
            this.setState(st => ({
              ps: Object.assign({}, st.ps, { slug: v, slugCustom: String(v || '').trim() !== '' })
            }));
          },
          themeLight: opt('theme', 'light'), themeDark: opt('theme', 'dark'),
          expNone: opt('expiry', 'none'), expDate: opt('expiry', 'date'),
          dateOn: p.expiry === 'date',
          afterMsg: opt('after', 'message'), afterRedirect: opt('after', 'redirect'),
          redirectOn: p.after === 'redirect', msgOn: p.after === 'message'
        };
      })(),
      rc: (() => {
        const r = s.rc;
        const set = (k, v) => () => this.setState(st => ({ rc: Object.assign({}, st.rc, { [k]: v }) }));
        const tog = k => () => this.setState(st => ({ rc: Object.assign({}, st.rc, { [k]: !st.rc[k] }) }));
        return {
          auto: { on: r.auto, go: set('auto', true) },
          manual: { on: !r.auto, go: set('auto', false) },
          showCustomer: { on: r.showCustomer, off: !r.showCustomer, go: tog('showCustomer') },
          ref: { on: r.ref, off: !r.ref, go: tog('ref') }
        };
      })(),
      nv: (() => {
        const iv = s.nv || {};
        const items = iv.items || [{ desc: '', qty: '1', price: '' }];
        const num = v => { const n = parseFloat(String(v).replace(/[^0-9.\\-]/g, '')); return isNaN(n) ? 0 : n; };
        const sub = items.reduce((a, x) => a + num(x.qty) * num(x.price), 0);
        const taxPct = num(iv.tax != null ? iv.tax : 0);
        const taxAmt = sub * taxPct / 100;
        const setItems = (next) => this.setState(st => ({ nv: Object.assign({}, st.nv, { items: next }) }));
        const patch = (k, v) => this.setState(st => ({ nv: Object.assign({}, st.nv, { [k]: v }) }));
        const clientName = iv.client || '';
        const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const nextNo = 'INV-' + String((s.invoices.reduce((n, i) => Math.max(n, parseInt(String(i.no || '').replace(/\D/g, ''), 10) || 0), 148) + 1)).padStart(4, '0');
        return {
          no: nextNo,
          clientLabel: clientName || 'Select or add a client',
          clientBtn: 'width:100%; display:flex; align-items:center; gap:10px; padding:11px 13px; border:1px solid var(--line); border-radius:10px; background:var(--panel); font-size:13.5px; transition:border-color .15s ease; color:' + (clientName ? 'var(--ink)' : 'var(--ink-5)'),
          clientsOpen: !!s.nvClients,
          toggleClients: () => this.setState(st => ({ nvClients: !st.nvClients })),
          clientOptions: s.clients.map(c => ({
            name: c.name, on: c.name === clientName,
            style: 'width:100%; display:flex; align-items:center; gap:9px; padding:10px 13px; text-align:left; font-size:12.5px; transition:background .14s ease; font-weight:' + (c.name === clientName ? '650' : '500') + '; color:' + (c.name === clientName ? 'var(--ink)' : 'var(--ink-2)'),
            go: this.memo('_nvc', c.id, () => () => this.setState(st => ({ nvClients: false, nv: Object.assign({}, st.nv, { client: c.name }) })))
          })),
          newClient: iv.newClient || '',
          setNewClient: (e) => patch('newClient', e.target.value),
          addClient: () => {
            const nm = (s.nv && s.nv.newClient || '').trim();
            if (!nm) { this.toast('Type a client name first'); return; }
            if (typeof FlowStore !== 'undefined' && FlowStore.addClient) {
              FlowStore.addClient({ name: nm });
              this.applyStore({
                nvClients: false,
                nv: Object.assign({}, this.state.nv, { client: nm, newClient: '' })
              });
              this.toast(nm + ' added');
              return;
            }
            this.setState(st => ({
              nvClients: false,
              clients: [{ id: 'c' + Date.now(), name: nm, email: '', owes: 0, invoices: 0 }].concat(st.clients),
              nv: Object.assign({}, st.nv, { client: nm, newClient: '' })
            }));
            this.toast(nm + ' added');
          },
          items: items.map((x, i) => ({
            desc: x.desc, qty: x.qty, price: x.price,
            total: money(num(x.qty) * num(x.price)),
            setDesc: (e) => { const v = e.target.value; setItems(items.map((y, j) => j === i ? Object.assign({}, y, { desc: v }) : y)); },
            setQty: (e) => { const v = e.target.value; setItems(items.map((y, j) => j === i ? Object.assign({}, y, { qty: v }) : y)); },
            setPrice: (e) => { const v = e.target.value; setItems(items.map((y, j) => j === i ? Object.assign({}, y, { price: v }) : y)); },
            remove: this.memo('_nvr', String(i), () => () => setItems(items.filter((y, j) => j !== i)))
          })),
          addItem: () => setItems(items.concat([{ desc: '', qty: '1', price: '' }])),
          tax: iv.tax != null ? iv.tax : '0',
          setTax: (e) => patch('tax', e.target.value),
          taxAmt: money(taxAmt),
          due: iv.due == null ? ((typeof FlowStore !== 'undefined' && FlowStore.dateInputValue) ? FlowStore.dateInputValue(14) : '') : iv.due,
          dueError: iv.dueError || '',
          dueErrorOn: !!iv.dueError,
          setDue: (e) => this.setState(st => ({ nv: Object.assign({}, st.nv, { due: e.target.value, dueError: '' }) })),
          notes: iv.notes != null ? iv.notes : '',
          setNotes: (e) => patch('notes', e.target.value),
          preview: items.filter(x => x.desc || num(x.price)).map(x => ({
            label: (x.desc || 'Untitled line') + (num(x.qty) > 1 ? ' ×' + num(x.qty) : ''),
            amt: money(num(x.qty) * num(x.price))
          })),
          total: 'QR ' + money(sub + taxAmt),
          create: () => {
            if (!clientName) { this.toast('Pick a client first'); return; }
            if (!sub) { this.toast('Add at least one line item'); return; }
            const saved = this.persistCreatedInvoice({
              clientName,
              amountMajor: sub + taxAmt,
              dueRaw: iv.due,
              draft: false,
              lines: items.filter(x => x.desc || num(x.price)).map(x => ({
                description: x.desc || 'Untitled line',
                quantity: num(x.qty) || 1,
                unitMinor: Math.round(num(x.price) * 100)
              }))
            });
            if (saved.error) {
              this.setState(st => ({ nv: Object.assign({}, st.nv, { dueError: saved.error }) }));
              return;
            }
            this.applyStore({ nv: {}, nvClients: false, tab: Object.assign({}, this.state.tab, { invoicing: 'all' }) });
            this.toast('Invoice ' + (saved.invoice && saved.invoice.number ? saved.invoice.number : nextNo) + ' sent');
          },
          draft: () => {
            if (!clientName) { this.toast('Pick a client first'); return; }
            if (!sub) { this.toast('Add at least one line item'); return; }
            const saved = this.persistCreatedInvoice({
              clientName,
              amountMajor: sub + taxAmt,
              dueRaw: iv.due,
              draft: true,
              lines: items.filter(x => x.desc || num(x.price)).map(x => ({
                description: x.desc || 'Untitled line',
                quantity: num(x.qty) || 1,
                unitMinor: Math.round(num(x.price) * 100)
              }))
            });
            if (saved.error) {
              this.setState(st => ({ nv: Object.assign({}, st.nv, { dueError: saved.error }) }));
              return;
            }
            this.applyStore({ nv: {}, nvClients: false });
            this.toast('Saved as draft');
          }
        };
      })(),
      gateways: [
        ['Dibsy', 'DY', 'Qatar cards, wallets and Apple Pay', 'ready'],
        ['QPay', 'QP', 'NAPS debit through Qatar National Bank', 'ready'],
        ['Stripe', 'ST', 'For customers paying from outside Qatar', 'ready'],
        ['Tap Payments', 'TP', 'Gulf-wide cards and KNET', 'soon']
      ].map(([name, initials, note, state]) => ({
        name, initials, note: state === 'soon' ? note + ' · coming soon' : note,
        cta: state === 'soon' ? 'Notify me' : 'Connect',
        btnStyle: 'flex:0 0 auto; font-size:12px; font-weight:650; padding:8px 14px; border-radius:9px; white-space:nowrap; ' + (state === 'soon'
          ? 'border:1px solid var(--line); background:var(--btn-light); color:var(--ink-3)'
          : 'border:1px solid var(--line); background:var(--btn-light); color:var(--ink)'),
        go: this.memo('_gw', name, () => () => this.toast(state === 'soon' ? 'We will let you know when ' + name + ' is ready' : name + ' connection is not available in Phase 1'))
      })),
      brand: (() => {
        const cur = s.brandColor || '#17171C';
        const HUES = [
          ['#FDE8E6', '#F9C0BB', '#F0857C', '#DE4B40', '#B8342A', '#8C231B'],
          ['#FCEFE0', '#F6D5AC', '#E9AE64', '#D48A2E', '#A96919', '#7E4E11'],
          ['#EAF3EC', '#C4E0CC', '#8CC2A0', '#4F9B6C', '#2F5D50', '#1E4038'],
          ['#E8F0F7', '#BFD8EC', '#82B2D8', '#4682B4', '#2C5C85', '#1C3C58'],
          ['#EFEBF7', '#D3C8EB', '#A692D6', '#7B62BE', '#5A4B8C', '#3C3160'],
          ['#F7EBF2', '#EAC7DB', '#D492B7', '#B85F8E', '#8C426A', '#5F2C47'],
          ['#F2F2F5', '#D8D8DE', '#A9A9B4', '#6E6E7A', '#3A3A44', '#17171C']
        ];
        const flat = [];
        for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) flat.push(HUES[c][r]);
        return {
          swatches: ['#17171C', '#2F5D50', '#5A4B8C', '#8A5A2B'].map(c => ({
            go: () => this.setState({ brandColor: c }),
            style: 'width:30px; height:30px; border-radius:9px; background:' + c + '; box-shadow:' + (cur === c ? '0 0 0 2px var(--surface), 0 0 0 3.5px ' + c : 'inset 0 0 0 1px rgba(255,255,255,.14)')
          })),
          pickerOpen: !!s.brandPicker,
          togglePicker: () => this.setState(st => ({ brandPicker: !st.brandPicker })),
          palette: flat.map(c => ({
            go: this.memo('_bp', c, () => () => this.setState({ brandColor: c })),
            style: 'width:100%; aspect-ratio:1; border-radius:6px; background:' + c + '; box-shadow:' + (cur.toLowerCase() === c.toLowerCase() ? '0 0 0 2px var(--panel-2), 0 0 0 3.5px var(--ink)' : 'inset 0 0 0 1px rgba(0,0,0,.08)')
          })),
          hex: cur,
          setHex: (e) => {
            let v = e.target.value.trim();
            if (v && v[0] !== '#') v = '#' + v;
            this.setState({ brandColor: v });
          },
          previewStyle: 'width:26px; height:26px; flex:0 0 26px; border-radius:7px; border:1px solid var(--line); background:' + cur
        };
      })(),
      ppGrid: s.vw < 1160
        ? 'display:grid; grid-template-columns:minmax(0,1fr); gap:28px; align-items:start; max-width:1160px; margin:0 auto'
        : 'display:grid; grid-template-columns:minmax(0,1fr) minmax(0,470px); gap:36px; align-items:start; max-width:1160px; margin:0 auto',
      ppList: {
        show: s.ppView === 'list',
        edit: s.ppView === 'edit',
        published: s.ppView === 'published',
        reopen: () => this.setState({ ppView: 'edit' }),
        count: (s.checkoutPages || s.ppPages || []).length + ((s.checkoutPages || s.ppPages || []).length === 1 ? ' page' : ' pages'),
        empty: (s.checkoutPages || s.ppPages || []).length === 0,
        create: () => this.setState({
          ppView: 'edit', ppEditing: null,
          pp: { title: '', desc: '', email: (((typeof window !== 'undefined' && window.FLOW_DATA) || {}).acctEmail) || '', phone: '', terms: true, published: false,
                fields: [{ label: 'Amount', kind: 'price', locked: true }, { label: 'Email', kind: 'mail', locked: true }] },
          ppLogo: '',
          ppPublishError: '',
          ps: Object.assign({}, this.state.ps, { slug: '', slugCustom: false })
        }),
        back: () => this.setState({ ppView: 'list' }),
        rows: (s.checkoutPages || s.ppPages || []).map(p => ({
          title: p.title,
          published: p.published !== false && p.status !== 'Draft',
          draft: p.published === false || p.status === 'Draft',
          meta: (p.published === false || p.status === 'Draft') ? 'Not published yet' : (p.views || 0) + ' views · ' + (p.paid || 0) + ' paid · /pay/' + (p.slug || ''),
          amount: p.amountText || (p.amount ? this.fmt0(p.amount) : '—'),
          open: () => this.setState({
            ppView: 'edit', ppEditing: p.id,
            ppLogo: p.logoDataUrl || '',
            ps: Object.assign({}, s.ps, { slug: p.slug || '', slugCustom: !!p.slug }),
            pp: { title: p.title, desc: p.desc, email: p.email, phone: p.phone, terms: p.terms,
                  published: p.published !== false, fields: (p.fields || [{ label: 'Amount', kind: 'price', locked: true, unitPrice: String(p.amount || '') }]).map(x => Object.assign({}, x)) }
          })
        }))
      },
      rcSummary: s.rc.auto
        ? { title: 'Receipts go out automatically', sub: 'Emailed the moment each payment clears' + (s.rc.showCustomer ? ', with customer details shown' : '') }
        : { title: 'You send receipts yourself', sub: 'Send them later from Money In & Out, with your own reference' },
      psSummary: s.ps.after === 'redirect'
        ? { title: 'Customers go to your website after paying', sub: 'Page theme: ' + (s.ps.theme === 'dark' ? 'dark' : 'light') + (s.ps.expiry === 'date' ? ' · closes on a set date' : '') }
        : { title: 'Customers see a thank-you message', sub: 'Page theme: ' + (s.ps.theme === 'dark' ? 'dark' : 'light') + (s.ps.expiry === 'date' ? ' · closes on a set date' : ' · no closing date') },
      navGroups: (() => {
        const by = {}; nav.forEach(n => by[n.key] = n);
        const G = [
          ['', ['dashboard']],
          ['Get paid & track money', ['payments', 'transactions', 'invoicing', 'accounting']],
          ['Your business', ['reports', 'team', 'payroll']],
          ['Account', ['connections', 'settings']]
        ];
        const SEC = this._SEC || {}, IC = this._IC || {};
        nav.forEach(n => {
          const rows = SEC[n.key] || [];
          n.hasFly = rows.length > 0;
          n.fly = rows.map(([tab, title, desc, ic]) => ({ title, desc, d: IC[ic] || '', go: this.tabH(n.key, tab) }));
          n.enter = (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            clearTimeout(this._flyT);
            if (rows.length) this._flyT = setTimeout(() => this.setState({ fly: n.key, flyTop: r.top, flyLeft: 264 }), 160);
            else this.setState({ fly: null });
          };
          n.leave = () => { clearTimeout(this._flyT); this._flyT = setTimeout(() => this.setState({ fly: null }), 220); };
        });
        return G.map(([label, keys], gi) => ({
          label,
          items: keys.map(k => by[k]).filter(Boolean),
          wrap: 'display:flex; flex-direction:column; gap:' + (rail ? '2px' : '5px') + '; align-items:' + (rail ? 'stretch' : 'center') + '; margin-top:' + (gi === 0 ? '0' : rail ? '16px' : '7px') + '; transition:gap .5s cubic-bezier(.32,.72,0,1), margin-top .5s cubic-bezier(.32,.72,0,1)',
          headStyle: (rail && label) ? 'padding:2px 12px 7px; font-size:9.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-5); white-space:nowrap; overflow:hidden; opacity:1; transition:opacity .3s ease .14s' : 'height:0; opacity:0; overflow:hidden; padding:0; transition:opacity .12s ease',
          ruleStyle: (!rail && label) ? 'width:22px; height:1px; background:var(--divider); margin:0 auto 1px' : 'display:none'
        }));
      })(),
      nav, tabs, ppFocus, head: Object.assign({}, this.headFor(), { show: false, inPage: !d && !ppFocus && s.page !== 'dashboard' && !(mob && (s.page === 'transactions' || s.page === 'invoicing')) }), branch,
      railOn: rail, railOff: !rail,
      searchOpen: !!s.searchOpen,
      searchIdle: !!s.searchOpen && (s.search || '').trim().length === 0,
      results: (() => {
        const q = (s.search || '').trim().toLowerCase();
        if (!q) return { groups: [], none: false };
        const hit = t => (t || '').toLowerCase().includes(q);
        const tx = s.txns.filter(t => hit(t.party) || hit(t.tag) || hit(t.src) || hit(String(Math.abs(t.amount)))).slice(0, 5).map(t => ({
          abbr: t.src.slice(0, 2).toUpperCase(), label: t.party, meta: this.fmt(t.amount),
          go: this.memo('_sr', 'tx' + t.id, () => () => this.setState({ search: '', searchOpen: false, detail: { type: 'txn', id: t.id } }))
        }));
        const iv = s.invoices.filter(i => hit(i.client) || hit(i.no) || hit(i.status)).slice(0, 4).map(i => ({
          abbr: 'IN', label: i.no + ' · ' + i.client, meta: i.status,
          go: this.memo('_sr', 'iv' + i.id, () => () => this.setState({ search: '', searchOpen: false, detail: { type: 'invoice', id: i.id } }))
        }));
        const cl = s.clients.filter(c => hit(c.name) || hit(c.email)).slice(0, 3).map(c => ({
          abbr: c.name.slice(0, 2).toUpperCase(), label: c.name, meta: this.fmt0(c.total),
          go: this.memo('_sr', 'cl' + c.id, () => () => this.setState({ search: '', searchOpen: false, detail: { type: 'client', id: c.id } }))
        }));
        const pg = NAV.filter(([k, label]) => hit(label)).slice(0, 3).map(([k, label]) => ({
          abbr: 'GO', label: label, meta: 'Page',
          go: this.memo('_sr', 'pg' + k, () => () => this.setState({ search: '', searchOpen: false, detail: null, page: k }))
        }));
        const groups = [];
        if (tx.length) groups.push({ label: 'TRANSACTIONS', items: tx });
        if (iv.length) groups.push({ label: 'INVOICES', items: iv });
        if (cl.length) groups.push({ label: 'CLIENTS', items: cl });
        if (pg.length) groups.push({ label: 'JUMP TO', items: pg });
        return { groups, none: groups.length === 0 };
      })(),
      theme: s.theme, isDark: s.theme === 'dark', isLight: s.theme !== 'dark',
      userMenu: !!s.userMenu,
      moreOpen: !!s.moreOpen,
      moreItems: [
        ['accounting', 'Sync to Books'],
        ['reports', 'Reports'],
        ['team', 'Your Team'],
        ['payroll', 'Payroll'],
        ['connections', 'Connected Apps'],
        ['settings', 'Settings']
      ].map(([key, label]) => {
        const n = NAV.find(x => x[0] === key) || [];
        return { label, d: (n[2] || '') + ' ' + (n[3] || ''), go: () => { clearTimeout(this._flyT); this.setState({ page: key, detail: null, fly: null, moreOpen: false }); } };
      }),
      me: {
        initials: (s.ownerName || s.acctName || 'NA').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase(), name: s.ownerName || s.acctName, email: s.acctEmail,
        role: 'Owner', plan: (s.plan && s.plan.tier) || '', business: s.merchantName || '',
        branch: (s.branches.find(b => b.id === s.branchId) || {}).name || '',
        limit: 'No limit', lastLogin: '',
        links: [
          { label: 'Business profile', d: 'M10 11.4a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM4.2 16.6c.9-2.6 3.1-3.8 5.8-3.8s4.9 1.2 5.8 3.8', go: () => this.setState({ userMenu: false, page: 'settings', tab: Object.assign({}, s.tab, { settings: 'profile' }), detail: null }) },
          { label: 'Security & devices', d: 'M10 2.8 4.6 5v4.4c0 3.4 2.2 6.3 5.4 7.8 3.2-1.5 5.4-4.4 5.4-7.8V5L10 2.8Z', go: () => this.setState({ userMenu: false, page: 'settings', tab: Object.assign({}, s.tab, { settings: 'security' }), detail: null }) },
          { label: 'Plan & billing', d: 'M2.8 6.6h14.4v8.2H2.8V6.6Zm0 3.2h14.4M6 12.8h3', go: () => this.setState({ userMenu: false, page: 'settings', tab: Object.assign({}, s.tab, { settings: 'billing' }), detail: null }) }
        ]
      },
      mobData: (() => {
        const bal = inflow + outflow;
        const recent = this.sortedTxns().slice(0, 6).map(t => Object.assign({}, this.row(t), { chip: this.chip(t.status) }));
        return {
          balance: this.fmt0(bal), inflow: this.fmt0(inflow), outflow: this.fmt0(Math.abs(outflow)),
          recent,
          actions: [
            { label: 'Request', d: 'M10 4.4v11.2M5.6 11.2 10 15.6l4.4-4.4', go: this.openModal('link') },
            { label: 'Invoice', d: 'M6.1 2.8h7.8v14.4l-1.95-1.3-1.95 1.3-1.95-1.3L6.1 17.2ZM8.4 9.6h3.2', go: this.openModal('invoice') },
            { label: 'Scan', d: 'M3 7.2V4.7A1.7 1.7 0 0 1 4.7 3h2.5M12.8 3h2.5A1.7 1.7 0 0 1 17 4.7v2.5M17 12.8v2.5a1.7 1.7 0 0 1-1.7 1.7h-2.5M7.2 17H4.7A1.7 1.7 0 0 1 3 15.3v-2.5M5.6 10h8.8', go: this.openModal('scan') },
            { label: 'Expense', d: 'M10 15.6V5.2M5.8 9.4 10 5.2l4.2 4.2M4.4 16.8h11.2', go: this.openModal('expense') }
          ],
          needsMatch: String(this.liveMatch().open),
          openInv: String((s.invoiceTotals && s.invoiceTotals.outstandingCount) || 0),
          outstanding: this.fmt0(outstanding),
          pending: period.pendingText || this.fmt0(period.pending), delta: '',
          allTxns: this.sortedTxns().slice(0, 16).map(t => this.row(t)),
          invoices: s.invoices.slice(0, 12).map(i => ({ no: i.no, client: i.client, status: i.status, amt: this.fmt0(i.amount), open: this.open('invoice', i.id) })),
          goTxns: this.go('transactions', 'all'), goMatch: this.go('transactions', 'matching'), goInv: this.go('invoicing', 'all')
        };
      })(),
      greet: (() => {
        const hr = new Date().getHours();
        const part = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
        const first = (s.ownerName || this.props.ownerName || '').split(' ')[0];
        return {
          hello: part + ', ' + first,
          sub: attList.length ? attList.length + ' things need a quick look. The rest is running itself.' : 'Everything is settled. Nothing needs you right now.',
          date: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
        };
      })(),
      usage: s.usage || { pct: '0%', label: '' },
      profile: s.profile || {},
      plan: s.plan || { tier: '', price: '', line: '', limitLabel: '' },
      showTax: !!s.showTax,
      ownerName: s.ownerName || '',
      bank: FlowStore.dashboardState().bank,
      gateways: s.gateways || { skipcash: {}, shopify: {} },
      scan: s.scan || {},
      periodFrom: s.periodFrom || '',
      periodTo: s.periodTo || '',
      f: Object.assign({ search: s.search }, s.form),
      memberEdit: (() => {
        const editing = d && d.type === 'member' && s.memberEditing === d.id;
        const cur = d && d.type === 'member' ? (s.team.find(m => m.id === d.id) || {}) : {};
        return {
          on: editing, off: !editing,
          start: this.memo('_me', d ? d.id : '', () => () => this.setState(st => ({ memberEditing: d.id, form: Object.assign({}, st.form, { memberName: cur.name, memberEmail: cur.email, memberRole: cur.role }) }))),
          save: () => {
            const id = s.memberEditing, f = s.form;
            this.setState(st => ({
              memberEditing: null,
              team: st.team.map(m => m.id === id ? Object.assign({}, m, { name: f.memberName, email: f.memberEmail, role: f.memberRole }) : m)
            }));
            this.toast('Member updated');
          }
        };
      })(),
      F: Object.assign({ search: (e) => { const v = e.target.value; this.setState({ search: v }); }, linkInvoice: this.onLinkInvoice, periodFrom: (e) => this.setState({ periodFrom: e.target.value }), periodTo: (e) => this.setState({ periodTo: e.target.value }), invDue: (e) => this.setState(st => ({ invDueError: '', form: Object.assign({}, st.form, { invDue: e.target.value }) })) }, this.forms(['empMethod', 'linkAmount', 'linkDesc', 'linkExpiry', 'linkClient', 'expAmount', 'expParty', 'invClient', 'invAmount', 'planName', 'planAmount', 'planInterval', 'planDesc', 'planCustomer', 'shopDomain', 'memberName', 'memberEmail', 'memberRole', 'empName', 'empRole', 'empSalary', 'scanVendor', 'scanAmount', 'scanDate', 'scanTag', 'scanTax', 'recEvery', 'recEnds', 'recClient', 'recAmount'])),
      h: {
        stop: (e) => e.stopPropagation(),
        back: () => this.setState({ detail: null }),
        openSearch: () => this.setState({ searchOpen: true, userMenu: false, moreOpen: false }),
        goHome: () => { clearTimeout(this._flyT); this.setState({ page: 'dashboard', detail: null, fly: null, moreOpen: false }); },
        closeMore: () => this.setState({ moreOpen: false }),
        closeSearch: () => this.setState({ searchOpen: false, search: '' }),
        railOpen: () => {
          clearTimeout(this._railT);
          if (!this.state.railOpen) this._railT = setTimeout(() => this.setState({ railOpen: true }), 90);
        },
        railClose: () => {
          clearTimeout(this._railT);
          this._railT = setTimeout(() => {
            if (this.state.railOpen && !this.state.fly) this.setState({ railOpen: false });
          }, 240);
        },
        toggleTheme: () => this.setState(st => {
          const t = st.theme === 'dark' ? 'light' : 'dark';
          try { localStorage.setItem('flow-theme', t); } catch (e) {}
          return { theme: t };
        }),
        branchMenu: this.go('reports', 'branches'),
        openHelp: this.openModal('help'),
        toggleUser: () => this.setState(x => ({ userMenu: !x.userMenu })),
        closeUser: () => this.setState({ userMenu: false }),
        closeModal: () => { clearTimeout(this._scanT); this.setState({ modal: null, editEmp: null, scanBusy: false }); },
        submitModal: this.submitModal,
        simulateScan: () => this.startExtract(((this.state.sampleBills || [])[0] || {}).id || 'bill_barzan'),
        goTxns: this.go('transactions', 'all'),
        goMatching: this.go('transactions', 'matching'),
        newLink: this.openModal('link'),
        openPageSettings: this.openModal('pageSettings'),
        openReceipts: this.openModal('receipts'),
        openScan: this.openModal('scan'),
        newPlan: this.openModal('plan'),
        newInvoice: this.openModal('invoice'),
        newMember: this.openModal('member'),
        newEmployee: this.openModal('employee'),
        export: () => this.toast('Export queued. CSV is sample-only in this sandbox'),
        copy: () => this.toast('Link copied to clipboard'),
        note: (e) => this.toast((e.currentTarget && e.currentTarget.getAttribute('data-note')) || 'Done'),
        signOut: () => { this.setState({ userMenu: false }); this.toast('Signed out of this sandbox'); },
        syncNow: () => this.runZohoSync(),
        tallyExport: () => this.runTallyExport(),
        testTxn: () => this.toast('Sandbox test payment of QR 1.00 sent'),
        generatePayslips: () => this.toast('Payslips generated for ' + this.state.employees.length + ' employees'),
        resetDemo: this.openModal('reset')
      },
      show: {
        dashboard: !d && s.page === 'dashboard' && !mob,
        payments: !d && s.page === 'payments',
        transactions: !d && s.page === 'transactions' && !mob,
        invoicing: !d && s.page === 'invoicing' && !mob,
        accounting: !d && s.page === 'accounting',
        connections: !d && s.page === 'connections',
        reports: !d && s.page === 'reports',
        team: !d && s.page === 'team',
        payroll: !d && s.page === 'payroll',
        settings: !d && s.page === 'settings'
      },
      detail: { on: !!d },
      modal: { on: !!s.modal, title: md[0], cta: md[1], link: s.modal === 'link', scan: s.modal === 'scan', expense: s.modal === 'expense', invoice: s.modal === 'invoice', plan: s.modal === 'plan', member: s.modal === 'member', employee: s.modal === 'employee', help: s.modal === 'help', pageSettings: s.modal === 'pageSettings', receipts: s.modal === 'receipts', reset: s.modal === 'reset' },
      scan: Object.assign({}, s.scan || {}, {
        done: !!s.scanDone,
        busy: !!s.scanBusy,
        notBusy: !s.scanBusy,
        conf: s.scanConf || {},
        samples: (s.sampleBills || []).map(b => ({
          id: b.id,
          cta: b.cta,
          use: this.memo('_sx', b.id, () => () => this.startExtract(b.id))
        })),
        lines: (s.scanLines || []).map((line, i) => ({
          description: line.description,
          amount: line.amount,
          setDesc: this.memo('_sld', String(i), () => (e) => this.setState(st => ({
            scanLines: (st.scanLines || []).map((row, j) => j === i ? Object.assign({}, row, { description: e.target.value }) : row)
          }))),
          setAmount: this.memo('_sla', String(i), () => (e) => this.setState(st => ({
            scanLines: (st.scanLines || []).map((row, j) => j === i ? Object.assign({}, row, { amount: e.target.value }) : row)
          })))
        })),
        pickFile: this.memo('_sfile', 'pick', () => () => {
          const el = typeof document !== 'undefined' && document.getElementById('flow-bill-file');
          if (el && el.click) el.click();
        }),
        onFile: this.memo('_sfile', 'chg', () => (e) => {
          const file = e && e.target && e.target.files && e.target.files[0];
          this.startExtract(file && file.name ? file.name : '');
        })
      }),
      toast: { on: !!s.toast, msg: s.toast },
      tfs: [['day', 'Day'], ['week', 'Week'], ['month', 'Month']].map(([k, label]) => ({ label, on: s.tf === k, off: s.tf !== k, go: this.memo('_tf', k, () => () => this.setState({ tf: k })) })),
      chart: this.chart(), chartHover: this.chartHover, chartLeave: this.chartLeave,
      bal: { total: period.netText || this.fmt(period.net), pending: period.pendingText || this.fmt0(period.pending), delta: period.netTrendText || '' },
      periodLabel: period.label || 'Last 30 days',
      matchLabel: 'This month',
      reportsLabel: (this.reportsPeriod().label) || 'Last 30 days',
      balLabel: 'Net this period',
      match: {
        matched: String(autoN), totalItems: String(totalN), pctText: matchPct + '%',
        dash: ((matchPct / 100) * C).toFixed(1) + ' ' + C.toFixed(1),
        open: openN, hasOpen: openN > 0,
        openLabel: openN === 1 ? '1 open' : openN + ' open',
        look: openN === 0 ? 'Everything is matched' : openN === 1 ? '1 still needs a look' : openN + ' still need a look'
      },
      auto: {
        open: !!s.autoOpen, shut: !s.autoOpen,
        count: String(autoN),
        pctText: matchPct + '%', pctW: matchPct + '%',
        line: autoN + ' matched automatically · ' + openN + (openN === 1 ? ' needs' : ' need') + ' a quick look',
        toggle: () => this.setState(x => ({ autoOpen: !x.autoOpen })),
        rows: (s.autoMatches || []).map(m => Object.assign({}, m, { amt: this.fmt(m.amount), confT: (m.conf || 0) + '%', open: this.open('match', m.id) }))
      },
      recent: this.sortedTxns().slice(0, 6).map(t => this.row(t)),
      att: {
        any: attList.length > 0, none: attList.length === 0, count: String(attList.length),
        items: attList.map(a => ({ id: a.id, amt: this.fmt(a.amount), d: a.d, src: a.src, note: a.note, conf: typeof a.conf === 'number' ? a.conf + '%' : a.conf, confirm: this.resolveAtt(a.id, true), reject: this.resolveAtt(a.id, false) }))
      },
      quick,
      tagPicks: s.tags.map(t => ({ label: t, on: s.form.expTag === t, off: s.form.expTag !== t, go: this.memo('_tp', t, () => () => this.setState(st => ({ form: Object.assign({}, st.form, { expTag: t }) }))) })),
      rolePicks: ['Owner', 'Accountant', 'Staff'].map(r => ({ label: r, on: s.form.memberRole === r, off: s.form.memberRole !== r, go: this.memo('_rp', r, () => () => this.setState(st => ({ form: Object.assign({}, st.form, { memberRole: r }) }))) }))
    };
    return Object.assign(vals, this.pageVals ? this.pageVals(s, d) : {});
  }
}
