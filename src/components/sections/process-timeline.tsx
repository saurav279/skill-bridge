import { processSteps } from "@/data/stats";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { FadeIn } from "@/components/shared/fade-in";

export function ProcessTimeline() {
  return (
    <section id="process" className="scroll-mt-24 bg-muted/20 py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <FadeIn>
            <SectionTitle
              eyebrow="Our Process"
              title="A clear path from eligibility to visa success."
              description="Five deliberate stages. No guesswork — just a structured engagement designed for high-stakes endorsement."
            />
          </FadeIn>
        </div>
        <div className="md:col-span-7">
          <FadeIn delay={0.1}>
            <Timeline
              items={processSteps.map((step) => ({
                title: step.title,
                description: step.description,
                meta: `Step ${step.step}`,
              }))}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
