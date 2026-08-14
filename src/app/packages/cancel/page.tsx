import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPackage } from "@/data/packages";

export const metadata: Metadata = {
  title: "Payment cancelled",
  description: "Your checkout was cancelled. You can pick a time and try again.",
};

type PageProps = {
  searchParams: Promise<{ package?: string }>;
};

export default async function PackageBookingCancelPage({ searchParams }: PageProps) {
  const { package: packageName } = await searchParams;
  const pkg = packageName ? getPackage(packageName) : undefined;
  const href = pkg ? `/packages/${pkg.slug}` : "/packages";

  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-lg rounded-2xl border border-border/80 bg-card p-8 text-center shadow-soft sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Payment cancelled
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            No charge was made. You can return to the package page, pick a time,
            and pay when you’re ready.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              className="h-11 rounded-xl px-6"
              render={<Link href={href} />}
            >
              Choose a time again
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl px-6"
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
