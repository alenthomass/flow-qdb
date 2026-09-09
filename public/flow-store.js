"use strict";
var FlowStore = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // lib/data/browser.ts
  var browser_exports = {};
  __export(browser_exports, {
    EXTRACT_DELAY_MS: () => EXTRACT_DELAY_MS,
    SAMPLE_BANKS: () => SAMPLE_BANKS,
    SAMPLE_BILL: () => SAMPLE_BILL,
    SAMPLE_BILLS: () => SAMPLE_BILLS,
    SAMPLE_CHECKOUT_ANALYTICS: () => SAMPLE_CHECKOUT_ANALYTICS,
    SAMPLE_SHOPIFY_ORDER: () => SAMPLE_SHOPIFY_ORDER,
    SETTLEMENT_DELAY_MS: () => SETTLEMENT_DELAY_MS,
    addClient: () => addClient,
    addSubscriber: () => addSubscriber,
    appendTransaction: () => appendTransaction,
    cancelSubscriber: () => cancelSubscriber,
    cancelSubscriptionPlan: () => cancelSubscriptionPlan,
    checkoutPageBySlug: () => checkoutPageBySlug,
    confirmMatch: () => confirmMatch,
    connectSampleBank: () => connectSampleBank,
    connectShopify: () => connectShopify,
    createInvoice: () => createInvoice,
    createPaymentLink: () => createPaymentLink,
    createSubscriptionPlan: () => createSubscriptionPlan,
    dashboardSnapshot: () => dashboardSnapshot,
    dashboardState: () => dashboardState,
    dateInputValue: () => dateInputValue,
    deactivatePaymentLink: () => deactivatePaymentLink,
    defaultPayrollPeriod: () => defaultPayrollPeriod,
    duplicateInvoice: () => duplicateInvoice,
    exportTallyXml: () => exportTallyXml,
    extractBill: () => extractBill,
    extractDelayMs: () => extractDelayMs,
    extractedBillForm: () => extractedBillForm,
    hydrateFromStorage: () => hydrateFromStorage,
    ingestShopifyOrder: () => ingestShopifyOrder,
    offsetFromLabel: () => offsetFromLabel,
    pauseSubscriber: () => pauseSubscriber,
    payPublishedCheckout: () => payPublishedCheckout,
    paymentLinkById: () => paymentLinkById,
    payrollPostedFor: () => payrollPostedFor,
    persistStore: () => persistStore,
    postPayroll: () => postPayroll,
    previousMonthLabel: () => previousMonthLabel,
    publishCheckoutPage: () => publishCheckoutPage,
    resetGateway: () => resetGateway,
    resetStore: () => resetStore,
    runSimulatedBilling: () => runSimulatedBilling,
    setSmartCheckout: () => setSmartCheckout,
    settleBilling: () => settleBilling,
    settleCheckoutPayment: () => settleCheckoutPayment,
    settlePayment: () => settlePayment,
    simulatePayment: () => simulatePayment,
    simulateZohoSync: () => simulateZohoSync
  });

  // lib/data/seed.ts
  function midnight(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }
  var ANCHOR_DATE = midnight(/* @__PURE__ */ new Date());
  function dateFor(dayOffset) {
    const date = new Date(ANCHOR_DATE.getTime());
    date.setUTCDate(date.getUTCDate() + dayOffset);
    return date;
  }
  function emailFor(name) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
    return slug + "@mail.qa";
  }
  var ownerName = "Noora Al Ansari";
  var accountantName = "Priya Menon";
  var transactions = [
    { id: "txn_01", dayOffset: -29, counterparty: "Noor Interiors", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 154e3, branchId: "br_01", invoiceId: "inv_0145" },
    { id: "txn_02", dayOffset: -28, counterparty: "Noor Interiors refund", source: "link", direction: "out", type: "refund", tag: "Sales", status: "refunded", amountMinor: 154e3, branchId: "br_01", invoiceId: "inv_0145" },
    { id: "txn_03", dayOffset: -27, counterparty: "Ahli Bank fees", source: "bank", direction: "out", type: "expense", tag: "Fees", status: "settled", amountMinor: 22e4, branchId: "br_01", invoiceId: null },
    { id: "txn_04", dayOffset: -26, counterparty: "Kahramaa", source: "bank", direction: "out", type: "expense", tag: "Utilities", status: "settled", amountMinor: 118e3, branchId: "br_01", invoiceId: null },
    { id: "txn_05", dayOffset: -24, counterparty: "Doha Events LLC", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 89e4, branchId: "br_02", invoiceId: "inv_0143" },
    { id: "txn_06", dayOffset: -22, counterparty: "Karak & Co", source: "cash", direction: "out", type: "expense", tag: "Supplies", status: "settled", amountMinor: 64e3, branchId: "br_02", invoiceId: null },
    { id: "txn_07", dayOffset: -20, counterparty: "Meta Ads", source: "bank", direction: "out", type: "expense", tag: "Marketing", status: "settled", amountMinor: 24e4, branchId: "br_01", invoiceId: null },
    { id: "txn_08", dayOffset: -18, counterparty: "Online orders (6)", source: "shopify", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 645e3, branchId: "br_02", invoiceId: null },
    { id: "txn_09", dayOffset: -15, counterparty: "Monthly payroll", source: "bank", direction: "out", type: "payroll", tag: "Salaries", status: "settled", amountMinor: 1966500, branchId: "br_01", invoiceId: null },
    { id: "txn_10", dayOffset: -12, counterparty: "Mohammed Rashid", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 98e3, branchId: "br_02", invoiceId: null },
    { id: "txn_11", dayOffset: -9, counterparty: "Souq Waqif Supplies", source: "cash", direction: "out", type: "expense", tag: "Supplies", status: "settled", amountMinor: 89e3, branchId: "br_02", invoiceId: null },
    { id: "txn_12", dayOffset: -7, counterparty: "Gulf Warehousing", source: "bank", direction: "out", type: "expense", tag: "Rent", status: "settled", amountMinor: 36e4, branchId: "br_02", invoiceId: null },
    { id: "txn_13", dayOffset: -5, counterparty: "Qatar Retail Group", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "pending", amountMinor: 63e4, branchId: "br_01", invoiceId: "inv_0142" },
    { id: "txn_14", dayOffset: -4, counterparty: "Fatima Al-Kuwari", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 215e3, branchId: "br_01", invoiceId: "inv_0146" },
    { id: "txn_15", dayOffset: -3, counterparty: "Online orders (14)", source: "shopify", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 124e4, branchId: "br_01", invoiceId: null },
    { id: "txn_16", dayOffset: -2, counterparty: "Ooredoo Business", source: "bank", direction: "out", type: "expense", tag: "Utilities", status: "settled", amountMinor: 125e3, branchId: "br_02", invoiceId: null },
    { id: "txn_17", dayOffset: -1, counterparty: "Al Meera Trading", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 482e3, branchId: "br_01", invoiceId: "inv_0144" },
    { id: "txn_18", dayOffset: -19, counterparty: "Online orders (9)", source: "shopify", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 428e3, branchId: "br_01", invoiceId: null },
    { id: "txn_19", dayOffset: -11, counterparty: "West Bay Catering", source: "skipcash", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 312e3, branchId: "br_01", invoiceId: "inv_0149" },
    { id: "txn_20", dayOffset: -6, counterparty: "Msheireb Boutiques", source: "link", direction: "in", type: "sale", tag: "Sales", status: "settled", amountMinor: 187e3, branchId: "br_02", invoiceId: "inv_0150" }
  ];
  var invoiceClients = [
    { id: "cli_01", name: "Qatar Retail Group", branchId: "br_01" },
    { id: "cli_02", name: "Doha Events LLC", branchId: "br_01" },
    { id: "cli_03", name: "Al Meera Trading", branchId: "br_01" },
    { id: "cli_04", name: "Noor Interiors", branchId: "br_01" },
    { id: "cli_05", name: "Fatima Al-Kuwari", branchId: "br_01" },
    { id: "cli_06", name: "Gulf Petro Services", branchId: "br_01" },
    { id: "cli_07", name: "Lusail Hospitality", branchId: "br_01" },
    { id: "cli_08", name: "Mohammed Rashid", branchId: "br_02" },
    { id: "cli_09", name: "West Bay Catering", branchId: "br_01" },
    { id: "cli_10", name: "Msheireb Boutiques", branchId: "br_02" }
  ];
  var clients = invoiceClients.map((client) => ({
    ...client,
    email: emailFor(client.name)
  }));
  function activityWhat(txn) {
    const dirhams = txn.amountMinor / 100;
    const amount = dirhams.toLocaleString("en-US");
    if (txn.type === "refund") return "Refund posted, QR " + amount + ", " + txn.counterparty;
    if (txn.type === "payroll") return "Payroll paid, QR " + amount;
    if (txn.direction === "in") return "Payment received, QR " + amount + ", " + txn.counterparty;
    return "Payment sent, QR " + amount + ", " + txn.counterparty;
  }
  var activityLog = transactions.map((txn) => ({
    id: "act_" + txn.id,
    kind: txn.type === "payroll" || txn.type === "expense" ? "payments" : "payments",
    dayOffset: txn.dayOffset,
    actor: txn.source === "shopify" || txn.source === "skipcash" ? "System" : "Noora Al Ansari",
    what: activityWhat(txn)
  })).concat([
    { id: "act_inv_0142", kind: "edits", dayOffset: -20, actor: "Noora Al Ansari", what: "Invoice INV-0142 sent" },
    { id: "act_inv_0147", kind: "edits", dayOffset: -20, actor: "Noora Al Ansari", what: "Invoice INV-0147 sent" },
    { id: "act_inv_0143", kind: "edits", dayOffset: -30, actor: "Noora Al Ansari", what: "Invoice INV-0143 sent" }
  ]).sort((a, b) => b.dayOffset - a.dayOffset || a.id.localeCompare(b.id));
  var seed = {
    merchant: {
      businessName: "Al Bidda Trading W.L.L.",
      legalEntity: "Limited Liability Company (W.L.L.)",
      crNumber: "CR-114820",
      taxRegistrationNumber: null,
      vatRegistered: false,
      country: "QA",
      currency: "QAR",
      industry: "Retail and e-commerce",
      address: "Building 42, Al Sadd, Doha, Qatar",
      ownerName,
      accountantName,
      plan: { tier: "Starter", monthlyPrice: 3900, txnLimit: 5e3 }
    },
    branches: [
      { id: "br_01", name: "Doha" },
      { id: "br_02", name: "Al Wakrah" }
    ],
    employees: [
      { id: "emp_01", name: "Rashid Al-Mannai", role: "Operations", monthlySalary: 95e4, branchId: "br_01" },
      { id: "emp_02", name: "Priya Menon", role: "Accounts", monthlySalary: 67e4, branchId: "br_01" },
      { id: "emp_03", name: "Samir Haddad", role: "Warehouse", monthlySalary: 45e4, branchId: "br_02" }
    ],
    payrollRuns: [
      {
        id: "pay_01",
        periodOffset: -15,
        employeeIds: ["emp_01", "emp_02", "emp_03"],
        deductionRate: 0.05,
        status: "paid",
        transactionId: "txn_09"
      }
    ],
    transactions,
    invoices: [
      { id: "inv_0142", number: "INV-0142", clientId: "cli_01", amountMinor: 63e4, issuedOffset: -20, dueOffset: -8, sentAt: -20, viewedAt: -18, branchId: "br_01" },
      { id: "inv_0143", number: "INV-0143", clientId: "cli_02", amountMinor: 89e4, issuedOffset: -30, dueOffset: -12, sentAt: -30, viewedAt: -28, branchId: "br_01" },
      { id: "inv_0144", number: "INV-0144", clientId: "cli_03", amountMinor: 482e3, issuedOffset: -6, dueOffset: 8, sentAt: -6, viewedAt: -5, branchId: "br_01" },
      { id: "inv_0145", number: "INV-0145", clientId: "cli_04", amountMinor: 154e3, issuedOffset: -33, dueOffset: -19, sentAt: -33, viewedAt: -31, branchId: "br_01" },
      { id: "inv_0146", number: "INV-0146", clientId: "cli_05", amountMinor: 215e3, issuedOffset: -9, dueOffset: 5, sentAt: -9, viewedAt: -8, branchId: "br_01" },
      { id: "inv_0147", number: "INV-0147", clientId: "cli_06", amountMinor: 92e4, issuedOffset: -20, dueOffset: -6, sentAt: -20, viewedAt: -16, branchId: "br_01" },
      { id: "inv_0148", number: "INV-0148", clientId: "cli_07", amountMinor: 54e4, issuedOffset: -8, dueOffset: 6, sentAt: -8, viewedAt: -7, branchId: "br_01" },
      { id: "inv_0149", number: "INV-0149", clientId: "cli_09", amountMinor: 312e3, issuedOffset: -18, dueOffset: -4, sentAt: -18, viewedAt: -17, branchId: "br_01" },
      { id: "inv_0150", number: "INV-0150", clientId: "cli_10", amountMinor: 187e3, issuedOffset: -9, dueOffset: 5, sentAt: -9, viewedAt: -8, branchId: "br_02" }
    ],
    clients,
    paymentLinks: [
      { id: "link_txn_01", payUrl: "/pay/link_txn_01", amountMinor: 154e3, description: "Noor Interiors", clientId: "cli_04", invoiceId: "inv_0145", status: "paid", createdOffset: -29, uses: 1, expiry: "-", txnId: "txn_01" },
      { id: "link_txn_10", payUrl: "/pay/link_txn_10", amountMinor: 98e3, description: "Mohammed Rashid", clientId: "cli_08", invoiceId: null, status: "paid", createdOffset: -12, uses: 1, expiry: "-", txnId: "txn_10" },
      { id: "link_txn_14", payUrl: "/pay/link_txn_14", amountMinor: 215e3, description: "Fatima Al-Kuwari", clientId: "cli_05", invoiceId: "inv_0146", status: "paid", createdOffset: -4, uses: 1, expiry: "-", txnId: "txn_14" },
      { id: "link_txn_20", payUrl: "/pay/link_txn_20", amountMinor: 187e3, description: "Msheireb Boutiques", clientId: "cli_10", invoiceId: "inv_0150", status: "paid", createdOffset: -6, uses: 1, expiry: "-", txnId: "txn_20" }
    ],
    exportHistory: [],
    checkoutPages: [],
    subscriptionPlans: [],
    subscribers: [],
    upcomingCharges: [],
    shopify: { connected: false, shopDomain: "" },
    smartCheckout: { on: false, walletDetect: true, retryOnDecline: true },
    matchProposals: [
      { id: "mp_01", transactionId: "txn_13", invoiceId: "inv_0142", confidence: 0.94, reason: "Exact amount and reference match, one day apart.", status: "open" },
      { id: "mp_02", transactionId: "txn_02", invoiceId: "inv_0145", confidence: 0.88, reason: "Refund of a paid invoice for the same client and amount.", status: "open" },
      { id: "mp_03", transactionId: "txn_10", invoiceId: null, confidence: 0.52, reason: "Payment link with no matching invoice. Log as a direct sale?", status: "open" }
    ],
    bankAccounts: [
      { id: "bank_01", bank: "Ahli Bank", label: "Ahli Bank current account", currency: "QAR", openingBalanceMinor: 85e5, asOfOffset: -30 }
    ],
    gatewayAccounts: [
      { id: "gw_01", provider: "SkipCash", label: "SkipCash", status: "live" },
      { id: "gw_02", provider: "Shopify", label: "Shopify", status: "connected" }
    ],
    teamMembers: [
      { id: "tm_00", employeeId: "", name: ownerName, email: ownerName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") + "@albidda.qa", role: "Owner", lastSeenOffset: 0 },
      { id: "tm_01", employeeId: "emp_01", name: "Rashid Al-Mannai", email: emailFor("Rashid Al-Mannai"), role: "Staff", lastSeenOffset: -1 },
      { id: "tm_02", employeeId: "emp_02", name: accountantName, email: emailFor(accountantName), role: "Staff", lastSeenOffset: -2 },
      { id: "tm_03", employeeId: "emp_03", name: "Samir Haddad", email: emailFor("Samir Haddad"), role: "Staff", lastSeenOffset: -3 }
    ],
    activityLog
  };

  // lib/data/store.ts
  var STORAGE_KEY = "flow-live-v1";
  function cloneSeed() {
    return structuredClone(seed);
  }
  function emptyExtras() {
    return {
      checkoutPages: [],
      subscriptionPlans: [],
      subscribers: [],
      upcomingCharges: [],
      shopify: { connected: false, shopDomain: "" },
      smartCheckout: { on: false, walletDetect: true, retryOnDecline: true }
    };
  }
  function withDefaults(row) {
    const base = cloneSeed();
    return {
      ...base,
      ...row,
      invoices: row.invoices && row.invoices.length ? row.invoices : base.invoices,
      clients: row.clients && row.clients.length ? row.clients : base.clients,
      paymentLinks: row.paymentLinks && row.paymentLinks.length ? row.paymentLinks : base.paymentLinks,
      checkoutPages: row.checkoutPages || [],
      subscriptionPlans: row.subscriptionPlans || [],
      subscribers: row.subscribers || [],
      upcomingCharges: row.upcomingCharges || [],
      shopify: row.shopify || emptyExtras().shopify,
      smartCheckout: row.smartCheckout || emptyExtras().smartCheckout,
      bankAccounts: row.bankAccounts || base.bankAccounts
    };
  }
  var live = cloneSeed();
  function persist() {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(live));
    } catch {
    }
  }
  function hydrateFromStorage() {
    if (typeof localStorage === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      live = withDefaults(JSON.parse(raw));
      return live;
    } catch {
      return null;
    }
  }
  function persistStore() {
    persist();
  }
  function getStore() {
    return live;
  }
  function appendClient(client) {
    live.clients = [client, ...live.clients];
    persist();
    return client;
  }
  function resetStore() {
    live = cloneSeed();
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
      }
    }
    return live;
  }
  function appendTransaction(txn) {
    live.transactions = [txn, ...live.transactions];
    persist();
    return txn;
  }
  function replaceTransaction(id, patch) {
    let next;
    live.transactions = live.transactions.map((txn) => {
      if (txn.id !== id) return txn;
      next = Object.assign({}, txn, patch, { id: txn.id });
      return next;
    });
    persist();
    return next;
  }
  function appendInvoice(invoice) {
    live.invoices = [invoice, ...live.invoices];
    persist();
    return invoice;
  }
  function appendMatchProposal(proposal) {
    live.matchProposals = [proposal, ...live.matchProposals];
    persist();
    return proposal;
  }
  function replaceMatchProposal(id, patch) {
    let next;
    live.matchProposals = live.matchProposals.map((proposal) => {
      if (proposal.id !== id) return proposal;
      next = Object.assign({}, proposal, patch, { id: proposal.id });
      return next;
    });
    persist();
    return next;
  }
  function appendActivity(entry) {
    live.activityLog = [entry, ...live.activityLog];
    persist();
    return entry;
  }
  function appendPaymentLink(link) {
    live.paymentLinks = [link, ...live.paymentLinks];
    persist();
    return link;
  }
  function replacePaymentLink(id, patch) {
    let next;
    live.paymentLinks = live.paymentLinks.map((link) => {
      if (link.id !== id) return link;
      next = Object.assign({}, link, patch, { id: link.id });
      return next;
    });
    persist();
    return next;
  }
  function appendExportRecord(row) {
    live.exportHistory = [row, ...live.exportHistory];
    persist();
    return row;
  }
  function appendCheckoutPage(page) {
    live.checkoutPages = [page, ...live.checkoutPages];
    persist();
    return page;
  }
  function replaceCheckoutPage(id, patch) {
    let next;
    live.checkoutPages = live.checkoutPages.map((page) => {
      if (page.id !== id) return page;
      next = Object.assign({}, page, patch, { id: page.id });
      return next;
    });
    persist();
    return next;
  }
  function appendSubscriptionPlan(plan) {
    live.subscriptionPlans = [plan, ...live.subscriptionPlans];
    persist();
    return plan;
  }
  function replaceSubscriptionPlan(id, patch) {
    let next;
    live.subscriptionPlans = live.subscriptionPlans.map((plan) => {
      if (plan.id !== id) return plan;
      next = Object.assign({}, plan, patch, { id: plan.id });
      return next;
    });
    persist();
    return next;
  }
  function appendSubscriber(row) {
    live.subscribers = [row, ...live.subscribers];
    persist();
    return row;
  }
  function replaceSubscriber(id, patch) {
    let next;
    live.subscribers = live.subscribers.map((row) => {
      if (row.id !== id) return row;
      next = Object.assign({}, row, patch, { id: row.id });
      return next;
    });
    persist();
    return next;
  }
  function appendUpcomingCharge(row) {
    live.upcomingCharges = [row, ...live.upcomingCharges];
    persist();
    return row;
  }
  function replaceUpcomingCharge(id, patch) {
    let next;
    live.upcomingCharges = live.upcomingCharges.map((row) => {
      if (row.id !== id) return row;
      next = Object.assign({}, row, patch, { id: row.id });
      return next;
    });
    persist();
    return next;
  }
  function replaceShopify(patch) {
    live.shopify = Object.assign({}, live.shopify, patch);
    persist();
    return live.shopify;
  }
  function replaceSmartCheckout(patch) {
    live.smartCheckout = Object.assign({}, live.smartCheckout, patch);
    persist();
    return live.smartCheckout;
  }
  function appendBankAccount(account) {
    live.bankAccounts = [...live.bankAccounts, account];
    persist();
    return account;
  }

  // lib/format.ts
  var EXPONENT = { QAR: 2, AED: 2 };
  var PREFIX = { QAR: "QR ", AED: "AED " };
  function formatMoney(amount, currency2, options = {}) {
    const exp = EXPONENT[currency2] ?? 2;
    const abs = Math.abs(Math.trunc(amount));
    const prefix = PREFIX[currency2] ?? currency2 + " ";
    if (abs === 0) return prefix + "0";
    const sign = amount < 0 ? "-" : "";
    const factor = 10 ** exp;
    const major2 = Math.floor(abs / factor);
    const minor = abs % factor;
    const grouped = major2.toLocaleString("en-US");
    if (minor === 0 && options.trimWhole) return sign + prefix + grouped;
    const frac = minor.toString().padStart(exp, "0");
    return sign + prefix + grouped + "." + frac;
  }
  function formatDate(dayOffset) {
    return dateFor(dayOffset).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  }
  function dateInputValue(dayOffset) {
    const date = dateFor(dayOffset);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }
  function previousMonthLabel() {
    const today = dateFor(0);
    const prev = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
    return prev.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  }
  function monthYearLabel(dayOffset) {
    return dateFor(dayOffset).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    });
  }
  function offsetFromLabel(label) {
    const trimmed = String(label || "").trim();
    if (!trimmed) return null;
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (iso) {
      const year = Number(iso[1]);
      const month = Number(iso[2]);
      const day = Number(iso[3]);
      const date = new Date(Date.UTC(year, month - 1, day));
      if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
        return null;
      }
      return Math.round((date.getTime() - dateFor(0).getTime()) / 864e5);
    }
    for (let offset = -400; offset <= 400; offset++) {
      if (formatDate(offset) === trimmed) return offset;
    }
    return null;
  }

  // lib/chart.ts
  function chartScale(values, currency2) {
    const low = Math.min(0, ...values);
    const high = Math.max(0, ...values);
    const padding = Math.max(1, Math.ceil((high - low) * 0.1));
    const min = low - padding;
    const max = high + padding;
    const targetStep = (max - min) / 5;
    const magnitude = 10 ** Math.floor(Math.log10(targetStep));
    const step = Math.max(1, Math.ceil(([1, 2, 5, 10].find((n) => n * magnitude >= targetStep) ?? 10) * magnitude));
    const ticks = [];
    for (let value = Math.ceil(min / step) * step; value <= max; value += step) {
      ticks.push({ value, label: formatMoney(value, currency2, { trimWhole: true }) });
    }
    return { min, max, ticks };
  }

  // lib/data/sample-bill.ts
  var EXTRACT_DELAY_MIN_MS = 1500;
  var EXTRACT_DELAY_MAX_MS = 2500;
  var EXTRACT_DELAY_MS = 1800;
  var SAMPLE_BILLS = [
    {
      id: "bill_barzan",
      filename: "barzan-water.pdf",
      mime: "application/pdf",
      vendor: "Barzan Water",
      dayOffset: 0,
      amountMinor: 118e3,
      taxMinor: 0,
      tag: "Utilities",
      source: "bank",
      branchId: "br_01",
      lines: [
        { description: "18.9L bottled water", amountMinor: 89e3 },
        { description: "Delivery", amountMinor: 29e3 }
      ],
      confidence: {
        vendor: 0.96,
        date: 0.93,
        total: 0.98,
        tax: 0.91,
        tag: 0.94,
        lines: 0.9
      }
    },
    {
      id: "bill_almaha",
      filename: "al-maha-stationery.svg",
      mime: "image/svg+xml",
      vendor: "Al Maha Stationery",
      dayOffset: -1,
      amountMinor: 34e3,
      taxMinor: 0,
      tag: "Supplies",
      source: "bank",
      branchId: "br_01",
      lines: [
        { description: "A4 copy paper", amountMinor: 18e3 },
        { description: "Printer toner", amountMinor: 16e3 }
      ],
      confidence: {
        vendor: 0.92,
        date: 0.88,
        total: 0.95,
        tax: 0.84,
        tag: 0.89,
        lines: 0.86
      }
    }
  ];
  var SAMPLE_BILL = {
    dayOffset: SAMPLE_BILLS[0].dayOffset,
    counterparty: SAMPLE_BILLS[0].vendor,
    source: SAMPLE_BILLS[0].source,
    direction: "out",
    type: "expense",
    tag: SAMPLE_BILLS[0].tag,
    status: "settled",
    amountMinor: SAMPLE_BILLS[0].amountMinor,
    branchId: SAMPLE_BILLS[0].branchId,
    invoiceId: null
  };
  function extractDelayMs() {
    return EXTRACT_DELAY_MIN_MS + Math.floor(Math.random() * (EXTRACT_DELAY_MAX_MS - EXTRACT_DELAY_MIN_MS + 1));
  }
  function extractBill(ref) {
    const key = String(ref || "").trim().toLowerCase();
    const match = SAMPLE_BILLS.find((bill) => {
      if (bill.id === ref || bill.filename === ref) return true;
      if (!key) return false;
      const stem = bill.filename.toLowerCase().replace(/\.[a-z0-9]+$/, "");
      return bill.id.toLowerCase() === key || bill.filename.toLowerCase() === key || key.includes(stem) || key.includes(bill.vendor.toLowerCase());
    });
    return structuredClone(match || SAMPLE_BILLS[0]);
  }
  function pct(value) {
    return Math.round(value * 100) + "%";
  }
  function extractedBillForm(bill) {
    const currency2 = seed.merchant.currency;
    return {
      form: {
        scanVendor: bill.vendor,
        scanAmount: formatMoney(bill.amountMinor, currency2),
        scanDate: formatDate(bill.dayOffset),
        scanTag: bill.tag,
        scanTax: formatMoney(bill.taxMinor, currency2),
        scanOffset: bill.dayOffset
      },
      lines: bill.lines.map((line) => ({
        description: line.description,
        amount: formatMoney(line.amountMinor, currency2)
      })),
      conf: {
        vendor: pct(bill.confidence.vendor),
        date: pct(bill.confidence.date),
        total: pct(bill.confidence.total),
        tax: pct(bill.confidence.tax),
        tag: pct(bill.confidence.tag),
        lines: pct(bill.confidence.lines)
      }
    };
  }

  // lib/data/sample-checkout.ts
  var SAMPLE_CHECKOUT_ANALYTICS = {
    note: "Sample analytics. Checkout drop-off is not stored for this merchant.",
    steps: [
      { label: "Opened checkout", percent: 100 },
      { label: "Entered details", percent: 64 },
      { label: "Paid", percent: 41 }
    ]
  };
  var SAMPLE_SHOPIFY_ORDER = {
    counterparty: "Shopify sample order #1042",
    amountMinor: 18500,
    tag: "Sales",
    branchId: "br_01"
  };
  var SAMPLE_BANKS = [
    { id: "bank_qnb", bank: "Qatar National Bank", label: "QNB current account (sample)" },
    { id: "bank_dukhan", bank: "Dukhan Bank", label: "Dukhan current account (sample)" }
  ];

  // lib/data/selectors.ts
  function db() {
    return getStore();
  }
  var PERIOD_DAYS = { day: 1, week: 7, month: 30 };
  function signedAmount(txn) {
    return txn.direction === "in" ? txn.amountMinor : -txn.amountMinor;
  }
  function inPeriod(dayOffset, period) {
    const days = PERIOD_DAYS[period];
    return dayOffset <= 0 && dayOffset >= -(days - 1);
  }
  function completedInPeriod(period) {
    return db().transactions.filter((txn) => txn.status !== "pending" && inPeriod(txn.dayOffset, period));
  }
  function getMoneyIn(period) {
    return db().transactions.filter((txn) => txn.direction === "in" && txn.status !== "pending" && inPeriod(txn.dayOffset, period)).reduce((sum, txn) => sum + txn.amountMinor, 0);
  }
  function getMoneyOut(period) {
    return db().transactions.filter((txn) => txn.direction === "out" && txn.status !== "pending" && inPeriod(txn.dayOffset, period)).reduce((sum, txn) => sum + txn.amountMinor, 0);
  }
  function getPendingSettlement(period) {
    return db().transactions.filter((txn) => txn.status === "pending" && inPeriod(txn.dayOffset, period)).reduce((sum, txn) => sum + txn.amountMinor, 0);
  }
  function getNet(period) {
    const net = getMoneyIn(period) - getMoneyOut(period);
    if (period === "month") {
      const netProfit = getProfitAndLoss(period).netProfit;
      if (net !== netProfit) {
        throw new Error("30-day Home Net " + net + " does not equal Reports net profit " + netProfit + " (minor units)");
      }
    }
    return net;
  }
  function getNetSeries(period) {
    if (period === "day") {
      const net = getNet(period);
      return { labels: ["Open", "Now"], values: [0, net] };
    }
    const days = PERIOD_DAYS[period];
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const labels = [];
    const values = [];
    let running = 0;
    for (let offset = -(days - 1); offset <= 0; offset++) {
      const dayNet = db().transactions.filter((txn) => txn.status !== "pending" && txn.dayOffset === offset).reduce((sum, txn) => sum + signedAmount(txn), 0);
      running += dayNet;
      if (period === "week") {
        labels.push(weekday[dateFor(offset).getUTCDay()] ?? "");
      } else {
        const index = offset + days - 1;
        labels.push(index % 5 === 0 ? dateFor(offset).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }) : "");
      }
      values.push(running);
    }
    return { labels, values };
  }
  function linkedTxns(invoiceId) {
    return db().transactions.filter((txn) => txn.invoiceId === invoiceId);
  }
  function getInvoiceStatus(invoiceId) {
    const invoice = db().invoices.find((row) => row.id === invoiceId);
    if (!invoice) return "draft";
    const linked = linkedTxns(invoiceId);
    if (linked.some((txn) => txn.type === "refund")) return "refunded";
    const settledIn = linked.filter((txn) => txn.direction === "in" && txn.status !== "pending").reduce((sum, txn) => sum + txn.amountMinor, 0);
    if (settledIn >= invoice.amountMinor) return "paid";
    if (linked.some((txn) => txn.status === "pending")) return "awaiting settlement";
    if (invoice.dueOffset < 0) return "overdue";
    if (invoice.viewedAt !== null) return "viewed";
    if (invoice.sentAt !== null) return "sent";
    return "draft";
  }
  function sumStatus(predicate) {
    const rows = db().invoices.filter((invoice) => predicate(getInvoiceStatus(invoice.id), invoice));
    return {
      amountMinor: rows.reduce((sum, invoice) => sum + invoice.amountMinor, 0),
      count: rows.length
    };
  }
  function getOutstandingInvoices() {
    return db().invoices.filter((invoice) => {
      const status = getInvoiceStatus(invoice.id);
      return status !== "paid" && status !== "refunded" && status !== "draft";
    }).sort((a, b) => a.dueOffset - b.dueOffset || a.id.localeCompare(b.id));
  }
  function getOutstanding() {
    const rows = getOutstandingInvoices();
    const amountMinor = rows.reduce((sum, invoice) => sum + invoice.amountMinor, 0);
    if (amountMinor !== sumStatus((status) => status !== "paid" && status !== "refunded" && status !== "draft").amountMinor) {
      throw new Error("Who owes me does not equal Outstanding");
    }
    return { amountMinor, count: rows.length };
  }
  function getOverdue() {
    return sumStatus((status) => status === "overdue");
  }
  function getTotalInvoiced() {
    return sumStatus((status) => status !== "draft");
  }
  function periodLabel(period) {
    if (period === "day") return "Last 1 day";
    if (period === "week") return "Last 7 days";
    return "Last 30 days";
  }
  function getRefunds(period) {
    return db().transactions.filter((txn) => txn.type === "refund" && txn.status !== "pending" && inPeriod(txn.dayOffset, period)).reduce((sum, txn) => sum + txn.amountMinor, 0);
  }
  function getMatchUniverse() {
    return db().transactions.filter(
      (txn) => (txn.direction === "in" || txn.type === "refund") && inPeriod(txn.dayOffset, "month")
    );
  }
  function getMatchedTransactions() {
    const openIds = new Set(getOpenMatches().map((proposal) => proposal.transactionId));
    return getMatchUniverse().filter(
      (txn) => !openIds.has(txn.id) && (txn.invoiceId !== null || txn.source === "shopify")
    );
  }
  function getMatchRate() {
    const openMatches = getOpenMatches();
    const matched = getMatchedTransactions().length;
    const total = getMatchUniverse().length;
    if (matched + openMatches.length !== total) {
      throw new Error("Match rate " + matched + " + " + openMatches.length + " open does not equal " + total);
    }
    return { matched, total, percent: total ? Math.round(matched / total * 100) : 0 };
  }
  function getOpenMatches() {
    return db().matchProposals.filter((proposal) => proposal.status === "open");
  }
  function getPayrollGross(runId) {
    const run = db().payrollRuns.find((row) => row.id === runId);
    if (!run) return 0;
    return db().employees.filter((employee) => run.employeeIds.includes(employee.id)).reduce((sum, employee) => sum + employee.monthlySalary, 0);
  }
  function getPayrollDeductions(runId) {
    const run = db().payrollRuns.find((row) => row.id === runId);
    if (!run) return 0;
    return Math.round(getPayrollGross(runId) * run.deductionRate);
  }
  function getPayrollNet(runId) {
    return getPayrollGross(runId) - getPayrollDeductions(runId);
  }
  function assertPayrollLink() {
    const run = db().payrollRuns[0];
    if (!run) return;
    const txn = db().transactions.find((row) => row.id === run.transactionId);
    const net = getPayrollNet(run.id);
    if (!txn || txn.amountMinor !== net) {
      throw new Error("Payroll net " + net + " does not equal " + run.transactionId);
    }
  }
  assertPayrollLink();
  function getProfitAndLoss(period) {
    const refunds = getRefunds(period);
    const revenue = getMoneyIn(period);
    const rows = completedInPeriod(period).filter((txn) => txn.direction === "out");
    const sumTag = (tags) => rows.filter((txn) => txn.type !== "refund" && tags.includes(txn.tag)).reduce((sum, txn) => sum + txn.amountMinor, 0);
    const costOfSales = sumTag(["Supplies", "Rent"]);
    const salaries = sumTag(["Salaries"]);
    const overheads = sumTag(["Utilities", "Marketing", "Fees"]);
    const netProfit = revenue - refunds - costOfSales - salaries - overheads;
    return {
      revenue,
      refunds,
      costOfSales,
      salaries,
      overheads,
      netProfit,
      margin: revenue ? netProfit / revenue : 0
    };
  }
  function getVatRate() {
    return db().merchant.country === "QA" ? 0 : 0.05;
  }
  function getPlanUsage() {
    return { used: db().transactions.length, limit: db().merchant.plan.txnLimit };
  }
  function getBranchComparison(period = "month") {
    return db().branches.map((branch) => {
      const rows = db().transactions.filter((txn) => txn.branchId === branch.id && txn.status !== "pending" && inPeriod(txn.dayOffset, period));
      const inflow = rows.filter((txn) => txn.direction === "in").reduce((sum, txn) => sum + txn.amountMinor, 0);
      const outflow = rows.filter((txn) => txn.direction === "out").reduce((sum, txn) => sum + txn.amountMinor, 0);
      return {
        id: branch.id,
        name: branch.name,
        inflow,
        outflow,
        net: inflow - outflow,
        count: rows.length,
        staff: db().employees.filter((employee) => employee.branchId === branch.id).length
      };
    });
  }
  function getOpeningBalance() {
    return db().bankAccounts.reduce((sum, account) => sum + account.openingBalanceMinor, 0);
  }
  function getCashOnHand() {
    const asOf = db().bankAccounts.reduce((min, account) => Math.min(min, account.asOfOffset), 0);
    const movement = db().transactions.filter((txn) => txn.status !== "pending" && txn.dayOffset > asOf).reduce((sum, txn) => sum + signedAmount(txn), 0);
    return getOpeningBalance() + movement;
  }
  function getRunway(period) {
    const cashOnHand = getCashOnHand();
    const net = getNet(period);
    if (net >= 0) {
      return { cashOnHand, net, burn: 0, profitable: true, months: null };
    }
    const burn = Math.abs(net);
    return { cashOnHand, net, burn, profitable: false, months: Math.floor(cashOnHand / Math.max(burn, 1)) };
  }
  function getSpend(period) {
    const rows = completedInPeriod(period).filter((txn) => txn.direction === "out" && txn.type !== "refund");
    const total = rows.reduce((sum, txn) => sum + txn.amountMinor, 0);
    const grouped = /* @__PURE__ */ new Map();
    for (const txn of rows) grouped.set(txn.tag, (grouped.get(txn.tag) ?? 0) + txn.amountMinor);
    const tags = [...grouped.entries()].map(([tag, amount]) => ({ tag, amount, percent: total ? Math.round(amount / total * 100) : 0 })).sort((a, b) => b.amount - a.amount || a.tag.localeCompare(b.tag));
    const vendors = rows.slice().sort((a, b) => b.amountMinor - a.amountMinor || a.id.localeCompare(b.id)).slice(0, 5).map((txn) => ({
      name: txn.counterparty,
      tag: txn.tag,
      source: txn.source,
      amount: txn.amountMinor
    }));
    const refunds = getRefunds(period);
    const salaries = tags.find((row) => row.tag === "Salaries");
    const rentAndSupplies = tags.filter((row) => row.tag === "Rent" || row.tag === "Supplies").reduce((sum, row) => sum + row.percent, 0);
    const insight = salaries ? "Salaries are your largest outflow at " + salaries.percent + "% of spend. Rent and supplies together add another " + rentAndSupplies + "%." : "";
    return { total, tags, vendors, refunds, insight };
  }
  function getCashForecast(period) {
    const days = PERIOD_DAYS[period];
    const bucketCount = period === "month" ? 6 : period === "week" ? 7 : 1;
    const width = days / bucketCount;
    const buckets = [];
    for (let i = 0; i < bucketCount; i++) {
      const start = -(days - 1) + Math.round(i * width);
      const end = i === bucketCount - 1 ? 0 : -(days - 1) + Math.round((i + 1) * width) - 1;
      const rows = db().transactions.filter((txn) => txn.status !== "pending" && txn.dayOffset >= start && txn.dayOffset <= end);
      const inflow = rows.filter((txn) => txn.direction === "in").reduce((sum, txn) => sum + txn.amountMinor, 0);
      const outflow = rows.filter((txn) => txn.direction === "out").reduce((sum, txn) => sum + txn.amountMinor, 0);
      const label = period === "week" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateFor(start).getUTCDay()] ?? "" : dateFor(start).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
      buckets.push({ label, start, end, inflow, outflow, projected: false });
    }
    buckets.push({ label: "Next", start: 1, end: 1, inflow: 0, outflow: 0, projected: true });
    return buckets;
  }

  // lib/data/view.ts
  var currency = seed.merchant.currency;
  function db2() {
    return getStore();
  }
  function major(amount) {
    return amount / 100;
  }
  function titleStatus(status) {
    return status.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  function sourceLabel(source) {
    if (source === "skipcash") return "SkipCash";
    if (source === "shopify") return "Shopify";
    return source.charAt(0).toUpperCase() + source.slice(1);
  }
  function clientName(clientId) {
    return db2().clients.find((client) => client.id === clientId)?.name ?? "";
  }
  function signedMoney(amount) {
    const text = formatMoney(amount, currency, { trimWhole: true });
    return amount > 0 ? "+" + text : text;
  }
  function periodRangeLabel(period) {
    const from = period === "day" ? 0 : period === "week" ? -6 : -29;
    return formatDate(from) + " \u2013 " + formatDate(0);
  }
  function runwayView(period) {
    const row = getRunway(period);
    return {
      cash: major(row.cashOnHand),
      burn: major(row.profitable ? row.net : row.burn),
      cashText: formatMoney(row.cashOnHand, currency, { trimWhole: true }),
      burnText: row.profitable ? signedMoney(row.net) : formatMoney(row.burn, currency, { trimWhole: true }),
      burnLabel: row.profitable ? "AVG NET / MO" : "AVG NET BURN / MO",
      months: row.profitable ? "Profitable" : row.months + (row.months === 1 ? " month" : " months"),
      until: row.profitable ? "Cash is growing" : "If this month repeats",
      profitable: row.profitable
    };
  }
  function spendView(period) {
    const spend = getSpend(period);
    return {
      total: major(spend.total),
      refunds: major(spend.refunds),
      refundsText: formatMoney(spend.refunds, currency, { trimWhole: true }),
      hasRefunds: spend.refunds > 0,
      insight: spend.insight,
      tags: spend.tags.map((row) => ({
        tag: row.tag,
        out: formatMoney(row.amount, currency, { trimWhole: true }),
        pct: row.percent + "%",
        bar: row.percent + "%",
        color: row.percent > 30 ? "var(--neg)" : "var(--ink-2)"
      })),
      vendors: spend.vendors.map((vendor) => ({
        name: vendor.name,
        tag: vendor.tag,
        abbr: vendor.name.slice(0, 2).toUpperCase(),
        count: sourceLabel(vendor.source),
        total: formatMoney(vendor.amount, currency, { trimWhole: true })
      }))
    };
  }
  function forecastView(period) {
    const buckets = getCashForecast(period);
    const max = Math.max(1, ...buckets.map((bucket) => Math.max(bucket.inflow, bucket.outflow)));
    return buckets.map((bucket) => ({
      day: bucket.label,
      inH: (bucket.inflow / max * 140).toFixed(0) + "px",
      outH: (bucket.outflow / max * 140).toFixed(0) + "px",
      inBg: bucket.projected ? "transparent" : "var(--pos)",
      outBg: bucket.projected ? "transparent" : "var(--ink-6)",
      border: bucket.projected ? "1.5px dashed var(--ink-6)" : "none"
    }));
  }
  function daysLateOf(invoice) {
    const status = getInvoiceStatus(invoice.id);
    return invoice.dueOffset < 0 && status !== "paid" && status !== "refunded" ? -invoice.dueOffset : 0;
  }
  function ageingView() {
    const rows = getOutstandingInvoices();
    const outstanding = getOutstanding();
    const sum = rows.reduce((total, invoice) => total + invoice.amountMinor, 0);
    if (sum !== outstanding.amountMinor || rows.length !== outstanding.count) {
      throw new Error("Who owes me " + sum + " does not equal Outstanding " + outstanding.amountMinor);
    }
    const bucket = (lo, hi) => rows.filter((invoice) => {
      const days = daysLateOf(invoice);
      return days >= lo && days < hi;
    });
    const mk = (label, list, color) => {
      const amountMinor = list.reduce((total, invoice) => total + invoice.amountMinor, 0);
      return {
        label,
        val: formatMoney(amountMinor, currency, { trimWhole: true }),
        count: list.length + (list.length === 1 ? " invoice" : " invoices"),
        color: amountMinor > 0 ? color : "var(--ink)"
      };
    };
    return {
      amountMinor: outstanding.amountMinor,
      count: outstanding.count,
      buckets: [
        mk("NOT DUE YET", bucket(0, 1), "var(--ink)"),
        mk("1\u201314 DAYS", bucket(1, 15), "var(--ink)"),
        mk("15\u201330 DAYS", bucket(15, 31), "var(--ink-2)"),
        mk("OVER 30 DAYS", bucket(31, 999), "var(--neg)")
      ],
      rows: rows.map((invoice) => {
        const days = daysLateOf(invoice);
        const status = getInvoiceStatus(invoice.id);
        return {
          id: invoice.id,
          no: invoice.number,
          client: clientName(invoice.clientId),
          status: titleStatus(status),
          due: formatDate(invoice.dueOffset),
          amount: major(invoice.amountMinor),
          amt: formatMoney(invoice.amountMinor, currency),
          age: days ? days + " days late" : "On time",
          ageColor: days > 14 ? "var(--neg)" : days ? "var(--ink-2)" : "var(--ink-4)"
        };
      })
    };
  }
  function periodBlock(period) {
    const series = getNetSeries(period);
    const scale = chartScale(series.values, currency);
    const pnl = getProfitAndLoss(period);
    return {
      moneyIn: major(getMoneyIn(period)),
      moneyOut: major(getMoneyOut(period)),
      pending: major(getPendingSettlement(period)),
      net: major(getNet(period)),
      moneyInText: formatMoney(getMoneyIn(period), currency),
      moneyOutText: formatMoney(getMoneyOut(period), currency),
      pendingText: formatMoney(getPendingSettlement(period), currency),
      netText: formatMoney(getNet(period), currency),
      label: periodLabel(period),
      series: {
        labels: series.labels,
        values: series.values.map(major),
        valueTexts: series.values.map((value) => formatMoney(value, currency, { trimWhole: true })),
        scale: {
          min: major(scale.min),
          max: major(scale.max),
          ticks: scale.ticks.map((tick) => ({ value: major(tick.value), label: tick.label }))
        }
      },
      branches: getBranchComparison(period).map((branch) => ({
        id: branch.id,
        name: branch.name,
        sub: "Branch",
        initials: branch.name.slice(0, 2).toUpperCase(),
        staff: branch.staff,
        revenue: major(branch.inflow)
      })),
      pnl: {
        revenue: major(pnl.revenue),
        refunds: major(pnl.refunds),
        costOfSales: major(pnl.costOfSales),
        salaries: major(pnl.salaries),
        overheads: major(pnl.overheads),
        netProfit: major(pnl.netProfit),
        margin: Math.round(pnl.margin * 100),
        formatted: {
          revenue: formatMoney(pnl.revenue, currency, { trimWhole: true }),
          refunds: formatMoney(-pnl.refunds, currency, { trimWhole: true }),
          costOfSales: formatMoney(-pnl.costOfSales, currency, { trimWhole: true }),
          salaries: formatMoney(-pnl.salaries, currency, { trimWhole: true }),
          overheads: formatMoney(-pnl.overheads, currency, { trimWhole: true }),
          netProfit: formatMoney(pnl.netProfit, currency, { trimWhole: true }),
          costOfSalesCard: formatMoney(pnl.costOfSales, currency, { trimWhole: true }),
          overheadsCard: formatMoney(pnl.overheads, currency, { trimWhole: true })
        }
      },
      range: periodRangeLabel(period),
      runway: runwayView(period),
      spend: spendView(period),
      forecast: forecastView(period)
    };
  }
  function dashboardState() {
    const owner = seed.merchant.ownerName;
    const open = getOpenMatches();
    const matchRate = getMatchRate();
    const usage = getPlanUsage();
    const payrollNet = getPayrollNet("pay_01");
    const payrollGross = getPayrollGross("pay_01");
    const payrollDed = getPayrollDeductions("pay_01");
    const outstanding = getOutstanding();
    const overdue = getOverdue();
    const invoiced = getTotalInvoiced();
    const txns = db2().transactions.slice().sort((a, b) => b.dayOffset - a.dayOffset || a.id.localeCompare(b.id)).map((txn) => ({
      id: txn.id,
      d: formatDate(txn.dayOffset),
      offset: txn.dayOffset,
      amount: major(signedAmount(txn)),
      type: txn.type,
      src: sourceLabel(txn.source),
      party: txn.counterparty,
      tag: txn.tag,
      status: titleStatus(txn.status),
      branchId: txn.branchId,
      invoiceId: txn.invoiceId
    }));
    const invoices = db2().invoices.map((invoice) => {
      const status = getInvoiceStatus(invoice.id);
      return {
        id: invoice.id,
        no: invoice.number,
        client: clientName(invoice.clientId),
        clientId: invoice.clientId,
        amount: major(invoice.amountMinor),
        status: titleStatus(status),
        due: formatDate(invoice.dueOffset),
        issued: formatDate(invoice.issuedOffset),
        sentOn: invoice.sentAt != null ? formatDate(invoice.sentAt) : "\u2014",
        viewedOn: invoice.viewedAt != null ? formatDate(invoice.viewedAt) : "\u2014",
        tag: "Sales",
        outstanding: status === "paid" || status === "refunded" || status === "draft" ? 0 : major(invoice.amountMinor),
        daysLate: invoice.dueOffset < 0 && status !== "paid" && status !== "refunded" ? -invoice.dueOffset : 0
      };
    });
    const matches = open.map((proposal) => {
      const txn = db2().transactions.find((row) => row.id === proposal.transactionId);
      const invoice = db2().invoices.find((row) => row.id === proposal.invoiceId);
      const inv = invoice?.number ?? "No invoice";
      return {
        id: proposal.id,
        amount: major(txn?.amountMinor ?? 0) * (txn?.direction === "out" ? -1 : 1),
        party: txn?.counterparty ?? "",
        inv,
        invoiceId: invoice?.id ?? "",
        txnId: txn?.id ?? "",
        pending: txn?.status === "pending",
        conf: Math.round(proposal.confidence * 100),
        why: proposal.reason,
        note: "Suggested match: " + inv + ", " + proposal.reason,
        when: formatDate(txn?.dayOffset ?? 0),
        d: formatDate(txn?.dayOffset ?? 0),
        src: sourceLabel(txn?.source ?? "bank")
      };
    });
    const autoMatches = getMatchedTransactions().map((txn) => {
      const invoice = db2().invoices.find((row) => row.id === txn.invoiceId);
      const proposal = db2().matchProposals.find((row) => row.transactionId === txn.id);
      const inv = invoice?.number ?? "No invoice";
      return {
        id: txn.id,
        amount: major(txn.amountMinor) * (txn.direction === "out" ? -1 : 1),
        party: txn.counterparty,
        inv,
        invoiceId: invoice?.id ?? "",
        txnId: txn.id,
        pending: txn.status === "pending",
        conf: proposal ? Math.round(proposal.confidence * 100) : 100,
        why: proposal?.reason || "Matched from the ledger",
        note: "Matched: " + inv,
        when: formatDate(txn.dayOffset),
        d: formatDate(txn.dayOffset),
        src: sourceLabel(txn.source)
      };
    });
    const attention = matches.map((item) => ({
      id: item.id,
      amount: item.amount,
      d: item.d,
      src: item.src,
      note: item.note,
      conf: item.conf + "%",
      inv: item.inv,
      invoiceId: item.invoiceId,
      txnId: item.txnId,
      pending: item.pending,
      why: item.why,
      party: item.party
    }));
    const periods = {
      day: periodBlock("day"),
      week: periodBlock("week"),
      month: periodBlock("month")
    };
    return {
      merchantName: seed.merchant.businessName,
      ownerName: owner,
      accountantName: seed.merchant.accountantName,
      acctName: owner,
      acctEmail: emailFromName(owner),
      ratesVat: String(getVatRate() * 100),
      showVat: getVatRate() > 0,
      showTax: getVatRate() > 0,
      periodFrom: formatDate(-29),
      periodTo: formatDate(0),
      profile: {
        businessName: seed.merchant.businessName,
        legalEntity: seed.merchant.legalEntity,
        taxRegistrationNumber: seed.merchant.taxRegistrationNumber ?? "",
        industry: seed.merchant.industry,
        address: seed.merchant.address,
        currency: "QR, Qatari Riyal",
        crNumber: seed.merchant.crNumber
      },
      plan: {
        tier: seed.merchant.plan.tier,
        price: formatMoney(seed.merchant.plan.monthlyPrice, currency),
        line: seed.merchant.plan.tier + " \xB7 " + formatMoney(seed.merchant.plan.monthlyPrice, currency) + "/mo",
        limitLabel: usage.limit.toLocaleString("en-US") + " transactions"
      },
      usage: {
        used: usage.used,
        limit: usage.limit,
        pct: Math.round(usage.used / usage.limit * 100) + "%",
        label: usage.used.toLocaleString("en-US") + " of " + usage.limit.toLocaleString("en-US") + " transactions used"
      },
      matchRate,
      invoiceTotals: {
        outstanding: major(outstanding.amountMinor),
        outstandingCount: outstanding.count,
        overdue: major(overdue.amountMinor),
        overdueCount: overdue.count,
        invoiced: major(invoiced.amountMinor),
        invoicedCount: invoiced.count
      },
      ageing: ageingView(),
      txns,
      invoices,
      links: db2().paymentLinks.map((link) => {
        const expiryOffset = offsetFromLabel(link.expiry);
        const expired = link.status === "active" && expiryOffset != null && expiryOffset < 0;
        const status = expired ? "expired" : link.status;
        return {
          id: link.id,
          amount: major(link.amountMinor),
          desc: link.description,
          status: titleStatus(status),
          created: formatDate(link.createdOffset),
          uses: link.uses,
          expiry: link.expiry,
          payUrl: appPayUrl(link.id),
          url: appPayUrl(link.id).replace(/^https?:\/\//, ""),
          invoiceId: link.invoiceId || "",
          clientId: link.clientId || "",
          canSimulate: status === "active",
          canDeactivate: status === "active" || status === "failed" || status === "rejected"
        };
      }),
      checkoutPages: db2().checkoutPages.map((page) => ({
        id: page.id,
        slug: page.slug,
        title: page.productName,
        desc: page.description,
        amount: major(page.amountMinor),
        amountText: formatMoney(page.amountMinor, currency, { trimWhole: true }),
        published: page.published,
        views: page.views,
        paid: page.paidCount,
        accent: page.accent,
        logoDataUrl: page.logoDataUrl || "",
        email: page.supportEmail || emailFromName(owner),
        phone: page.supportPhone || "",
        terms: page.terms !== false,
        payLabel: page.payLabel || "Pay",
        fields: (page.fields && page.fields.length ? page.fields : [
          { label: "Amount", kind: "price" },
          { label: "Email", kind: "mail" }
        ]).map((field) => Object.assign({}, field)),
        path: "/pay/" + page.slug
      })),
      plans: db2().subscriptionPlans.map((plan) => {
        const people = db2().subscribers.filter((row) => row.planId === plan.id && row.status === "active");
        const monthly = plan.interval === "Year" ? Math.round(plan.amountMinor / 12) : plan.interval === "Quarter" ? Math.round(plan.amountMinor / 3) : plan.interval === "Week" ? Math.round(plan.amountMinor * 52 / 12) : plan.amountMinor;
        return {
          id: plan.id,
          name: plan.name,
          amount: major(plan.amountMinor),
          interval: plan.interval,
          desc: plan.description,
          customerName: plan.customerName,
          status: titleStatus(plan.status),
          slug: plan.slug,
          signupUrl: appPayUrl(plan.slug),
          url: appPayUrl(plan.slug).replace(/^https?:\/\//, ""),
          subs: people.length,
          mrr: major(monthly * people.length)
        };
      }),
      subscribers: db2().subscribers.map((row) => ({
        id: row.id,
        plan: row.planId,
        name: row.name,
        email: row.email,
        status: titleStatus(row.status),
        since: formatDate(row.createdOffset),
        next: formatDate(row.nextChargeOffset),
        canAct: row.status === "active"
      })),
      upcomingCharges: db2().upcomingCharges.filter((row) => row.status === "upcoming").map((row) => {
        const plan = db2().subscriptionPlans.find((item) => item.id === row.planId);
        const person = db2().subscribers.find((item) => item.id === row.subscriberId);
        return {
          id: row.id,
          planId: row.planId,
          subscriberId: row.subscriberId,
          name: person?.name || "",
          planName: plan?.name || "",
          amount: major(row.amountMinor),
          amountText: formatMoney(row.amountMinor, currency, { trimWhole: true }),
          when: formatDate(row.dayOffset)
        };
      }),
      shopify: {
        connected: db2().shopify.connected,
        shopDomain: db2().shopify.shopDomain,
        disconnected: !db2().shopify.connected,
        orderCount: db2().transactions.filter((txn) => txn.source === "shopify").length,
        sampleReady: db2().shopify.connected && !db2().transactions.some((txn) => txn.counterparty === "Shopify sample order #1042")
      },
      smartCheckout: {
        on: db2().smartCheckout.on,
        walletDetect: db2().smartCheckout.walletDetect,
        retryOnDecline: db2().smartCheckout.retryOnDecline,
        analytics: SAMPLE_CHECKOUT_ANALYTICS
      },
      sampleBanks: SAMPLE_BANKS,
      banks: db2().bankAccounts.map((account) => ({
        id: account.id,
        bank: account.bank,
        name: account.bank + ", " + account.label,
        label: account.label,
        initials: account.bank.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        sample: !!account.sample,
        note: account.sample ? "Sample data. Live bank feeds arrive in a later phase." : formatMoney(account.openingBalanceMinor, currency, { trimWhole: true }) + " opening as of " + formatDate(account.asOfOffset)
      })),
      linkClients: db2().clients.map((client) => ({ id: client.id, name: client.name })),
      linkInvoices: getOutstandingInvoices().map((invoice) => ({
        id: invoice.id,
        clientId: invoice.clientId,
        amount: major(invoice.amountMinor),
        label: invoice.number + " \xB7 " + clientName(invoice.clientId) + " \xB7 " + formatMoney(invoice.amountMinor, currency, { trimWhole: true })
      })),
      clients: db2().clients.map((client) => {
        const rows = db2().invoices.filter((invoice) => invoice.clientId === client.id);
        return {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: "",
          invoiceCount: rows.length,
          total: major(rows.reduce((sum, invoice) => sum + invoice.amountMinor, 0))
        };
      }),
      team: seed.teamMembers.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        last: member.lastSeenOffset === 0 ? "Today" : formatDate(member.lastSeenOffset)
      })),
      employees: seed.employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
        salary: major(employee.monthlySalary),
        method: "Bank transfer"
      })),
      history: db2().activityLog.map((entry) => ({
        id: entry.id,
        kind: entry.kind,
        when: formatDate(entry.dayOffset),
        who: entry.actor,
        what: entry.what
      })),
      exportHistory: db2().exportHistory.map((row) => ({
        id: row.id,
        kind: row.kind,
        target: row.target,
        when: formatDate(row.dayOffset),
        items: row.items,
        status: row.status,
        filename: row.filename || "",
        simulated: row.simulated,
        errors: row.errors
      })),
      syncLog: db2().exportHistory.filter((row) => row.kind === "zoho").map((row) => ({
        id: row.id,
        target: row.target,
        when: formatDate(row.dayOffset),
        items: row.items,
        status: row.status,
        simulated: row.simulated,
        errors: row.errors
      })),
      zoho: (() => {
        const last = db2().exportHistory.find((row) => row.kind === "zoho");
        return {
          hasLast: !!last,
          line: last ? "Last push simulated \xB7 " + last.items + " items \xB7 " + formatDate(last.dayOffset) : ""
        };
      })(),
      matches,
      autoMatches,
      reminderInvoices: invoices.filter((row) => {
        const status = row.status;
        return status === "Sent" || status === "Viewed" || status === "Overdue" || status === "Awaiting Settlement";
      }),
      attention,
      periods,
      branches: getBranchComparison().map((branch) => ({
        id: branch.id,
        name: branch.name,
        sub: "Branch",
        initials: branch.name.slice(0, 2).toUpperCase(),
        staff: branch.staff,
        revenue: major(branch.inflow)
      })),
      gateways: sourceStats(),
      bank: bankView(),
      scan: scanSample(),
      sampleBills: sampleBillViews(),
      figures: {
        balance: major(getNet("week")),
        pending: major(getPendingSettlement("week")),
        payrollGross: major(payrollGross),
        payrollNet: major(payrollNet),
        payrollDeductions: major(payrollDed),
        payrollCount: seed.employees.length,
        deductionRate: seed.payrollRuns[0]?.deductionRate ?? 0
      }
    };
  }
  function appPayUrl(pathId) {
    const origin = typeof location !== "undefined" && location.origin ? location.origin : "";
    return origin + "/pay/" + pathId;
  }
  function sourceVolume(source) {
    const rows = db2().transactions.filter((txn) => txn.source === source);
    const settledIn = rows.filter((txn) => txn.direction === "in" && txn.status === "settled").reduce((sum, txn) => sum + txn.amountMinor, 0);
    const pending = rows.filter((txn) => txn.status === "pending").reduce((sum, txn) => sum + txn.amountMinor, 0);
    const settledCount = rows.filter((txn) => txn.status === "settled").length;
    return {
      month: formatMoney(settledIn, currency),
      settling: formatMoney(pending, currency),
      success: rows.length ? Math.round(settledCount / rows.length * 100) + "%" : ""
    };
  }
  function sourceStats() {
    return {
      skipcash: sourceVolume("skipcash"),
      shopify: sourceVolume("shopify")
    };
  }
  function bankView() {
    const account = db2().bankAccounts[0];
    const cashOnHand = getCashOnHand();
    const name = account ? account.bank + ", " + account.label : "";
    const opening = account ? account.openingBalanceMinor : 0;
    return {
      name,
      initials: (account?.bank ?? "").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      activity: formatMoney(cashOnHand, currency),
      activityCaption: "Cash on hand",
      note: account ? formatMoney(opening, currency, { trimWhole: true }) + " opening as of " + formatDate(account.asOfOffset) : "No bank account is stored.",
      extra: db2().bankAccounts.slice(1).map((row) => ({
        id: row.id,
        name: row.bank + ", " + row.label,
        initials: row.bank.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        sample: !!row.sample,
        note: row.sample ? "Sample data. Live bank feeds arrive in a later phase." : formatMoney(row.openingBalanceMinor, currency, { trimWhole: true }) + " opening as of " + formatDate(row.asOfOffset)
      }))
    };
  }
  function scanSample() {
    return {
      vendor: SAMPLE_BILL.counterparty,
      amount: formatMoney(SAMPLE_BILL.amountMinor, currency),
      date: formatDate(SAMPLE_BILL.dayOffset),
      dayOffset: SAMPLE_BILL.dayOffset
    };
  }
  function sampleBillViews() {
    return SAMPLE_BILLS.map((bill) => ({
      id: bill.id,
      vendor: bill.vendor,
      filename: bill.filename,
      cta: "Use " + bill.vendor + " bill"
    }));
  }
  function dashboardSnapshot() {
    const data = dashboardState();
    return {
      txns: data.txns,
      invoices: data.invoices,
      periods: data.periods,
      figures: data.figures,
      invoiceTotals: data.invoiceTotals,
      ageing: data.ageing,
      usage: data.usage,
      matchRate: data.matchRate,
      history: data.history,
      branches: data.branches,
      gateways: data.gateways,
      bank: data.bank,
      links: data.links,
      linkClients: data.linkClients,
      linkInvoices: data.linkInvoices,
      matches: data.matches,
      autoMatches: data.autoMatches,
      reminderInvoices: data.reminderInvoices,
      attention: data.attention,
      scan: data.scan,
      sampleBills: data.sampleBills,
      clients: data.clients,
      exportHistory: data.exportHistory,
      syncLog: data.syncLog,
      zoho: data.zoho,
      checkoutPages: data.checkoutPages,
      plans: data.plans,
      subscribers: data.subscribers,
      upcomingCharges: data.upcomingCharges,
      shopify: data.shopify,
      smartCheckout: data.smartCheckout,
      sampleBanks: data.sampleBanks,
      banks: data.banks
    };
  }
  function emailFromName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, ".") + "@albidda.qa";
  }

  // lib/gateway/types.ts
  var SKIP_CASH_STATUS = {
    0: "new",
    1: "pending",
    2: "paid",
    3: "canceled",
    4: "failed",
    5: "rejected",
    6: "refunded",
    7: "pending refund",
    8: "refund failed"
  };

  // lib/gateway/mock-skipcash.ts
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function uuid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
      const n = Math.random() * 16 | 0;
      return (ch === "x" ? n : n & 3 | 8).toString(16);
    });
  }
  function majorString(amountMinor) {
    return (amountMinor / 100).toFixed(2);
  }
  function parseAmountMinor(amount) {
    const n = typeof amount === "number" ? amount : Number(amount);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100);
  }
  function hostedPayUrl(id) {
    const origin = typeof location !== "undefined" && location.origin ? location.origin : "";
    return origin + "/pay/" + id;
  }
  function asWebhook(payload) {
    if (!payload || typeof payload !== "object") throw new Error("SkipCash webhook body is missing");
    const row = payload;
    const paymentId = String(row.paymentId ?? row.PaymentId ?? "");
    const statusRaw = row.statusId ?? row.StatusId;
    const statusId = Number(statusRaw);
    if (!paymentId) throw new Error("SkipCash webhook PaymentId is missing");
    if (!(statusId in SKIP_CASH_STATUS)) throw new Error("SkipCash webhook StatusId is unknown: " + String(statusRaw));
    return {
      paymentId,
      amount: String(row.amount ?? row.Amount ?? ""),
      statusId,
      transactionId: row.transactionId == null && row.TransactionId == null ? null : String(row.transactionId ?? row.TransactionId),
      custom1: row.custom1 == null && row.Custom1 == null ? null : String(row.custom1 ?? row.Custom1),
      visaId: row.visaId == null && row.VisaId == null ? null : String(row.visaId ?? row.VisaId)
    };
  }
  var GATEWAY_STORAGE_KEY = "flow-gateway-v1";
  function clearMockSkipCashStorage() {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.removeItem(GATEWAY_STORAGE_KEY);
    } catch {
    }
  }
  function readGatewayStorage() {
    if (typeof localStorage === "undefined") return { payments: [], settlements: [] };
    try {
      const raw = localStorage.getItem(GATEWAY_STORAGE_KEY);
      if (!raw) return { payments: [], settlements: [] };
      const saved = JSON.parse(raw);
      return {
        payments: Array.isArray(saved.payments) ? saved.payments : [],
        settlements: Array.isArray(saved.settlements) ? saved.settlements : []
      };
    } catch {
      return { payments: [], settlements: [] };
    }
  }
  function createMockSkipCash() {
    const payments = /* @__PURE__ */ new Map();
    const settlements = [];
    const saved = readGatewayStorage();
    saved.payments.forEach((row) => payments.set(row.id, row));
    saved.settlements.forEach((row) => settlements.push(row));
    function persist2() {
      if (typeof localStorage === "undefined") return;
      try {
        localStorage.setItem(GATEWAY_STORAGE_KEY, JSON.stringify({
          payments: Array.from(payments.values()),
          settlements
        }));
      } catch {
      }
    }
    return {
      async createPaymentLink(input) {
        await delay(300 + Math.floor(Math.random() * 601));
        const skipCashRequest = {
          Uid: uuid(),
          KeyId: "00000000-0000-0000-0000-000000000001",
          Amount: majorString(input.amountMinor),
          FirstName: input.customer?.firstName ?? "",
          LastName: input.customer?.lastName ?? "",
          Phone: input.customer?.phone ?? "",
          Email: input.customer?.email ?? "",
          TransactionId: input.merchantTransactionId ?? "",
          Custom1: input.description ?? ""
        };
        const id = uuid();
        const record = {
          id,
          payUrl: hostedPayUrl(id),
          amountMinor: input.amountMinor,
          currency: input.currency,
          statusId: 0,
          status: SKIP_CASH_STATUS[0],
          merchantTransactionId: skipCashRequest.TransactionId || null,
          createdDayOffset: 0
        };
        payments.set(id, record);
        persist2();
        return { ...record };
      },
      async getPaymentStatus(id) {
        const record = payments.get(id);
        if (!record) throw new Error("SkipCash payment not found: " + id);
        return { ...record };
      },
      ensurePayment(record) {
        const existing = payments.get(record.id);
        if (existing) return { ...existing };
        const next = {
          id: record.id,
          payUrl: record.payUrl || hostedPayUrl(record.id),
          amountMinor: record.amountMinor,
          currency: record.currency,
          statusId: record.statusId,
          status: record.status,
          merchantTransactionId: record.merchantTransactionId,
          createdDayOffset: record.createdDayOffset
        };
        payments.set(next.id, next);
        persist2();
        return { ...next };
      },
      async simulatePayment(id, outcome) {
        const record = payments.get(id);
        if (!record) throw new Error("SkipCash payment not found: " + id);
        let statusId = 2;
        let amountMinor = record.amountMinor;
        if (outcome === "decline") statusId = 5;
        else if (outcome === "timeout") statusId = 4;
        else if (outcome === "partial") {
          statusId = 2;
          amountMinor = Math.max(1, Math.round(record.amountMinor / 2));
        }
        return {
          paymentId: record.id,
          amount: majorString(amountMinor),
          statusId,
          transactionId: record.merchantTransactionId,
          custom1: null,
          visaId: outcome === "success" || outcome === "partial" ? "sim_" + record.id.slice(0, 8) : null
        };
      },
      async listSettlements() {
        return settlements.map((row) => ({ ...row }));
      },
      async handleWebhook(payload) {
        const hook = asWebhook(payload);
        const record = payments.get(hook.paymentId);
        if (!record) throw new Error("SkipCash payment not found: " + hook.paymentId);
        const amountMinor = parseAmountMinor(hook.amount) || record.amountMinor;
        record.statusId = hook.statusId;
        record.status = SKIP_CASH_STATUS[hook.statusId];
        record.amountMinor = amountMinor;
        let settlementDayOffset = null;
        if (hook.statusId === 2) {
          const lag = 1 + Math.floor(Math.random() * 2);
          settlementDayOffset = record.createdDayOffset + lag;
          settlements.push({
            id: "stl_" + record.id,
            paymentId: record.id,
            amountMinor,
            dayOffset: settlementDayOffset
          });
        }
        persist2();
        return {
          paymentId: record.id,
          statusId: record.statusId,
          status: record.status,
          amountMinor,
          merchantTransactionId: record.merchantTransactionId,
          settlementDayOffset
        };
      }
    };
  }

  // lib/gateway/index.ts
  var GATEWAY = "mock-skipcash";
  var instance = null;
  function getGateway() {
    if (!instance) {
      if (GATEWAY !== "mock-skipcash") {
        throw new Error("Unknown gateway implementation: " + GATEWAY);
      }
      instance = createMockSkipCash();
    }
    return instance;
  }
  function resetGateway() {
    instance = null;
    clearMockSkipCashStorage();
  }

  // lib/data/spine.ts
  var SETTLEMENT_DELAY_MS = 1200;
  function ownerContact() {
    const merchant = getStore().merchant;
    const owner = getStore().teamMembers.find((member) => member.role === "Owner");
    const parts = merchant.ownerName.split(" ").filter(Boolean);
    return {
      firstName: parts[0] || merchant.ownerName,
      lastName: parts.slice(1).join(" ") || parts[0] || merchant.ownerName,
      email: owner?.email || getStore().clients[0]?.email || ""
    };
  }
  async function createPaymentLink(input) {
    const store = getStore();
    const invoice = input.invoiceId ? store.invoices.find((row) => row.id === input.invoiceId) : void 0;
    const clientId = input.clientId || invoice?.clientId || null;
    const client = clientId ? store.clients.find((row) => row.id === clientId) : void 0;
    const owner = ownerContact();
    const names = (client?.name || store.merchant.ownerName).split(" ").filter(Boolean);
    const record = await getGateway().createPaymentLink({
      amountMinor: input.amountMinor,
      currency: store.merchant.currency,
      description: input.description,
      merchantTransactionId: invoice?.number,
      customer: {
        firstName: names[0] || owner.firstName,
        lastName: names.slice(1).join(" ") || owner.lastName,
        email: client?.email || owner.email
      }
    });
    const link = {
      id: record.id,
      payUrl: record.payUrl,
      amountMinor: input.amountMinor,
      description: input.description || "Payment",
      clientId,
      invoiceId: invoice?.id || null,
      status: "active",
      createdOffset: 0,
      uses: 0,
      expiry: input.expiry || "-",
      txnId: null
    };
    appendPaymentLink(link);
    return link;
  }
  function paymentLinkById(id) {
    return getStore().paymentLinks.find((row) => row.id === id);
  }
  function ensureGatewayPayment(link) {
    getGateway().ensurePayment({
      id: link.id,
      payUrl: link.payUrl || "/pay/" + link.id,
      amountMinor: link.amountMinor,
      currency: getStore().merchant.currency,
      statusId: 0,
      status: "new",
      merchantTransactionId: link.invoiceId,
      createdDayOffset: link.createdOffset
    });
  }
  async function simulatePayment(linkId, outcome) {
    const link = getStore().paymentLinks.find((row) => row.id === linkId);
    if (!link) throw new Error("Payment link not found: " + linkId);
    ensureGatewayPayment(link);
    const gateway = getGateway();
    const payload = await gateway.simulatePayment(linkId, outcome);
    const result = await gateway.handleWebhook(payload);
    if (result.statusId !== 2) {
      replacePaymentLink(linkId, { status: result.statusId === 5 ? "rejected" : "failed" });
      return { pending: false, txnId: null, delayMs: 0, reference: payload.visaId, amountMinor: result.amountMinor };
    }
    const client = link.clientId ? getStore().clients.find((row) => row.id === link.clientId) : void 0;
    const invoice = link.invoiceId ? getStore().invoices.find((row) => row.id === link.invoiceId) : void 0;
    const txnId = "txn_link_" + link.id.replace(/-/g, "").slice(0, 10);
    appendTransaction({
      id: txnId,
      dayOffset: 0,
      counterparty: client?.name || link.description,
      source: "link",
      direction: "in",
      type: "sale",
      tag: "Sales",
      status: "pending",
      amountMinor: result.amountMinor,
      branchId: invoice?.branchId || "br_01",
      invoiceId: link.invoiceId
    });
    appendActivity({
      id: "act_" + txnId,
      kind: "payments",
      dayOffset: 0,
      actor: "System",
      what: "Payment received, QR " + (result.amountMinor / 100).toLocaleString("en-US") + ", " + (client?.name || link.description)
    });
    appendMatchProposal({
      id: "mp_" + txnId,
      transactionId: txnId,
      invoiceId: link.invoiceId,
      confidence: invoice ? 0.93 : 0.52,
      reason: invoice ? "Payment link amount matches " + invoice.number + (client ? " for " + client.name : "") + "." : "Payment link with no matching invoice. Log as a direct sale?",
      status: "open"
    });
    replacePaymentLink(linkId, { status: "pending", txnId, uses: 1 });
    return { pending: true, txnId, delayMs: SETTLEMENT_DELAY_MS, reference: payload.visaId || txnId, amountMinor: result.amountMinor };
  }
  function settlePayment(linkId) {
    const link = getStore().paymentLinks.find((row) => row.id === linkId);
    if (!link?.txnId) return;
    replaceTransaction(link.txnId, { status: "settled" });
    replacePaymentLink(linkId, { status: "paid" });
  }
  function confirmMatch(proposalId) {
    replaceMatchProposal(proposalId, { status: "confirmed" });
  }
  function deactivatePaymentLink(linkId) {
    const link = getStore().paymentLinks.find((row) => row.id === linkId);
    if (!link) throw new Error("Payment link not found: " + linkId);
    if (link.status === "paid" || link.status === "pending") return link;
    return replacePaymentLink(linkId, { status: "deactivated" });
  }
  function slugify(text) {
    return String(text || "page").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "page";
  }
  function uniqueSlug(base, existing) {
    const root = slugify(base);
    if (!existing.includes(root)) return root;
    let n = 2;
    while (existing.includes(root + "-" + n)) n += 1;
    return root + "-" + n;
  }
  function intervalOffset(interval) {
    if (interval === "Week") return 7;
    if (interval === "Quarter") return 90;
    if (interval === "Year") return 365;
    return 30;
  }
  function postInbound(opts) {
    appendTransaction({
      id: opts.id,
      dayOffset: 0,
      counterparty: opts.counterparty,
      source: opts.source,
      direction: "in",
      type: "sale",
      tag: "Sales",
      status: "pending",
      amountMinor: opts.amountMinor,
      branchId: opts.branchId || "br_01",
      invoiceId: opts.invoiceId
    });
    appendActivity({
      id: "act_" + opts.id,
      kind: "payments",
      dayOffset: 0,
      actor: "System",
      what: "Payment received, QR " + (opts.amountMinor / 100).toLocaleString("en-US") + ", " + opts.counterparty
    });
    if (opts.source !== "shopify") {
      appendMatchProposal({
        id: "mp_" + opts.id,
        transactionId: opts.id,
        invoiceId: opts.invoiceId,
        confidence: opts.invoiceId ? 0.93 : 0.52,
        reason: opts.reason,
        status: "open"
      });
    }
  }
  function defaultCheckoutFields() {
    return [
      { label: "Amount", kind: "price", optional: false },
      { label: "Email", kind: "mail", optional: false }
    ];
  }
  function publishCheckoutPage(input) {
    if (!input.productName || !String(input.productName).trim()) {
      throw new Error("Checkout page needs a product name");
    }
    if (!input.amountMinor || input.amountMinor <= 0) {
      throw new Error("Checkout page needs a price");
    }
    const store = getStore();
    const existing = input.id ? store.checkoutPages.find((page2) => page2.id === input.id) : void 0;
    const others = store.checkoutPages.filter((page2) => page2.id !== existing?.id).map((page2) => page2.slug);
    const slug = uniqueSlug(input.slug || input.productName, others);
    const fields = (input.fields && input.fields.length ? input.fields : existing?.fields || defaultCheckoutFields()).map((field) => ({
      label: String(field.label || "Field").trim() || "Field",
      kind: String(field.kind || "text"),
      optional: !!field.optional
    }));
    const page = {
      id: existing?.id || "pp_" + Date.now().toString(36),
      slug,
      productName: String(input.productName).trim(),
      description: input.description || "",
      amountMinor: input.amountMinor,
      currency: store.merchant.currency,
      logoDataUrl: input.logoDataUrl ?? existing?.logoDataUrl ?? null,
      accent: input.accent || existing?.accent || "#17171C",
      published: true,
      views: existing?.views ?? 0,
      paidCount: existing?.paidCount ?? 0,
      createdOffset: existing?.createdOffset ?? 0,
      txnIds: existing?.txnIds ?? [],
      supportEmail: (input.supportEmail ?? existing?.supportEmail ?? ownerContact().email).trim(),
      supportPhone: (input.supportPhone ?? existing?.supportPhone ?? "").trim(),
      terms: input.terms ?? existing?.terms ?? true,
      payLabel: String(input.payLabel ?? existing?.payLabel ?? "Pay").trim() || "Pay",
      fields
    };
    if (existing) replaceCheckoutPage(existing.id, page);
    else appendCheckoutPage(page);
    return getStore().checkoutPages.find((row) => row.id === page.id) || page;
  }
  function checkoutPageBySlug(slug) {
    return getStore().checkoutPages.find((page) => page.slug === slug && page.published);
  }
  async function payPublishedCheckout(slug) {
    const page = checkoutPageBySlug(slug);
    if (!page) throw new Error("Checkout page not found: " + slug);
    replaceCheckoutPage(page.id, { views: page.views + 1 });
    const record = await getGateway().createPaymentLink({
      amountMinor: page.amountMinor,
      currency: page.currency,
      description: page.productName,
      customer: ownerContact()
    });
    const payload = await getGateway().simulatePayment(record.id, "success");
    const result = await getGateway().handleWebhook(payload);
    if (result.statusId !== 2) {
      return { pending: false, txnId: null, delayMs: 0, pageId: page.id, reference: payload.visaId, amountMinor: result.amountMinor };
    }
    const txnId = "txn_chk_" + record.id.replace(/-/g, "").slice(0, 10);
    postInbound({
      id: txnId,
      counterparty: page.productName,
      source: "skipcash",
      amountMinor: result.amountMinor,
      invoiceId: null,
      reason: "Hosted checkout payment for " + page.productName + "."
    });
    const latest = getStore().checkoutPages.find((row) => row.id === page.id);
    replaceCheckoutPage(page.id, {
      paidCount: (latest?.paidCount ?? page.paidCount) + 1,
      txnIds: (latest?.txnIds ?? page.txnIds).concat([txnId])
    });
    return { pending: true, txnId, delayMs: SETTLEMENT_DELAY_MS, pageId: page.id, reference: payload.visaId || txnId, amountMinor: result.amountMinor };
  }
  function settleCheckoutPayment(txnId) {
    replaceTransaction(txnId, { status: "settled" });
  }
  async function createSubscriptionPlan(input) {
    if (!input.name || !String(input.name).trim()) throw new Error("Plan needs a name");
    if (!input.amountMinor || input.amountMinor <= 0) throw new Error("Plan needs an amount");
    const store = getStore();
    const slug = uniqueSlug(input.name, store.subscriptionPlans.map((plan2) => plan2.slug));
    const plan = {
      id: "plan_" + Date.now().toString(36),
      name: String(input.name).trim(),
      amountMinor: input.amountMinor,
      interval: input.interval || "Month",
      description: input.description || "",
      customerName: input.customerName || "",
      status: "active",
      createdOffset: 0,
      slug,
      signupUrl: "/pay/" + slug
    };
    appendSubscriptionPlan(plan);
    if (input.customerName && String(input.customerName).trim()) {
      addSubscriber(plan.id, String(input.customerName).trim());
    }
    return plan;
  }
  function addSubscriber(planId, name, email) {
    const plan = getStore().subscriptionPlans.find((row) => row.id === planId);
    if (!plan) throw new Error("Plan not found: " + planId);
    if (plan.status === "canceled") throw new Error("Plan is canceled");
    const subscriber = {
      id: "sub_" + Date.now().toString(36),
      planId,
      name: name || "Subscriber",
      email: email || "",
      status: "active",
      createdOffset: 0,
      nextChargeOffset: intervalOffset(plan.interval)
    };
    appendSubscriber(subscriber);
    appendUpcomingCharge({
      id: "chg_" + subscriber.id,
      planId,
      subscriberId: subscriber.id,
      amountMinor: plan.amountMinor,
      dayOffset: subscriber.nextChargeOffset,
      status: "upcoming",
      txnId: null
    });
    return subscriber;
  }
  function pauseSubscriber(subscriberId) {
    const row = getStore().subscribers.find((item) => item.id === subscriberId);
    if (!row) throw new Error("Subscriber not found: " + subscriberId);
    getStore().upcomingCharges.filter((charge) => charge.subscriberId === subscriberId && charge.status === "upcoming").forEach((charge) => replaceUpcomingCharge(charge.id, { status: "canceled" }));
    return replaceSubscriber(subscriberId, { status: "paused" });
  }
  function cancelSubscriber(subscriberId) {
    const row = getStore().subscribers.find((item) => item.id === subscriberId);
    if (!row) throw new Error("Subscriber not found: " + subscriberId);
    getStore().upcomingCharges.filter((charge) => charge.subscriberId === subscriberId && charge.status === "upcoming").forEach((charge) => replaceUpcomingCharge(charge.id, { status: "canceled" }));
    return replaceSubscriber(subscriberId, { status: "canceled" });
  }
  function cancelSubscriptionPlan(planId) {
    const plan = getStore().subscriptionPlans.find((row) => row.id === planId);
    if (!plan) throw new Error("Plan not found: " + planId);
    getStore().subscribers.filter((row) => row.planId === planId && row.status === "active").forEach((row) => cancelSubscriber(row.id));
    return replaceSubscriptionPlan(planId, { status: "canceled" });
  }
  async function runSimulatedBilling(chargeId) {
    const charge = getStore().upcomingCharges.find((row) => row.id === chargeId);
    if (!charge || charge.status !== "upcoming") throw new Error("Upcoming charge not found: " + chargeId);
    const subscriber = getStore().subscribers.find((row) => row.id === charge.subscriberId);
    const plan = getStore().subscriptionPlans.find((row) => row.id === charge.planId);
    if (!subscriber || subscriber.status !== "active") throw new Error("Subscriber is not active");
    if (!plan || plan.status !== "active") throw new Error("Plan is not active");
    const record = await getGateway().createPaymentLink({
      amountMinor: charge.amountMinor,
      currency: getStore().merchant.currency,
      description: plan.name,
      customer: {
        firstName: subscriber.name.split(" ")[0] || subscriber.name,
        lastName: subscriber.name.split(" ").slice(1).join(" ") || subscriber.name,
        email: subscriber.email || ownerContact().email
      }
    });
    const payload = await getGateway().simulatePayment(record.id, "success");
    const result = await getGateway().handleWebhook(payload);
    if (result.statusId !== 2) {
      replaceUpcomingCharge(chargeId, { status: "canceled" });
      return { pending: false, txnId: null, delayMs: 0 };
    }
    const txnId = "txn_sub_" + record.id.replace(/-/g, "").slice(0, 10);
    postInbound({
      id: txnId,
      counterparty: subscriber.name,
      source: "skipcash",
      amountMinor: result.amountMinor,
      invoiceId: null,
      reason: "Simulated billing for " + plan.name + "."
    });
    replaceUpcomingCharge(chargeId, { status: "paid", txnId, dayOffset: 0 });
    const nextOffset = intervalOffset(plan.interval);
    replaceSubscriber(subscriber.id, { nextChargeOffset: nextOffset });
    appendUpcomingCharge({
      id: "chg_" + subscriber.id + "_" + Date.now().toString(36),
      planId: plan.id,
      subscriberId: subscriber.id,
      amountMinor: plan.amountMinor,
      dayOffset: nextOffset,
      status: "upcoming",
      txnId: null
    });
    return { pending: true, txnId, delayMs: SETTLEMENT_DELAY_MS };
  }
  function settleBilling(txnId) {
    replaceTransaction(txnId, { status: "settled" });
  }
  function setSmartCheckout(on, extras) {
    return replaceSmartCheckout(Object.assign({ on }, extras || {}));
  }
  function connectShopify(shopDomain) {
    const domain = String(shopDomain || "").trim();
    if (!domain) throw new Error("Store URL is required");
    return replaceShopify({ connected: true, shopDomain: domain });
  }
  function ingestShopifyOrder() {
    if (!getStore().shopify.connected) throw new Error("Shopify is not connected");
    const sample = SAMPLE_SHOPIFY_ORDER;
    if (getStore().transactions.some((txn) => txn.counterparty === sample.counterparty)) {
      throw new Error("Sample Shopify order is already on the ledger");
    }
    const txnId = "txn_shop_" + Date.now().toString(36);
    appendTransaction({
      id: txnId,
      dayOffset: 0,
      counterparty: sample.counterparty,
      source: "shopify",
      direction: "in",
      type: "sale",
      tag: sample.tag,
      status: "settled",
      amountMinor: sample.amountMinor,
      branchId: sample.branchId,
      invoiceId: null
    });
    appendActivity({
      id: "act_" + txnId,
      kind: "payments",
      dayOffset: 0,
      actor: "System",
      what: "Payment received, QR " + (sample.amountMinor / 100).toLocaleString("en-US") + ", " + sample.counterparty
    });
    return getStore().transactions.find((txn) => txn.id === txnId);
  }
  function nextInvoiceIdentity() {
    let max = 0;
    for (const invoice of getStore().invoices) {
      const n = parseInt(String(invoice.number).replace(/\D/g, ""), 10);
      if (Number.isFinite(n) && n > max) max = n;
    }
    const next = max + 1;
    const pad = String(next).padStart(4, "0");
    return { id: "inv_" + pad, number: "INV-" + pad };
  }
  function addClient(input) {
    const name = String(input.name || "").trim();
    if (!name) throw new Error("Client name is required");
    const existing = getStore().clients.find((client) => client.name === name);
    if (existing) return existing;
    return appendClient({
      id: "cli_" + Date.now().toString(36),
      name,
      email: input.email || "",
      branchId: input.branchId || getStore().branches[0]?.id || "br_01"
    });
  }
  function resolveInvoiceClient(input) {
    if (input.clientId) {
      const found = getStore().clients.find((client) => client.id === input.clientId);
      if (found) return found;
    }
    const name = String(input.clientName || "").trim();
    if (!name) throw new Error("Client is required");
    return addClient({ name });
  }
  function createInvoice(input) {
    if (!Number.isFinite(input.dueOffset)) throw new Error("Due date is required");
    if (!Number.isFinite(input.amountMinor) || input.amountMinor <= 0) throw new Error("Amount is required");
    const client = resolveInvoiceClient(input);
    const identity = nextInvoiceIdentity();
    const draft = !!input.draft;
    const issuedOffset = input.issuedOffset != null ? input.issuedOffset : 0;
    const invoice = {
      id: identity.id,
      number: identity.number,
      clientId: client.id,
      amountMinor: Math.round(input.amountMinor),
      issuedOffset,
      dueOffset: input.dueOffset,
      sentAt: draft ? null : 0,
      viewedAt: null,
      branchId: client.branchId,
      lines: input.lines && input.lines.length ? input.lines.map((line) => ({
        description: line.description,
        quantity: line.quantity,
        unitMinor: line.unitMinor
      })) : void 0
    };
    appendInvoice(invoice);
    appendActivity({
      id: "act_" + invoice.id,
      kind: "edits",
      dayOffset: 0,
      actor: getStore().merchant.ownerName,
      what: draft ? "Invoice " + invoice.number + " saved as draft" : "Invoice " + invoice.number + " sent"
    });
    return invoice;
  }
  function duplicateInvoice(invoiceId) {
    const source = getStore().invoices.find((invoice) => invoice.id === invoiceId);
    if (!source) throw new Error("Invoice not found: " + invoiceId);
    return createInvoice({
      clientId: source.clientId,
      amountMinor: source.amountMinor,
      dueOffset: 14,
      issuedOffset: 0,
      draft: true,
      lines: source.lines
    });
  }
  function offsetsForMonthLabel(label) {
    const wanted = String(label || "").trim();
    if (!wanted) return null;
    let from = null;
    let to = null;
    for (let offset = -400; offset <= 400; offset++) {
      if (monthYearLabel(offset) === wanted) {
        if (from == null) from = offset;
        to = offset;
      }
    }
    if (from == null || to == null) return null;
    return { from, to };
  }
  function defaultPayrollPeriod() {
    const run = getStore().payrollRuns[0];
    return monthYearLabel(run ? run.periodOffset : -15);
  }
  function payrollPostedFor(periodLabel2) {
    const range = offsetsForMonthLabel(periodLabel2);
    if (!range) return false;
    return getStore().transactions.some(
      (txn) => txn.type === "payroll" && txn.tag === "Salaries" && txn.status !== "pending" && txn.dayOffset >= range.from && txn.dayOffset <= range.to
    );
  }
  function postPayroll(periodLabel2) {
    const period = String(periodLabel2 || "").trim();
    if (!period) throw new Error("Period is required");
    if (payrollPostedFor(period)) {
      return { alreadyPosted: true, period };
    }
    const range = offsetsForMonthLabel(period);
    const dayOffset = range ? Math.min(0, range.to) : 0;
    const amountMinor = getPayrollNet("pay_01");
    const txn = appendTransaction({
      id: "txn_pay_" + Date.now().toString(36),
      dayOffset,
      counterparty: "Monthly payroll",
      source: "bank",
      direction: "out",
      type: "payroll",
      tag: "Salaries",
      status: "settled",
      amountMinor,
      branchId: getStore().branches[0]?.id || "br_01",
      invoiceId: null
    });
    appendActivity({
      id: "act_" + txn.id,
      kind: "payments",
      dayOffset,
      actor: getStore().merchant.ownerName,
      what: "Payroll paid, QR " + (amountMinor / 100).toLocaleString("en-US")
    });
    return { alreadyPosted: false, period, txnId: txn.id };
  }
  function connectSampleBank(bankId) {
    const sample = SAMPLE_BANKS.find((row) => row.id === bankId);
    if (!sample) throw new Error("Sample bank not found: " + bankId);
    if (getStore().bankAccounts.some((row) => row.id === sample.id)) {
      return getStore().bankAccounts.find((row) => row.id === sample.id);
    }
    return appendBankAccount({
      id: sample.id,
      bank: sample.bank,
      label: sample.label,
      currency: getStore().merchant.currency,
      openingBalanceMinor: 0,
      asOfOffset: 0,
      sample: true
    });
  }

  // lib/data/tally-export.ts
  function xmlEscape(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function tallyDate(offset) {
    const date = dateFor(offset);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return String(year) + month + day;
  }
  function majorAmount(amountMinor) {
    return (amountMinor / 100).toFixed(2);
  }
  function offsetFromLabel2(label) {
    const trimmed = String(label || "").trim();
    if (!trimmed) return null;
    if (/^\d{8}$/.test(trimmed)) {
      for (let offset = -400; offset <= 1; offset++) {
        if (tallyDate(offset) === trimmed) return offset;
      }
    }
    for (let offset = -400; offset <= 1; offset++) {
      if (formatDate(offset) === trimmed) return offset;
    }
    return null;
  }
  function resolveTallyRange(fromLabel, toLabel) {
    const fromOffset = fromLabel ? offsetFromLabel2(fromLabel) : -29;
    const toOffset = toLabel ? offsetFromLabel2(toLabel) : 0;
    return {
      fromOffset: fromOffset ?? -29,
      toOffset: toOffset ?? 0
    };
  }
  function bankLedger(txn) {
    const account = getStore().bankAccounts[0];
    if (txn.source === "bank") return account ? account.bank : "Bank";
    if (txn.source === "skipcash") return "SkipCash";
    if (txn.source === "shopify") return "Shopify";
    if (txn.source === "link") return "Payment Link";
    if (txn.source === "cash") return "Cash";
    return "Bank";
  }
  function plLedger(txn) {
    if (txn.type === "sale" || txn.type === "refund") return "Sales";
    if (txn.type === "payroll") return "Salaries";
    return txn.tag;
  }
  function voucherType(txn) {
    return txn.direction === "in" ? "Receipt" : "Payment";
  }
  function ledgerEntry(name, debit, amountMinor, costCentre) {
    const amount = debit ? "-" + majorAmount(amountMinor) : majorAmount(amountMinor);
    const cost = costCentre ? [
      "        <CATEGORYALLOCATIONS.LIST>",
      "          <CATEGORY>Primary Cost Category</CATEGORY>",
      "          <COSTCENTREALLOCATIONS.LIST>",
      "            <NAME>" + xmlEscape(costCentre) + "</NAME>",
      "            <AMOUNT>" + amount + "</AMOUNT>",
      "          </COSTCENTREALLOCATIONS.LIST>",
      "        </CATEGORYALLOCATIONS.LIST>"
    ].join("\n") + "\n" : "";
    return [
      "      <ALLLEDGERENTRIES.LIST>",
      "        <LEDGERNAME>" + xmlEscape(name) + "</LEDGERNAME>",
      "        <ISDEEMEDPOSITIVE>" + (debit ? "Yes" : "No") + "</ISDEEMEDPOSITIVE>",
      "        <AMOUNT>" + amount + "</AMOUNT>",
      cost + "      </ALLLEDGERENTRIES.LIST>"
    ].join("\n");
  }
  function voucherXml(txn) {
    const type = voucherType(txn);
    const date = tallyDate(txn.dayOffset);
    const narration = txn.type + " \xB7 " + txn.counterparty + " \xB7 " + txn.tag;
    const party = bankLedger(txn);
    const books = plLedger(txn);
    const debitBooks = txn.direction === "out";
    const entries = debitBooks ? ledgerEntry(books, true, txn.amountMinor, txn.tag) + "\n" + ledgerEntry(party, false, txn.amountMinor) : ledgerEntry(party, true, txn.amountMinor) + "\n" + ledgerEntry(books, false, txn.amountMinor, txn.tag);
    return [
      '    <TALLYMESSAGE xmlns:UDF="TallyUDF">',
      '      <VOUCHER VCHTYPE="' + type + '" ACTION="Create" OBJVIEW="Accounting Voucher View">',
      "        <DATE>" + date + "</DATE>",
      "        <EFFECTIVEDATE>" + date + "</EFFECTIVEDATE>",
      "        <VOUCHERTYPENAME>" + type + "</VOUCHERTYPENAME>",
      "        <PARTYLEDGERNAME>" + xmlEscape(txn.counterparty) + "</PARTYLEDGERNAME>",
      "        <NARRATION>" + xmlEscape(narration) + "</NARRATION>",
      "        <REFERENCE>" + xmlEscape(txn.id) + "</REFERENCE>",
      entries,
      "      </VOUCHER>",
      "    </TALLYMESSAGE>"
    ].join("\n");
  }
  function transactionsInTallyRange(fromOffset, toOffset) {
    const start = Math.min(fromOffset, toOffset);
    const end = Math.max(fromOffset, toOffset);
    return getStore().transactions.filter((txn) => txn.status !== "pending" && txn.dayOffset >= start && txn.dayOffset <= end).slice().sort((a, b) => a.dayOffset - b.dayOffset || a.id.localeCompare(b.id));
  }
  function buildTallyExport(fromLabel, toLabel) {
    const range = resolveTallyRange(fromLabel, toLabel);
    const rows = transactionsInTallyRange(range.fromOffset, range.toOffset);
    const company = getStore().merchant.businessName;
    const fromStamp = tallyDate(range.fromOffset);
    const toStamp = tallyDate(range.toOffset);
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      "<ENVELOPE>",
      "  <HEADER>",
      "    <VERSION>1</VERSION>",
      "    <TALLYREQUEST>Import</TALLYREQUEST>",
      "    <TYPE>Data</TYPE>",
      "    <ID>Vouchers</ID>",
      "  </HEADER>",
      "  <BODY>",
      "    <DESC>",
      "      <STATICVARIABLES>",
      "        <SVCURRENTCOMPANY>" + xmlEscape(company) + "</SVCURRENTCOMPANY>",
      "      </STATICVARIABLES>",
      "    </DESC>",
      "    <DATA>",
      ...rows.map(voucherXml),
      "    </DATA>",
      "  </BODY>",
      "</ENVELOPE>",
      ""
    ].join("\n");
    return {
      xml,
      filename: "flow-tally-export-" + fromStamp + "-" + toStamp + ".xml",
      items: rows.length,
      fromOffset: range.fromOffset,
      toOffset: range.toOffset
    };
  }
  function logExport(row, what) {
    appendActivity({
      id: "act_" + row.id,
      kind: "sync",
      dayOffset: 0,
      actor: getStore().merchant.ownerName,
      what
    });
    return row;
  }
  function recordTallyExport(file) {
    return logExport(appendExportRecord({
      id: "exp_tally_" + Date.now(),
      kind: "tally",
      target: "Tally XML",
      dayOffset: 0,
      items: file.items,
      status: "Success",
      filename: file.filename,
      simulated: false,
      errors: 0
    }), file.items + " vouchers exported to Tally XML (" + file.filename + ")");
  }
  function exportTallyXml(fromLabel, toLabel) {
    const file = buildTallyExport(fromLabel, toLabel);
    recordTallyExport(file);
    return file;
  }
  function simulateZohoSync() {
    const rows = transactionsInTallyRange(-29, 0);
    return logExport(appendExportRecord({
      id: "exp_zoho_" + Date.now(),
      kind: "zoho",
      target: "Zoho Books (simulated)",
      dayOffset: 0,
      items: rows.length,
      status: "Simulated",
      filename: null,
      simulated: true,
      errors: 0
    }), rows.length + " items pushed to Zoho Books (simulated)");
  }

  // lib/data/browser.ts
  if (typeof window !== "undefined") {
    hydrateFromStorage();
    window.FLOW_DATA = dashboardState();
  }
  return __toCommonJS(browser_exports);
})();
