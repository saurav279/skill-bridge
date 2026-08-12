import { api, type ApiResponse } from "@/services/fetchApi";

export type EmailPreferenceAction = "unsubscribe" | "subscribe";

export type EmailPreferencePayload = {
  email: string;
};

export type EmailPreferenceResponse = {
  message: string;
  action: EmailPreferenceAction;
  email: string;
};

export async function unsubscribeEmail(
  email: string
): Promise<ApiResponse<EmailPreferenceResponse>> {
  return api.post<EmailPreferenceResponse, EmailPreferencePayload>(
    "services/emails/unsubscribe",
    { email }
  );
}

export async function subscribeEmail(
  email: string
): Promise<ApiResponse<EmailPreferenceResponse>> {
  return api.post<EmailPreferenceResponse, EmailPreferencePayload>(
    "services/emails/subscribe",
    { email }
  );
}
