import Link from "next/link";
import { Check } from "lucide-react";
import { packages } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { cn } from "@/lib/utils";

type ConversionPackagesProps = {
  showIntro?: boolean;
  limit?: number;
};

export function ConversionPackages({
  showIntro = true,
  limit,
}: ConversionPackagesProps) {
  const list = limit ? packages.slice(0, limit) : packages;

  return (
    <section id="packages" className="scroll-mt-28 py-20 md:py-28">
      <div className="container-page">
        {showIntro ? (
          <FadeIn>
            <SectionTitle
              eyebrow="Packages"
              title="Choose your package"
              description="From self-paced learning to bespoke 1-to-1 coaching — pick the support level that matches where you are in the Stage 1 endorsement journey."
              align="center"
              className="mx-auto"
            />
          </FadeIn>
        ) : null}

        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((pkg) => (
            <StaggerItem key={pkg.slug}>
              <article
                id={pkg.slug}
                className={cn(
                  "relative flex h-full flex-col scroll-mt-32 overflow-hidden rounded-2xl border bg-card shadow-soft",
                  pkg.featured
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/80"
                )}
              >
                <div
                  className={cn(
                    "px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider",
                    pkg.featured
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {pkg.featured ? "Most Popular" : pkg.priceNote?.split("·")[0]?.trim() ?? "Package"}
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {pkg.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{pkg.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary sm:text-4xl">
                      {pkg.priceLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{pkg.priceNote}</p>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {pkg.description}
                  </p>

                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-border/70 pt-5">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Ideal for: </span>
                    {pkg.idealFor}
                  </p>

                  <Button
                    className="mt-6 h-11 w-full rounded-full font-semibold uppercase tracking-wide"
                    variant={pkg.featured ? "default" : "outline"}
                    render={<Link href={`/packages/${pkg.slug}`} />}
                  >
                    Explore
                  </Button>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
