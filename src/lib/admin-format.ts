import {
  AssessmentRoutes,
  AssessmentSections,
} from "@/data/assessment-questionnaire";

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
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: UK_TIME_ZONE,
  }).format(date);
}

export function formatStripeAmount(amount: number, currency: string) {
  const code = currency.toUpperCase();
  const divisor = ZERO_DECIMAL_CURRENCIES.has(code) ? 1 : 100;
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: code,
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
