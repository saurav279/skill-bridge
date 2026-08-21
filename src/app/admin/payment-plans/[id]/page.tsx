import type { Metadata } from "next";
import { PaymentPlanDetailView } from "@/components/admin/payment-plan-views";

export const metadata: Metadata = {
  title: "Payment plan",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminPaymentPlanDetailPage({ params }: Props) {
  const { id } = await params;
  return <PaymentPlanDetailView id={id} />;
}
