import type { Metadata } from "next";
import Link from "next/link";
import { consultationPackages, consultationPackageIds } from "@/data/consultation-packages";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Choose a Skill Bridge consultation package and pick a time that works for you.",
};

export default function BookingIndexPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            as="h1"
            eyebrow="Consultation"
            title="Choose a consultation"
            description="Select the consultation you’d like to book. You’ll pick a UK time slot next, then pay securely with Stripe."
          />
        </FadeIn>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {consultationPackageIds.map((id, i) => {
            const pkg = consultationPackages[id];
            return (
              <FadeIn key={id} delay={0.06 * (i + 1)}>
                <div className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                    {pkg.tagline}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    {pkg.name} {pkg.cost === 0 ? <span className="text-xs text-muted-foreground">Free</span> : <span className="text-xs text-muted-foreground">£{pkg.cost}</span>}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {pkg.description}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {pkg.slotDurationMinutes}-minute slots · Europe/London
                  </p>
                  <Button
                    className="mt-6 h-11 w-full rounded-xl"
                    render={<Link href={`/consultations/${pkg.id}`} />}
                  >
                    Book {pkg.name}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
