export type CountryCode = "QA" | "AE";
export type CurrencyCode = "QAR" | "AED";
export type Period = "day" | "week" | "month";
export type TxnSource = "skipcash" | "shopify" | "link" | "bank" | "cash";
export type TxnDirection = "in" | "out";
export type TxnType = "sale" | "refund" | "expense" | "payroll";
export type TxnStatus = "settled" | "pending" | "refunded";
export type InvoiceStatus =
  | "refunded"
  | "paid"
  | "awaiting settlement"
  | "overdue"
  | "viewed"
  | "sent"
  | "draft";

export interface MerchantPlan {
  tier: string;
  monthlyPrice: number;
  txnLimit: number;
}

export interface Merchant {
  businessName: string;
  legalEntity: string;
  crNumber: string;
  taxRegistrationNumber: string | null;
  vatRegistered: boolean;
  country: CountryCode;
  currency: CurrencyCode;
  industry: string;
  address: string;
  ownerName: string;
  accountantName: string;
  plan: MerchantPlan;
  bankName?: string;
  accountName?: string;
  iban?: string;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  monthlySalary: number;
  branchId: string;
}

export interface PayrollRun {
  id: string;
  periodOffset: number;
  employeeIds: string[];
  deductionRate: number;
  status: "paid";
  transactionId: string;
}

export interface Transaction {
  id: string;
  dayOffset: number;
  counterparty: string;
  source: TxnSource;
  direction: TxnDirection;
  type: TxnType;
  tag: string;
  status: TxnStatus;
  amountMinor: number;
  branchId: string;
  invoiceId: string | null;
}

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitMinor: number;
  note?: string;
}

export interface InvoiceAttachment {
  name: string;
  size?: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  amountMinor: number;
  issuedOffset: number;
  dueOffset: number;
  sentAt: number | null;
  viewedAt: number | null;
  branchId: string;
  lines?: InvoiceLine[];
  partialPayment?: boolean;
  discountMinor?: number;
  attachments?: InvoiceAttachment[];
  notes?: string;
  reference?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address?: string;
  branchId: string;
}

export interface MatchProposal {
  id: string;
  transactionId: string;
  invoiceId: string | null;
  confidence: number;
  reason: string;
  status: "open" | "confirmed";
}

export interface BankAccount {
  id: string;
  bank: string;
  label: string;
  currency: CurrencyCode;
  openingBalanceMinor: number;
  asOfOffset: number;
  sample?: boolean;
}

export interface GatewayAccount {
  id: string;
  provider: string;
  label: string;
  status: "live" | "connected";
}

export interface TeamMember {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  lastSeenOffset: number;
}

export interface ActivityLog {
  id: string;
  kind: string;
  dayOffset: number;
  actor: string;
  what: string;
}

export type PaymentLinkStatus =
  | "active"
  | "pending"
  | "paid"
  | "failed"
  | "rejected"
  | "deactivated"
  | "expired";

export type PlanInterval = "Week" | "Month" | "Quarter" | "Year";
export type PlanStatus = "active" | "paused" | "canceled";
export type SubscriberStatus = "active" | "paused" | "canceled";
export type ChargeStatus = "upcoming" | "paid" | "canceled";

export interface CheckoutField {
  label: string;
  kind: string;
  optional?: boolean;
}

export type CheckoutTheme = "light" | "dark";
export type CheckoutCloseMode = "none" | "date";
export type CheckoutAfterPay = "message" | "redirect";
export type CheckoutAmountMode = "fixed" | "open" | "qty";

export interface CheckoutPage {
  id: string;
  slug: string;
  productName: string;
  description: string;
  amountMinor: number;
  amountMode?: CheckoutAmountMode;
  currency: CurrencyCode;
  logoDataUrl: string | null;
  accent: string;
  published: boolean;
  views: number;
  paidCount: number;
  createdOffset: number;
  txnIds: string[];
  supportEmail: string;
  supportPhone: string;
  terms: boolean;
  payLabel: string;
  fields: CheckoutField[];
  theme?: CheckoutTheme;
  closeMode?: CheckoutCloseMode;
  closeLabel?: string;
  afterPay?: CheckoutAfterPay;
  redirectUrl?: string;
  receiptAuto?: boolean;
  receiptCustomer?: boolean;
  receiptRef?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  amountMinor: number;
  interval: PlanInterval;
  description: string;
  customerName: string;
  status: PlanStatus;
  createdOffset: number;
  slug: string;
  signupUrl: string;
}

export interface Subscriber {
  id: string;
  planId: string;
  name: string;
  email: string;
  status: SubscriberStatus;
  createdOffset: number;
  nextChargeOffset: number;
}

export interface UpcomingCharge {
  id: string;
  planId: string;
  subscriberId: string;
  amountMinor: number;
  dayOffset: number;
  status: ChargeStatus;
  txnId: string | null;
}

export interface ShopifyConnection {
  connected: boolean;
  shopDomain: string;
}

export interface SmartCheckoutConfig {
  on: boolean;
  walletDetect: boolean;
  retryOnDecline: boolean;
}

export interface PaymentLinkNote {
  key: string;
  value: string;
}

export interface PaymentLink {
  id: string;
  payUrl: string;
  amountMinor: number;
  description: string;
  clientId: string | null;
  invoiceId: string | null;
  status: PaymentLinkStatus;
  createdOffset: number;
  uses: number;
  expiry: string;
  txnId: string | null;
  customerEmail?: string | null;
  notifyEmail?: boolean;
  customerPhone?: string | null;
  phoneDial?: string;
  notifySms?: boolean;
  referenceId?: string | null;
  partialPayment?: boolean;
  notes?: PaymentLinkNote[];
}

export interface ExportRecord {
  id: string;
  kind: "tally" | "zoho";
  target: string;
  dayOffset: number;
  items: number;
  status: string;
  filename: string | null;
  simulated: boolean;
  errors: number;
}

export type AccessLevel = "full" | "view" | "none";
export type RecurringInterval = "Week" | "Month" | "Quarter";

export interface RecurringInvoice {
  id: string;
  clientId: string;
  amountMinor: number;
  interval: RecurringInterval;
  nextOffset: number;
  endsAfter: number | null;
  sentCount: number;
  status: "active" | "paused" | "canceled";
}

export interface ApprovalRequest {
  id: string;
  memberId: string;
  amountMinor: number;
  what: string;
  dayOffset: number;
  status: "open" | "approved" | "declined";
}

export interface RolePermissionRow {
  area: string;
  owner: AccessLevel;
  accountant: AccessLevel;
  staff: AccessLevel;
}

export interface Seed {
  merchant: Merchant;
  branches: Branch[];
  employees: Employee[];
  payrollRuns: PayrollRun[];
  transactions: Transaction[];
  invoices: Invoice[];
  clients: Client[];
  matchProposals: MatchProposal[];
  paymentLinks: PaymentLink[];
  exportHistory: ExportRecord[];
  checkoutPages: CheckoutPage[];
  subscriptionPlans: SubscriptionPlan[];
  subscribers: Subscriber[];
  upcomingCharges: UpcomingCharge[];
  shopify: ShopifyConnection;
  smartCheckout: SmartCheckoutConfig;
  bankAccounts: BankAccount[];
  gatewayAccounts: GatewayAccount[];
  teamMembers: TeamMember[];
  activityLog: ActivityLog[];
  recurringInvoices: RecurringInvoice[];
  approvalRequests: ApprovalRequest[];
  rolePermissions: RolePermissionRow[];
  approvalLimits: Record<string, number | null>;
}

export interface MoneyTotal {
  amountMinor: number;
  count: number;
}
