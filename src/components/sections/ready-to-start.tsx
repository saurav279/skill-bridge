import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { company } from "@/data/company";

export function ReadyToStartCta() {
  return (
    <section className="bg-foreground py-16 text-background md:py-20">
      <div className="container-page text-center">
        <FadeIn>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Ready to start?
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Complete our questionnaire for a free 15-minute discovery call
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-background">
            We&apos;ll discuss your eligibility and recommend the right package —
            from Strategy Session to Full Review or Bespoke Coaching. All queries
            are replied to within 5 working days.
          </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 font-semibold uppercase tracking-wide"
              render={<Link href="/eligibility" />}
            >
              Start Eligibility Questionnaire
            </Button>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-background/30 px-8 text-sm font-semibold uppercase tracking-wide text-background transition-colors hover:bg-background/10"
            >
              Email {company.name}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
