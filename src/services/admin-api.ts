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
  if (name) params.set("name", name);
  if (email) params.set("email", email);

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
