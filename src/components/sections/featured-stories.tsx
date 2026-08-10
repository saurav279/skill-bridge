import Link from "next/link";
import { getFeaturedCaseStudies } from "@/data/case-studies";
import { CaseCard } from "@/components/shared/case-card";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function FeaturedStories() {
  const featured = getFeaturedCaseStudies();

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Success Stories"
              title="Featured case studies"
              description="Real profiles. Clear strategy. Measurable outcomes."
            />
            <Button
              variant="outline"
              className="h-10 shrink-0 rounded-xl"
              render={<Link href="/case-studies" target="_blank" rel="noopener noreferrer"/>}
            >
              View all
            </Button>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((study) => (
            <StaggerItem key={study.slug}>
              <CaseCard study={study} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
