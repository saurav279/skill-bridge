"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { submitContactUs } from "@/api/useContact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { success, error: submitError,data } = await submitContactUs({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
    });

    setSubmitting(false);
    setSuccessMessage(data?.message ?? "Message sent successfully");

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
    setCompany("");
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
      noValidate={false}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
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
          <Label htmlFor="contact-email">Email</Label>
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-company">Company</Label>
          <Input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={submitting}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subject</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
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
