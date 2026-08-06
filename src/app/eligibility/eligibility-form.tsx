"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { company } from "@/data/company";

const roles = [
  "Founder / Entrepreneur",
  "Engineer / Developer",
  "Product / Design",
  "Research / Academia",
  "Marketing / Growth",
  "Other",
];

export function EligibilityForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [ukInterest, setUkInterest] = useState("");
  const [background, setBackground] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center shadow-soft sm:p-10"
        role="status"
      >
        <h2 className="text-2xl font-bold tracking-tight">Thank you, {name}!</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          This is a demo form — your answers were not sent to a server. In
          production we would review your profile and invite you to a free
          15-minute discovery call.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            className="h-11 rounded-full px-6 font-semibold uppercase tracking-wide"
            render={<Link href="/consultation" />}
          >
            Book Discovery Call
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full px-6"
            onClick={() => setSubmitted(false)}
          >
            Edit answers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-border/80 bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eq-name">Full name</Label>
          <Input
            id="eq-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-xl"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eq-email">Email</Label>
          <Input
            id="eq-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eq-role">Primary role</Label>
          <select
            id="eq-role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select…</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="eq-years">Years of experience</Label>
          <Input
            id="eq-years"
            required
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="h-11 rounded-xl"
            placeholder="e.g. 8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="eq-interest">Why the UK Global Talent Visa?</Label>
        <Input
          id="eq-interest"
          required
          value={ukInterest}
          onChange={(e) => setUkInterest(e.target.value)}
          className="h-11 rounded-xl"
          placeholder="Career goals, company move, founding…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="eq-bg">
          Brief background (impact, recognition, products, research)
        </Label>
        <Textarea
          id="eq-bg"
          required
          rows={5}
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          className="rounded-xl"
          placeholder="Share the highlights of your profile…"
        />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="eq-consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          required
        />
        <Label htmlFor="eq-consent" className="font-normal leading-relaxed">
          I agree to be contacted by {company.name} about my eligibility and a
          free discovery call. Demo UI only — no data is stored.
        </Label>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-full font-semibold uppercase tracking-wide"
        disabled={!consent}
      >
        Submit &amp; Request Discovery Call
      </Button>
    </form>
  );
}
