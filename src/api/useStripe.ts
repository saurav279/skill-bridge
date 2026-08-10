import { api, ApiResponse } from "@/services/fetchApi";
import { PackageName } from "@/types/packages";

export async function createCheckoutSession(
  packageName:  PackageName,
  successUrl: string,
  cancelUrl: string,
  customerName: string = "Test User",
  customerEmail: string = "test@example.com",
): Promise<ApiResponse<{ url: string }>> {
  return api.post<{ url: string }, { packageName: PackageName, successUrl?: string, cancelUrl?: string, customerName?: string, customerEmail?: string }>(
    "stripe/checkout",
    { packageName, successUrl, cancelUrl, customerName, customerEmail }
  );
}