import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
// import { company } from "@/data/company";
import { BadgeText } from "../shared/badge";

export function ReadyForStrategyCall() {
  return (
    <section className="border-t border-border/70 bg-muted/30 py-16 text-foreground md:py-20">
      <div className="container-page text-center">
        <FadeIn>
        <BadgeText text="Ready for a Strategy Call?" />
          <h2 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Next Step: Book a 30 minute Strategy Call
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We&apos;ll discuss your assessment and recommend the right package for your profile.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 font-semibold uppercase tracking-wide"
              render={
                <Link
                  href="/packages/strategy-call"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Book Strategy Call
            </Button>
            
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
