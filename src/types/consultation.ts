import type { PackageName } from "@/types/packages";

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

export type CreateConsultationCheckoutPayload = {
  name: string;
  email: string;
  description: string;
  packageName: PackageName;
  startTime: string;
  endTime: string;
  successUrl: string;
  cancelUrl: string;
};

export type CreateConsultationCheckoutResponse = {
  url: string;
};

export type BookingDetails = {
  name: string;
  email: string;
  description: string;
};
