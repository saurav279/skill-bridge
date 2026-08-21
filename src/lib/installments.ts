import { isAfter, isValid, parseISO } from "date-fns";
import { titleCase } from "@/lib/admin-format";
import { addCalendarDays } from "@/lib/uk-date";
import type { InstallmentStatus, PaymentPlanStatus } from "@/types/admin";

export const INSTALLMENT_STATUSES: Array<{
  id: InstallmentStatus;
  label: string;
}> = [
  { id: "upcoming", label: "Upcoming" },
  { id: "due", label: "Due" },
  { id: "link_sent", label: "Link sent" },
  { id: "paid", label: "Paid" },
  { id: "failed", label: "Failed" },
  { id: "overdue", label: "Overdue" },
  { id: "cancelled", label: "Cancelled" },
];

export const PAYMENT_PLAN_STATUSES: Array<{
  id: PaymentPlanStatus;
  label: string;
}> = [
  { id: "on_track", label: "On track" },
  { id: "overdue", label: "Overdue" },
  { id: "complete", label: "Complete" },
  { id: "cancelled", label: "Cancelled" },
];

const INSTALLMENT_TONES: Record<InstallmentStatus, string> = {
  upcoming: "bg-muted text-muted-foreground",
  due: "bg-amber-500/10 text-amber-800 dark:text-amber-400",
  link_sent: "bg-primary/10 text-primary",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  failed: "bg-red-500/10 text-red-700 dark:text-red-400",
  overdue: "bg-red-500/10 text-red-700 dark:text-red-400",
  cancelled: "bg-muted text-muted-foreground",
};

const PLAN_TONES: Record<PaymentPlanStatus, string> = {
  on_track: "bg-primary/10 text-primary",
  overdue: "bg-red-500/10 text-red-700 dark:text-red-400",
  complete: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-muted text-muted-foreground",
};

export function installmentStatusLabel(status: string | null | undefined) {
  if (!status?.trim()) return "No status";
  return (
    INSTALLMENT_STATUSES.find((item) => item.id === status)?.label ??
    titleCase(status)
  );
}

export function installmentStatusTone(status: string | null | undefined) {
  if (!status) return "bg-muted text-muted-foreground";
  return (
    INSTALLMENT_TONES[status as InstallmentStatus] ??
    "bg-muted text-muted-foreground"
  );
}

export function paymentPlanStatusLabel(status: string | null | undefined) {
  if (!status?.trim()) return "No status";
  return (
    PAYMENT_PLAN_STATUSES.find((item) => item.id === status)?.label ??
    titleCase(status)
  );
}

export function paymentPlanStatusTone(status: string | null | undefined) {
  if (!status) return "bg-muted text-muted-foreground";
  return (
    PLAN_TONES[status as PaymentPlanStatus] ?? "bg-muted text-muted-foreground"
  );
}

export function isInstallmentLocked(status: string | null | undefined) {
  return status === "paid" || status === "cancelled";
}

export function isCheckoutExpired(expiresAt: string | null | undefined) {
  if (!expiresAt) return true;
  const expires = parseISO(expiresAt);
  if (!isValid(expires)) return true;
  return !isAfter(expires, new Date());
}

export function splitInstallments(
  totalAmount: number,
  count: number,
  intervalDays: number,
  firstDueAt: string
) {
  const base = Math.floor(totalAmount / count);
  const remainder = totalAmount - base * count;
  return Array.from({ length: count }, (_, index) => ({
    amount: index === count - 1 ? base + remainder : base,
    dueAt: addCalendarDays(firstDueAt, index * intervalDays),
  }));
}

export async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}
