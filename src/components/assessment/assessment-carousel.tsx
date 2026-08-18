"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
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
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  AssessmentRoutes,
  areSectionsAnswered,
  getSectionsForRoute,
  isQuestionVisible,
  type AssessmentQuestion,
} from "@/data/assessment-questionnaire";
import { createAssessment } from "@/api/useAssessment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AssessPayload, Assessment } from "@/types";
import { uploadToCloudinary } from "@/services/cloudinary";
import { PhoneInputField } from "@/components/shared/phone-input";
import { BadgeText } from "../shared/badge";
import {
  clearAllAssessmentCache,
  deserializeAnswersFromCache,
  hasAnyAssessmentCache,
  readAssessmentCache,
  saveRouteCache,
  setAssessmentLastRouteId,
} from "@/lib/assessment-cache";
import { useUserStore, useUserStoreHydrated } from "@/stores/user-details";
import { UkVisaOption } from "@/types/consultation";

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

export function AssessmentCarousel() {
  const [routeId, setRouteId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<SubmitPhase>("form");
  const [assessment, setAssessment] = useState<Assessment | null>(
    null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [hydrated, setHydrated] = useState(false);
  const [hasCache, setHasCache] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { personalInfo, setPersonalInfo } = useUserStore();
  const personalInfoHydrated = useUserStoreHydrated();

  const sections = useMemo(
    () => (routeId ? getSectionsForRoute(routeId) : []),
    [routeId]
  );

  const current = sections[step];
  const progress = sections.length
    ? Math.round(((step + 1) / sections.length) * 100)
    : 0;

  const visibleQuestions = useMemo(
    () => current?.questions.filter((q) => isQuestionVisible(q, answers)) ?? [],
    [current, answers]
  );

  const isLastStep = sections.length > 0 && step >= sections.length - 1;
  const canSubmit = areSectionsAnswered(sections, answers);

  useEffect(() => {
    const store = readAssessmentCache();
    setHasCache(hasAnyAssessmentCache(store));

    if (store.lastRouteId && store.routes[store.lastRouteId]) {
      const cached = store.routes[store.lastRouteId];
      const maxStep = Math.max(
        0,
        getSectionsForRoute(store.lastRouteId).length - 1
      );
      setRouteId(store.lastRouteId);
      setStep(Math.min(Math.max(0, cached.step), maxStep));
      setAnswers(deserializeAnswersFromCache(cached.answers));
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || phase !== "form") return;

    if (!routeId) {
      setAssessmentLastRouteId(null);
      setHasCache(hasAnyAssessmentCache());
      return;
    }

    saveRouteCache(routeId, { step, answers });
    setHasCache(true);
  }, [hydrated, routeId, step, answers, phase]);

  function clearCache() {
    clearAllAssessmentCache();
    setHasCache(false);
    setRouteId(null);
    setStep(0);
    setAnswers({});
    setPhase("form");
    setAssessment(null);
    setSubmitError(null);
  }

  function startRoute(nextRouteId: string) {
    // Choosing a route always starts fresh and overwrites that route’s cache.
    setRouteId(nextRouteId);
    setStep(0);
    setAnswers({});
    setDirection("next");
    saveRouteCache(nextRouteId, { step: 0, answers: {} });
    setHasCache(true);
  }

  function setAnswer(id: string, value: unknown) {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      if (id === "livesInUk" && value !== "Yes") {
        delete next.ukVisa;
        delete next.ukVisaOther;
      }
      if (id === "ukVisa" && value !== "Others") {
        delete next.ukVisaOther;
      }
      return next;
    });
  }

  function toggleCheckbox(
    q: AssessmentQuestion,
    option: string,
    checked: boolean
  ) {
    const prev = Array.isArray(answers[q.id])
      ? (answers[q.id] as string[])
      : [];
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
    if (!areSectionsAnswered(sections, answers)) {
      setSubmitError("Please complete all required fields before submitting.");
      return;
    }

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

    const answersForSubmit: Answers = { ...answers };
    const resumeFile = answers.resume;



    const payload: AssessPayload = { routeId };

    for (const section of sections) {
      const sectionAnswers: Record<string, unknown> = {};

      for (const q of section.questions) {
        if (
          section.id === "personalDetails" &&
          (q.id === "resume" || q.id === "ukVisaOther")
        ) {
          continue;
        }
        const key = `${section.id}_${q.id}`;
        let value = isQuestionVisible(q, answersForSubmit)
          ? answersForSubmit[q.id]
          : undefined;
        if (
          section.id === "personalDetails" &&
          q.id === "ukVisa" &&
          value === "Others"
        ) {
          const other = String(answers.ukVisaOther ?? "").trim();
          if (other) value = other;
        }
        sectionAnswers[key] = serializeAnswer(value);
      }

      if (section.id === "personalDetails") {
        sectionAnswers.phone =
          typeof answers.phone === "string" ? answers.phone : "";
      }

      payload[section.id] = sectionAnswers;
    }

if (resumeFile instanceof File) {
  try {
//payload.resumeLink = "https://res.cloudinary.com/dud6q9sp/raw/upload/v1786380068/qwrkjhflfqppisi8jgm2.pdf" 
payload.resumeLink = await uploadToCloudinary(resumeFile);

  } catch (e) {
    setSubmitError(
      e instanceof Error
        ? e.message
        : "Could not upload your resume. Please try again."
    );
    setPhase("error");
    return;
  }
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
    if (isLastStep) {
      if (!canSubmit) return;
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

  function CacheToolbar() {
    if (!hasCache) return null;
    return (
      <div className="mb-3 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-full px-3 text-xs"
          onClick={clearCache}
        >
          <Trash2 className="size-3.5" />
          Remove Assessment cache
        </Button>
      </div>
    );
  }

  //Populate answers with personal info if hydrated
  useEffect(() => {
    if (personalInfoHydrated) {
      setAnswers(prev=>({ ...prev,
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        livesInUk: personalInfo.liveInUk === "yes" ? "Yes" : personalInfo.liveInUk === "no" ? "No" : undefined,
        ukVisa: personalInfo.currentVisa as UkVisaOption, 
        ukVisaOther: personalInfo.ukVisaOther,
        
       }));
    }
  }, [personalInfoHydrated, personalInfo.name, personalInfo.email, personalInfo.phone, personalInfo.liveInUk, personalInfo.currentVisa, personalInfo.ukVisaOther]);

  //Update personal info with answers if not hydrated
  useEffect(() => {
    if (answers.name && answers.email && answers.phone) {
 
      setPersonalInfo({
        name: answers.name as string,
        email: answers.email as string,
        phone: answers.phone as string,
        liveInUk: answers.livesInUk === "Yes" ? "yes" : answers.livesInUk === "No" ? "no" : undefined,
        currentVisa: answers.ukVisa as UkVisaOption,
        ukVisaOther: answers.ukVisaOther as string,
      });

    }
    
  }, [answers.name, answers.email, answers.phone, answers.livesInUk, answers.ukVisa, answers.ukVisaOther, setPersonalInfo]);



  console.log(answers.livesInUk);
  if (!hydrated) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border/80 bg-card p-8 shadow-soft">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div>
        <CacheToolbar />
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
            {AssessmentRoutes.find((r) => r.id === routeId)?.name} answers and
            mapping them to endorsement criteria. This usually takes a few
            seconds.
          </p>
          <div className="mx-auto mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div>
        <CacheToolbar />
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
      </div>
    );
  }

  if (phase === "ready" && assessment) {
    const name = String(answers.name ?? "there");
    return (
      <div>
        <CacheToolbar />
        <div
          className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-soft sm:p-10"
          role="status"
        >
          <BadgeText text={`Assessment ready · ${assessment.confidenceScore}/100`} />
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            We have built your assessment, {name}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Your personalised assessment summary is ready. Open it to review
            confidence score, improvements, and next steps.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
              render={<Link href={`/assessment/${assessment.id}`} target="_blank" rel="noopener noreferrer"/>}
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
      </div>
    );
  }

  /* Route picker */
  if (!routeId) {
    return (
      <div>
        <CacheToolbar />
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-soft sm:p-8">
          <BadgeText text="Step 0 · Choose your route" />
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Which pathway fits you?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We will tailor the carousel questions to your endorsement route.
          </p>
          <div className="mt-8 grid gap-3">
            {AssessmentRoutes.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => startRoute(route.id)}
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
      </div>
    );
  }

  const Icon = ICONS[current?.icon ?? "Users"] ?? Users;


  return (
    <div>
      <CacheToolbar />
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
      {/* Progress */}
      <div className="border-b border-border/70 px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-muted-foreground">
            {AssessmentRoutes.find((r) => r.id === routeId)?.name}
          </span>
          {/* <span className="font-mono text-primary">
            {step + 1} / {sections.length}
          </span> */}
          <BadgeText text={`${step + 1} / ${sections.length}`} />
          {/* </span> */}
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
              onValue={(v) => setAnswer(q.id, v)}
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
          disabled={isLastStep && !canSubmit}
        >
          {isLastStep ? "Submit" : "Next"}
          {!isLastStep ? <ArrowRight className="size-4" /> : null}
        </Button>
      </div>
      </div>
    </div>
  );
}

const OTHER_OPTION = "Other";

function isCustomOtherValue(
  option: string,
  options: string[] | undefined
): boolean {
  return Boolean(options && option !== OTHER_OPTION && !options.includes(option));
}

function QuestionField({
  question: q,
  value,
  onCheckbox,
  onRadio,
  onChips,
  onText,
  onFile,
  onValue,
  fileRef,
}: {
  question: AssessmentQuestion;
  value: unknown;
  onCheckbox: (q: AssessmentQuestion, option: string, checked: boolean) => void;
  onRadio: (option: string) => void;
  onChips: (option: string) => void;
  onText: (value: string) => void;
  onFile: (file: File | null) => void;
  onValue: (value: unknown) => void;
  fileRef?: RefObject<HTMLInputElement | null>;
}) {
  const [draft, setDraft] = useState("");
  const [addingOther, setAddingOther] = useState(false);
  const selected = Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];
  const hasOtherOption = Boolean(q.options?.includes(OTHER_OPTION));

  const customValues =
    q.type === "checkbox"
      ? selected.filter((v) => isCustomOtherValue(v, q.options))
      : typeof value === "string" && isCustomOtherValue(value, q.options)
        ? [value]
        : [];

  const isOtherOn =
    addingOther ||
    (q.type === "checkbox" && selected.includes(OTHER_OPTION)) ||
    ((q.type === "chips" || q.type === "radio") && value === OTHER_OPTION) ||
    customValues.length > 0;

  const atMax =
    q.type === "checkbox" &&
    Boolean(q.maxSelection) &&
    selected.filter((v) => v !== OTHER_OPTION).length >= (q.maxSelection ?? 0);

  function clearOther() {
    setDraft("");
    setAddingOther(false);
    if (q.type === "checkbox") {
      onValue(
        selected.filter(
          (v) => v !== OTHER_OPTION && !isCustomOtherValue(v, q.options)
        )
      );
      return;
    }
    onValue(undefined);
  }

  function selectOther() {
    if (isOtherOn) {
      clearOther();
      return;
    }
    setAddingOther(true);
    if (q.type === "checkbox") onCheckbox(q, OTHER_OPTION, true);
    else if (q.type === "chips") onChips(OTHER_OPTION);
    else onRadio(OTHER_OPTION);
  }

  function addCustom() {
    const text = draft.trim();
    if (!text) return;

    if (q.options?.includes(text)) {
      setDraft("");
      if (q.type === "checkbox") onCheckbox(q, text, true);
      else if (q.type === "chips") onChips(text);
      else onRadio(text);
      setAddingOther(false);
      return;
    }

    if (q.type === "checkbox") {
      if (customValues.includes(text)) {
        setDraft("");
        return;
      }
      const base = selected.filter((v) => v !== OTHER_OPTION);
      let next = [...base, text];
      if (q.maxSelection && next.length > q.maxSelection) {
        next = next.slice(-q.maxSelection);
      }
      onValue(next);
    } else {
      onValue(text);
    }

    setDraft("");
    setAddingOther(true);
  }

  function removeCustom(opt: string) {
    if (q.type === "checkbox") {
      const next = selected.filter((v) => v !== opt);
      const stillHasCustom = next.some((v) =>
        isCustomOtherValue(v, q.options)
      );
      setAddingOther(true);
      onValue(
        stillHasCustom || next.includes(OTHER_OPTION)
          ? next
          : [...next, OTHER_OPTION]
      );
      return;
    }
    setAddingOther(true);
    onValue(OTHER_OPTION);
  }

  function isOptionOn(opt: string) {
    if (opt === OTHER_OPTION) return isOtherOn;
    if (q.type === "checkbox") return selected.includes(opt);
    return value === opt;
  }

  function selectOption(opt: string) {
    if (opt === OTHER_OPTION) {
      selectOther();
      return;
    }
    if (q.type === "chips") {
      setAddingOther(false);
      onChips(opt);
      return;
    }
    if (q.type === "radio") {
      setAddingOther(false);
      onRadio(opt);
      return;
    }
    onCheckbox(q, opt, !selected.includes(opt));
  }

  function onDraftKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  }

  const optionClass = (isOn: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all",
      isOn
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background text-foreground hover:border-primary/40"
    );

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold tracking-tight text-foreground">
        {q.title}
        {!q.optional ? (
          <span className="ml-0.5 text-primary" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-2 font-normal text-muted-foreground">(optional)</span>
        )}
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
            const isOn = isOptionOn(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => selectOption(opt)}
                className={optionClass(isOn)}
              >
                {q.type === "checkbox" && isOn ? (
                  <Check className="size-3.5" />
                ) : null}
                {opt}
              </button>
            );
          })}
          {customValues.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => removeCustom(opt)}
              className={optionClass(true)}
              aria-label={`Remove ${opt}`}
            >
              {q.type === "checkbox" ? <Check className="size-3.5" /> : null}
              {opt}
              <X className="size-3.5 opacity-80" />
            </button>
          ))}
        </div>
      ) : null}

      {q.type === "radio" && q.options ? (
        <div className="flex flex-wrap gap-2">
          {q.options.map((opt) => {
            const isOn = isOptionOn(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => selectOption(opt)}
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
          {customValues.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => removeCustom(opt)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                "border-primary bg-primary text-primary-foreground"
              )}
              aria-label={`Remove ${opt}`}
            >
              {opt}
              <X className="size-3.5 opacity-80" />
            </button>
          ))}
        </div>
      ) : null}

      {hasOtherOption && isOtherOn ? (
        <div className="flex gap-2">
          <Label htmlFor={`${q.id}-other`} className="sr-only">
            Add your own
          </Label>
          <Input
            id={`${q.id}-other`}
            type="text"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onDraftKeyDown}
            disabled={atMax}
            className="h-11 rounded-xl"
            placeholder={atMax ? "Selection limit reached" : "Type and add/press enter"}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 shrink-0 rounded-xl"
            onClick={addCustom}
            disabled={!draft.trim() || atMax}
            aria-label="Add value"
          >
            <Plus className="size-4" />
          </Button>
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
            placeholder={
              q.id.includes("email")
                ? "you@company.com"
                : q.id === "name"
                  ? "Your full name"
                  : q.id === "ukVisaOther"
                    ? "Please specify your visa"
                    : "Your answer"
            }
          />
        </div>
      ) : null}

      {q.type === "phone" ? (
        <PhoneInputField
          id={q.id}
          value={typeof value === "string" ? value : ""}
          onChange={onText}
          required={!q.optional}
        />
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
              <span>Click to upload PDF</span>
            )}
          </button>
        </div>
      ) : null}
    </fieldset>
  );
}
