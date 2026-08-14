import Link from "next/link";
import { Check, X } from "lucide-react";
import type { ServicePackage } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PackageNameTypes } from "@/types/packages";
import { PurchaseButton } from "./purchase-btn";
import { BadgeText } from "./badge";

type PackageCardProps = {
  pkg: ServicePackage;
  className?: string;
};

export function PackageCard({ pkg, className }: PackageCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated sm:p-8",
        pkg.featured
          ? "border-primary/40 ring-1 ring-primary/20"
          : "border-border/80",
        className
      )}
    >
      {pkg.featured ? (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Recommended
        </span>
      ) : null}

      {/* <p className="font-mono text-xs uppercase tracking-wider text-primary">
        {pkg.tagline}sss
      </p> */}
      <BadgeText text={pkg.tagline} />
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{pkg.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {pkg.description}
      </p>

      {(pkg.priceLabel || pkg.priceNote) && (
        <div className="mt-5 border-y border-border/70 py-4">
          {pkg.priceLabel ? (
            <p className="text-lg font-semibold text-foreground">
              {pkg.priceLabel}
            </p>
          ) : null}
          {pkg.priceNote ? (
            <p className="mt-1 text-xs text-muted-foreground">{pkg.priceNote}</p>
          ) : null}
        </div>
      )}

      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((feature) => (
          <li
            key={`${feature.included ? "in" : "ex"}-${feature.label}`}
            className="flex gap-3 text-sm text-muted-foreground"
          >
            <span
              className={cn(
                "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full",
                feature.included
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {feature.included ? (
                <Check className="size-3" aria-hidden />
              ) : (
                <X className="size-3" aria-hidden />
              )}
            </span>
            <span
              className={cn(
                "leading-relaxed",
                feature.included
                  ? "text-foreground/90"
                  : "text-muted-foreground"
              )}
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

   { pkg.idealFor && <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Ideal for: </span>
        {pkg.idealFor}
      </p>}
      <div className="mt-6 flex flex-col gap-2">
        {pkg.ctaHref ? (
          <Button
            className="h-11 w-full rounded-xl"
            render={<Link href={pkg.ctaHref} />}
          >
            {pkg.ctaLabel}
          </Button>
        ) : (
          <PurchaseButton packageName={pkg.slug as PackageNameTypes} />
        )}
      </div>
    </article>
  );
}
