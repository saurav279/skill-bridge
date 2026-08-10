import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { resources, getResource } from "@/data/resources";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { ReadyToStartCta } from "@/components/sections/ready-to-start";
import { Button } from "@/components/ui/button";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResource(slug);
  if (!article) return { title: "Insight" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image
        ? [{ url: article.image, width: 1400, height: 800, alt: article.title }]
        : undefined,
    },
  };
}

export default async function ResourceArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getResource(slug);
  if (!article) notFound();

  const related = resources.filter((r) => r.slug !== slug).slice(0, 3);

  return (
    <>
      <article className="pb-16 md:pb-24">
        <div className="container-page pt-8 md:pt-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 rounded-full"
            render={<Link href="/resources" target="_blank" rel="noopener noreferrer"/>}
          >
            <ArrowLeft className="size-4" />
            All resources
          </Button>

          <FadeIn>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {article.category} · {article.date}
            </p>
            <h1 className="mt-3 max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          </FadeIn>

          {article.image ? (
            <FadeIn delay={0.08} className="mt-10">
              <div className="relative aspect-[21/9] min-h-[200px] overflow-hidden rounded-2xl shadow-elevated">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </FadeIn>
          ) : null}

          <FadeIn delay={0.12}>
            <div className="mx-auto mt-12 max-w-2xl space-y-5">
              {article.content.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-relaxed text-muted-foreground sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-6">
                <p className="font-semibold tracking-tight">
                  Ready to apply this to your profile?
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete the Assessment Questionnaire for a free 15-minute
                  discovery call with Skill Bridge.
                </p>
                <Button
                  className="mt-4 h-10 rounded-full px-5 font-semibold uppercase tracking-wide"
                  render={<Link href="/assessment" target="_blank" rel="noopener noreferrer"/>}
                >
                  Start Questionnaire
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </article>

      <section className="border-t border-border/70 bg-muted/20 py-16 md:py-20">
        <div className="container-page">
          <FadeIn>
            <SectionTitle
              eyebrow="Keep reading"
              title="Related insights"
            />
          </FadeIn>
          <StaggerChildren className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <StaggerItem key={item.slug}>
                <Link
                  href={`/resources/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
                >
                  <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                    {item.category} · {item.date}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {item.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read more
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <ReadyToStartCta />
    </>
  );
}
