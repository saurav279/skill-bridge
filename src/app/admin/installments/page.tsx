import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { InstallmentsView } from "@/components/admin/installment-views";

export const metadata: Metadata = {
  title: "Installments",
};

export default function AdminInstallmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <InstallmentsView />
    </Suspense>
  );
}
