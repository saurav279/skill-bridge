"use client";

import { useMemo, useState } from "react";
import { caseStudies } from "@/data/case-studies";
import { CaseCard } from "@/components/shared/case-card";
import { SectionTitle } from "@/components/shared/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";

const filters = ["All", "Product", "Research", "Design", "Founder", "Marketing", "Security"] as const;

export function CaseStudiesGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return caseStudies;
    return caseStudies.filter((c) =>
      c.role.toLowerCase().includes(filter.toLowerCase()) ||
      (filter === "Founder" && c.role.toLowerCase().includes("founder")) ||
      (filter === "Research" && c.role.toLowerCase().includes("research")) ||
      (filter === "Security" && c.role.toLowerCase().includes("security")) ||
      (filter === "Marketing" && c.role.toLowerCase().includes("marketing")) ||
      (filter === "Product" && c.role.toLowerCase().includes("product")) ||
      (filter === "Design" && c.role.toLowerCase().includes("design"))
    );
  }, [filter]);

  return (
    <section className="pb-20 md:pb-28">
      <div className="container-page">
        <FadeIn>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter case studies"
          >
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </FadeIn>

        <StaggerChildren className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study) => (
            <StaggerItem key={study.slug}>
              <CaseCard study={study} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">
            No case studies match this filter.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function CaseStudiesHeader() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            as="h1"
            eyebrow="Case Studies"
            title="Proof over promises."
            description="Explore how exceptional professionals structured evidence, navigated endorsement, and secured Global Talent outcomes."
          />
        </FadeIn>
      </div>
    </section>
  );
}
