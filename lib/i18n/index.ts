import enChrome from "../../locales/en/chrome.json" with { type: "json" };
import enSettings from "../../locales/en/settings.json" with { type: "json" };
import enOverview from "../../locales/en/overview.json" with { type: "json" };
import enPages from "../../locales/en/pages.json" with { type: "json" };
import enUi from "../../locales/en/ui.json" with { type: "json" };
import arChrome from "../../locales/ar/chrome.json" with { type: "json" };
import arSettings from "../../locales/ar/settings.json" with { type: "json" };
import arOverview from "../../locales/ar/overview.json" with { type: "json" };
import arPages from "../../locales/ar/pages.json" with { type: "json" };
import arUi from "../../locales/ar/ui.json" with { type: "json" };

export type LocaleCode = "en" | "ar";

export type LocaleInfo = {
  code: LocaleCode;
  dir: "ltr";
  native: string;
  english: string;
};

type Catalog = Record<string, unknown>;
type Pack = { chrome: Catalog; settings: Catalog; overview: Catalog; pages: Catalog; ui: Catalog };

const PACKS: Record<LocaleCode, Pack> = {
  en: { chrome: enChrome, settings: enSettings, overview: enOverview, pages: enPages, ui: enUi },
  ar: { chrome: arChrome, settings: arSettings, overview: arOverview, pages: arPages, ui: arUi }
};

export const LOCALES: LocaleInfo[] = [
  { code: "en", dir: "ltr", native: "English", english: "English" },
  { code: "ar", dir: "ltr", native: "العربية", english: "Arabic" }
];

const ENABLED: readonly LocaleCode[] = ["en", "ar"];
const STORAGE_KEY = "flow-locale";
const EASTERN_ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Languages that swap 0-9 glyphs on displayed amounts, counts, and dates. */
export function localeUsesNativeDigits(locale: string | null | undefined): boolean {
  return locale === "ar";
}

const AR_WORDS: [RegExp, string][] = [
  [/\bJanuary\b/g, "يناير"], [/\bFebruary\b/g, "فبراير"], [/\bMarch\b/g, "مارس"],
  [/\bApril\b/g, "أبريل"], [/\bMay\b/g, "مايو"], [/\bJune\b/g, "يونيو"],
  [/\bJuly\b/g, "يوليو"], [/\bAugust\b/g, "أغسطس"], [/\bSeptember\b/g, "سبتمبر"],
  [/\bOctober\b/g, "أكتوبر"], [/\bNovember\b/g, "نوفمبر"], [/\bDecember\b/g, "ديسمبر"],
  [/\bSept\b/g, "سبتمبر"], [/\bJan\b/g, "يناير"], [/\bFeb\b/g, "فبراير"],
  [/\bMar\b/g, "مارس"], [/\bApr\b/g, "أبريل"], [/\bJun\b/g, "يونيو"],
  [/\bJul\b/g, "يوليو"], [/\bAug\b/g, "أغسطس"], [/\bSep\b/g, "سبتمبر"],
  [/\bOct\b/g, "أكتوبر"], [/\bNov\b/g, "نوفمبر"], [/\bDec\b/g, "ديسمبر"],
  [/\bMonday\b/g, "الاثنين"], [/\bTuesday\b/g, "الثلاثاء"], [/\bWednesday\b/g, "الأربعاء"],
  [/\bThursday\b/g, "الخميس"], [/\bFriday\b/g, "الجمعة"], [/\bSaturday\b/g, "السبت"],
  [/\bSunday\b/g, "الأحد"],
  [/\bMon\b/g, "الإثنين"], [/\bTue\b/g, "الثلاثاء"], [/\bWed\b/g, "الأربعاء"],
  [/\bThu\b/g, "الخميس"], [/\bFri\b/g, "الجمعة"], [/\bSat\b/g, "السبت"], [/\bSun\b/g, "الأحد"],
  [/ vs yesterday/g, " مقابل أمس"], [/ vs last week/g, " مقابل الأسبوع الماضي"],
  [/ vs last month/g, " مقابل الشهر الماضي"],
  [/pending settlement/g, "بانتظار التسوية"],
  [/transactions used/g, "معاملة مستخدمة"],
  [/No invoice/g, "لا فاتورة"],
  [/Exact amount and reference match, one day apart\./g, "مطابقة المبلغ والمرجع تماماً، بفارق يوم."],
  [/Refund of a paid invoice for the same client and amount\./g, "استرداد لفاتورة مدفوعة لنفس العميل والمبلغ."],
  [/Payment link reference (.+?) has no matching invoice\. Log as a direct sale\?/g, "مرجع رابط الدفع $1 بلا فاتورة مطابقة. هل تسجّله كبيع مباشر؟"],
  [/Payment link reference (.+?) matches (.+?) for (.+?)\./g, "مرجع رابط الدفع $1 يطابق $2 لـ $3."],
  [/Payment link amount matches (.+?) for (.+?)\./g, "مبلغ رابط الدفع يطابق $1 لـ $2."],
  [/Payment link with no matching invoice\. Log as a direct sale\?/g, "رابط دفع بلا فاتورة مطابقة. هل تسجّله كبيع مباشر؟"],
  [/Hosted checkout payment for /g, "دفعة صفحة دفع لـ "],
  [/Amount, reference and date all lined up, so Flow matched this on its own\./g, "المبلغ والمرجع والتاريخ متوافقة، فطابقها فلو تلقائياً."],
  [/Simulated billing for /g, "فوترة تجريبية لـ "],
  [/Matched from the ledger/g, "مطابقة من الدفتر"],
  [/\bJust now\b/g, "الآن"],
  [/\bBank transfer\b/g, "تحويل بنكي"],
  [/ days late/g, " أيام تأخير"],
  [/On time/g, "في الموعد"],
  [/ views · /g, " مشاهدة · "],
  [/ paid · /g, " مدفوعة · "],
  [/ opening as of /g, " افتتاحاً في "]
];

/** Map ASCII digits to the locale's glyphs. Leaves QR, separators, and letters alone.
 *  Wrap in an LTR isolate so Eastern digits cannot reverse "QR" or the rest of the slot. */
export function localizeDigits(text: string | number, locale: string | null | undefined): string {
  const raw = String(text);
  if (!localeUsesNativeDigits(locale)) return raw;
  if (!/[0-9]/.test(raw)) return raw;
  const converted = raw.replace(/[0-9]/g, digit => EASTERN_ARABIC_DIGITS[Number(digit)]);
  return "\u2066" + converted + "\u2069";
}

/** Translate leftover English date/trend fragments, then localize digits. */
export function localizeDisplay(text: string | number, locale: string | null | undefined): string {
  let raw = String(text ?? "");
  if (locale === "ar") {
    for (let i = 0; i < AR_WORDS.length; i++) raw = raw.replace(AR_WORDS[i][0], AR_WORDS[i][1]);
  }
  return localizeDigits(raw, locale);
}

export function isLocaleCode(value: string | null | undefined): value is LocaleCode {
  return value === "en" || value === "ar";
}

/** Layout never mirrors. Always LTR slots, including Arabic and (later) Urdu. */
export function isRtlLocale(_locale?: string | null): boolean {
  return false;
}

export function readStoredLocale(): LocaleCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (isLocaleCode(raw) && ENABLED.indexOf(raw) >= 0) return raw;
  } catch {
    /* demo: storage may be blocked */
  }
  return "en";
}

export function storeLocale(locale: LocaleCode) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* demo: storage may be blocked */
  }
}

export function applyLocaleDir(locale: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale || "en";
  document.documentElement.dir = "ltr";
  document.documentElement.style.direction = "ltr";
  if (document.body) {
    document.body.dir = "ltr";
    document.body.style.direction = "ltr";
  }
}

function lookup(dict: unknown, key: string): string | undefined {
  let cur: unknown = dict;
  for (const part of key.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Catalog)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => (
    vars[name] == null ? "" : String(vars[name])
  ));
}

function pluralSuffix(locale: string, count: number): string {
  if (locale === "ar") {
    if (count === 0) return "_zero";
    if (count === 1) return "_one";
    if (count === 2) return "_two";
    if (count >= 3 && count <= 10) return "_few";
    return "_other";
  }
  return count === 1 ? "_one" : "_other";
}

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

/** Canonical `pages.status.*` key for a stored or already-translated status label. */
export function statusLookupKey(status: string): string {
  const slug = String(status || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return slug ? "pages.status." + slug : "";
}

/** Resolve a status to the translated word. Never returns a leaked `pages.status.*` key. */
export function translateStatus(t: TranslateFn, status: string | null | undefined): string {
  const raw = String(status || "");
  if (!raw) return "";
  if (raw.indexOf("pages.status.") === 0) return translateStatus(t, raw.slice("pages.status.".length));
  const key = statusLookupKey(raw);
  if (!key) return raw;
  const out = t(key);
  return out === key ? raw : out;
}

export function createTranslator(locale: string): TranslateFn {
  const code: LocaleCode = isLocaleCode(locale) ? locale : "en";
  const pack = PACKS[code] || PACKS.en;
  const fallback = PACKS.en;
  return function t(key: string, vars?: Record<string, string | number>) {
    let found: string | undefined;
    if (vars && typeof vars.count === "number") {
      const pluralKey = key + pluralSuffix(code, vars.count);
      found = lookup(pack, pluralKey) || lookup(fallback, pluralKey);
    }
    if (found == null) found = lookup(pack, key) || lookup(fallback, key);
    if (found == null) return key;
    return localizeDigits(interpolate(found, vars), code);
  };
}

export function enabledLocales(): LocaleInfo[] {
  return LOCALES.filter(item => ENABLED.indexOf(item.code) >= 0);
}
