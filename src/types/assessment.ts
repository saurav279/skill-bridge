export type PriorityLevel = "high" | "medium" | "easy";
export type ProbabilityLabel = "Emerging" | "Moderate" | "Strong";

export type ScoreBreakdownItem = {
  id: string;
  label: string;
  score: number;
};

export type PriorityImprovement = {
  id: string;
  priority: PriorityLevel;
  title: string;
  description: string;
};

/** Full assessment returned by POST/GET /assessments */
export type Assessment = {
  id: string;
  routeId: string;
  summary: string;
  headline: string;
  breakdown: ScoreBreakdownItem[];
  strengths: string[];
  improvements: string[];
  confidenceScore: number;
  priorityImprovements: PriorityImprovement[];
  overallRecommendation: string;
  createdAt: string;
  customerEmail: string;
};

/** Per-section answers keyed as `section_question_id` */
export type AssessSectionAnswers = Record<string, unknown>;

export type AssessPayload = {
  routeId: string;
  [sectionId: string]: string | AssessSectionAnswers;
};

/** Subset commonly used after create */
export type AssessSummary = Pick<
  Assessment,
  "id" | "confidenceScore" | "summary" | "improvements"
>;

export function potentialFromScore(score: number): {
  label: string;
  probability: ProbabilityLabel;
} {
  if (score >= 75)
    return { label: "Strong Potential", probability: "Strong" };
  if (score >= 50)
    return { label: "Moderate Potential", probability: "Moderate" };
  return { label: "Emerging Potential", probability: "Emerging" };
}

export function starRatingFromScore(score: number) {
  return Math.min(5, Math.max(1, Math.round(score / 20)));
}
