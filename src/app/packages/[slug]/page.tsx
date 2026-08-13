
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import {
  packages,
  getPackage,
  whyWorkWithSkillBridge,
} from "@/data/packages";
import { SectionTitle } from "@/components/shared/section-title";
import { TestimonialsCarousel } from "@/components/shared/testimonials-carousel";
import { Timeline } from "@/components/shared/timeline";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { Button } from "@/components/ui/button";

import { ConversionPackages } from "@/components/sections/conversion-packages";

import { PackageNameTypes } from "@/types/packages";
import { PurchaseButton } from "@/components/shared/purchase-btn";
import Image from "next/image";
import { BadgeText } from "@/components/shared/badge";

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
            render={<Link href="/packages" target="_blank" rel="noopener noreferrer"/>}
          >
            <ArrowLeft className="size-4" />
            All packages
          </Button>

          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <FadeIn>
                {/* <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {pkg.tagline}
                </p> */}
                <BadgeText text={pkg.tagline} />
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
                    <li
                      key={`${f.included ? "in" : "ex"}-${f.label}`}
                      className="flex gap-2.5 text-sm"
                    >
                      {f.included ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span
                        className={
                          f.included ? undefined : "text-muted-foreground"
                        }
                      >
                        {f.label} 
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
               
                  <PurchaseButton
  packageName={pkg.slug as PackageNameTypes}
/>
                  <Button
                      variant="outline"
                    className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
                    render={<Link href="/assessment" target="_blank" rel="noopener noreferrer"/>}
                  >
                    Start Assessment Questionnaire
                  </Button>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-6">
              <FadeIn delay={0.1}>
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-elevated">
                  <div className="relative aspect-video bg-muted">
                    {/* {pkg.videoEmbedUrl ? (
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
                    )} */}

                    <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=900&fit=crop&q=80" alt="Package reference video" width={600} height={400} className="w-full h-full object-cover" />
                  </div>
                  {/* <div className="border-t border-border/70 px-4 py-3 text-sm text-muted-foreground">
                    {pkg.videoTitle ?? "Package reference video"} — replace embed
                    URL in data when you have your walkthrough.
                  </div> */}
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
            <TestimonialsCarousel />
          </FadeIn>
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
