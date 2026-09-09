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
}

export interface Client {
  id: string;
  name: string;
  email: string;
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

export type PaymentLinkStatus = "active" | "pending" | "paid" | "failed" | "rejected";

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
  bankAccounts: BankAccount[];
  gatewayAccounts: GatewayAccount[];
  teamMembers: TeamMember[];
  activityLog: ActivityLog[];
}

export interface MoneyTotal {
  amountMinor: number;
  count: number;
}
