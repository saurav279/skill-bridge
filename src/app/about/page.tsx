import type { Metadata } from "next";
import Image from "next/image";
import { Shield, Eye, Award, HeartHandshake } from "lucide-react";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { FinalCTA } from "@/components/shared/final-cta";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { team, values, milestones } from "@/data/team";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Skill Bridge — our mission, story, values, and the team behind premium Global Talent Visa strategy.",
};

const valueIcons = {
  integrity: Shield,
  transparency: Eye,
  expertise: Award,
  client: HeartHandshake,
};

export default function AboutPage() {
  const founder = team.find((m) => m.founder);
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
              description="We help world-class professionals secure Global Talent Visas through evidence architecture, narrative clarity, and end-to-end guidance — never volume processing."
            />
          </FadeIn>
        </div>
      </section>

      <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <FadeIn>
              <SectionTitle
                eyebrow="Mission"
                title="Raise the standard of Global Talent preparation."
              />
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn delay={0.08}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Exceptional people deserve exceptional counsel. Our mission is
                to replace guesswork with a rigorous, human process — so
                founders, researchers, designers, and operators can present
                their work with the clarity endorsement panels expect.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <FadeIn>
              <SectionTitle
                eyebrow="Our Story"
                title="Why we started"
                description="Too many talented professionals were funneled through generic immigration workflows that ignored how excellence is actually evaluated. Skill Bridge was founded to bring product-grade strategy to Global Talent applications — selective intake, deep evidence planning, and writing that respects the craft of the candidate."
              />
            </FadeIn>
          </div>
          <div className="md:col-span-6">
            <FadeIn delay={0.1} direction="scale">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-elevated">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=900&fit=crop&q=80"
                  alt="Team collaborating in a modern office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Values"
              title="What guides every engagement"
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = valueIcons[value.icon];
              return (
                <StaggerItem key={value.title}>
                  <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
                    <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Team"
              title="Meet the people behind the work"
              description="Operators and strategists who understand exceptional careers — and how to evidence them."
            />
          </FadeIn>

          {founder ? (
            <FadeIn delay={0.08}>
              <div className="mt-12 grid items-center gap-8 rounded-3xl border border-border/80 bg-card p-6 shadow-soft md:grid-cols-12 md:p-10">
                <div className="relative aspect-square overflow-hidden rounded-2xl md:col-span-4">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="md:col-span-8">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary">
                    Founder spotlight
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {founder.name}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{founder.role}</p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {founder.bio}
                  </p>
                </div>
              </div>
            </FadeIn>
          ) : null}

          <StaggerChildren className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                title="Milestones that shaped Skill Bridge"
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

      <FinalCTA
        title="Work with a team that treats your career with care"
        description="Book a consultation to explore fit, pathway, and next steps."
      />
    </>
  );
}
