import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";
import { EligibilityForm } from "./eligibility-form";

export const metadata: Metadata = {
  title: "Eligibility Questionnaire",
  description:
    "Complete the Skill Bridge eligibility questionnaire for a free 15-minute UK Global Talent Visa discovery call.",
};

export default function EligibilityPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="Free discovery call"
              title="Eligibility Questionnaire"
              description="Tell us about your background. We’ll review fit for Stage 1 endorsement and invite you to a free 15-minute discovery call."
            />
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">01</span>
                Complete this short questionnaire
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">02</span>
                We assess Exceptional Talent / Promise fit
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">03</span>
                Book a free 15-minute discovery call
              </li>
            </ul>
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer to speak now?{" "}
              <Link
                href="/consultation"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Open the calendar
              </Link>
              .
            </p>
          </FadeIn>
        </div>
        <div className="md:col-span-7">
          <FadeIn delay={0.08}>
            <EligibilityForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
