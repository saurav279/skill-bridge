import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";
import { AssessmentCarousel } from "@/components/assessment/assessment-carousel";

export const metadata: Metadata = {
  title: "Assessment Questionnaire",
  description:
    "Complete the Skill Bridge Assessment Questionnaire for a free 15-minute UK Global Talent Visa discovery call.",
};

export default function AssessmentPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="Free discovery call"
              title="Assessment Questionnaire"
              description="Pick your endorsement route, then swipe through a guided carousel. We’ll review fit for Stage 1 and invite you to a free 15-minute discovery call."
            />
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">01</span>
                Choose Digital Tech, Academia, or Arts
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">02</span>
                Answer route-specific carousel questions
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">03</span>
                Get a confidence score and next steps
              </li>
            </ul>
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer to speak 1:1 now?{" "}
              <Link
                href="/packages/strategy-call"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Book Strategy Call
              </Link>
              .
            </p>
          </FadeIn>
        </div>
        <div className="md:col-span-7">
          <FadeIn delay={0.08}>
            <AssessmentCarousel />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
