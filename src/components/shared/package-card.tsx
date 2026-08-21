import Link from "next/link";
import { Check, Info, X } from "lucide-react";
import type { PackageInstallmentPlan, ServicePackage } from "@/types";
import { formatPackagePrice } from "@/lib/format-package-price";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { BadgeText } from "./badge";

type PackageCardProps = {
  pkg: ServicePackage;
  className?: string;
  onCompare?: (slug: string) => void;
};

function InstallmentHint({ plan }: { plan: PackageInstallmentPlan }) {
  const first = plan.payments[0];
  if (!first) return null;

  return (
    <div className="flex items-start gap-1.5">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{plan.label}</p>
        <p className="text-xs text-muted-foreground/80">
          First {formatPackagePrice(first.amount, plan.currency)} · {first.due}
        </p>
      </div>
      <Tooltip>
        <TooltipTrigger
          className="mt-0.5 inline-flex shrink-0 text-muted-foreground transition-colors hover:text-primary"
          aria-label="View payment schedule"
        >
          <Info className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-0" side="top">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-background/20">
                <th className="px-3 py-2 font-medium">Due</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">You get</th>
              </tr>
            </thead>
            <tbody>
              {plan.payments.map((payment) => (
                <tr
                  key={`${payment.due}-${payment.amount}`}
                  className="border-b border-background/10 last:border-0"
                >
                  <td className="whitespace-nowrap px-3 py-2 align-top">
                    {payment.due}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 align-top tabular-nums">
                    {formatPackagePrice(payment.amount, plan.currency)}
                  </td>
                  <td className="max-w-[14rem] px-3 py-2 align-top leading-snug">
                    {payment.achievement}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function PackageCard({ pkg, className, onCompare }: PackageCardProps) {
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

      {(pkg.priceLabel || pkg.installments) ? (
        <div className="mt-5 space-y-1.5 border-y border-border/70 py-4">
          {pkg.priceLabel ? (
            <p className="text-lg font-semibold text-foreground">
              {pkg.priceLabel}
            </p>
          ) : null}
          {pkg.installments ? (
            <InstallmentHint plan={pkg.installments} />
          ) : null}
        </div>
      ) : null}

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
        {pkg.ctaHref && (
          <Button
            className="h-11 w-full rounded-xl"
            render={<Link href={pkg.ctaHref} />}
          >
            {pkg.ctaLabel}
          </Button>
        )}
        {onCompare ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={() => onCompare(pkg.slug)}
          >
            Compare
          </Button>
        ) : null}
      </div>
    </article>
  );
}
