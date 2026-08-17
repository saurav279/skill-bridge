

import { packages } from "@/data/packages";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { PackageCard } from "../shared/package-card";

type ConversionPackagesProps = {
  showIntro?: boolean;
  limit?: number;
  data?:{
    section_title: string;
    section_description: string;
  }
};

export function ConversionPackages({
  showIntro = true,
  limit,
  data
}: ConversionPackagesProps) {
  const skipPackageSlugs = ["strategy-call", "appeal-diagnosis", "appeal-rebuild", "appeal-full-support"];
  const filteredPackages = packages.filter((pkg) => !skipPackageSlugs.includes(pkg.slug));


  return (
    <section id="packages" className="scroll-mt-28 py-20 md:py-28">
      <div className="container-page">
        {showIntro ? (
          <FadeIn>
            <SectionTitle
              eyebrow="Packages"
              title={data?.section_title || "Choose your package"}
              description={data?.section_description || "From a focused strategy call to bespoke 1-to-1 coaching — pick the support level that matches where you are in the Stage 1 endorsement journey."}
              align="center"
              className="mx-auto"
            />
          </FadeIn>
        ) : null}

        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        
          {filteredPackages.map((pkg) => (
            <StaggerItem key={pkg.slug}>
              <PackageCard pkg={pkg} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
