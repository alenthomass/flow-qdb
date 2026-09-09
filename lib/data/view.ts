import { formatDate, formatMoney } from "../format";
import { chartScale } from "../chart";
import { seed } from "./seed";
import { getStore } from "./store";
import { SAMPLE_BILL, SAMPLE_BILLS } from "./sample-bill";
import { SAMPLE_BANKS, SAMPLE_CHECKOUT_ANALYTICS } from "./sample-checkout";
import { offsetFromLabel } from "../format";
import type { Period } from "./types";
import {
  getBranchComparison,
  getCashForecast,
  getInvoiceStatus,
  getMatchRate,
  getMoneyIn,
  getMoneyOut,
  getNet,
  getNetSeries,
  getOpenMatches,
  getOutstanding,
  getOutstandingInvoices,
  getOverdue,
  getPayrollDeductions,
  getPayrollGross,
  getPayrollNet,
  getPendingSettlement,
  getPlanUsage,
  getProfitAndLoss,
  getRunway,
  getSpend,
  getTotalInvoiced,
  periodLabel,
  getVatRate,
  signedAmount
} from "./selectors";
import type { CurrencyCode } from "./types";

const currency = seed.merchant.currency;

function db() {
  return getStore();
}

function major(amount: number): number {
  return amount / 100;
}

function titleStatus(status: string): string {
  return status.replace(/\b\w/g, letter => letter.toUpperCase());
}

function sourceLabel(source: string): string {
  if (source === "skipcash") return "SkipCash";
  if (source === "shopify") return "Shopify";
  return source.charAt(0).toUpperCase() + source.slice(1);
}

function clientName(clientId: string): string {
  return seed.clients.find(client => client.id === clientId)?.name ?? "";
}

function signedMoney(amount: number): string {
  const text = formatMoney(amount, currency, { trimWhole: true });
  return amount > 0 ? "+" + text : text;
}

function periodRangeLabel(period: Period): string {
  const from = period === "day" ? 0 : period === "week" ? -6 : -29;
  return formatDate(from) + " – " + formatDate(0);
}

function runwayView(period: Period) {
  const row = getRunway(period);
  return {
    cash: major(row.cashOnHand),
    burn: major(row.profitable ? row.net : row.burn),
    cashText: formatMoney(row.cashOnHand, currency, { trimWhole: true }),
    burnText: row.profitable ? signedMoney(row.net) : formatMoney(row.burn, currency, { trimWhole: true }),
    burnLabel: row.profitable ? "AVG NET / MO" : "AVG NET BURN / MO",
    months: row.profitable ? "Profitable" : row.months + ((row.months === 1) ? " month" : " months"),
    until: row.profitable ? "Cash is growing" : "If this month repeats",
    profitable: row.profitable
  };
}

function spendView(period: Period) {
  const spend = getSpend(period);
  return {
    total: major(spend.total),
    refunds: major(spend.refunds),
    refundsText: formatMoney(spend.refunds, currency, { trimWhole: true }),
    hasRefunds: spend.refunds > 0,
    insight: spend.insight,
    tags: spend.tags.map(row => ({
      tag: row.tag,
      out: formatMoney(row.amount, currency, { trimWhole: true }),
      pct: row.percent + "%",
      bar: row.percent + "%",
      color: row.percent > 30 ? "var(--neg)" : "var(--ink-2)"
    })),
    vendors: spend.vendors.map(vendor => ({
      name: vendor.name,
      tag: vendor.tag,
      abbr: vendor.name.slice(0, 2).toUpperCase(),
      count: sourceLabel(vendor.source),
      total: formatMoney(vendor.amount, currency, { trimWhole: true })
    }))
  };
}

function forecastView(period: Period) {
  const buckets = getCashForecast(period);
  const max = Math.max(1, ...buckets.map(bucket => Math.max(bucket.inflow, bucket.outflow)));
  return buckets.map(bucket => ({
    day: bucket.label,
    inH: ((bucket.inflow / max) * 140).toFixed(0) + "px",
    outH: ((bucket.outflow / max) * 140).toFixed(0) + "px",
    inBg: bucket.projected ? "transparent" : "var(--pos)",
    outBg: bucket.projected ? "transparent" : "var(--ink-6)",
    border: bucket.projected ? "1.5px dashed var(--ink-6)" : "none"
  }));
}

function daysLateOf(invoice: { id: string; dueOffset: number }): number {
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
  const bucket = (lo: number, hi: number) => rows.filter(invoice => {
    const days = daysLateOf(invoice);
    return days >= lo && days < hi;
  });
  const mk = (label: string, list: typeof rows, color: string) => {
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
      mk("1–14 DAYS", bucket(1, 15), "var(--ink)"),
      mk("15–30 DAYS", bucket(15, 31), "var(--ink-2)"),
      mk("OVER 30 DAYS", bucket(31, 999), "var(--neg)")
    ],
    rows: rows.map(invoice => {
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

function periodBlock(period: Period) {
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
      valueTexts: series.values.map(value => formatMoney(value, currency, { trimWhole: true })),
      scale: {
        min: major(scale.min), max: major(scale.max),
        ticks: scale.ticks.map(tick => ({ value: major(tick.value), label: tick.label }))
      }
    },
    branches: getBranchComparison(period).map(branch => ({
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

export function dashboardState() {
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

  const txns = db().transactions
    .slice()
    .sort((a, b) => b.dayOffset - a.dayOffset || a.id.localeCompare(b.id))
    .map(txn => ({
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

  const invoices = db().invoices.map(invoice => {
    const status = getInvoiceStatus(invoice.id);
    return {
      id: invoice.id,
      no: invoice.number,
      client: clientName(invoice.clientId),
      amount: major(invoice.amountMinor),
      status: titleStatus(status),
      due: formatDate(invoice.dueOffset),
      tag: "Sales",
      outstanding: status === "paid" || status === "refunded" || status === "draft" ? 0 : major(invoice.amountMinor),
      daysLate: invoice.dueOffset < 0 && status !== "paid" && status !== "refunded" ? -invoice.dueOffset : 0
    };
  });

  const matches = open.map(proposal => {
    const txn = db().transactions.find(row => row.id === proposal.transactionId);
    const invoice = db().invoices.find(row => row.id === proposal.invoiceId);
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

  const attention = matches.map(item => ({
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

  const periods: Record<Period, ReturnType<typeof periodBlock>> = {
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
      price: formatMoney(seed.merchant.plan.monthlyPrice, currency as CurrencyCode),
      line: seed.merchant.plan.tier + " · " + formatMoney(seed.merchant.plan.monthlyPrice, currency as CurrencyCode) + "/mo",
      limitLabel: usage.limit.toLocaleString("en-US") + " transactions"
    },
    usage: {
      used: usage.used,
      limit: usage.limit,
      pct: Math.round((usage.used / usage.limit) * 100) + "%",
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
    links: db().paymentLinks.map(link => {
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
        payUrl: link.payUrl,
        url: link.payUrl.replace(/^https?:\/\//, ""),
        invoiceId: link.invoiceId || "",
        clientId: link.clientId || "",
        canSimulate: status === "active",
        canDeactivate: status === "active" || status === "failed" || status === "rejected"
      };
    }),
    checkoutPages: db().checkoutPages.map(page => ({
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
      path: "/pay/" + page.slug
    })),
    plans: db().subscriptionPlans.map(plan => {
      const people = db().subscribers.filter(row => row.planId === plan.id && row.status === "active");
      const monthly = plan.interval === "Year"
        ? Math.round(plan.amountMinor / 12)
        : plan.interval === "Quarter"
          ? Math.round(plan.amountMinor / 3)
          : plan.interval === "Week"
            ? Math.round(plan.amountMinor * 52 / 12)
            : plan.amountMinor;
      return {
        id: plan.id,
        name: plan.name,
        amount: major(plan.amountMinor),
        interval: plan.interval,
        desc: plan.description,
        customerName: plan.customerName,
        status: titleStatus(plan.status),
        slug: plan.slug,
        signupUrl: plan.signupUrl,
        url: plan.signupUrl.replace(/^https?:\/\//, ""),
        subs: people.length,
        mrr: major(monthly * people.length)
      };
    }),
    subscribers: db().subscribers.map(row => ({
      id: row.id,
      plan: row.planId,
      name: row.name,
      email: row.email,
      status: titleStatus(row.status),
      since: formatDate(row.createdOffset),
      next: formatDate(row.nextChargeOffset),
      canAct: row.status === "active"
    })),
    upcomingCharges: db().upcomingCharges
      .filter(row => row.status === "upcoming")
      .map(row => {
        const plan = db().subscriptionPlans.find(item => item.id === row.planId);
        const person = db().subscribers.find(item => item.id === row.subscriberId);
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
      connected: db().shopify.connected,
      shopDomain: db().shopify.shopDomain,
      disconnected: !db().shopify.connected,
      orderCount: db().transactions.filter(txn => txn.source === "shopify").length,
      sampleReady: db().shopify.connected && !db().transactions.some(txn => txn.counterparty === "Shopify sample order #1042")
    },
    smartCheckout: {
      on: db().smartCheckout.on,
      walletDetect: db().smartCheckout.walletDetect,
      retryOnDecline: db().smartCheckout.retryOnDecline,
      analytics: SAMPLE_CHECKOUT_ANALYTICS
    },
    sampleBanks: SAMPLE_BANKS,
    banks: db().bankAccounts.map(account => ({
      id: account.id,
      bank: account.bank,
      name: account.bank + ", " + account.label,
      label: account.label,
      initials: account.bank.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase(),
      sample: !!account.sample,
      note: account.sample
        ? "Sample data. Live bank feeds arrive in a later phase."
        : formatMoney(account.openingBalanceMinor, currency, { trimWhole: true }) + " opening as of " + formatDate(account.asOfOffset)
    })),
    linkClients: seed.clients.map(client => ({ id: client.id, name: client.name })),
    linkInvoices: getOutstandingInvoices().map(invoice => ({
      id: invoice.id,
      clientId: invoice.clientId,
      amount: major(invoice.amountMinor),
      label: invoice.number + " · " + clientName(invoice.clientId) + " · " + formatMoney(invoice.amountMinor, currency as CurrencyCode, { trimWhole: true })
    })),
    clients: seed.clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: "",
      total: major(db().invoices.filter(invoice => invoice.clientId === client.id).reduce((sum, invoice) => sum + invoice.amountMinor, 0))
    })),
    team: seed.teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      last: member.lastSeenOffset === 0 ? "Today" : formatDate(member.lastSeenOffset)
    })),
    employees: seed.employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      role: employee.role,
      salary: major(employee.monthlySalary),
      method: "Bank transfer"
    })),
    history: db().activityLog.map(entry => ({
      id: entry.id,
      kind: entry.kind,
      when: formatDate(entry.dayOffset),
      who: entry.actor,
      what: entry.what
    })),
    exportHistory: db().exportHistory.map(row => ({
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
    syncLog: db().exportHistory.filter(row => row.kind === "zoho").map(row => ({
      id: row.id,
      target: row.target,
      when: formatDate(row.dayOffset),
      items: row.items,
      status: row.status,
      simulated: row.simulated,
      errors: row.errors
    })),
    zoho: (() => {
      const last = db().exportHistory.find(row => row.kind === "zoho");
      return {
        hasLast: !!last,
        line: last
          ? "Last push simulated · " + last.items + " items · " + formatDate(last.dayOffset)
          : ""
      };
    })(),
    matches,
    autoMatches: [] as typeof matches,
    attention,
    periods,
    branches: getBranchComparison().map(branch => ({
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

function sourceVolume(source: string) {
  const rows = db().transactions.filter(txn => txn.source === source);
  const settledIn = rows
    .filter(txn => txn.direction === "in" && txn.status === "settled")
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const pending = rows
    .filter(txn => txn.status === "pending")
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const settledCount = rows.filter(txn => txn.status === "settled").length;
  return {
    month: formatMoney(settledIn, currency as CurrencyCode),
    settling: formatMoney(pending, currency as CurrencyCode),
    success: rows.length ? Math.round((settledCount / rows.length) * 100) + "%" : ""
  };
}

function sourceStats() {
  return {
    skipcash: sourceVolume("skipcash"),
    shopify: sourceVolume("shopify")
  };
}

function bankView() {
  const account = db().bankAccounts[0];
  const net = db().transactions
    .filter(txn => txn.source === "bank" && txn.status === "settled")
    .reduce((sum, txn) => sum + signedAmount(txn), 0);
  const name = account ? account.bank + ", " + account.label : "";
  const opening = account ? account.openingBalanceMinor : 0;
  return {
    name,
    initials: (account?.bank ?? "").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase(),
    activity: formatMoney(net, currency as CurrencyCode),
    note: account
      ? formatMoney(opening, currency as CurrencyCode, { trimWhole: true }) + " opening as of " + formatDate(account.asOfOffset)
      : "No bank account is stored.",
    extra: db().bankAccounts.slice(1).map(row => ({
      id: row.id,
      name: row.bank + ", " + row.label,
      initials: row.bank.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase(),
      sample: !!row.sample,
      note: row.sample
        ? "Sample data. Live bank feeds arrive in a later phase."
        : formatMoney(row.openingBalanceMinor, currency as CurrencyCode, { trimWhole: true }) + " opening as of " + formatDate(row.asOfOffset)
    }))
  };
}

function scanSample() {
  return {
    vendor: SAMPLE_BILL.counterparty,
    amount: formatMoney(SAMPLE_BILL.amountMinor, currency as CurrencyCode),
    date: formatDate(SAMPLE_BILL.dayOffset),
    dayOffset: SAMPLE_BILL.dayOffset
  };
}

function sampleBillViews() {
  return SAMPLE_BILLS.map(bill => ({
    id: bill.id,
    vendor: bill.vendor,
    filename: bill.filename,
    cta: "Use " + bill.vendor + " bill"
  }));
}

export function dashboardSnapshot() {
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

function emailFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ".") + "@albidda.qa";
}
