import Link from "next/link";
import { packages } from "@/data/packages";
import { PackageCard } from "@/components/shared/package-card";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function PackagesSection() {
  return (
    <section id="packages" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Packages"
              title="Two clear ways to work with us"
              description="Start with a focused profiling strategy, or go end-to-end with our comprehensive package."
            />
            <Button
              variant="outline"
              className="h-10 shrink-0 rounded-xl"
              render={<Link href="/packages" />}
            >
              Compare packages
            </Button>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-6 md:grid-cols-2">
          {packages.map((pkg) => (
            <StaggerItem key={pkg.slug}>
              <PackageCard pkg={pkg} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
