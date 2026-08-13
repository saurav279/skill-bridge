import type { PackageName } from "@/types/packages";

export type ConsultationPackage = {
  id: PackageName;
  name: string;
  tagline: string;
  description: string;
  /** Slot length in minutes. Sent as `duration` on available-slots. */
  slotDurationMinutes: number;
};

export const consultationPackages: Record<PackageName, ConsultationPackage> = {
  A: {
    id: "A",
    name: "Package A",
    tagline: "Consultation",
    description:
      "Book a focused consultation. We’ll review your profile at a high level and outline whether a Global Talent pathway is a strong fit.",
    slotDurationMinutes: 30,
  },
  B: {
    id: "B",
    name: "Package B",
    tagline: "Consultation",
    description:
      "Book a focused consultation. We’ll review your profile at a high level and outline whether a Global Talent pathway is a strong fit.",
    slotDurationMinutes: 30,
  },
  C: {
    id: "C",
    name: "Package C",
    tagline: "Consultation",
    description:
      "Book a focused consultation. We’ll review your profile at a high level and outline whether a Global Talent pathway is a strong fit.",
    slotDurationMinutes: 30,
  },
};

export const consultationPackageIds: PackageName[] = ["A", "B", "C"];

export function isConsultationPackageId(value: string): value is PackageName {
  return consultationPackageIds.includes(value.toUpperCase() as PackageName);
}

export function getConsultationPackage(id: string): ConsultationPackage | undefined {
  const key = id.toUpperCase();
  if (!isConsultationPackageId(key)) return undefined;
  return consultationPackages[key];
}
