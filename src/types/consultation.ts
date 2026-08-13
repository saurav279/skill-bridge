import type { ConsultationPackageTypes } from "@/types/packages";

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
  packageName: ConsultationPackageTypes;
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


export type CreateFreeConsultationCheckoutResponse= {
  consultationId: string;
  htmlLink:string
};

export type CreateFreeConsultationCheckoutPayload = {
  name: string;
  email: string;
  description: string;
  packageName: ConsultationPackageTypes;
  startTime: string;
  endTime: string;
};