import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPackage } from "@/data/packages";

type PageProps = {
  searchParams: Promise<{ package?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { package: packageName } = await searchParams;
  const pkg = packageName ? getPackage(packageName) : undefined;
  if (!pkg) {
    return {
      title: "Payment cancelled",
      description:
        "Your checkout was cancelled. You can pick a time and try again.",
    };
  }
  return {
    title: `${pkg.name} payment cancelled`,
    description: pkg.description,
  };
}

export default async function PackageBookingCancelPage({
  searchParams,
}: PageProps) {
  const { package: packageName } = await searchParams;
  const pkg = packageName ? getPackage(packageName) : undefined;
  const href = pkg ? `/packages/${pkg.slug}` : "/packages";

  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-lg rounded-2xl border border-border/80 bg-card p-8 text-center shadow-soft sm:p-10">
          {pkg ? (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                {pkg.tagline}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {pkg.name} payment cancelled
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {pkg.description}
              </p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                No charge was made. Return to {pkg.name} to pick a time and
                complete checkout when you’re ready.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Payment cancelled
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                No charge was made. You can return to packages, pick a time,
                and pay when you’re ready.
              </p>
            </>
          )}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              className="h-11 rounded-xl px-6 w-full"
              render={<Link href={href} />}
            >
              {pkg ? `Return to ${pkg.name}` : "Browse packages"}
            </Button>
            {/* <Button
              variant="outline"
              className="h-11 rounded-xl px-6"
              render={<Link href="/" />}
            >
              Back to home
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
