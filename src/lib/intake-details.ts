import { isPossiblePhoneNumber } from "libphonenumber-js/max";
import type { LivesInUk, UkVisaOption } from "@/types/consultation";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;

export const VISA_OPTIONS: { id: UkVisaOption; label: string }[] = [
  { id: "PSW Visa", label: "PSW Visa" },
  { id: "Skill Worker Visa", label: "Skill Worker Visa" },
  { id: "Dependent Visa", label: "Dependent Visa" },
  { id: "Student Visa", label: "Student Visa" },
  { id: "Others", label: "Others" },
];

export type IntakeDetails = {
  name: string;
  email: string;
  phone: string;
  livesInUk: LivesInUk | "";
  ukVisa: UkVisaOption | "";
  ukVisaOther: string;
};

export function parseCurrentVisa(value: string | undefined | null): {
  ukVisa: UkVisaOption | "";
  ukVisaOther: string;
} {
  if (!value) return { ukVisa: "", ukVisaOther: "" };
  if (value === "PSW" || value === "psw") {
    return { ukVisa: "PSW Visa", ukVisaOther: "" };
  }
  if (value === "Skill visa" || value === "skill-visa") {
    return { ukVisa: "Skill Worker Visa", ukVisaOther: "" };
  }
  if (value === "Others" || value === "other") {
    return { ukVisa: "Others", ukVisaOther: "" };
  }
  return { ukVisa: "Others", ukVisaOther: value };
}

export function currentVisaForPayload(details: {
  livesInUk: LivesInUk | "";
  ukVisa: UkVisaOption | "";
  ukVisaOther: string;
}): string | undefined {
  if (details.livesInUk !== "yes") return undefined;
  if (details.ukVisa === "PSW Visa" || details.ukVisa === "Skill Worker Visa") {
    return details.ukVisa;
  }
  if (details.ukVisa === "Others") {
    return details.ukVisaOther.trim() || undefined;
  }
  return undefined;
}

export function isCompletePhoneNumber(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;

  try {
    if (isPossiblePhoneNumber(trimmed)) return true;
  } catch {
    // Fall through to digit-length check.
  }

  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_DIGITS;
}

/** Returns an error message, or null if the shared intake fields are valid. */
export function validateIntakeDetails(details: IntakeDetails): string | null {
  const name = details.name.trim();
  const email = details.email.trim();

  if (!name) return "Please enter your name.";
  if (!EMAIL_PATTERN.test(email)) return "Please enter a valid email address.";
  if (!isCompletePhoneNumber(details.phone)) {
    return "Please enter a valid phone number.";
  }
  if (!details.livesInUk) {
    return "Please tell us whether you live in the UK.";
  }
  if (details.livesInUk === "yes" && !details.ukVisa) {
    return "Please select which visa you are on.";
  }
  if (
    details.livesInUk === "yes" &&
    details.ukVisa === "Others" &&
    !details.ukVisaOther.trim()
  ) {
    return "Please specify your visa.";
  }

  return null;
}
