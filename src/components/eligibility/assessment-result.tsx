"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { AssessmentRadar } from "@/components/eligibility/assessment-radar";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import type { EligibilityAssessment } from "@/lib/eligibility-assessment";
import { normalizeAssessment } from "@/lib/eligibility-assessment";
import { cn } from "@/lib/utils";

const ROADMAP_COPY: Record<string, string> = {
  assessment:
    "Your questionnaire answers have been scored against endorsement criteria.",
  evidence:
    "Collect letters, metrics, press, and work samples that map to each criterion.",
  letters:
    "Secure 2–3 strong recommenders who can independently verify your impact.",
  narrative:
    "Draft a criteria-mapped personal statement that ties evidence to the route.",
  review:
    "Walk through gaps and packaging with a consultant before you submit.",
  stage1: "Submit Stage 1 endorsement with a complete, criteria-aligned file.",
  endorsement: "Receive a decision from the endorsing body for your pathway.",
  visa: "Apply for the Global Talent visa once endorsement is confirmed.",
};

function priorityMeta(priority: "high" | "medium" | "easy") {
  if (priority === "high") {
    return {
      label: "High Priority",
      badge: "bg-red-500/10 text-red-600 border-red-500/20",
      dot: "bg-red-500",
    };
  }
  if (priority === "medium") {
    return {
      label: "Medium",
      badge: "bg-amber-500/10 text-amber-700 border-amber-500/20",
      dot: "bg-amber-500",
    };
  }
  return {
    label: "Easy Win",
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    dot: "bg-emerald-500",
  };
}

export function AssessmentResult({ id }: { id: string }) {
  const [data, setData] = useState<EligibilityAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/eligibility/${id}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Assessment not found. Complete the questionnaire again."
              : "Failed to load assessment."
          );
        }
        const json = (await res.json()) as Partial<EligibilityAssessment> & {
          id: string;
          confidenceScore: number;
        };
        if (!cancelled) setData(normalizeAssessment(json));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Something went wrong.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handlePdf() {
    setPdfBusy(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/eligibility/${id}/pdf`, { method: "POST" });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(err?.error ?? "PDF generation failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skill-bridge-assessment-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setActionMsg("Report downloaded.");
    } catch (e) {
      setActionMsg(
        e instanceof Error ? e.message : "Could not download the PDF."
      );
    } finally {
      setPdfBusy(false);
    }
  }

  async function handleEmail() {
    setEmailBusy(true);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/eligibility/${id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data?.contactEmail }),
      });
      const json = (await res.json()) as { message?: string };
      setActionMsg(json.message ?? "Email request sent.");
    } catch {
      setActionMsg("Could not reach the email endpoint.");
    } finally {
      setEmailBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-7 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading report…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-bold tracking-tight">
          Assessment unavailable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error ?? "No data returned."}
        </p>
        <Button
          className="mt-5 h-10 rounded-full px-5"
          render={<Link href="/eligibility" />}
        >
          Retake questionnaire
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
      {/* Compact header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Global Talent Report
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Eligibility Assessment
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-full px-4"
            disabled={pdfBusy}
            onClick={() => void handlePdf()}
          >
            {pdfBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="h-9 rounded-full px-4"
            disabled={emailBusy}
            onClick={() => void handleEmail()}
          >
            {emailBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            Email
          </Button>
          <Button
            className="h-9 rounded-full px-4 font-semibold"
            render={<Link href="/consultation" />}
          >
            Book call
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
      {actionMsg ? (
        <p className="text-sm text-muted-foreground" role="status">
          {actionMsg}
        </p>
      ) : null}

      {/* Score + Breakdown (bars + radar) */}
      <div className="grid gap-4 md:grid-cols-12">
        <FadeIn className="md:col-span-4">
          <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-2 text-primary">
              <Trophy className="size-4" />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                Readiness score
              </p>
            </div>
            <p className="mt-3 text-5xl font-bold tracking-tight">
              {data.confidenceScore}
              <span className="text-xl text-muted-foreground">%</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.potentialLabel}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${data.confidenceScore}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Target {data.targetScore}+</span>
              <span>Stage 1 · {data.probability}</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="md:col-span-8" delay={0.04}>
          <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <h2 className="text-base font-semibold tracking-tight">
                Assessment Breakdown
              </h2>
            </div>
            <AssessmentRadar
              items={data.breakdown}
              className="mt-2 flex-1"
            />
          </div>
        </FadeIn>
      </div>

      {/* AI summary */}
      <FadeIn>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                AI Assessment Summary
              </h2>
              <div
                className="mt-0.5 flex gap-0.5"
                aria-label={`${data.starRating} of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < data.starRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground">
            {data.headline}
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Strongest
              </p>
              <ul className="mt-2 space-y-3">
                {data.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm leading-relaxed">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Needs attention
              </p>
              <ul className="mt-2 space-y-3">
                {data.attentionAreas.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm leading-relaxed">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-5 rounded-xl bg-primary/5 px-4 py-3 text-sm font-medium text-foreground">
            {data.overallRecommendation}
          </p>
        </div>
      </FadeIn>

      {/* Priority improvements — 2 col */}
      <FadeIn>
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">
              Priority Improvements
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.priorityImprovements.map((item) => {
              const meta = priorityMeta(item.priority);
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", meta.dot)} />
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        meta.badge
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Roadmap */}
      <FadeIn>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="mb-2 flex items-center gap-2">
            <Rocket className="size-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">
              Your Roadmap
            </h2>
          </div>
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
            A practical path from this assessment to Stage 1 endorsement and
            visa application. Timelines are estimates — we adjust them in a
            strategy session based on your evidence readiness.
          </p>
          <ol className="space-y-0">
            {data.roadmap.map((step, i) => {
              const explanation =
                ROADMAP_COPY[step.id] ??
                "Complete this milestone before moving to the next stage.";
              const isLast = i === data.roadmap.length - 1;
              return (
                <li key={step.id} className="flex gap-4">
                  <div className="flex w-5 flex-col items-center">
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                        step.completed
                          ? "border-emerald-500"
                          : "border-primary/40"
                      )}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="size-3 text-emerald-600" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-primary/70" />
                      )}
                    </span>
                    {!isLast ? (
                      <span className="mt-1 w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className={cn("min-w-0 flex-1", !isLast && "pb-5")}>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          step.completed
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-foreground"
                        )}
                      >
                        {step.title}
                      </p>
                      {step.estimated ? (
                        <span className="text-xs text-muted-foreground">
                          · {step.estimated}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {explanation}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </FadeIn>
    </div>
  );
}
