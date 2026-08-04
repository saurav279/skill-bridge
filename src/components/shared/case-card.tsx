import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/types";
import { cn } from "@/lib/utils";

type CaseCardProps = {
  study: CaseStudy;
  className?: string;
  compact?: boolean;
};

export function CaseCard({ study, className, compact }: CaseCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={study.image}
          alt={`${study.name}, ${study.role}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
            {study.country}
          </span>
          <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
            {study.visaType.split("—")[0]?.trim()}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {study.role}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">
          {study.name}
        </h3>
        {!compact ? (
          <>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {study.challenge}
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              Outcome: {study.result}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Timeline: {study.approvalTimeline}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{study.result}</p>
        )}
        <Link
          href={`/case-studies/${study.slug}`}
          className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Read Case Study
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
