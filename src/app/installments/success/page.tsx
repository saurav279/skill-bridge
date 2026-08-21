import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Installment received",
  description:
    "Thank you. Your installment payment is being confirmed.",
};

export default function InstallmentSuccessPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div
          className="mx-auto max-w-lg rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-soft sm:p-10"
          role="status"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-5" />
          </div>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Installment
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Payment received
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Thank you. Your installment is being confirmed — you do not need to
            pay this one again. We’ll email you when the next installment is due.
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              className="h-11 w-full rounded-xl px-6"
              render={<Link href="/" />}
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
