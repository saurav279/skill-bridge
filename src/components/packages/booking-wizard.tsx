"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Loader2 } from "lucide-react";
import { createPackageCheckout, getAvailableSlots } from "@/api/useCalendar";
import { BadgeText } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addCalendarDays,
  addWeekdays,
  clampToWeekday,
  formatUkCalendarDate,
  getUkToday,
  isUkWeekendInstant,
  isWeekendDate,
  nextWeekdayOnOrAfter,
  previousWeekdayOnOrBefore,
} from "@/lib/uk-date";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { IntakeProfileFields, RequiredMark } from "@/components/shared/intake-fields";
import {
  currentVisaForPayload,
  parseCurrentVisa,
  validateIntakeDetails,
} from "@/lib/intake-details";
import type { ServicePackage } from "@/types";
import type { PackageNameTypes } from "@/types/packages";
import type { BookingDetails, CalendarSlot, LivesInUk, UkVisaOption } from "@/types/consultation";

const STEPS = ["Details", "Time", "Pay"] as const;
const DESCRIPTION_MAX = 500;
const DATE_WINDOW_DAYS = 60;
/** First bookable UK calendar day is tomorrow, not today. */
const FIRST_BOOKABLE_OFFSET_DAYS = 1;
const SLOT_TAKEN = "already booked";

type StepIndex = 0 | 1 | 2;

type BookingWizardProps = {
  pkg: ServicePackage;
};

type Draft = BookingDetails & {
  date: string;
  slot: CalendarSlot | null;
};

function storageKey(packageId: string) {
  return `skill-bridge:booking:${packageId}`;
}

function emptyDraft(date: string): Draft {
  return {
    name: "",
    email: "",
    phone: "",
    livesInUk: "",
    ukVisa: "",
    ukVisaOther: "",
    description: "",
    date,
    slot: null,
  };
}

function readStoredPhone(parsed: Partial<Draft> & { phoneCountryCode?: string }) {
  if (typeof parsed.phone === "string" && parsed.phone.startsWith("+")) {
    return parsed.phone;
  }
  const national =
    typeof parsed.phone === "string" ? parsed.phone.replace(/\D/g, "") : "";
  const code =
    typeof parsed.phoneCountryCode === "string" ? parsed.phoneCountryCode : "";
  if (code && national) return `${code}${national}`;
  return "";
}

function asLivesInUk(value: unknown): LivesInUk | "" {
  return value === "yes" || value === "no" ? value : "";
}

function asUkVisa(value: unknown): UkVisaOption | "" {
  return parseCurrentVisa(typeof value === "string" ? value : "").ukVisa;
}

function visaSummary(draft: BookingDetails): string {
  if (draft.livesInUk !== "yes") return "—";
  return currentVisaForPayload(draft) ?? "—";
}

function readDraft(
  packageId: string,
  minDate: string,
  maxDate: string
): Draft {
  if (typeof window === "undefined") return emptyDraft(minDate);
  try {
    const raw = sessionStorage.getItem(storageKey(packageId));
    if (!raw) return emptyDraft(minDate);
    const parsed = JSON.parse(raw) as Partial<Draft>;
    const storedDate =
      typeof parsed.date === "string" ? parsed.date : minDate;
    const date = clampToWeekday(storedDate, minDate, maxDate);
    const slot =
      parsed.slot && typeof parsed.slot.startTime === "string"
        ? parsed.slot
        : null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      phone: readStoredPhone(parsed),
      livesInUk: asLivesInUk(parsed.livesInUk),
      ukVisa: asUkVisa(parsed.ukVisa),
      ukVisaOther:
        typeof parsed.ukVisaOther === "string" ? parsed.ukVisaOther : "",
      description:
        typeof parsed.description === "string" ? parsed.description : "",
      date,
      slot: date === storedDate ? slot : null,
    };
  } catch {
    return emptyDraft(minDate);
  }
}

export function BookingWizard({ pkg }: BookingWizardProps) {
  const today = useMemo(() => getUkToday(), []);
  const minDate = useMemo(
    () =>
      nextWeekdayOnOrAfter(
        addCalendarDays(today, FIRST_BOOKABLE_OFFSET_DAYS)
      ),
    [today]
  );
  const maxDate = useMemo(
    () =>
      previousWeekdayOnOrBefore(addCalendarDays(today, DATE_WINDOW_DAYS)),
    [today]
  );

  const [step, setStep] = useState<StepIndex>(0);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(minDate));
  const [hydrated, setHydrated] = useState(false);
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(readDraft(pkg.slug, minDate, maxDate));
    setHydrated(true);
  }, [pkg.slug, minDate, maxDate]);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(storageKey(pkg.slug), JSON.stringify(draft));
  }, [draft, hydrated, pkg.slug]);

  const loadSlots = useCallback(
    async (date: string, options?: { clearSlot?: boolean }) => {
      setSlotsLoading(true);
      setSlotsError(null);
      if (options?.clearSlot) {
        setDraft((prev) => ({ ...prev, slot: null }));
      }

      if (isWeekendDate(date)) {
        setSlots([]);
        setSlotsLoading(false);
        return;
      }

      const { success, data, error } = await getAvailableSlots({
        date,
        duration: pkg.slotDurationMinutes,
      });

      setSlotsLoading(false);

      if (!success || !data) {
        setSlots([]);
        setSlotsError(error ?? "Could not load available times.");
        return;
      }

      const weekdaySlots = data.slots.filter(
        (slot) => !isUkWeekendInstant(slot.startTime)
      );
      setSlots(weekdaySlots);
      setDraft((prev) => {
        if (!prev.slot) return prev;
        const stillOpen = weekdaySlots.some(
          (slot) => slot.startTime === prev.slot?.startTime
        );
        return stillOpen ? prev : { ...prev, slot: null };
      });
    },
    [pkg.slotDurationMinutes]
  );

  useEffect(() => {
    if (!hydrated || step !== 1) return;
    void loadSlots(draft.date);
  }, [draft.date, hydrated, loadSlots, step]);

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function validateDetails(): boolean {
    const intakeError = validateIntakeDetails(draft);
    if (intakeError) {
      setDetailsError(intakeError);
      return false;
    }
    const description = draft.description.trim();
    if (!description) {
      setDetailsError("Please add a short note about what you’d like to cover.");
      return false;
    }
    if (description.length > DESCRIPTION_MAX) {
      setDetailsError(`Please keep your note under ${DESCRIPTION_MAX} characters.`);
      return false;
    }

    setDetailsError(null);
    return true;
  }

  function onDetailsContinue(e: FormEvent) {
    e.preventDefault();
    if (!validateDetails()) return;
    setDraft((prev) => ({
      ...prev,
      name: prev.name.trim(),
      email: prev.email.trim(),
      phone: prev.phone,
      ukVisaOther: prev.ukVisaOther.trim(),
      description: prev.description.trim(),
    }));
    setStep(1);
  }

  function onLivesInUk(value: LivesInUk) {
    setDraft((prev) => ({
      ...prev,
      livesInUk: value,
      ukVisa: value === "yes" ? prev.ukVisa : "",
      ukVisaOther: value === "yes" ? prev.ukVisaOther : "",
    }));
  }

  function onUkVisa(value: UkVisaOption) {
    setDraft((prev) => ({
      ...prev,
      ukVisa: value,
      ukVisaOther: value === "Others" ? prev.ukVisaOther : "",
    }));
  }

  function onDateChange(next: string) {
    const date = clampToWeekday(next, minDate, maxDate);
    setDraft((prev) => ({ ...prev, date, slot: null }));
  }

  async function onPay() {
    if (!draft.slot) {
      setPayError("Please choose a time slot.");
      setStep(1);
      return;
    }

    setPaying(true);
    setPayError(null);

    const origin = window.location.origin;
    const { success, data, error } = await createPackageCheckout({
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone,
      livesInUk: draft.livesInUk === "yes",
      currentVisa: currentVisaForPayload(draft),
      description: draft.description.trim(),
      packageName: pkg.slug as PackageNameTypes,
      startTime: draft.slot.startTime,
      endTime: draft.slot.endTime,
      successUrl: `${origin}/packages/success?package=${pkg.slug}`,
      cancelUrl: `${origin}/packages/cancel?package=${pkg.slug}`,
    });

    if (!success || !data?.url) {
      const message = error ?? "Checkout failed. Please try again.";
      setPaying(false);
      setPayError(message);

      if (message.toLowerCase().includes(SLOT_TAKEN)) {
        toast.error(
          "That time is no longer available",
          "Please pick another slot."
        );
        setDraft((prev) => ({ ...prev, slot: null }));
        setStep(1);
        await loadSlots(draft.date, { clearSlot: true });
      }
      return;
    }

    window.location.href = data.url;
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
      <div className="border-b border-border/70 px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            {STEPS[step]}
          </span>
          <BadgeText text={`${step + 1} / ${STEPS.length}`} />
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex gap-1.5">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={cn(
                "h-1.5 min-w-6 flex-1 rounded-full transition-colors",
                i === step
                  ? "bg-primary"
                  : i < step
                    ? "bg-primary/40"
                    : "bg-muted-foreground/20"
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-8">
        {step === 0 ? (
          <form onSubmit={onDetailsContinue} className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Your details
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                We’ll use this for your booking confirmation and calendar invite.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booking-name">
                  Name
                  <RequiredMark />
                </Label>
                <Input
                  id="booking-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={draft.name}
                  onChange={(e) => updateDraft("name", e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-email">
                  Email
                  <RequiredMark />
                </Label>
                <Input
                  id="booking-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={draft.email}
                  onChange={(e) => updateDraft("email", e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <IntakeProfileFields
              phone={draft.phone}
              livesInUk={draft.livesInUk}
              ukVisa={draft.ukVisa}
              ukVisaOther={draft.ukVisaOther}
              onPhone={(value) => updateDraft("phone", value)}
              onLivesInUk={onLivesInUk}
              onUkVisa={onUkVisa}
              onUkVisaOther={(value) => updateDraft("ukVisaOther", value)}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="booking-description">What you want to discuss with us?<RequiredMark /></Label>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {draft.description.length}/{DESCRIPTION_MAX}
                </span>
              </div>
              <Textarea
                id="booking-description"
                name="description"
                placeholder="A short note on your background and what you’d like to discuss."
                value={draft.description}
                onChange={(e) =>
                  updateDraft(
                    "description",
                    e.target.value.slice(0, DESCRIPTION_MAX)
                  )
                }
                required
                rows={5}
                maxLength={DESCRIPTION_MAX}
                className="resize-y rounded-xl"
              />
            </div>

            {detailsError ? (
              <p className="text-sm text-destructive" role="alert">
                {detailsError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl sm:w-auto sm:px-8"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </form>
        ) : null}

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Choose a time
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Times are in the UK ({pkg.slotDurationMinutes}-minute slots),
                Monday to Friday. Weekend dates are not available.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-xl"
                  disabled={
                    addWeekdays(draft.date, -1) < minDate || slotsLoading
                  }
                  onClick={() =>
                    onDateChange(addWeekdays(draft.date, -1))
                  }
                  aria-label="Previous day"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <p className="min-w-0 flex-1 text-center text-sm font-medium sm:min-w-[220px]">
                  {formatUkCalendarDate(draft.date)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-xl"
                  disabled={
                    addWeekdays(draft.date, 1) > maxDate || slotsLoading
                  }
                  onClick={() =>
                    onDateChange(addWeekdays(draft.date, 1))
                  }
                  aria-label="Next day"
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={draft.date}
                  onChange={(e) => onDateChange(e.target.value)}
                  disabled={slotsLoading}
                  className="h-11 rounded-xl pl-9"
                  aria-label="Choose a date"
                />
              </div>
            </div>

            {slotsLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading times…
              </div>
            ) : slotsError ? (
              <div
                className="rounded-xl border border-border/80 bg-muted/20 px-4 py-8 text-center"
                role="alert"
              >
                <p className="text-sm text-destructive">{slotsError}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 h-10 rounded-xl"
                  onClick={() => void loadSlots(draft.date)}
                >
                  Try again
                </Button>
              </div>
            ) : slots.length === 0 ? (
              <div className="rounded-xl border border-border/80 bg-muted/20 px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No times available on this day. Try another date.
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                role="listbox"
                aria-label="Available time slots"
              >
                {slots.map((slot) => {
                  const selected = draft.slot?.startTime === slot.startTime;
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => updateDraft("slot", slot)}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/80 bg-background text-foreground hover:border-primary/40"
                      )}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-6"
                onClick={() => setStep(0)}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button
                type="button"
                className="h-11 rounded-xl px-8"
                disabled={!draft.slot}
                onClick={() => setStep(2)}
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Confirm and pay
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                You’ll be redirected to Stripe Checkout. The calendar invite is
                created after payment is confirmed.
              </p>
            </div>

            <dl className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border/80">
              <SummaryRow label="Package" value={pkg.name} />
              <SummaryRow label="Name" value={draft.name} />
              <SummaryRow label="Email" value={draft.email} />
              <SummaryRow label="Phone" value={draft.phone} />
              <SummaryRow
                label="Lives in UK"
                value={draft.livesInUk === "yes" ? "Yes" : "No"}
              />
              {draft.livesInUk === "yes" ? (
                <SummaryRow label="Current visa" value={visaSummary(draft)} />
              ) : null}
              <SummaryRow
                label="Date"
                value={formatUkCalendarDate(draft.date)}
              />
              <SummaryRow
                label="Time"
                value={draft.slot?.label ?? "—"}
              />
              <SummaryRow label="Note" value={draft.description} />
              <SummaryRow label="Cost" value={pkg.priceLabel ?? "—"} />
            </dl>

            {payError ? (
              <p className="text-sm text-destructive" role="alert">
                {payError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-6"
                disabled={paying}
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button
                type="button"
                className="h-11 rounded-xl px-8"
                disabled={paying || !draft.slot}
                onClick={() => void onPay()}
              >
                {paying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting…
                  </>
                ) : (
                  <>
                    <Check className="size-4" />
                    Pay with Stripe
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed break-words">{value}</dd>
    </div>
  );
}
