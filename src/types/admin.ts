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
  from?: string;
  to?: string;
  status?: string;
  leadId?: string;
  userId?: string;
  planId?: string;
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

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  secondaryEmail: string | null;
  secondaryPhone: string | null;
  priority: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadStatusCounts = {
  total: number;
  highPriority: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
};

export type LeadListItem = Lead & {
  latestStatus: string | null;
  totalNoteCount: number;
  lastNote: string | null;
  lastNoteCreatedAt: string | null;
};

export type PipelineItem = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteItem = {
  id: string;
  note: string;
  notedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadDetail = Lead & {
  pipelines: PipelineItem[];
  notes: NoteItem[];
};

export type CreateLeadRequest = {
  name: string;
  email: string;
  phone: string;
  secondaryEmail?: string | null;
  secondaryPhone?: string | null;
  priority?: string | null;
};

export type UpdateLeadRequest = {
  name?: string;
  email?: string;
  phone?: string;
  secondaryEmail?: string | null;
  secondaryPhone?: string | null;
  priority?: string | null;
};

export type DeleteLeadResponse = {
  message: "Lead deleted.";
};

export type CreatePipelineRequest = {
  leadId: string;
  status: string;
};

export type CreateNoteRequest = {
  leadId: string;
  note: string;
  notedBy: string;
};

export type UpdateNoteRequest = {
  note?: string;
  notedBy?: string;
};

export type InstallmentStatus =
  | "upcoming"
  | "due"
  | "link_sent"
  | "paid"
  | "failed"
  | "overdue"
  | "cancelled";

export type PaymentPlanStatus =
  | "on_track"
  | "overdue"
  | "complete"
  | "cancelled";

export type PaymentPlanPackageName =
  | "strategy-call"
  | "leadership-enhancement"
  | "diy-membership"
  | "review-only"
  | "full-review"
  | "strategy-session"
  | "bespoke-coaching"
  | "appeal-diagnosis"
  | "appeal-rebuild"
  | "appeal-full-support";

export type Installment = {
  id: string;
  planId: string;
  userId: string;
  leadId: string | null;
  sequence: number;
  installmentCount: number;
  amount: number;
  currency: string;
  dueAt: string;
  status: InstallmentStatus;
  checkoutUrl: string | null;
  checkoutExpiresAt: string | null;
  linkSentAt: string | null;
  paidAt: string | null;
  failedAt: string | null;
  paidOffline: boolean;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  packageName: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type PaymentPlanListItem = {
  id: string;
  userId: string;
  leadId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  packageName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  installmentCount: number;
  paidCount: number;
  intervalDays: number;
  firstDueAt: string;
  nextDueAt: string | null;
  status: PaymentPlanStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaymentPlanDetail = PaymentPlanListItem & {
  installments: Installment[];
};

export type PaymentPlanStatusCounts = {
  total: number;
  onTrack: number;
  overdue: number;
  complete: number;
  cancelled: number;
};

export type InstallmentStatusCounts = {
  total: number;
  upcoming: number;
  due: number;
  linkSent: number;
  paid: number;
  failed: number;
  overdue: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  phone?: string | null;
  leadId?: string | null;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  phone?: string | null;
  leadId?: string | null;
};

export type CreatePaymentPlanRequest = {
  userId: string;
  packageName: PaymentPlanPackageName;
  totalAmount: number;
  currency?: "gbp";
  installmentCount?: number;
  intervalDays?: number;
  firstDueAt: string;
  installments?: Array<{
    amount: number;
    dueAt: string;
  }>;
};

export type CreateInstallmentCheckoutRequest = {
  successUrl?: string;
  cancelUrl?: string;
};

export type EmailInstallmentResponse = {
  message: string;
  installment: Installment;
};

export type UpdateInstallmentRequest = {
  amount?: number;
  dueAt?: string;
  paidOffline?: boolean;
};
