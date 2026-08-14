import type { Metadata } from "next";
import Link from "next/link";
import { ConversionPackages } from "@/components/sections/conversion-packages";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Strategy Call, Leadership Enhancement, DIY Membership, Strategy Session, Review Only, Full Review, and Bespoke 1-to-1 Support — Skill Bridge UK Global Talent Visa packages.",
};

export default function PackagesPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-muted/20 py-16 md:py-20">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="Packages"
              title="Ways to work with Skill Bridge"
              description="From a focused strategy call and leadership course to DIY templates, review, and bespoke 1-to-1 coaching — choose the support that matches your Stage 1 journey."
            />
            <Button
              className="mt-8 h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
              render={<Link href="/assessment" target="_blank" rel="noopener noreferrer"/>}
            >
              Start Assessment Questionnaire
            </Button>
          </FadeIn>
        </div>
      </section>
      <ConversionPackages showIntro={false} />
      <ReadyToStartCta />
    </>
  );
}
