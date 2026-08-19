import { titleCase } from "@/lib/admin-format";

export const LEAD_STATUSES = [
  { id: "New", label: "New" },
  { id: "Contacted", label: "Contacted" },
  { id: "Response Pending", label: "Response Pending" },
  { id: "Qualified", label: "Qualified" },
  { id: "Consultation Scheduled", label: "Consultation Scheduled" },
  { id: "Consultation Completed", label: "Consultation Completed" },
  { id: "Follow-up Required", label: "Follow-up Required" },
  { id: "Proposal Sent", label: "Proposal Sent" },
  { id: "Negotiation", label: "Negotiation" },
  { id: "Won", label: "Won" },
  { id: "Lost", label: "Lost" },
  { id: "Not Interested", label: "Not Interested" },
] as const;

export type LeadStatusId = (typeof LEAD_STATUSES)[number]["id"];

const STATUS_TONES: Record<string, string> = {
  new: "bg-muted text-muted-foreground",
  contacted: "bg-primary/10 text-primary",
  qualified: "bg-primary/10 text-primary",
  consultation_booked: "bg-primary/10 text-primary",
  proposal_sent: "bg-amber-500/10 text-amber-800 dark:text-amber-400",
  won: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  lost: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function leadStatusLabel(status: string | null | undefined) {
  if (!status?.trim()) return "No status";
  return (
    LEAD_STATUSES.find((item) => item.id === status)?.label ?? titleCase(status)
  );
}

export function leadStatusTone(status: string | null | undefined) {
  if (!status) return "bg-muted text-muted-foreground";
  return STATUS_TONES[status] ?? "bg-muted text-muted-foreground";
}

export function leadStatusOptions(current?: string | null) {
  if (!current || LEAD_STATUSES.some((item) => item.id === current)) {
    return [...LEAD_STATUSES];
  }
  return [...LEAD_STATUSES, { id: current, label: titleCase(current) }];
}

export const LEAD_PRIORITIES = [
  { id: "High", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "Low", label: "Low" },
] as const;

export const CLEAR_PRIORITY_VALUE = "__clear__";

const PRIORITY_TONES: Record<string, string> = {
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
  medium: "bg-amber-500/10 text-amber-800 dark:text-amber-400",
  low: "bg-muted text-muted-foreground",
};

export function leadPriorityLabel(priority: string | null | undefined) {
  if (!priority?.trim()) return "No priority";
  return (
    LEAD_PRIORITIES.find((item) => item.id === priority.toLowerCase())?.label ??
    titleCase(priority)
  );
}

export function leadPriorityTone(priority: string | null | undefined) {
  if (!priority) return "bg-muted text-muted-foreground";
  return PRIORITY_TONES[priority.toLowerCase()] ?? "bg-muted text-muted-foreground";
}

export function leadPriorityOptions(current?: string | null) {
  if (
    !current ||
    LEAD_PRIORITIES.some((item) => item.id === current.toLowerCase())
  ) {
    return [...LEAD_PRIORITIES];
  }
  return [...LEAD_PRIORITIES, { id: current, label: titleCase(current) }];
}

export function parsePriorityValue(value: string | null | undefined) {
  if (!value || value === CLEAR_PRIORITY_VALUE) return null;
  return value;
}
