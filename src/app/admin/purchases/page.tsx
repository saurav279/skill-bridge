import type { Metadata } from "next";
import { PurchasesView } from "@/components/admin/purchase-views";

export const metadata: Metadata = {
  title: "Purchases",
};

export default function AdminPurchasesPage() {
  return <PurchasesView />;
}
