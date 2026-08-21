"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { submitContactUs } from "@/api/useContact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IntakeProfileFields, RequiredMark } from "@/components/shared/intake-fields";
import {
  currentVisaForPayload,
  parseCurrentVisa,
  pickPhone,
  validateIntakeDetails,
} from "@/lib/intake-details";
import { cn } from "@/lib/utils";
import type { ContactTalkPreference } from "@/api/useContact";
import type { LivesInUk, UkVisaOption } from "@/types/consultation";
import Link from "next/link";
import { useUserStore, useUserStoreHydrated } from "@/stores/user-details";
import PrivacyAndTermsConsent from "./privacy-and-terms-consent";

const TALK_PREFERENCES: { id: ContactTalkPreference; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "email", label: "Email" },
];

export function ContactForm({
  defaultValues,
}: {
  defaultValues?: Partial<{
    name: string;
    email: string;
    phone: string;
    livesInUk: boolean;
    currentVisa?: string;
    subject: string;
    message: string;
  }>;
}) {
  const hydrated = useUserStoreHydrated();
  const personalInfo = useUserStore((s) => s.personalInfo);
  const setPersonalInfo = useUserStore((s) => s.setPersonalInfo);

  const parsedDefaultVisa = parseCurrentVisa(defaultValues?.currentVisa);
  const name = defaultValues?.name || (hydrated ? personalInfo.name : "") || "";
  const email = defaultValues?.email || (hydrated ? personalInfo.email : "") || "";
  const phone = pickPhone(
    defaultValues?.phone ?? "",
    hydrated ? personalInfo.phone : ""
  );
  const livesInUk: LivesInUk | "" =
    defaultValues?.livesInUk === true
      ? "yes"
      : defaultValues?.livesInUk === false
        ? "no"
        : hydrated
          ? personalInfo.liveInUk || ""
          : "";
  const ukVisa: UkVisaOption | "" =
    parsedDefaultVisa.ukVisa || (hydrated ? personalInfo.currentVisa || "" : "");
  const ukVisaOther =
    parsedDefaultVisa.ukVisaOther || (hydrated ? personalInfo.ukVisaOther || "" : "");

  const [prefered, setPrefered] = useState<ContactTalkPreference | "">("phone");
  const [subject, setSubject] = useState(defaultValues?.subject || "");
  const [message, setMessage] = useState(defaultValues?.message || "");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onLivesInUk(value: LivesInUk) {
    setPersonalInfo({
      liveInUk: value,
      ...(value !== "yes" ? { currentVisa: undefined, ukVisaOther: undefined } : {}),
    });
  }

  function onUkVisa(value: UkVisaOption) {
    setPersonalInfo({
      currentVisa: value,
      ...(value !== "Others" ? { ukVisaOther: undefined } : {}),
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const intakeError = validateIntakeDetails({
      name,
      email,
      phone,
      livesInUk,
      ukVisa,
      ukVisaOther,
    });
    if (intakeError) {
      setError(intakeError);
      return;
    }
    if (!prefered) {
      setError("Please choose how you’d prefer to talk.");
      return;
    }
    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    setSubmitting(true);

    const { success, error: submitError } = await submitContactUs({
      name: name.trim(),
      email: email.trim(),
      phone,
      livesInUk: livesInUk === "yes",
      currentVisa: currentVisaForPayload({ livesInUk, ukVisa, ukVisaOther }),
      prefered,
      subject: subject.trim(),
      message: message.trim(),
    });

    setSubmitting(false);

    if (!success) {
      setError(submitError ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false);
    setError(null);
    setPrefered("phone");
    setSubject("");
    setMessage("");
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-soft sm:p-10"
        role="status"
      >
        <p className="text-lg font-semibold tracking-tight">Message sent</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. Our team will review your message and get back to
          you within 5 business days.
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Need personalised guidance sooner? Book a 1:1 strategy call and get your personalized slot to discuss
          your assessment, explore your UK options, and get clear on your next steps
          with our team.
        </p>
        <Button
          type="button"

          className="mt-6 h-10 rounded-xl px-6"
          onClick={resetForm}
          render={<Link href="/packages/strategy-call" target="_blank" rel="noopener noreferrer" />}
        >
          Book a paid strategy call
        </Button>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border/80 bg-card p-8 shadow-soft sm:p-10">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading your details</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="space-y-5 rounded-2xl border border-border/80 bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {!defaultValues?.name && <div className="space-y-2">
          <Label htmlFor="contact-name">
            Name
            <RequiredMark />
          </Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setPersonalInfo({ name: e.target.value })}
            required
            disabled={submitting}
            className="h-11 rounded-xl"
          />
        </div>}
        {!defaultValues?.email && <div className="space-y-2">
          <Label htmlFor="contact-email">
            Email
            <RequiredMark />
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setPersonalInfo({ email: e.target.value })}
            required
            disabled={submitting}
            className="h-11 rounded-xl"
          />
        </div>}
      </div>

      {!defaultValues?.phone && <IntakeProfileFields
        phone={phone}
        livesInUk={livesInUk}
        ukVisa={ukVisa}
        ukVisaOther={ukVisaOther}
        disabled={submitting}
        onPhone={(value) => setPersonalInfo({ phone: value })}
        onLivesInUk={onLivesInUk}
        onUkVisa={onUkVisa}
        onUkVisaOther={(value) => setPersonalInfo({ ukVisaOther: value })}
      />}



      <div className="space-y-2">
        <Label htmlFor="contact-subject">
          Subject
          <RequiredMark />
        </Label>
        <Input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="How can we help?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          disabled={submitting}
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">
          Message
          <RequiredMark />
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Tell us about your background and what you’re looking for."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          disabled={submitting}
          className="resize-y rounded-xl"
        />
      </div>
      <fieldset className="space-y-3" disabled={submitting}>
        <legend className="text-sm font-medium">
          How would you prefer to talk?
          {/* <RequiredMark /> */}
        </legend>
        <div className="flex flex-wrap gap-2">
          {TALK_PREFERENCES.map((option) => {
            const selected = prefered === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                disabled={submitting}
                onClick={() => setPrefered(option.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <PrivacyAndTermsConsent/>
      <div className="flex justify-end">



      <Button
        type="submit"
        className="h-11 w-full rounded-xl sm:w-auto sm:px-8 "
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
      </div>
    </form>
  );
}
