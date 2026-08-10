import { api, type ApiResponse } from "@/services/fetchApi";
import type {
  AssessPayload,
  EligibilityAssessment,
} from "@/types";

export async function createAssessment(
  payload: AssessPayload
): Promise<ApiResponse<EligibilityAssessment>> {
  return api.post<EligibilityAssessment, AssessPayload>("assessments", payload);
}

export async function getAssessment(
  id: string
): Promise<ApiResponse<EligibilityAssessment>> {
  return api.get<EligibilityAssessment>(`assessments/${id}`);
}

export async function emailAssessment(
  id: string,
  email?: string
): Promise<ApiResponse<{ message?: string }>> {
  return api.post<{ message?: string }, { email?: string }>(
    `assessments/${id}/email`,
    { email }
  );
}

/** Local Next.js PDF generation (pdf-lib) — not the Node backend */
export async function downloadAssessmentPdf(
  id: string
): Promise<ApiResponse<Blob>> {
  try {
    const response = await fetch(`/api/eligibility/${id}/pdf`, {
      method: "POST",
      headers: { Accept: "application/pdf" },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const error =
        data && typeof data === "object" && "error" in data
          ? String((data as { error: unknown }).error)
          : `Request failed with status ${response.status}.`;

      return { success: false, data: null, error };
    }

    return {
      success: true,
      data: await response.blob(),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Something went wrong.",
    };
  }
}
