import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { appealContent } from "@/data/appeal";
import { appealPackages } from "@/data/content-extra";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Appeal",
  description:
    "Skill Bridge Stage 1 endorsement appeal packages — diagnosis, rebuild, and full support after a refusal.",
};

export default function AppealPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="Appeal & resubmission"
              title={appealContent.headline}
              description={appealContent.intro}
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
                render={<Link href="/assessment" />}
              >
                Start Assessment Questionnaire
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
                render={<Link href="#appeal-packages" />}
              >
                View Appeal Packages
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <SectionTitle
                eyebrow="When to consider"
                title="Is appeal or resubmission support right for you?"
              />
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.08}>
              <ul className="space-y-4">
                {appealContent.whenToConsider.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="leading-relaxed text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="How we help"
              title="A clear path after a difficult decision"
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-5 md:grid-cols-3">
            {appealContent.howWeHelp.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Appeal packages */}
      <section
        id="appeal-packages"
        className="scroll-mt-28 border-t border-border/70 bg-muted/20 py-20 md:py-28"
      >
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Appeal packages"
              title="Choose your appeal support level"
              description="From a clear diagnosis to full rebuild and coaching — pick the engagement that matches how much support you need after a refusal."
              align="center"
              className="mx-auto"
            />
          </FadeIn>

          <StaggerChildren className="mt-12 grid gap-6 md:grid-cols-3">
            {appealPackages.map((pkg) => (
              <StaggerItem key={pkg.slug}>
                <article
                  className={cn(
                    "flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft",
                    pkg.featured
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border/80"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider",
                      pkg.featured
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {pkg.featured ? "Most Popular" : "Appeal support"}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold tracking-tight">
                      {pkg.name}
                    </h3>
                    <p className="mt-4 text-3xl font-bold text-primary">
                      {pkg.priceLabel}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pkg.priceNote}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2.5 border-t border-border/70 pt-5">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex gap-2 text-sm">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-6 h-11 w-full rounded-full font-semibold uppercase tracking-wide"
                      variant={pkg.featured ? "default" : "outline"}
                      render={<Link href="/assessment" />}
                    >
                      Explore
                    </Button>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerChildren>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted-foreground">
            {appealContent.disclaimer}
          </p>
        </div>
      </section>

      <ReadyToStartCta />
    </>
  );
}
