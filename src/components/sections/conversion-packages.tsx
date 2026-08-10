
import { Check } from "lucide-react";
import { packages } from "@/data/packages";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { cn } from "@/lib/utils";
import { PackageName } from "@/types/packages";
import { PurchaseButton } from "../shared/purchase-btn";
import { PackageCard } from "../shared/package-card";

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
