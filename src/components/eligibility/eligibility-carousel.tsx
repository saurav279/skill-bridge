"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  FileStack,
  Globe,
  Loader2,
  Mail,
  Map,
  Palette,
  Sparkles,
  TrendingUp,
  Upload,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  eligibilityRoutes,
  getSectionsForRoute,
  isQuestionVisible,
  type EligibilityQuestion,
} from "@/data/eligibility-questionnaire";
import { createAssessment } from "@/api/useAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AssessPayload, EligibilityAssessment } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  Users,
  User,
  Sparkles,
  BookOpen,
  Palette,
  TrendingUp,
  Award,
  Globe,
  FileStack,
  Mail,
  Map,
  Upload,
};

type Answers = Record<string, unknown>;

type SubmitPhase = "form" | "loading" | "ready" | "error";

export function EligibilityCarousel() {
  const [routeId, setRouteId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<SubmitPhase>("form");
  const [assessment, setAssessment] = useState<EligibilityAssessment | null>(
    null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const fileRef = useRef<HTMLInputElement>(null);

  const sections = useMemo(
    () => (routeId ? getSectionsForRoute(routeId) : []),
    [routeId]
  );

  const current = sections[step];
  const progress = sections.length
    ? Math.round(((step + 1) / sections.length) * 100)
    : 0;

  function setAnswer(id: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleCheckbox(
    q: EligibilityQuestion,
    option: string,
    checked: boolean
  ) {
    const prev = (answers[q.id] as string[] | undefined) ?? [];
    let next: string[];
    if (checked) {
      next = [...prev, option];
      if (q.maxSelection && next.length > q.maxSelection) {
        next = next.slice(-q.maxSelection);
      }
    } else {
      next = prev.filter((o) => o !== option);
    }
    setAnswer(q.id, next);
  }

  async function submitAssessment() {
    if (!routeId) return;
    setPhase("loading");
    setSubmitError(null);
    setAssessment(null);

    function serializeAnswer(value: unknown) {
      if (value instanceof File) {
        return {
          name: value.name,
          size: value.size,
          type: value.type,
        };
      }
      if (value === undefined || value === null || value === "") {
        return [];
      }
      if (Array.isArray(value) && value.length === 0) {
        return [];
      }
      return value;
    }

    const payload: AssessPayload = { routeId };

    for (const section of sections) {
      const sectionAnswers: Record<string, unknown> = {};

      for (const q of section.questions) {
        const key = `${section.id}_${q.id}`;
        const value = isQuestionVisible(q, answers)
          ? answers[q.id]
          : undefined;
        sectionAnswers[key] = serializeAnswer(value);
      }

      payload[section.id] = sectionAnswers;
    }

    const { success, data, error } = await createAssessment(payload);

    if (!success || !data) {
      setSubmitError(
        error ?? "Something went wrong. Please try again."
      );
      setPhase("error");
      return;
    }

    setAssessment(data);
    setPhase("ready");
  }

  function goNext() {
    if (step >= sections.length - 1) {
      void submitAssessment();
      return;
    }
    setDirection("next");
    setStep((s) => s + 1);
  }

  function goPrev() {
    if (step <= 0) {
      setRouteId(null);
      setStep(0);
      return;
    }
    setDirection("prev");
    setStep((s) => s - 1);
  }

  function resetForm() {
    setPhase("form");
    setAssessment(null);
    setSubmitError(null);
    setStep(0);
    setRouteId(null);
    setAnswers({});
  }

  if (phase === "loading") {
    return (
      <div
        className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-soft sm:p-12"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="size-7 animate-spin" />
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">
          Building your assessment…
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Analysing your{" "}
          {eligibilityRoutes.find((r) => r.id === routeId)?.name} answers and
          mapping them to endorsement criteria. This usually takes a few
          seconds.
        </p>
        <div className="mx-auto mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div
        className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-soft sm:p-10"
        role="alert"
      >
        <h2 className="text-2xl font-bold tracking-tight">
          Couldn’t build assessment
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {submitError ?? "Please try again."}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
            onClick={() => void submitAssessment()}
          >
            Retry
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full px-6"
            onClick={resetForm}
          >
            Start over
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "ready" && assessment) {
    const name = String(answers.name ?? "there");
    return (
      <div
        className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-soft sm:p-10"
        role="status"
      >
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
          Assessment ready · {assessment.confidenceScore}/100
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          We have built your assessment, {name}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your personalised eligibility summary is ready. Open it to review
          confidence score, improvements, and next steps.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
            render={<Link href={`/eligibility/${assessment.id}`} />}
          >
            View assessment
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full px-6"
            onClick={resetForm}
          >
            Start over
          </Button>
        </div>
      </div>
    );
  }

  /* Route picker */
  if (!routeId) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-soft sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Step 0 · Choose your route
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Which pathway fits you?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We will tailor the carousel questions to your endorsement route.
        </p>
        <div className="mt-8 grid gap-3">
          {eligibilityRoutes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => {
                setRouteId(route.id);
                setStep(0);
                setAnswers({});
              }}
              className="rounded-2xl border border-border/80 bg-background p-5 text-left transition-all hover:border-primary/40 hover:shadow-soft"
            >
              <span className="text-base font-semibold tracking-tight">
                {route.name}
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                {route.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const Icon = ICONS[current?.icon ?? "Users"] ?? Users;
  const visibleQuestions =
    current?.questions.filter((q) => isQuestionVisible(q, answers)) ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
      {/* Progress */}
      <div className="border-b border-border/70 px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-muted-foreground">
            {eligibilityRoutes.find((r) => r.id === routeId)?.name}
          </span>
          <span className="font-mono text-primary">
            {step + 1} / {sections.length}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Section dots */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              title={s.title}
              onClick={() => {
                setDirection(i > step ? "next" : "prev");
                setStep(i);
              }}
              className={cn(
                "h-1.5 min-w-6 flex-1 rounded-full transition-colors",
                i === step
                  ? "bg-primary"
                  : i < step
                    ? "bg-primary/40"
                    : "bg-muted-foreground/20"
              )}
              aria-label={`Go to ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Carousel panel */}
      <div
        key={`${current?.id}-${direction}`}
        className={cn(
          "px-5 py-8 sm:px-8 sm:py-10",
          "animate-in fade-in duration-300",
          direction === "next" ? "slide-in-from-right-4" : "slide-in-from-left-4"
        )}
      >
        <div className="mb-6 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-6" aria-hidden />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Section {step + 1}
            </p>
            <h2 className="text-2xl font-bold tracking-tight">{current?.title}</h2>
            {current?.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {current.description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-8">
          {visibleQuestions.map((q) => (
            <QuestionField
              key={q.id}
              question={q}
              value={answers[q.id]}
              onCheckbox={toggleCheckbox}
              onRadio={(opt) => setAnswer(q.id, opt)}
              onChips={(opt) => setAnswer(q.id, opt)}
              onText={(v) => setAnswer(q.id, v)}
              onFile={(file) => setAnswer(q.id, file)}
              fileRef={q.type === "file" ? fileRef : undefined}
            />
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 border-t border-border/70 px-5 py-4 sm:px-8">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full px-4"
          onClick={goPrev}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          type="button"
          className="h-10 rounded-full px-5 font-semibold uppercase tracking-wide"
          onClick={goNext}
        >
          {step >= sections.length - 1 ? "Submit" : "Next"}
          {step < sections.length - 1 ? <ArrowRight className="size-4" /> : null}
        </Button>
      </div>
    </div>
  );
}

function QuestionField({
  question: q,
  value,
  onCheckbox,
  onRadio,
  onChips,
  onText,
  onFile,
  fileRef,
}: {
  question: EligibilityQuestion;
  value: unknown;
  onCheckbox: (q: EligibilityQuestion, option: string, checked: boolean) => void;
  onRadio: (option: string) => void;
  onChips: (option: string) => void;
  onText: (value: string) => void;
  onFile: (file: File | null) => void;
  fileRef?: RefObject<HTMLInputElement | null>;
}) {
  const selected = (value as string[] | undefined) ?? [];

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold tracking-tight text-foreground">
        {q.title}
        {q.optional ? (
          <span className="ml-2 font-normal text-muted-foreground">(optional)</span>
        ) : null}
      </legend>
      {q.tooltip ? (
        <p className="text-xs text-muted-foreground">{q.tooltip}</p>
      ) : null}
      {q.maxSelection ? (
        <p className="text-xs text-muted-foreground">
          Select up to {q.maxSelection}
        </p>
      ) : null}

      {(q.type === "checkbox" || q.type === "chips") && q.options ? (
        <div
          className={cn(
            "flex flex-wrap gap-2",
            q.type === "checkbox" && "flex-col sm:flex-row sm:flex-wrap"
          )}
        >
          {q.options.map((opt) => {
            const isOn =
              q.type === "chips"
                ? value === opt
                : selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  if (q.type === "chips") onChips(opt);
                  else onCheckbox(q, opt, !isOn);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all",
                  isOn
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                )}
              >
                {q.type === "checkbox" && isOn ? (
                  <Check className="size-3.5" />
                ) : null}
                {opt}
              </button>
            );
          })}
        </div>
      ) : null}

      {q.type === "radio" && q.options ? (
        <div className="flex flex-wrap gap-2">
          {q.options.map((opt) => {
            const isOn = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onRadio(opt)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  isOn
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : null}

      {q.type === "text" ? (
        <div className="space-y-2">
          <Label htmlFor={q.id} className="sr-only">
            {q.title}
          </Label>
          <Input
            id={q.id}
            type={q.id.includes("email") ? "email" : "text"}
            required={!q.optional}
            value={String(value ?? "")}
            onChange={(e) => onText(e.target.value)}
            className="h-11 rounded-xl"
            placeholder={q.id.includes("email") ? "you@company.com" : "Your answer"}
          />
        </div>
      ) : null}

      {q.type === "file" ? (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept={q.accept?.join(",")}
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onFile(e.target.files?.[0] ?? null);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef?.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-10 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <Upload className="size-6 text-primary" />
            {value instanceof File ? (
              <span className="font-medium text-foreground">{value.name}</span>
            ) : (
              <span>Click to upload PDF or Word resume</span>
            )}
          </button>
        </div>
      ) : null}
    </fieldset>
  );
}
