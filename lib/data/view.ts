import { dateInputValue, formatDate, formatMoney, monthYearLabel, offsetFromLabel } from "../format";
import { chartScale } from "../chart";
import { dateFor, seed } from "./seed";
import { getStore } from "./store";
import { SAMPLE_BILL, SAMPLE_BILLS } from "./sample-bill";
import { CONNECTED_BANKING_PREVIEW, QATAR_BANKS, SAMPLE_BANKS, SAMPLE_CHECKOUT_ANALYTICS } from "./sample-checkout";
import type { BankAccount, Period } from "./types";
import {
  getBranchComparison,
  getCashForecast,
  getCashOnHand,
  getInvoiceStatus,
  getMatchedTransactions,
  getMatchRate,
  getMoneyIn,
  getMoneyInPrevious,
  getMoneyOut,
  getMoneyOutPrevious,
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
  signedAmount,
  assertPhase1Invariants
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
  return db().clients.find(client => client.id === clientId)?.name ?? "";
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

function forecastSummaryView(period: Period) {
  const buckets = getCashForecast(period);
  const projected = buckets.filter(b => b.projected);
  if (!projected.length) return { hasProjection: false, netMinor: 0, netText: "", positive: true };
  const netMinor = projected.reduce((sum, b) => sum + (b.inflow - b.outflow), 0);
  return {
    hasProjection: true,
    netMinor,
    netText: formatMoney(Math.abs(netMinor), currency, { trimWhole: true }),
    positive: netMinor >= 0
  };
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

function trendPct(current: number, previous: number): number | null {
  if (previous === 0 || current === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function trendShare(pct: number | null): string {
  if (pct == null) return "";
  return (pct > 0 ? "+" : "") + pct + "%";
}

function periodBlock(period: Period) {
  const series = getNetSeries(period);
  const scale = chartScale(series.values, currency);
  const pnl = getProfitAndLoss(period);
  const moneyInMinor = getMoneyIn(period);
  const moneyOutMinor = getMoneyOut(period);
  const moneyInTrendPct = trendPct(moneyInMinor, getMoneyInPrevious(period));
  const moneyOutTrendPct = trendPct(moneyOutMinor, getMoneyOutPrevious(period));
  const netMinor = getNet(period);
  const netPreviousMinor = getMoneyInPrevious(period) - getMoneyOutPrevious(period);
  const netTrendPct = trendPct(netMinor, netPreviousMinor);
  const netTrendAgainst = period === "day" ? "yesterday" : period === "week" ? "last week" : "last month";
  const netTrendText = netTrendPct == null ? "" : (netTrendPct > 0 ? "+" : "") + netTrendPct + "% vs " + netTrendAgainst;
  return {
    moneyIn: major(moneyInMinor),
    moneyOut: major(moneyOutMinor),
    pending: major(getPendingSettlement(period)),
    net: major(getNet(period)),
    moneyInText: formatMoney(moneyInMinor, currency, { trimWhole: true }),
    moneyOutText: formatMoney(moneyOutMinor, currency, { trimWhole: true }),
    moneyInShare: trendShare(moneyInTrendPct),
    moneyOutShare: trendShare(moneyOutTrendPct),
    moneyInTrendPct,
    moneyOutTrendPct,
    netTrendText,
    pendingText: formatMoney(getPendingSettlement(period), currency, { trimWhole: true }),
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
    forecast: forecastView(period),
    forecastSummary: forecastSummaryView(period)
  };
}

export function dashboardState() {
  assertPhase1Invariants();
  const owner = seed.merchant.ownerName;
  const merchant = db().merchant;
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
    .map(txn => {
      const proposal = db().matchProposals.find(row => row.transactionId === txn.id);
      const invoice = txn.invoiceId
        ? db().invoices.find(row => row.id === txn.invoiceId)
        : proposal?.invoiceId
          ? db().invoices.find(row => row.id === proposal.invoiceId)
          : undefined;
      const inUniverse = txn.direction === "in" || txn.type === "refund";
      const openMatch = proposal?.status === "open";
      const ledgerMatched = !openMatch && (!!txn.invoiceId || (txn.source === "shopify" && inUniverse));
      let matchLabel = "—";
      if (openMatch) matchLabel = "Waiting for review";
      else if (ledgerMatched) matchLabel = invoice ? "Matched to " + invoice.number : "Matched";
      else if (inUniverse) matchLabel = "Unmatched";
      const log: { when: string; text: string }[] = [];
      const when = formatDate(txn.dayOffset);
      if (txn.type === "refund") log.push({ when, text: "Refund recorded" + (txn.source === "skipcash" ? " by SkipCash" : "") });
      else if (txn.type === "expense") log.push({ when, text: "Expense recorded" });
      else if (txn.type === "payroll") log.push({ when, text: "Payroll posted" });
      else if (txn.source === "skipcash") log.push({ when, text: "Payment authorised by SkipCash" });
      else if (txn.source === "shopify") log.push({ when, text: "Order recorded from Shopify" });
      else if (txn.source === "link") log.push({ when, text: "Payment received via payment link" });
      else log.push({ when, text: "Payment recorded from " + sourceLabel(txn.source) });
      if (ledgerMatched) {
        log.push({ when, text: invoice ? "Matched to " + invoice.number : "Matched from the ledger" });
      } else if (openMatch && invoice) {
        log.push({ when, text: "Suggested match: " + invoice.number });
      }
      if (proposal?.status === "confirmed") {
        log.push({ when, text: "Confirmed by " + owner });
      }
      return {
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
        invoiceId: txn.invoiceId,
        matchLabel,
        matchLog: log
      };
    });

  const invoices = db().invoices.map(invoice => {
    const status = getInvoiceStatus(invoice.id);
    const buyer = db().clients.find(client => client.id === invoice.clientId);
    return {
      id: invoice.id,
      no: invoice.number,
      client: clientName(invoice.clientId),
      clientId: invoice.clientId,
      clientAddress: buyer?.address || "",
      amount: major(invoice.amountMinor),
      status: titleStatus(status),
      due: formatDate(invoice.dueOffset),
      issued: formatDate(invoice.issuedOffset),
      issuedOffset: invoice.issuedOffset,
      issuedThisMonth: (() => {
        const issued = dateFor(invoice.issuedOffset);
        const today = dateFor(0);
        return issued.getUTCFullYear() === today.getUTCFullYear() && issued.getUTCMonth() === today.getUTCMonth();
      })(),
      sentOn: invoice.sentAt != null ? formatDate(invoice.sentAt) : "—",
      viewedOn: invoice.viewedAt != null ? formatDate(invoice.viewedAt) : "—",
      tag: "Sales",
      outstanding: status === "paid" || status === "refunded" || status === "draft" ? 0 : major(invoice.amountMinor),
      daysLate: invoice.dueOffset < 0 && status !== "paid" && status !== "refunded" ? -invoice.dueOffset : 0,
      lines: (invoice.lines && invoice.lines.length)
        ? invoice.lines.map(line => ({
            description: line.description,
            quantity: line.quantity,
            unitMinor: line.unitMinor,
            note: line.note || ""
          }))
        : [],
      partialPayment: !!invoice.partialPayment,
      discount: major(invoice.discountMinor || 0),
      notes: invoice.notes || "",
      termsAndConditions: invoice.termsAndConditions || "",
      reference: invoice.reference || "",
      attachments: (invoice.attachments || []).map(file => ({
        name: file.name,
        size: file.size || 0
      }))
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

  const autoMatches = getMatchedTransactions().map(txn => {
    const invoice = db().invoices.find(row => row.id === txn.invoiceId);
    const proposal = db().matchProposals.find(row => row.transactionId === txn.id);
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
    merchantName: merchant.businessName,
    ownerName: owner,
    accountantName: seed.merchant.accountantName,
    acctName: owner,
    acctEmail: emailFromName(owner),
    ratesVat: String(getVatRate() * 100),
    showVat: getVatRate() > 0,
    showTax: getVatRate() > 0,
    periodFrom: dateInputValue(-29),
    periodTo: dateInputValue(0),
    profile: {
      businessName: merchant.businessName,
      legalEntity: merchant.legalEntity,
      taxRegistrationNumber: merchant.taxRegistrationNumber ?? "",
      industry: merchant.industry,
      address: merchant.address,
      currency: "QR, Qatari Riyal",
      crNumber: merchant.crNumber,
      phone: merchant.phone || "",
      email: merchant.email || "",
      bankName: merchant.bankName || (db().bankAccounts.find(account => !account.sample) || db().bankAccounts[0])?.bank || "",
      accountName: merchant.accountName || "",
      iban: merchant.iban || "",
      accountNumber: merchant.accountNumber || "",
      swiftCode: merchant.swiftCode || ""
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
        payUrl: appPayUrl(link.id),
        url: appPayUrl(link.id).replace(/^https?:\/\//, ""),
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
      amountText: page.amountMode === "open" ? "Open" : formatMoney(page.amountMinor, currency, { trimWhole: true }),
      amountMode: page.amountMode === "open" || page.amountMode === "qty" ? page.amountMode : "fixed",
      published: page.published,
      views: page.views,
      paid: page.paidCount,
      accent: page.accent,
      logoDataUrl: page.logoDataUrl || "",
      email: page.supportEmail || emailFromName(owner),
      phone: page.supportPhone || "",
      terms: page.terms !== false,
      payLabel: page.payLabel || "Pay",
      theme: page.theme === "dark" ? "dark" : "light",
      closeMode: page.closeMode === "date" ? "date" : "none",
      closeLabel: page.closeLabel || "",
      afterPay: page.afterPay === "redirect" ? "redirect" : "message",
      redirectUrl: page.redirectUrl || "",
      receiptAuto: page.receiptAuto !== false,
      receiptCustomer: !!page.receiptCustomer,
      receiptRef: !!page.receiptRef,
      fields: (page.fields && page.fields.length ? page.fields : [
        { label: "Amount", kind: "price" },
        { label: "Email", kind: "mail" }
      ]).map(field => Object.assign({}, field)),
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
        signupUrl: appPayUrl(plan.slug),
        url: appPayUrl(plan.slug).replace(/^https?:\/\//, ""),
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
    bankPreview: {
      name: CONNECTED_BANKING_PREVIEW.bank + ", " + CONNECTED_BANKING_PREVIEW.label,
      initials: bankInitials(CONNECTED_BANKING_PREVIEW.bank),
      logo: bankLogoSrc(CONNECTED_BANKING_PREVIEW.bank),
      iban: CONNECTED_BANKING_PREVIEW.ibanMasked,
      balance: formatMoney(CONNECTED_BANKING_PREVIEW.balanceMinor, currency as CurrencyCode)
    },
    qatarBanks: QATAR_BANKS.map(row => Object.assign({}, row, {
      initials: bankInitials(row.bank),
      logo: bankLogoSrc(row.bank)
    })),
    banks: db().bankAccounts.map(account => Object.assign(bankCardFields(account), {
      bank: account.bank,
      label: account.label
    })),
    overdueBankCount: db().bankAccounts.filter(account => bankReminderView(account).status === "overdue").length,
    statementMonths: bankStatementMonthsView(),
    linkClients: db().clients.map(client => ({ id: client.id, name: client.name })),
    linkInvoices: getOutstandingInvoices().map(invoice => ({
      id: invoice.id,
      clientId: invoice.clientId,
      amount: major(invoice.amountMinor),
      label: invoice.number + " · " + clientName(invoice.clientId) + " · " + formatMoney(invoice.amountMinor, currency as CurrencyCode, { trimWhole: true })
    })),
    clients: db().clients.map(client => {
      const rows = db().invoices.filter(invoice => invoice.clientId === client.id);
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        address: client.address || "",
        phone: client.phone || "",
        invoiceCount: rows.length,
        total: major(rows.reduce((sum, invoice) => sum + invoice.amountMinor, 0))
      };
    }),
    team: db().teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      last: member.lastSeenOffset === 0 ? "Today" : formatDate(member.lastSeenOffset)
    })),
    employees: db().employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      role: employee.role,
      salary: major(employee.monthlySalary),
      method: "Bank transfer"
    })),
    payslips: db().payslips.map(row => {
      const employee = db().employees.find(item => item.id === row.employeeId);
      return {
        id: row.id,
        period: row.period,
        employeeId: row.employeeId,
        employeeName: row.employeeName,
        role: employee?.role || "",
        method: "Bank transfer",
        gross: major(row.grossMinor),
        deduction: major(row.deductionMinor),
        net: major(row.netMinor),
        generatedOffset: row.generatedOffset
      };
    }),
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
    autoMatches,
    reminderInvoices: invoices.filter(row => {
      const status = row.status;
      return status === "Sent" || status === "Viewed" || status === "Overdue" || status === "Awaiting Settlement";
    }),
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
    },
    recurringInvoices: db().recurringInvoices.map(row => {
      const client = clientName(row.clientId);
      return {
        id: row.id,
        clientId: row.clientId,
        client,
        amount: major(row.amountMinor),
        interval: row.interval,
        nextOffset: row.nextOffset,
        endsAfter: row.endsAfter,
        sentCount: row.sentCount,
        status: titleStatus(row.status),
        running: row.status === "active"
      };
    }),
    rolePermissions: db().rolePermissions,
    approvalLimits: db().approvalLimits,
    approvalRequests: db().approvalRequests.filter(row => row.status === "open").map(row => {
      const member = db().teamMembers.find(item => item.id === row.memberId);
      return {
        id: row.id,
        amt: major(row.amountMinor),
        what: row.what,
        who: member?.name || "",
        when: formatDate(row.dayOffset)
      };
    }),
    ledgerTags: [...new Set(db().transactions.map(txn => txn.tag))].sort(),
    tags: db().tags.slice(),
    tagParents: { ...db().tagParents }
  };
}

function appPayUrl(pathId: string): string {
  const origin = typeof location !== "undefined" && location.origin ? location.origin : "";
  return origin + "/pay/" + pathId;
}

function sourceVolume(source: string) {
  const rows = db().transactions.filter(txn => txn.source === source);
  const settledIn = rows
    .filter(txn => txn.direction === "in" && txn.status === "settled")
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const pending = rows
    .filter(txn => txn.status === "pending")
    .reduce((sum, txn) => sum + txn.amountMinor, 0);
  const volume = settledIn + pending;
  return {
    month: formatMoney(settledIn, currency as CurrencyCode),
    settling: formatMoney(pending, currency as CurrencyCode),
    success: volume ? Math.round((settledIn / volume) * 100) + "%" : ""
  };
}

function sourceStats() {
  return {
    skipcash: sourceVolume("skipcash"),
    shopify: sourceVolume("shopify")
  };
}

function bankInitials(bank: string): string {
  return String(bank || "").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

export function bankReminderView(account: BankAccount): { status: "never" | "current" | "due-soon" | "overdue" | null; label: string } {
  if (account.sample) return { status: null, label: "" };
  if (account.lastImportOffset == null) {
    return { status: "never", label: "No statement uploaded yet" };
  }
  const daysSince = 0 - account.lastImportOffset;
  if (daysSince < 25) {
    return { status: "current", label: "Up to date · last upload " + formatDate(account.lastImportOffset) };
  }
  if (daysSince < 30) {
    return { status: "due-soon", label: "Statement due soon · last upload " + formatDate(account.lastImportOffset) };
  }
  return { status: "overdue", label: daysSince + " days since last upload" };
}

function bankCardFields(account: BankAccount) {
  const reminder = bankReminderView(account);
  const history = account.importHistory || [];
  const last = history[0];
  return {
    id: account.id,
    name: account.bank + ", " + account.label,
    initials: bankInitials(account.bank),
    logo: bankLogoSrc(account.bank),
    sample: !!account.sample,
    lastImportOffset: account.lastImportOffset == null ? null : account.lastImportOffset,
    note: account.sample
      ? "Sample data. Live bank feeds arrive in a later phase."
      : formatMoney(account.openingBalanceMinor, currency, { trimWhole: true }) + " opening as of " + formatDate(account.asOfOffset),
    reminder,
    lastUpload: account.lastImportOffset == null ? "" : formatDate(account.lastImportOffset),
    daysSince: account.lastImportOffset == null ? 0 : 0 - account.lastImportOffset,
    historyOn: history.length > 0,
    importCount: history.length,
    lastImportDate: last ? formatDate(last.importedOffset) : "",
    lastImportedRows: last ? last.rowsImported : 0,
    historyLine: last
      ? history.length + " statements imported · last: " + formatDate(last.importedOffset) + " (" + last.rowsImported + " transactions)"
      : ""
  };
}

export function bankStatementMonthsView() {
  const rows = db().bankAccounts.flatMap(account => (account.importHistory || []).map(record => ({
    id: record.id,
    accountId: account.id,
    name: account.bank + ", " + account.label,
    initials: bankInitials(account.bank),
    logo: bankLogoSrc(account.bank),
    importedOffset: record.importedOffset,
    importedDate: formatDate(record.importedOffset),
    rowsImported: record.rowsImported,
    rowsSkipped: record.rowsSkipped,
    periodOn: record.periodFromOffset != null && record.periodToOffset != null,
    periodFrom: record.periodFromOffset != null ? formatDate(record.periodFromOffset) : "",
    periodTo: record.periodToOffset != null ? formatDate(record.periodToOffset) : "",
    monthKey: monthYearLabel(record.importedOffset)
  })));
  rows.sort((a, b) => (b.importedOffset - a.importedOffset) || String(b.id).localeCompare(String(a.id)));
  const months: { id: string; label: string; rows: typeof rows }[] = [];
  const byMonth = new Map<string, typeof rows>();
  rows.forEach(row => {
    let group = byMonth.get(row.monthKey);
    if (!group) {
      group = [];
      byMonth.set(row.monthKey, group);
      months.push({ id: row.monthKey, label: row.monthKey, rows: group });
    }
    group.push(row);
  });
  return { empty: rows.length === 0, months };
}

export function bankLogoSrc(bank: string): string | null {
  const key = String(bank || "").toLowerCase();
  if (key.includes("ahli")) return "/banks/ahli.png";
  if (key.includes("qatar national") || /\bqnb\b/.test(key)) return "/banks/qnb.png";
  if (key.includes("dukhan")) return "/banks/dukhan.png";
  if (key.includes("doha")) return "/banks/doha.jpg";
  if (key.includes("commercial bank") || /\bcbq\b/.test(key)) return "/banks/cbq.png";
  if (key.includes("international islamic") || /\bqiib\b/.test(key)) return "/banks/qiib.png";
  if (key.includes("qatar islamic") || /\bqib\b/.test(key)) return "/banks/qib.png";
  if (key.includes("rayan") || key.includes("masraf")) return "/banks/alrayan.png";
  return null;
}

export function bankView() {
  const accounts = db().bankAccounts;
  const account = accounts[0];
  const cashOnHand = getCashOnHand();
  const card = account ? bankCardFields(account) : null;
  return {
    name: card ? card.name : "",
    initials: card ? card.initials : bankInitials(""),
    logo: card ? card.logo : null,
    activity: formatMoney(cashOnHand, currency as CurrencyCode),
    activityCaption: "Cash on hand",
    note: card ? card.note : "No bank account is stored.",
    reminder: card ? card.reminder : { status: null, label: "" },
    lastUpload: card ? card.lastUpload : "",
    daysSince: card ? card.daysSince : 0,
    historyOn: card ? card.historyOn : false,
    importCount: card ? card.importCount : 0,
    lastImportDate: card ? card.lastImportDate : "",
    lastImportedRows: card ? card.lastImportedRows : 0,
    historyLine: card ? card.historyLine : "",
    sample: card ? card.sample : false,
    extra: accounts.slice(1).map(bankCardFields)
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
    bankPreview: data.bankPreview,
    qatarBanks: data.qatarBanks,
    banks: data.banks,
    overdueBankCount: data.overdueBankCount,
    statementMonths: data.statementMonths
  };
}

function emailFromName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ".") + "@albidda.qa";
}
