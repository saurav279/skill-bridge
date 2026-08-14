import type { PackageNameTypes } from "@/types/packages";

export type CalendarSlot = {
  label: string;
  startTime: string;
  endTime: string;
};

export type AvailableSlotsResponse = {
  date: string;
  timeZone: string;
  slots: CalendarSlot[];
};

export type LivesInUk = "yes" | "no";
export type UkVisaOption = "PSW" | "Skill visa" | "Others";

export type CreatePackageCheckoutPayload = {
  name: string;
  email: string;
  phone: string;
  livesInUk: boolean;
  currentVisa?: string;
  description: string;
  packageName: PackageNameTypes;
  startTime: string;
  endTime: string;
  successUrl: string;
  cancelUrl: string;
};

export type CreatePackageCheckoutResponse = {
  url: string;
};

export type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  livesInUk: LivesInUk | "";
  ukVisa: UkVisaOption | "";
  ukVisaOther: string;
  description: string;
};
