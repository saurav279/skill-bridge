import { api, type ApiResponse } from "@/services/fetchApi";
import type {
  AvailableSlotsResponse,
  CreateConsultationCheckoutPayload,
  CreateConsultationCheckoutResponse,
  CreateFreeConsultationCheckoutPayload,
  CreateFreeConsultationCheckoutResponse,
} from "@/types/consultation";

export async function getAvailableSlots(params: {
  date: string;
  duration: number;
}): Promise<ApiResponse<AvailableSlotsResponse>> {
  return api.get<AvailableSlotsResponse>("services/calendar/available-slots", {
    params: {
      date: params.date,
      difference: params.duration,
    },
  });
}

export async function createConsultationCheckout(
  payload: CreateConsultationCheckoutPayload
): Promise<ApiResponse<CreateConsultationCheckoutResponse>> {
  return api.post<
    CreateConsultationCheckoutResponse,
    CreateConsultationCheckoutPayload
  >("services/calendar/stripe", payload);
}



export async function createFreeConsultationCheckout(
  payload: CreateFreeConsultationCheckoutPayload
): Promise<ApiResponse<CreateFreeConsultationCheckoutResponse>> {
  return api.post<
    CreateFreeConsultationCheckoutResponse,
    CreateFreeConsultationCheckoutPayload
  >("services/calendar/free", payload);
}