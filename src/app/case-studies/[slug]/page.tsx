import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { SectionTitle } from "@/components/shared/section-title";
import { Timeline } from "@/components/shared/timeline";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";
import { ConversionPackages } from "@/components/sections/conversion-packages";
import { EbookCta } from "@/components/shared/ebook-cta";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case Study" };

  return {
    title: `${study.name} — ${study.role}`,
    description: study.overview,
    openGraph: {
      title: `${study.name} · Skill Bridge Case Study`,
      description: study.overview,
      images: [{ url: study.image, width: 1200, height: 900, alt: study.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.name} · Skill Bridge Case Study`,
      description: study.overview,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${study.name} — Global Talent Visa Case Study`,
    description: study.overview,
    image: study.image,
    author: { "@type": "Organization", name: "Skill Bridge" },
    about: {
      "@type": "Person",
      name: study.name,
      jobTitle: study.role,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-8 md:pt-12">
        <div className="container-page">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 rounded-xl"
            render={<Link href="/case-studies" target="_blank" rel="noopener noreferrer"/>}
          >
            <ArrowLeft className="size-4" />
            All case studies
          </Button>

          <FadeIn>
            <div className="relative aspect-[21/9] min-h-[240px] overflow-hidden rounded-2xl shadow-elevated md:aspect-[2.4/1]">
              <Image
                src={study.image}
                alt={study.name}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <p className="font-mono text-xs uppercase tracking-wider text-white/80">
                  {study.role} · {study.country}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                  {study.name}
                </h1>
                <p className="mt-2 text-sm text-white/85 md:text-base">
                  {study.visaType} · Approved in {study.approvalTimeline}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-page grid gap-14 md:gap-20">
          <FadeIn>
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <SectionTitle eyebrow="Overview" title="The engagement" />
              </div>
              <p className="md:col-span-8 text-lg leading-relaxed text-muted-foreground">
                {study.overview}
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <SectionTitle eyebrow="Challenge" title="What stood in the way" />
              </div>
              <p className="md:col-span-8 text-lg leading-relaxed text-muted-foreground">
                {study.challenge}
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <SectionTitle
                  eyebrow="Evidence Strategy"
                  title="How we built the case"
                />
              </div>
              <ul className="md:col-span-8 space-y-3">
                {study.evidenceStrategy.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <SectionTitle eyebrow="Timeline" title="From kickoff to approval" />
              </div>
              <div className="md:col-span-8">
                <Timeline
                  items={study.timeline.map((t) => ({
                    title: t.label,
                    description: t.detail,
                  }))}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <SectionTitle
                  eyebrow="Documents"
                  title="Materials prepared"
                />
              </div>
              <ul className="md:col-span-8 grid gap-2 sm:grid-cols-2">
                {study.documentsPrepared.map((doc) => (
                  <li
                    key={doc}
                    className="rounded-xl border border-border/80 bg-card px-4 py-3 text-sm shadow-soft"
                  >
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <SectionTitle eyebrow="Outcome" title="The result" />
              </div>
              <p className="md:col-span-8 text-lg leading-relaxed text-muted-foreground">
                {study.outcome}
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <figure className="rounded-3xl border border-border/80 bg-muted/30 p-8 md:p-12">
              <blockquote className="text-xl font-medium leading-relaxed tracking-tight sm:text-2xl">
                “{study.testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {study.testimonial.author}
                </span>
                {" · "}
                {study.testimonial.role}, {study.testimonial.company}
              </figcaption>
            </figure>
          </FadeIn>
        </div>
      </section>

      <ConversionPackages />
      <EbookCta />
      <ReadyToStartCta />


    </>
  );
}
