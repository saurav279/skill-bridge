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
  validateIntakeDetails,
} from "@/lib/intake-details";
import { cn } from "@/lib/utils";
import type { ContactTalkPreference } from "@/api/useContact";
import type { LivesInUk, UkVisaOption } from "@/types/consultation";

const TALK_PREFERENCES: { id: ContactTalkPreference; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "google_meet", label: "Google Meet" },
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [livesInUk, setLivesInUk] = useState<LivesInUk | "">("");
  const [ukVisa, setUkVisa] = useState<UkVisaOption | "">("");
  const [ukVisaOther, setUkVisaOther] = useState("");
  const [prefered, setPrefered] = useState<ContactTalkPreference | "">("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onLivesInUk(value: LivesInUk) {
    setLivesInUk(value);
    if (value !== "yes") {
      setUkVisa("");
      setUkVisaOther("");
    }
  }

  function onUkVisa(value: UkVisaOption) {
    setUkVisa(value);
    if (value !== "other") setUkVisaOther("");
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
    setName("");
    setEmail("");
    setPhone("");
    setLivesInUk("");
    setUkVisa("");
    setUkVisaOther("");
    setPrefered("");
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
          Thanks for reaching out. We’ll get back to you within one business
          day.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 h-10 rounded-xl"
          onClick={resetForm}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="space-y-5 rounded-2xl border border-border/80 bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
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
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
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
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      <IntakeProfileFields
        phone={phone}
        livesInUk={livesInUk}
        ukVisa={ukVisa}
        ukVisaOther={ukVisaOther}
        disabled={submitting}
        onPhone={setPhone}
        onLivesInUk={onLivesInUk}
        onUkVisa={onUkVisa}
        onUkVisaOther={setUkVisaOther}
      />

      <fieldset className="space-y-3" disabled={submitting}>
        <legend className="text-sm font-medium">
          How would you prefer to talk?
          <RequiredMark />
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

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl sm:w-auto sm:px-8"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
