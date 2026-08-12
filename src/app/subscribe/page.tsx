import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SubscribeView } from "@/components/shared/subscribe-view";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Subscribe to Skill Bridge emails.",
  robots: { index: false, follow: false },
};

function SubscribeFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div
        className="flex flex-col items-center gap-3 text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm">Loading…</p>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<SubscribeFallback />}>
      <SubscribeView />
    </Suspense>
  );
}
