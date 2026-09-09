import { formatMoney } from "./format";
import type { CurrencyCode } from "./data/types";

// Values and tick amounts remain in minor units until the view adapter.
export function chartScale(values: number[], currency: CurrencyCode) {
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values);
  const padding = Math.max(1, Math.ceil((high - low) * 0.1));
  const min = low - padding;
  const max = high + padding;
  // Round tick intervals for readability, never the data-driven bounds.
  const targetStep = (max - min) / 5;
  const magnitude = 10 ** Math.floor(Math.log10(targetStep));
  const step = Math.max(1, Math.ceil(([1, 2, 5, 10].find(n => n * magnitude >= targetStep) ?? 10) * magnitude));
  const ticks = [];
  for (let value = Math.ceil(min / step) * step; value <= max; value += step) {
    ticks.push({ value, label: formatMoney(value, currency, { trimWhole: true }) });
  }
  return { min, max, ticks };
}
