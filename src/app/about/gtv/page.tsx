import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  endorsementBodies,
  talentVsPromise,
  gtvFaqs,
} from "@/data/content-extra";
import { benefits } from "@/data/conversion";
import { SectionTitle } from "@/components/shared/section-title";
import { EbookCta } from "@/components/shared/ebook-cta";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";

export const metadata: Metadata = {
  title: "About the UK Global Talent Visa",
  description:
    "Understand the six endorsement bodies, Exceptional Talent vs Promise, benefits of the UK Global Talent Visa, and common questions.",
};

export default function AboutGtvPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="UK Global Talent Visa"
              title="About the UK Global Talent Visa"
              description="A two-stage route for exceptional talent: first secure Stage 1 endorsement from the right body, then apply for the visa. Skill Bridge specialises in Stage 1 preparation."
            />
            <Button
              className="mt-8 h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
              render={<Link href="/assessment" />}
            >
              Start Assessment Questionnaire
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* 6 endorsement bodies */}
      <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Endorsement bodies"
              title="Clear differences between the six pathways"
              description="Each field has a dedicated endorsing route. Choosing the right one is the first strategic decision."
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {endorsementBodies.map((b, i) => (
              <StaggerItem key={b.name}>
                <div className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
                  <span className="font-mono text-xs font-semibold text-primary">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-bold tracking-tight">
                    {b.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {b.body}
                  </p>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Best for: {b.focus}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {b.notes}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Benefits"
              title="Benefits of the UK Global Talent Visa"
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <StaggerItem key={item.title}>
                <div className="flex h-full gap-3 rounded-2xl border border-border/80 bg-card p-5 shadow-soft">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Talent vs Promise */}
      <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Pathways"
              title="Exceptional Talent vs Exceptional Promise"
              description="Same route family — different evidence standards. The right label depends on career stage and recognition."
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <FadeIn>
              <div className="h-full rounded-2xl border border-primary/40 bg-card p-6 shadow-soft ring-1 ring-primary/20 sm:p-8">
                <h3 className="text-2xl font-bold tracking-tight text-primary">
                  {talentVsPromise.talent.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {talentVsPromise.talent.summary}
                </p>
                <ul className="mt-6 space-y-3">
                  {talentVsPromise.talent.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-soft sm:p-8">
                <h3 className="text-2xl font-bold tracking-tight">
                  {talentVsPromise.promise.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {talentVsPromise.promise.summary}
                </p>
                <ul className="mt-6 space-y-3">
                  {talentVsPromise.promise.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Common Qns */}
      <section className="py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <SectionTitle
                eyebrow="FAQ"
                title="Common questions"
                description="Straight answers before you book a discovery call."
              />
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.08}>
              <Accordion className="w-full">
                {gtvFaqs.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`gtv-faq-${i}`}>
                    <AccordionTrigger className="text-left text-base font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>
        </div>
      </section>

      <EbookCta />
      <ReadyToStartCta />
    </>
  );
}
