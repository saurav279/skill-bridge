"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  HelpCircle,
  LayoutTemplate,
  MessageSquare,
  SearchCheck,
  Users,
} from "lucide-react";
import { howWeHelp } from "@/data/conversion";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { cn } from "@/lib/utils";
import { BadgeText } from "../shared/badge";

const icons = [
  ClipboardCheck,
  LayoutTemplate,
  Users,
  SearchCheck,
  HelpCircle,
  MessageSquare,
];

export function HowWeHelpSection() {
  const [active, setActive] = useState(0);
  const Icon = icons[active % icons.length];
  const current = howWeHelp[active];

  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            eyebrow="How we help"
            title="How Skill Bridge supports your endorsement"
            description="Working with us increases your chances of endorsement for Exceptional Talent or Exceptional Promise — so you can apply for the Global Talent Visa with confidence."
            align="center"
            className="mx-auto max-w-3xl"
          />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
            Disclaimer: Stage 1 endorsement for Exceptional Talent / Promise is
            not a visa application. Skill Bridge coaches Stage 1 endorsement
            preparation only. For immigration advice, seek a qualified solicitor.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Vertical stepper */}
          <ol className="lg:col-span-5" aria-label="How we help steps">
            {howWeHelp.map((item, i) => {
              const StepIcon = icons[i % icons.length];
              const isActive = i === active;
              const isLast = i === howWeHelp.length - 1;
              return (
                <li key={item.title} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-soft"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                      )}
                    >
                      {i + 1}
                    </button>
                    {!isLast ? (
                      <div
                        className={cn(
                          "my-1 w-0.5 flex-1 min-h-8",
                          i < active ? "bg-primary" : "bg-border"
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "mb-6 flex-1 rounded-xl border px-4 py-3 text-left transition-all last:mb-0",
                      isActive
                        ? "border-primary/40 bg-primary/5 shadow-soft"
                        : "border-transparent hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <StepIcon
                        className={cn(
                          "size-4",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Active panel */}
          <div className="lg:col-span-7">
            <FadeIn key={active} direction="none">
              <div className="flex h-full min-h-[280px] flex-col justify-center rounded-3xl border border-border/80 bg-card p-8 shadow-elevated sm:p-10">
                <div className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-7" aria-hidden />
                </div>
                {/* <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Step {active + 1} of {howWeHelp.length}
                </p> */}
                <BadgeText text={`Step ${active + 1} of ${howWeHelp.length}`} />
                <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {current.description}
                </p>
                <div className="mt-8 flex gap-2">
                  <button
                    type="button"
                    disabled={active === 0}
                    onClick={() => setActive((a) => Math.max(0, a - 1))}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={active === howWeHelp.length - 1}
                    onClick={() =>
                      setActive((a) => Math.min(howWeHelp.length - 1, a + 1))
                    }
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
