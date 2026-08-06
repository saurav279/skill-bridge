import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resources, newsletters } from "@/data/resources";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { NewsletterSignup } from "@/components/shared/newsletter-signup";
import { EbookCta } from "@/components/shared/ebook-cta";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Skill Bridge insights, guides, and newsletters on UK Global Talent Visa Stage 1 endorsement.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="Resources"
              title="News, guides & newsletters"
              description="Practical insights on Stage 1 endorsement, evidence strategy, and building a UK tech career — written for founders, engineers, researchers, and creators."
            />
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-border/70 pb-20 md:pb-28">
        <div className="container-page">
          <FadeIn>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Latest insights
            </h2>
          </FadeIn>
          <StaggerChildren className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((item) => (
              <StaggerItem key={item.slug}>
                <Link
                  href={`/resources/${item.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
                >
                  <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                    {item.category} · {item.date}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read more
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section id="newsletters" className="scroll-mt-28 border-t border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <SectionTitle
                eyebrow="Newsletters"
                title="Stay ahead of the process"
                description="Subscribe for endorsement briefings and talent strategy notes. Demo signup only — no backend."
              />
            </FadeIn>
          </div>
          <div className="md:col-span-7 space-y-6">
            <FadeIn delay={0.08}>
              <div className="grid gap-4 sm:grid-cols-2">
                {newsletters.map((n) => (
                  <div
                    key={n.title}
                    className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft"
                  >
                    <h3 className="font-semibold tracking-tight">{n.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{n.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-border/80 bg-card p-6 shadow-soft" id="ebook">
                <h3 className="text-lg font-semibold tracking-tight">
                  Download the E-Book
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Free UK Global Talent Visa primer — criteria, evidence, and letter checklist. Demo UI only.
                </p>
                <div className="mt-4">
                  <NewsletterSignup />
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Looking for packages?{" "}
                <Link
                  href="/packages"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Compare all packages
                </Link>
                .
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <EbookCta compact />
      <ReadyToStartCta />
    </>
  );
}
