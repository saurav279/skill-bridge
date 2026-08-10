import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";

export function AboutGtvSection() {
  return (
    <section id="about-gtv" className="scroll-mt-28 py-20 md:py-28">
      <div className="container-page grid gap-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <FadeIn>
            <SectionTitle
              eyebrow="About the route"
              title="About the UK Global Talent Visa"
            />
          </FadeIn>
        </div>
        <div className="md:col-span-7">
          <FadeIn delay={0.08}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The UK Global Talent Visa in Digital Technology allows highly
              skilled tech talent to live and work in the UK for up to five
              years. It is a two-stage process: first you must be endorsed for
              Exceptional Talent or Exceptional Promise against strict criteria
              set by the endorsing body — then you can apply for the Global
              Talent Visa itself.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Skill Bridge specialises in Stage 1 endorsement strategy and
              preparation — evidence architecture, narrative clarity, and
              expert review so you submit with confidence.
            </p>
            <Button
              className="mt-8 h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
              render={<Link href="/about/gtv" target="_blank" rel="noopener noreferrer"/>}
            >
              Learn more about the visa
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
