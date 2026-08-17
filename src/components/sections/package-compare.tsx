"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, Check, ChevronDown, Minus, X } from "lucide-react";
import type { ServicePackage } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const DEFAULT_LEFT = "full-review";
const DEFAULT_RIGHT = "bespoke-coaching";

type FeatureValue = boolean | null;

type CompareRow = {
  label: string;
  left: FeatureValue;
  right: FeatureValue;
  differs: boolean;
};

export function defaultCompareSlugs(packages: ServicePackage[]) {
  const slugs = new Set(packages.map((pkg) => pkg.slug));
  const left = slugs.has(DEFAULT_LEFT) ? DEFAULT_LEFT : packages[0]?.slug ?? "";
  const preferredRight = slugs.has(DEFAULT_RIGHT)
    ? DEFAULT_RIGHT
    : (packages.find((pkg) => pkg.slug !== left)?.slug ?? "");
  const right = preferredRight === left ? "" : preferredRight;
  return { left, right };
}

function featureValue(pkg: ServicePackage, label: string): FeatureValue {
  const feature = pkg.features.find((item) => item.label === label);
  if (!feature) return null;
  return feature.included;
}

function buildRows(left: ServicePackage, right: ServicePackage): CompareRow[] {
  const labels: string[] = [];
  const seen = new Set<string>();

  for (const feature of [...left.features, ...right.features]) {
    if (seen.has(feature.label)) continue;
    seen.add(feature.label);
    labels.push(feature.label);
  }

  return labels.map((label) => {
    const leftValue = featureValue(left, label);
    const rightValue = featureValue(right, label);
    return {
      label,
      left: leftValue,
      right: rightValue,
      differs: leftValue !== rightValue,
    };
  });
}

function FeatureMark({ value }: { value: FeatureValue }) {
  if (value === null) {
    return (
      <span className="inline-flex size-6 items-center justify-center text-muted-foreground/40">
        <Minus className="size-4" aria-hidden />
        <span className="sr-only">Not listed</span>
      </span>
    );
  }

  if (value) {
    return (
      <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="size-3.5" aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    );
  }

  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <X className="size-3.5" aria-hidden />
      <span className="sr-only">Not included</span>
    </span>
  );
}

function PackageSelect({
  label,
  value,
  packages,
  onChange,
}: {
  label: string;
  value: string;
  packages: ServicePackage[];
  onChange: (slug: string) => void;
}) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-border/80 bg-card px-4 pr-10 text-sm font-medium shadow-soft outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/20"
        >
          {packages.map((pkg) => (
            <option key={pkg.slug} value={pkg.slug}>
              {pkg.name}
              {pkg.priceLabel ? ` · ${pkg.priceLabel}` : ""}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
    </label>
  );
}

type PackageCompareProps = {
  packages: ServicePackage[];
  leftSlug: string;
  rightSlug: string;
  onLeftChange: (slug: string) => void;
  onRightChange: (slug: string) => void;
};

export function PackageCompare({
  packages,
  leftSlug,
  rightSlug,
  onLeftChange,
  onRightChange,
}: PackageCompareProps) {
  const [diffOnly, setDiffOnly] = useState(false);
  const left = packages.find((pkg) => pkg.slug === leftSlug);
  const right = packages.find((pkg) => pkg.slug === rightSlug);

  if (!left || !right) return null;

  const rows = buildRows(left, right);
  const visibleRows = diffOnly ? rows.filter((row) => row.differs) : rows;

  function handleLeftChange(slug: string) {
    if (slug === rightSlug) onRightChange(leftSlug);
    onLeftChange(slug);
  }

  function handleRightChange(slug: string) {
    if (slug === leftSlug) onLeftChange(rightSlug);
    onRightChange(slug);
  }

  function swap() {
    onLeftChange(rightSlug);
    onRightChange(leftSlug);
  }

  return (
    <div id="compare" className="scroll-mt-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <PackageSelect
          label="Package A"
          value={leftSlug}
          packages={packages}
          onChange={handleLeftChange}
        />
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="mx-auto hidden shrink-0 rounded-xl sm:inline-flex"
          aria-label="Swap packages"
          onClick={swap}
        >
          <ArrowLeftRight />
        </Button>
        <PackageSelect
          label="Package B"
          value={rightSlug}
          packages={packages}
          onChange={handleRightChange}
        />
      </div>

      <div className="mt-4 flex justify-end sm:hidden">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
          onClick={swap}
        >
          <ArrowLeftRight />
          Swap
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-8">
          <p className="text-sm text-muted-foreground">
            {diffOnly
              ? `${visibleRows.length} difference${visibleRows.length === 1 ? "" : "s"}`
              : `${rows.length} inclusions compared`}
          </p>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
            <Checkbox
              checked={diffOnly}
              onCheckedChange={(checked) => setDiffOnly(checked === true)}
            />
            Differences only
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <caption className="sr-only">
              Comparison of {left.name} and {right.name}
            </caption>
            <thead>
              <tr className="border-b border-border/70">
                <th className="w-[36%] px-5 py-5 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:px-8" />
                <th
                  className={cn(
                    "w-[32%] px-4 py-5 align-bottom sm:px-6",
                    left.featured && "bg-primary/5"
                  )}
                  scope="col"
                >
                  <PackageHeader pkg={left} />
                </th>
                <th
                  className={cn(
                    "w-[32%] px-4 py-5 align-bottom sm:px-6",
                    right.featured && "bg-primary/5"
                  )}
                  scope="col"
                >
                  <PackageHeader pkg={right} />
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-8"
                  >
                    These packages list the same inclusions.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr
                    key={row.label}
                    className={cn(
                      "border-b border-border/60 last:border-b-0",
                      row.differs && "bg-muted/40"
                    )}
                  >
                    <th
                      scope="row"
                      className="px-5 py-3.5 text-sm font-medium leading-relaxed text-foreground/90 sm:px-8"
                    >
                      {row.label}
                    </th>
                    <td
                      className={cn(
                        "px-4 py-3.5 sm:px-6",
                        left.featured && "bg-primary/5"
                      )}
                    >
                      <FeatureMark value={row.left} />
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3.5 sm:px-6",
                        right.featured && "bg-primary/5"
                      )}
                    >
                      <FeatureMark value={row.right} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-border/70">
                <td className="px-5 py-5 sm:px-8" />
                <td
                  className={cn(
                    "px-4 py-5 sm:px-6",
                    left.featured && "bg-primary/5"
                  )}
                >
                  <PackageCta pkg={left} />
                </td>
                <td
                  className={cn(
                    "px-4 py-5 sm:px-6",
                    right.featured && "bg-primary/5"
                  )}
                >
                  <PackageCta pkg={right} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {(left.idealFor || right.idealFor) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <IdealFor pkg={left} />
          <IdealFor pkg={right} />
        </div>
      )}
    </div>
  );
}

function PackageHeader({ pkg }: { pkg: ServicePackage }) {
  return (
    <div>
      {pkg.featured ? (
        <span className="mb-2 inline-flex rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
          Recommended
        </span>
      ) : null}
      <p className="text-lg font-semibold tracking-tight text-foreground">
        {pkg.name}
      </p>
      {pkg.priceLabel ? (
        <p className="mt-1 text-sm font-medium text-foreground">{pkg.priceLabel}</p>
      ) : null}
      {pkg.priceNote ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{pkg.priceNote}</p>
      ) : null}
    </div>
  );
}

function PackageCta({ pkg }: { pkg: ServicePackage }) {
  if (!pkg.ctaHref) return null;

  return (
    <Button
      className="h-11 w-full rounded-xl"
      render={<Link href={pkg.ctaHref} />}
    >
      {pkg.ctaLabel}
    </Button>
  );
}

function IdealFor({ pkg }: { pkg: ServicePackage }) {
  if (!pkg.idealFor) return null;

  return (
    <p className="rounded-xl border border-border/70 bg-muted/30 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">{pkg.name} — ideal for: </span>
      {pkg.idealFor}
    </p>
  );
}
