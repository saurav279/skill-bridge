import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { resources } from "@/data/resources";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { BadgeText } from "../shared/badge";

export function LatestInsightsSection({ limit = 3, main = false }: { limit?: number, main?: boolean }) {
  const latest = resources.slice(0, limit);

  return (
    <section className="border-y border-border/70 bg-muted/20 py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Latest News & Insights"
              title="Stay informed on Stage 1 endorsement"
              description="Practical notes on criteria, evidence, and talent strategy."
            />
       { !main &&    <Button
              variant="outline"
              className="h-10 shrink-0 rounded-full"
              render={<Link href="/resources" target="_blank" rel="noopener noreferrer"/>}
            >
              View all resources
            </Button>}
          </div>
        </FadeIn>

        <StaggerChildren className="mt-10 grid gap-5 md:grid-cols-3">
          {latest.map((item) => (
            <StaggerItem key={item.slug}>
              <Link
                href={`/resources/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
              >
                {/* <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  {item.category} · {item.date}s
                </p> */}
                <div className="flex items-center gap-2">

               
                <BadgeText text={item.category} />
                <BadgeText text={item.date} />
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
                {/* <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read more
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span> */}
                <Button variant="outline" className="mt-5 h-10 shrink-0 rounded-full"> 
                  Read more
                </Button>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
