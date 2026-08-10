import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resources, newsletters } from "@/data/resources";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { EbookCta } from "@/components/shared/ebook-cta";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { LatestInsightsSection } from "@/components/sections/latest-insights";
import { FeaturedStories } from "@/components/sections/featured-stories";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Skill Bridge insights, guides, and newsletters on UK Global Talent Visa Stage 1 endorsement.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="Resources"
              title="News & guides"
              description="Practical insights on Stage 1 endorsement, evidence strategy, and building a UK tech career — written for founders, engineers, researchers, and creators."
            />
          </FadeIn>
        </div>
      </section>

      

 

    
      <LatestInsightsSection limit={10} main={true}/>
      <EbookCta />
      <ReadyToStartCta />
      <FeaturedStories />
      
    </>
  );
}
