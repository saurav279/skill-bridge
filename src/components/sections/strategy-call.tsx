import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { company } from "@/data/company";
import { BadgeText } from "../shared/badge";
import { getPackage } from "@/data/packages";

type StrategyCallCtaProps = {
  variant: "contact" | "strategy-call";
  nextSteps?: boolean;
};

export function StrategyCallCta({ variant, nextSteps }: StrategyCallCtaProps) {
  const isContact = variant === "contact";
  const pkg = getPackage("strategy-call");
  const href = isContact ? "/contact" : "/packages/strategy-call";
  const name = isContact ? "Free Strategy Call" : (pkg?.name ?? "Strategy Call");
  const title = nextSteps
    ? `Next Step: ${name}`
    : isContact
      ? "Get in touch with Skill Bridge"
      : `Book a ${pkg?.name ?? "Strategy Call"}`;
  const description = isContact
    ? "Questions about fit, timelines, or working together? Send a message and we’ll respond within one business day."
    : (pkg?.description ?? "");

  return (
    <section className="border-t border-border/70 bg-muted/30 py-16 text-foreground md:py-20">
      <div className="container-page text-center">
        <FadeIn>
          <BadgeText text={name} />
          <h2 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 font-semibold uppercase tracking-wide"
              render={
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              {isContact ? "Contact us" : `Book ${pkg?.name ?? "Strategy Call"}`}
            </Button>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-muted"
            >
              Email {company.name}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
