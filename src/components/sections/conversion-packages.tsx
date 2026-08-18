"use client";

import { useState } from "react";
import { packages } from "@/data/packages";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { PackageCard } from "../shared/package-card";
import { defaultCompareSlugs, PackageCompare } from "./package-compare";
import { cn } from "@/lib/utils";

type ConversionPackagesProps = {
  showIntro?: boolean;
  limit?: number;
  data?: {
    section_title: string;
    section_description: string;
  };
};

type ViewMode = "browse" | "compare";

export function ConversionPackages({
  showIntro = true,
  // limit,
  data,
}: ConversionPackagesProps) {
  const skipPackageSlugs = [
    "strategy-call",
    "appeal-diagnosis",
    "appeal-rebuild",
    "appeal-full-support",
  ];
  const filteredPackages = packages.filter(
    (pkg) => !skipPackageSlugs.includes(pkg.slug)
  );

  const defaults = defaultCompareSlugs(filteredPackages);
  const [view, setView] = useState<ViewMode>("browse");
  const [leftSlug, setLeftSlug] = useState(defaults.left);
  const [rightSlug, setRightSlug] = useState(defaults.right);

  function startCompare(slug: string) {
    setView("compare");
    if (slug === leftSlug || slug === rightSlug) return;
    setRightSlug(slug);
  }

  return (
    <section id="packages" className="scroll-mt-28 py-20 md:py-28">
      <div className="container-page">
        {showIntro ? (
          <FadeIn>
            <SectionTitle
              eyebrow="Packages"
              title={data?.section_title || "Choose your package"}
              description={
                data?.section_description ||
                "From a focused strategy call to bespoke 1-to-1 coaching — pick the support level that matches where you are in the Stage 1 endorsement journey."
              }
              align="center"
              className="mx-auto"
            />
          </FadeIn>
        ) : null}

        {filteredPackages.length >= 2 ? (
          <div
            className={cn(
              "flex justify-center",
              showIntro ? "mt-10" : "mt-0"
            )}
          >
            <div
              role="tablist"
              aria-label="Package views"
              className="inline-flex rounded-xl border border-border/80 bg-muted/40 p-1"
            >
              <ViewTab
                selected={view === "browse"}
                onSelect={() => setView("browse")}
              >
                All packages
              </ViewTab>
              <ViewTab
                selected={view === "compare"}
                onSelect={() => setView("compare")}
              >
                Compare
              </ViewTab>
            </div>
          </div>
        ) : null}

        {view === "compare" && filteredPackages.length >= 2 ? (
          <div className="mt-12">
            <PackageCompare
              packages={filteredPackages}
              leftSlug={leftSlug}
              rightSlug={rightSlug}
              onLeftChange={setLeftSlug}
              onRightChange={setRightSlug}
            />
          </div>
        ) : (
          <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <StaggerItem key={pkg.slug}>
                <PackageCard
                  pkg={pkg}
                  onCompare={
                    filteredPackages.length >= 2 ? startCompare : undefined
                  }
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </div>
    </section>
  );
}

function ViewTab({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        selected
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
