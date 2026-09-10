import type { CountryCode } from "../data/types";

export const GCC_DIALS = [
  { code: "QA", dial: "+974", label: "QA +974" },
  { code: "AE", dial: "+971", label: "AE +971" },
  { code: "SA", dial: "+966", label: "SA +966" },
  { code: "KW", dial: "+965", label: "KW +965" },
  { code: "BH", dial: "+973", label: "BH +973" },
  { code: "OM", dial: "+968", label: "OM +968" }
] as const;

export function defaultDial(country: CountryCode): string {
  return country === "AE" ? "+971" : "+974";
}

export function fullPhone(dial: string, local: string): string {
  const digits = String(local || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  return (dial || "+974") + " " + digits;
}
