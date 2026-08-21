import type { Metadata } from "next";
import { PaymentPlansView } from "@/components/admin/payment-plan-views";

export const metadata: Metadata = {
  title: "Payment plans",
};

export default function AdminPaymentPlansPage() {
  return <PaymentPlansView />;
}
