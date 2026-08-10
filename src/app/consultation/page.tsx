import type { Metadata } from "next";
import Link from "next/link";
import { CalendlyEmbed } from "@/components/shared/calendly-embed";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";

export const metadata: Metadata = {
  title: "Book Consultation",
  description:
    "Schedule a free Global Talent Visa consultation with Skill Bridge. Pick a time that works for you.",
};

export default function ConsultationPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            as="h1"
            eyebrow="Consultation"
            title="Book a free strategy call"
            description="Choose a time below. We’ll review your profile at a high level and outline whether a Global Talent pathway is a strong fit."
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Prefer email instead?{" "}
            <Link
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Contact us
            </Link>
            .
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10">
          <CalendlyEmbed />
        </FadeIn>
      </div>
    </section>
  );
}
