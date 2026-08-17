import type { Metadata } from "next";
import { PurchaseDetailView } from "@/components/admin/purchase-views";

export const metadata: Metadata = {
  title: "Purchase",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminPurchaseDetailPage({ params }: Props) {
  const { id } = await params;
  return <PurchaseDetailView id={id} />;
}
