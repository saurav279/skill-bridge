import type { Metadata } from "next";
import { ContactMap } from "@/components/shared/contact-map";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";
import { company } from "@/data/company";
import { ContactSection } from "@/components/sections/contact-section";
import { ConversionPackages } from "@/components/sections/conversion-packages";
import { EbookCta } from "@/components/shared/ebook-cta";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import Link from "next/link";
import { AssessmentCarousel } from "@/components/assessment/assessment-carousel";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${company.name} about Global Talent Visa strategy, partnerships, or general inquiries.`,
};

export default function ContactPage() {
  
  return (
    <>
      <ContactSection headingAs="h1" />
      <ReadyToStartCta />


      {/* <section className="border-t border-border/70 bg-muted/20 pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Location"
              title="Visit us"
              description={`Find ${company.name} at ${company.address}.`}
              className="mb-8"
            />
            <ContactMap />
          </FadeIn>
        </div>
      </section> */}

      <ConversionPackages />
      <EbookCta />
 
    </>
  );
}
