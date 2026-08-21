import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Installment cancelled",
  description:
    "Checkout was cancelled. No charge was made for this installment.",
};

export default function InstallmentCancelPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-lg rounded-2xl border border-border/80 bg-card p-8 text-center shadow-soft sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Installment
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Payment cancelled
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            No charge was made. Use the checkout link from your email when you
            are ready to pay this installment.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
