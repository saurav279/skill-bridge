import { format, isValid, parseISO } from "date-fns";
import {
  AssessmentRoutes,
  AssessmentSections,
} from "@/data/assessment-questionnaire";
import { packages } from "@/data/packages";
import { isIsoDate, parseDateOnly } from "@/lib/uk-date";

const UK_TIME_ZONE = "Europe/London";

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export function formatAdminDate(iso: string) {
  const date = parseISO(iso);
  if (!isValid(date)) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: UK_TIME_ZONE,
  }).format(date);
}

export function formatAdminDay(value: string) {
  if (isIsoDate(value)) {
    const date = parseDateOnly(value);
    if (!isValid(date)) return "—";
    return format(date, "d MMM yyyy");
  }
  return formatAdminDate(value);
}

export function formatStripeAmount(amount: number, currency: string) {
  const code = currency.toUpperCase();
  const divisor = ZERO_DECIMAL_CURRENCIES.has(code) ? 1 : 100;
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount / divisor);
  } catch {
    return `${(amount / divisor).toFixed(2)} ${code}`;
  }
}

export function routeLabel(routeId: string) {
  return (
    AssessmentRoutes.find((route) => route.id === routeId)?.name ?? routeId
  );
}

export function sectionLabel(sectionId: string) {
  return AssessmentSections[sectionId]?.title ?? titleCase(sectionId);
}

export function questionLabel(sectionId: string, questionId: string) {
  const question = AssessmentSections[sectionId]?.questions.find(
    (item) => item.id === questionId
  );
  return question?.title ?? titleCase(questionId);
}

export function formatAnswer(value: string | string[] | undefined) {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return value;
}

export function contactPreferenceLabel(value: string | null) {
  if (!value) return "—";
  if (value === "phone") return "Phone";
  if (value === "google_meet") return "Google Meet";
  return titleCase(value);
}

export function titleCase(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function dash(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

export function packageLabel(slug: string | null | undefined) {
  if (!slug?.trim()) return "—";
  const match = packages.find((pkg) => pkg.slug === slug || pkg.name === slug);
  return match?.name ?? titleCase(slug);
}

export function parseGbpLabelToPence(label: string) {
  const match = label.replace(/,/g, "").match(/£\s*([\d]+(?:\.\d{1,2})?)/);
  if (!match) return null;
  return Math.round(Number(match[1]) * 100);
}

export function penceToPoundsInput(pence: number) {
  return (pence / 100).toFixed(2);
}

export function poundsInputToPence(value: string) {
  const parsed = Number.parseFloat(value.replace(/,/g, "").trim());
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100);
}
