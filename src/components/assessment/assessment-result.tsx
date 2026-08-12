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
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import {
  downloadAssessmentPdf,
  emailAssessment,
  getAssessment,
} from "@/api/useAssessment";
import { AssessmentRadar } from "@/components/assessment/assessment-radar";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";
import {
  potentialFromScore,
  starRatingFromScore,
  type Assessment,
} from "@/types";
import { format } from "date-fns";
import { addBusinessDays } from "date-fns";
import { ConversionPackages } from "../sections/conversion-packages";
import { LatestInsightsSection } from "../sections/latest-insights";
import { ReadyToStartCta } from "../sections/ready-to-start";
import { EbookCta } from "../shared/ebook-cta";
import { TestimonialsSection } from "../sections/testimonials";
import { FeaturedStories } from "../sections/featured-stories";

const TARGET_SCORE = 75;

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
  const [data, setData] = useState<Assessment | null>(null);
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

      const result = await getAssessment(id);
      if (cancelled) return;

      if (!result.success || !result.data) {
        setData(null);
        setError(result.error ?? "Failed to load assessment.");
      } else {
        setData(result.data);
        setError(null);
      }
      setLoading(false);
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
      const result = await downloadAssessmentPdf(id);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? "PDF generation failed.");
      }
      const url = URL.createObjectURL(result.data);
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
      const result = await emailAssessment(id);
      if (!result.success) {
        throw new Error(result.error ?? "Could not reach the email endpoint.");
      }
      setActionMsg(result.data?.message ?? "Email request sent.");
    } catch (e) {
      setActionMsg(
        e instanceof Error ? e.message : "Could not reach the email endpoint."
      );
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
          render={<Link href="/assessment" target="_blank" rel="noopener noreferrer"/>}
        >
          Retake questionnaire
        </Button>
      </div>
    );
  }

  const { label: potentialLabel, probability } = potentialFromScore(
    data.confidenceScore
  );
  const starRating = starRatingFromScore(data.confidenceScore);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Global Talent Report
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Assessment
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
          <div className="flex flex-col items-center gap-2">
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
            Resend Email
          </Button>
          <span className="text-xs font-normal text-foreground leading-tight">
             On {data.customerEmail}
          </span>
          </div>
          {data.createdAt && (
            <div className="flex flex-col items-center gap-2">
            <Button
          className="h-9 rounded-full px-4"
            >
              <Link href="/consultation" target="_blank" rel="noopener noreferrer" className="flex flex-col items-start">
                <span className="flex items-center font-semibold">
                  Book a  free call
                  <ArrowRight className="ml-1 inline-block size-5 align-text-bottom" />
                </span>
               
              </Link>
            </Button>
             <span className="text-xs font-normal text-foreground leading-tight">
             For next {format(addBusinessDays(new Date(data.createdAt), 5), "EEE, MMM d")}
          </span>
          </div>
          )}
     
     
        </div>
      </div>
      {actionMsg ? (
        <p className="text-sm text-muted-foreground" role="status">
          {actionMsg}
        </p>
      ) : null}

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
            <p className="mt-1 text-sm text-muted-foreground">{potentialLabel}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${data.confidenceScore}%` }}
              />
            </div>
            {/* <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Target {TARGET_SCORE}+</span>
              <span>Stage 1 · {probability}</span>
            </div> */}
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

      <FadeIn>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Brain className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                 Assessment Summary
              </h2>
              <div
                className="mt-0.5 flex gap-0.5"
                aria-label={`${starRating} of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < starRating
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
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm leading-relaxed"
                  >
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Improvements
              </p>
              <ul className="mt-2 space-y-3">
                {data.improvements.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-2 text-sm leading-relaxed"
                  >
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

      <FadeIn>

        
      <ConversionPackages data={{section_title: "Next Steps", section_description: " Enhance your skills and boost your chances of success with our expert guidance and resources."}}/>

<LatestInsightsSection />
<EbookCta />

{/* <ReadyToStartCta /> */}
<FeaturedStories />
<TestimonialsSection />

      </FadeIn>
    </div>
  );
}
