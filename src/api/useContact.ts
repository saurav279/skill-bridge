import { api, type ApiResponse } from "@/services/fetchApi";

export type ContactUsPayload = {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
};

export type ContactUsResponse = {
  message: string;
};

export async function submitContactUs(
  payload: ContactUsPayload
): Promise<ApiResponse<ContactUsResponse>> {
  return api.post<ContactUsResponse, ContactUsPayload>(
    "public/contact-us",
    payload
  );
}
