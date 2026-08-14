import { isPossiblePhoneNumber } from "libphonenumber-js/max";
import type { LivesInUk, UkVisaOption } from "@/types/consultation";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;

export const VISA_OPTIONS: { id: UkVisaOption; label: string }[] = [
  { id: "psw", label: "PSW" },
  { id: "skill-visa", label: "Skill visa" },
  { id: "other", label: "Others" },
];

export type IntakeDetails = {
  name: string;
  email: string;
  phone: string;
  livesInUk: LivesInUk | "";
  ukVisa: UkVisaOption | "";
  ukVisaOther: string;
};

export function currentVisaForPayload(details: {
  livesInUk: LivesInUk | "";
  ukVisa: UkVisaOption | "";
  ukVisaOther: string;
}): string | undefined {
  if (details.livesInUk !== "yes") return undefined;
  if (details.ukVisa === "psw") return "PSW";
  if (details.ukVisa === "skill-visa") return "Skill visa";
  if (details.ukVisa === "other") return details.ukVisaOther.trim() || undefined;
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
    details.ukVisa === "other" &&
    !details.ukVisaOther.trim()
  ) {
    return "Please specify your visa.";
  }

  return null;
}
