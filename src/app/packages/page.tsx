import type { Metadata } from "next";
import { packages } from "@/data/packages";
import { PackageCard } from "@/components/shared/package-card";
import { SectionTitle } from "@/components/shared/section-title";
import { FinalCTA } from "@/components/shared/final-cta";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Choose Profiling Strategy or our Comprehensive Package — evidence-driven Global Talent Visa consultancy from Skill Bridge.",
};

export default function PackagesPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="Packages"
              title="Profiling Strategy & Comprehensive Package"
              description="Select the engagement that matches where you are — a precise strategy first, or full endorsement preparation with dedicated experts."
            />
          </FadeIn>

          <StaggerChildren className="mt-12 grid gap-6 md:grid-cols-2">
            {packages.map((pkg) => (
              <StaggerItem key={pkg.slug}>
                <PackageCard pkg={pkg} />
              </StaggerItem>
            ))}
          </StaggerChildren>

          <FadeIn delay={0.1}>
            <div className="mt-14 rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight">
                Not sure which package fits?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Book a free consultation. We’ll review your background and
                recommend Profiling Strategy or the Comprehensive Package based
                on evidence readiness — never pressure, just clarity.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <FinalCTA
        title="Ready to choose your path?"
        description="Book a consultation and we’ll match you to the right package."
      />
    </>
  );
}
