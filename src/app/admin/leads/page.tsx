import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { LeadsView } from "@/components/admin/lead-views";

export const metadata: Metadata = {
  title: "Leads",
};

export default function AdminLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LeadsView />
    </Suspense>
  );
}
