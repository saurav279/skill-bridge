import { api, type ApiResponse } from "@/services/fetchApi";
import type {
  AvailableSlotsResponse,
  CreatePackageCheckoutPayload,
  CreatePackageCheckoutResponse,
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

export async function createPackageCheckout(
  payload: CreatePackageCheckoutPayload
): Promise<ApiResponse<CreatePackageCheckoutResponse>> {
  return api.post<
    CreatePackageCheckoutResponse,
    CreatePackageCheckoutPayload
  >("services/calendar/stripe", payload);
}
