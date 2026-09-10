export class Component {
  props: Record<string, unknown>;
  state: Record<string, unknown>;
  onState: ((state: unknown) => void) | null;
  setState(update: unknown): void;
  applyStore(extra?: Record<string, unknown>): void;
  renderVals(): Record<string, any>;
  pageSlug(st?: unknown): string;
  startExtract(ref: string): void;
  submitModal(): void;
  publishCheckout(): void;
  runTallyExport(): void;
  runZohoSync(): void;
  periodOf(): { label?: string; [key: string]: unknown };
  reportsPeriod(): { label?: string; [key: string]: unknown };
  chart(): { marker: { y: string | number } };
  sortedTxns(): Array<{ party?: string; offset?: number; id?: string }>;
}
