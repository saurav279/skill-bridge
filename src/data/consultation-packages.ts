import type { ConsultationPackageTypes } from "@/types/packages";

export type ConsultationPackage = {
  id: ConsultationPackageTypes;
  name: string;
  tagline: string;
  heading: string;
  description: string;
  /** Slot length in minutes. Sent as `duration` on available-slots. */
  slotDurationMinutes: number;
  cost:number;
};

export const consultationPackages: Record<ConsultationPackageTypes, ConsultationPackage> = {
  "free-strategy-call": {
    id: "free-strategy-call",
    name: "Free Strategy Call",
    tagline: "Consultation",
    heading: "Book a free 15-minute discovery call",
    description:
      "Book a focused consultation. We’ll review your assessment results at a high level and outline whether a Global Talent pathway is a strong fit.",
    slotDurationMinutes: 15,
    cost:0,
  },
  "paid-strategy-call": {
    id: "paid-strategy-call",
    name: "Paid Strategy Call",
    tagline: "Consultation",
    heading: "Book a paid 30-minute discovery call",
    description:
      "Book a focused consultation. We’ll review your assessment results at a high level and outline whether a Global Talent pathway is a strong fit.",
    slotDurationMinutes: 30,
    cost:100,
  },
 

};

export const consultationPackageIds: ConsultationPackageTypes[] = ["free-strategy-call", "paid-strategy-call"];

export function isConsultationPackageId(value: string): value is ConsultationPackageTypes {
  return consultationPackageIds.includes(value as ConsultationPackageTypes);
}

export function getConsultationPackage(id: string): ConsultationPackage | undefined {
  if (!isConsultationPackageId(id)) return undefined;
  return consultationPackages[id];
}
