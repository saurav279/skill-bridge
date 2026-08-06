import { ConversionHero } from "@/components/sections/conversion-hero";
import { AboutGtvSection } from "@/components/sections/about-gtv";
import { LatestInsightsSection } from "@/components/sections/latest-insights";
import { BenefitsSection } from "@/components/sections/benefits";
import { ConversionStatsBand } from "@/components/sections/conversion-stats";
import { ConversionPackages } from "@/components/sections/conversion-packages";
import { FounderBand } from "@/components/sections/founder-band";
import { HowWeHelpSection } from "@/components/sections/how-we-help";
import { EbookCta } from "@/components/shared/ebook-cta";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { FeaturedStories } from "@/components/sections/featured-stories";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq-section";

export default function HomePage() {
  return (
    <>
      <ConversionHero />
      <AboutGtvSection />
      <LatestInsightsSection />
      <BenefitsSection />
      <ConversionStatsBand />
      <ConversionPackages />
      <FounderBand />
      <HowWeHelpSection />
      <EbookCta />
      <ReadyToStartCta />
      <FeaturedStories />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
