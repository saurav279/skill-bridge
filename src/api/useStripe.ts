import { api, ApiResponse } from "@/services/fetchApi";
import { PackageNameTypes } from "@/types/packages";

export async function createCheckoutSession(
  packageName:  PackageNameTypes,
  successUrl: string,
  cancelUrl: string,
): Promise<ApiResponse<{ url: string }>> {
  return api.post<{ url: string }, { packageName: PackageNameTypes, successUrl?: string, cancelUrl?: string, customerName?: string, customerEmail?: string }>(
    "stripe/checkout",
    { packageName, successUrl, cancelUrl }
  );
}