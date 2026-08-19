import { packages } from "@/data/packages";
import { getApiBaseUrl } from "@/services/fetchApi";
import type {
  AdminAssessmentDetail,
  AdminAssessmentListItem,
  AdminContactMessage,
  AdminListQuery,
  AdminListResponse,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminOtpRequest,
  AdminOtpResponse,
  AdminPackagePurchase,
  ApiError,
  CreateLeadRequest,
  CreateNoteRequest,
  CreatePipelineRequest,
  DeleteLeadResponse,
  Lead,
  LeadDetail,
  LeadListItem,
  LeadStatusCounts,
  NoteItem,
  PipelineItem,
  UpdateLeadRequest,
  UpdateNoteRequest,
} from "@/types/admin";

export class AdminUnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminUnauthorizedError";
  }
}

function buildUrl(path: string, query?: AdminListQuery): string {
  const url = `${getApiBaseUrl()}${path}`;
  if (!query) return url;

  const params = new URLSearchParams();
  if (query.page != null) params.set("page", String(query.page));
  if (query.limit != null) params.set("limit", String(query.limit));
  if (query.order) params.set("order", query.order);
  const name = query.name?.trim();
  const email = query.email?.trim();
  const packageName = query.packageName?.trim();
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  if (packageName) params.set("packageName", packages.find((pkg) => pkg.name === packageName)?.slug ?? "");

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit & { query?: AdminListQuery }
): Promise<T> {
  const { query, headers, ...rest } = init ?? {};
  const res = await fetch(buildUrl(path, query), {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  });

  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    throw new AdminUnauthorizedError(
      (json as ApiError).error ?? "Unauthorized"
    );
  }

  if (!res.ok) {
    throw new Error((json as ApiError).error ?? "Request failed");
  }

  return json as T;
}

export function adminLogin(body: AdminLoginRequest) {
  return adminFetch<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function adminVerifyOtp(body: AdminOtpRequest) {
  return adminFetch<AdminOtpResponse>("/admin/otp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listAssessments(query?: AdminListQuery) {
  return adminFetch<AdminListResponse<AdminAssessmentListItem>>(
    "/admin/assessments",
    { query }
  );
}

export function getAssessment(id: string) {
  return adminFetch<AdminAssessmentDetail>(
    `/admin/assessments/${encodeURIComponent(id)}`
  );
}

export function listContactMessages(query?: AdminListQuery) {
  return adminFetch<AdminListResponse<AdminContactMessage>>(
    "/admin/contact_messages",
    { query }
  );
}

export function getContactMessage(id: string) {
  return adminFetch<AdminContactMessage>(
    `/admin/contact_messages/${encodeURIComponent(id)}`
  );
}

export function listPackagePurchases(query?: AdminListQuery) {
  // console.log(query);
  return adminFetch<AdminListResponse<AdminPackagePurchase>>(
    "/admin/package_purchases",
    { query }
  );
}

export function getPackagePurchase(id: string) {
  return adminFetch<AdminPackagePurchase>(
    `/admin/package_purchases/${encodeURIComponent(id)}`
  );
}

export function listLeads(query?: AdminListQuery) {
  return adminFetch<AdminListResponse<LeadListItem>>("/admin/leads", {
    query,
  });
}

export function getLead(id: string) {
  return adminFetch<LeadDetail>(`/admin/leads/${encodeURIComponent(id)}`);
}

export function getLeadStatusCounts() {
  return adminFetch<LeadStatusCounts>("/admin/leads/status");
}

export function createLead(body: CreateLeadRequest) {
  return adminFetch<Lead>("/admin/leads", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateLead(id: string, body: UpdateLeadRequest) {
  return adminFetch<Lead>(`/admin/leads/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteLead(id: string) {
  return adminFetch<DeleteLeadResponse>(
    `/admin/leads/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}

export function createPipeline(body: CreatePipelineRequest) {
  return adminFetch<PipelineItem>("/admin/pipeline", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function createNote(body: CreateNoteRequest) {
  return adminFetch<NoteItem>("/admin/notes", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateNote(id: string, body: UpdateNoteRequest) {
  return adminFetch<NoteItem>(`/admin/notes/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
