export type ApiError = {
  error: string;
};

export type AdminListQuery = {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  order?: "asc" | "desc";
  packageName?: string;
};

export type AdminListResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  message: "OTP sent";
};

export type AdminOtpRequest = {
  email: string;
  otp: string;
};

export type AdminOtpResponse = {
  message: "Logged in";
};

export type AdminAssessmentListItem = {
  id: string;
  routeId: string;
  contactName: string | null;
  contactEmail: string | null;
  phone: string | null;
  resumeLink: string | null;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
};

export type RouteId = "digital-technology" | "academia" | "arts";

export type AssessSectionAnswers = Record<string, string | string[]>;

export type AssessPayload = {
  routeId: RouteId;
  resumeLink?: string;
  [sectionId: string]: string | AssessSectionAnswers | undefined;
};

export type AssessmentReport = {
  id: string;
  routeId: string;
  customerName?: string;
  customerEmail?: string;
  summary: string;
  headline: string;
  confidenceScore: number;
  breakdown: Array<{ id: string; label: string; score: number }>;
  strengths: string[];
  improvements: string[];
  priorityImprovements: Array<{
    id: string;
    priority: "high" | "medium" | "easy";
    title: string;
    description: string;
  }>;
  overallRecommendation: string;
};

export type AdminAssessmentDetail = AdminAssessmentListItem & {
  payload: AssessPayload;
  report: AssessmentReport;
};

export type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  livesInUk: boolean;
  currentVisa: string | null;
  prefered: "phone" | "google_meet" | string | null;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminPackagePurchase = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  amount: number;
  currency: string;
  packageName: string;
  createdAt: string;
  updatedAt: string;
};
