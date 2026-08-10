import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Check } from "lucide-react";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { EbookCta } from "@/components/shared/ebook-cta";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { team, milestones } from "@/data/team";
import { ceo, awards } from "@/data/content-extra";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Skill Bridge CEO Elena Voss — mission, awards, and leadership behind our Global Talent Visa consultancy.",
};

export default function AboutPage() {
  const consultants = team.filter((m) => !m.founder);

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              as="h1"
              eyebrow="About Skill Bridge"
              title="A strategy firm for exceptional talent."
              description="We help world-class professionals secure Global Talent Visas through evidence architecture, narrative clarity, and end-to-end guidance."
            />
          </FadeIn>
        </div>
      </section>

      {/* CEO profile */}
      <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn direction="scale">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl shadow-elevated">
                <Image
                  src={ceo.image}
                  alt={ceo.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.08}>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                CEO profile
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {ceo.name}
              </h2>
              <p className="mt-1 text-lg text-muted-foreground">{ceo.title}</p>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {ceo.shortBio}
              </p>
              <ul className="mt-6 space-y-2.5">
                {ceo.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm text-foreground/90">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
                render={<Link href="#more-about-ceo" />}
              >
                More about CEO
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* More about CEO */}
      <section id="more-about-ceo" className="scroll-mt-28 py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <FadeIn>
              <SectionTitle
                eyebrow="Leadership"
                title="More about our CEO"
              />
            </FadeIn>
          </div>
          <div className="md:col-span-8 space-y-5">
            <FadeIn delay={0.08}>
              {ceo.longBio.map((p) => (
                <p
                  key={p.slice(0, 32)}
                  className="text-base leading-relaxed text-muted-foreground sm:text-lg"
                >
                  {p}
                </p>
              ))}
              <Button
                variant="outline"
                className="mt-4 h-11 rounded-full px-6"
                render={<Link href="/assessment" />}
              >
                Book a discovery call with the team
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Awards & recognition"
              title="Milestones that mark our work"
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((a) => (
              <StaggerItem key={a.title}>
                <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Award className="size-5" aria-hidden />
                  </div>
                  <p className="font-mono text-xs text-primary">{a.year}</p>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {a.org}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Team consultants */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Team"
              title="Consultants behind the work"
              description="Operators and strategists who understand exceptional careers."
            />
          </FadeIn>
          <StaggerChildren className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {consultants.map((member) => (
              <StaggerItem key={member.name}>
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="border-t border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <SectionTitle
                eyebrow="Timeline"
                title="Company milestones"
              />
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.08}>
              <Timeline
                numbered={false}
                items={milestones.map((m) => ({
                  title: m.title,
                  description: m.description,
                  meta: m.year,
                }))}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* E-book access */}
      <EbookCta compact />
      <ReadyToStartCta />
    </>
  );
}
