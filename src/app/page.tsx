import { Hero } from "@/components/sections/hero";
import { StatsSection } from "@/components/sections/stats";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { FeaturedStories } from "@/components/sections/featured-stories";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq-section";
import { FinalCTA } from "@/components/shared/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <WhyChooseUs />
      <ProcessTimeline />
      <FeaturedStories />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
