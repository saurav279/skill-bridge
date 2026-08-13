import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearBookingDraft } from "@/components/consultation/clear-booking-draft";

export const metadata: Metadata = {
  title: "Payment received",
  description:
    "Your consultation payment was received. A calendar invite will follow shortly.",
};

export default function BookingSuccessPage() {
  return (
    <section className="py-16 md:py-24">
      <ClearBookingDraft />
      <div className="container-page">
        <div
          className="mx-auto max-w-lg rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-soft sm:p-10"
          role="status"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-5" />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
            Payment received
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Thank you. Your consultation is being confirmed — you’ll receive a
            calendar invite shortly. No need to book the slot again from this
            page.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              className="h-11 rounded-xl px-6"
              render={<Link href="/" />}
            >
              Back to home
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl px-6"
              render={<Link href="/contact" />}
            >
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
