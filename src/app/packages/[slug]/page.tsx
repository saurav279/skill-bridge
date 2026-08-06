import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Play } from "lucide-react";
import {
  packages,
  getPackage,
  whyWorkWithSkillBridge,
} from "@/data/packages";
import { testimonials } from "@/data/testimonials";
import { SectionTitle } from "@/components/shared/section-title";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { Timeline } from "@/components/shared/timeline";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConversionPackages } from "@/components/sections/conversion-packages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return { title: "Package" };
  return {
    title: pkg.name,
    description: pkg.description,
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const steps = pkg.steps ?? [];
  const overview = pkg.overview ?? pkg.description;

  return (
    <>
      {/* Hero: description + video */}
      <section className="border-b border-border/70 py-12 md:py-20">
        <div className="container-page">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 rounded-full"
            render={<Link href="/packages" />}
          >
            <ArrowLeft className="size-4" />
            All packages
          </Button>

          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <FadeIn>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {pkg.tagline}
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {pkg.name}
                </h1>
                <div className="mt-5 flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    {pkg.priceLabel}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {pkg.priceNote}
                  </span>
                </div>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {overview}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Ideal for: </span>
                  {pkg.idealFor}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
                    render={<Link href="/eligibility" />}
                  >
                    Start Eligibility Questionnaire
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
                    render={<Link href="/consultation" />}
                  >
                    Book a Call
                  </Button>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-6">
              <FadeIn delay={0.1}>
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-elevated">
                  <div className="relative aspect-video bg-muted">
                    {pkg.videoEmbedUrl ? (
                      <iframe
                        title={pkg.videoTitle ?? `${pkg.name} reference video`}
                        src={pkg.videoEmbedUrl}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Play className="size-12" />
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
                    {pkg.videoTitle ?? "Package reference video"} — replace embed
                    URL in data when you have your walkthrough.
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Step by step */}
      {steps.length > 0 ? (
        <section className="bg-muted/20 py-20 md:py-28">
          <div className="container-page grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <FadeIn>
                <SectionTitle
                  eyebrow="Process"
                  title="Step by step — what will happen"
                  description={`Exactly how the ${pkg.name} engagement unfolds from kickoff to completion.`}
                />
              </FadeIn>
            </div>
            <div className="md:col-span-7">
              <FadeIn delay={0.08}>
                <Timeline
                  items={steps.map((s, i) => ({
                    title: s.title,
                    description: s.detail,
                    meta: `Step ${i + 1}`,
                  }))}
                />
              </FadeIn>
            </div>
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Testimonials"
              title="What clients say"
              description="Leaders who trusted Skill Bridge with their Stage 1 journey."
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-5 md:grid-cols-2">
            {testimonials.slice(0, 4).map((t) => (
              <StaggerItem key={t.id}>
                <TestimonialCard testimonial={t} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Why Skill Bridge */}
      <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Why us"
              title="Why work with Skill Bridge"
              align="center"
              className="mx-auto"
            />
          </FadeIn>
          <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyWorkWithSkillBridge.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
                  <h3 className="font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* All packages list */}
      <ConversionPackages />

      <ReadyToStartCta />
    </>
  );
}
