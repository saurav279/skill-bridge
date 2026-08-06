export type PriorityLevel = "high" | "medium" | "easy";
export type ProbabilityLabel = "Emerging" | "Moderate" | "Strong";

export type ScoreBreakdownItem = {
  id: string;
  label: string;
  score: number;
};

export type EvidenceItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type PriorityImprovement = {
  id: string;
  priority: PriorityLevel;
  title: string;
  /** ~40–50 words / ~200 characters of actionable guidance */
  description: string;
};

export type RoadmapStep = {
  id: string;
  title: string;
  estimated?: string;
  completed?: boolean;
};

export type AssessmentStatus = {
  profileCompleted: number;
  aiAnalysis: "Completed" | "Pending" | "In progress";
  expertReview: "Completed" | "Pending" | "In progress";
  pdfGenerated: "Completed" | "Pending";
  emailSent: "Completed" | "Pending";
};

export type EligibilityAssessment = {
  id: string;
  confidenceScore: number;
  summary: string;
  improvements: string[];
  nextSteps: string[];
  routeId?: string;
  contactName?: string;
  contactEmail?: string;
  createdAt: string;

  /** Premium report fields */
  headline: string;
  potentialLabel: string;
  probability: ProbabilityLabel;
  targetScore: number;
  starRating: number;
  evidenceUploaded: number;
  criteriaMatched: number;
  criteriaTotal: number;
  strengths: string[];
  attentionAreas: string[];
  overallRecommendation: string;
  breakdown: ScoreBreakdownItem[];
  evidenceChecklist: EvidenceItem[];
  priorityImprovements: PriorityImprovement[];
  roadmap: RoadmapStep[];
  status: AssessmentStatus;
};

type AssessPayload = {
  routeId: string;
  answers: Record<string, unknown>;
  readinessScore?: number;
};

const globalForStore = globalThis as typeof globalThis & {
  __eligibilityAssessments?: Map<string, EligibilityAssessment>;
};

function store() {
  if (!globalForStore.__eligibilityAssessments) {
    globalForStore.__eligibilityAssessments = new Map();
  }
  return globalForStore.__eligibilityAssessments;
}

export function getAssessment(id: string): EligibilityAssessment | undefined {
  const raw = store().get(id);
  if (!raw) return undefined;
  return normalizeAssessment(raw);
}

export function saveAssessment(
  assessment: EligibilityAssessment
): EligibilityAssessment {
  store().set(assessment.id, assessment);
  return assessment;
}

/** Fill premium report fields for legacy / partial API payloads */
export function normalizeAssessment(
  raw: Partial<EligibilityAssessment> &
    Pick<EligibilityAssessment, "id" | "confidenceScore">
): EligibilityAssessment {
  const score = clamp(Math.round(raw.confidenceScore ?? 42), 0, 100);
  const { label: potentialLabel, probability } = potentialFromScore(score);
  const starRating = clamp(Math.round(score / 20), 2, 5);
  const monthsAway =
    score >= 75 ? "3–6 months" : score >= 50 ? "6–12 months" : "12–18 months";

  const defaultBreakdown: ScoreBreakdownItem[] = [
    { id: "leadership", label: "Leadership", score: clamp(score + 18, 20, 96) },
    { id: "innovation", label: "Innovation", score: clamp(score + 8, 18, 94) },
    { id: "impact", label: "Impact", score: clamp(score - 6, 15, 92) },
    { id: "recognition", label: "Recognition", score: clamp(score - 18, 12, 90) },
    {
      id: "publicProfile",
      label: "Public Profile",
      score: clamp(score - 2, 15, 95),
    },
    { id: "evidence", label: "Evidence", score: clamp(score + 12, 15, 93) },
    {
      id: "recommendationLetters",
      label: "Recommendation Letters",
      score: clamp(score - 22, 10, 92),
    },
    { id: "futurePlans", label: "Future Plans", score: clamp(score + 25, 25, 98) },
  ];

  const breakdown = raw.breakdown?.length ? raw.breakdown : defaultBreakdown;

  const defaultChecklist: EvidenceItem[] = [
    { id: "resume", label: "Resume", completed: true },
    { id: "portfolio", label: "Portfolio", completed: score >= 50 },
    { id: "linkedin", label: "LinkedIn", completed: true },
    { id: "awards", label: "Awards", completed: score >= 70 },
    { id: "speaking", label: "Speaking", completed: score >= 60 },
    { id: "publications", label: "Publications", completed: false },
    { id: "letters", label: "Recommendation Letters", completed: score >= 65 },
    { id: "press", label: "Press Coverage", completed: false },
  ];

  const evidenceChecklist = raw.evidenceChecklist?.length
    ? raw.evidenceChecklist
    : defaultChecklist;
  const evidenceUploaded =
    raw.evidenceUploaded ??
    evidenceChecklist.filter((e) => e.completed).length;

  return {
    id: raw.id,
    confidenceScore: score,
    summary: raw.summary ?? "Your profile has been analysed for Global Talent endorsement readiness.",
    improvements: raw.improvements?.length
      ? raw.improvements
      : [
          "Strengthen recommendation letters from senior independent experts.",
          "Add clearer impact metrics tied to your work.",
          "Tighten public profile consistency.",
        ],
    nextSteps: raw.nextSteps?.length
      ? raw.nextSteps
      : [
          "Book a discovery call to review this assessment.",
          "Gather missing evidence within 2–4 weeks.",
          "Draft a criteria-mapped narrative.",
        ],
    routeId: raw.routeId,
    contactName: raw.contactName,
    contactEmail: raw.contactEmail,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    headline:
      raw.headline ??
      "Your profile demonstrates promising technical achievements.",
    potentialLabel: raw.potentialLabel ?? potentialLabel,
    probability: raw.probability ?? probability,
    targetScore: raw.targetScore ?? 75,
    starRating: raw.starRating ?? starRating,
    evidenceUploaded,
    criteriaMatched: raw.criteriaMatched ?? clamp(Math.round(score / 12), 2, 10),
    criteriaTotal: raw.criteriaTotal ?? 10,
    strengths: expandInsightLines(raw.strengths, breakdown, "strength"),
    attentionAreas: expandInsightLines(
      raw.attentionAreas,
      breakdown,
      "attention"
    ),
    overallRecommendation:
      raw.overallRecommendation ??
      `You are likely ${monthsAway} away from a competitive endorsement.`,
    breakdown,
    evidenceChecklist,
    priorityImprovements: raw.priorityImprovements?.length
      ? raw.priorityImprovements.map((item) => ({
          id: item.id,
          priority: item.priority,
          title: item.title,
          description:
            "description" in item && typeof item.description === "string"
              ? item.description
              : `${item.title}. Focus on concrete evidence that independent experts can verify, and package it clearly against the endorsement criteria for your route so assessors can follow the narrative without gaps.`,
        }))
      : [
          {
            id: "letters",
            priority: "high" as const,
            title: "Strengthen recommendation letters",
            description:
              "Prioritise two to three letters from senior independent experts who can quantify your leadership and impact with specific outcomes. Generic praise will not help. Brief recommenders with metrics, dates, and criterion mapping so each letter clearly supports Stage 1 endorsement evidence standards.",
          },
          {
            id: "recognition",
            priority: "medium" as const,
            title: "Build independent public recognition",
            description:
              "Increase third-party visibility through speaking, awards, press, or peer invitations that sit outside your employer. Independent recognition is weighted heavily. Aim for verifiable appearances or coverage that assessors can check online and that clearly relates to your field contribution.",
          },
          {
            id: "linkedin",
            priority: "easy" as const,
            title: "Align and polish public profiles",
            description:
              "Make LinkedIn, portfolio, and personal site consistent with your application narrative. Highlight outcomes, not duties, and surface links to products, papers, or press. A coherent public footprint makes evidence easier to verify and reduces friction during endorsement review.",
          },
        ],
    roadmap: raw.roadmap?.length
      ? raw.roadmap
      : [
          { id: "assessment", title: "Assessment Completed", completed: true },
          { id: "evidence", title: "Gather Evidence", estimated: "2 weeks" },
          {
            id: "letters",
            title: "Strengthen Recommendation Letters",
            estimated: "3 weeks",
          },
          { id: "narrative", title: "Narrative Draft" },
          { id: "review", title: "Review Session" },
          { id: "stage1", title: "Stage 1 Submission" },
          { id: "endorsement", title: "Endorsement" },
          { id: "visa", title: "Visa Application" },
        ],
    status: raw.status ?? {
      profileCompleted: 100,
      aiAnalysis: "Completed",
      expertReview: "Pending",
      pdfGenerated: "Completed",
      emailSent: "Pending",
    },
  };
}

function createId() {
  return `ea_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** ~25–30 word insight lines for AI summary bullets */
const STRENGTH_INSIGHTS: Record<string, string> = {
  leadership:
    "Your leadership record shows credible ownership of teams, products, or agendas, with responsibilities assessors recognise as senior contribution rather than individual delivery alone.",
  innovation:
    "Innovation signals stand out through products, research, or creative work that demonstrate original contribution and practical delivery beyond routine professional output.",
  impact:
    "Impact evidence points to measurable outcomes—users, revenue, citations, or organisational change—that strengthen your case when quantified and independently corroborated.",
  recognition:
    "Recognition indicators suggest peers already notice your work through awards, speaking, or media, giving assessors useful third-party validation of standing in the field.",
  publicProfile:
    "Your public profile footprint is comparatively strong, making achievements easier to verify online and supporting a coherent narrative across LinkedIn, portfolio, and press.",
  evidence:
    "Evidence readiness looks relatively solid, with document types that can map cleanly to endorsement criteria once packaged with dates, metrics, and clear exhibit labels.",
  recommendationLetters:
    "Recommendation letter potential is a relative strength if you can secure senior independent voices who quantify impact with specifics rather than generic endorsement language.",
  futurePlans:
    "Future plans are clear and UK-aligned, which helps assessors see how endorsement would unlock concrete next steps rather than an open-ended relocation story.",
};

const ATTENTION_INSIGHTS: Record<string, string> = {
  leadership:
    "Leadership evidence needs sharper proof of scope—team size, hiring, architecture, or budget ownership—so assessors can see seniority beyond job titles and day-to-day delivery.",
  innovation:
    "Innovation claims need clearer artefacts: shipped products, patents, papers, or open work assessors can inspect, with your specific contribution explained without ambiguity.",
  impact:
    "Impact is underpowered without hard metrics. Add quantified reach, revenue, citations, or organisational outcomes tied directly to your work and timeframe.",
  recognition:
    "Independent recognition looks thin. Prioritise speaking, awards, judging, or press outside your employer so third parties can validate standing in the field.",
  publicProfile:
    "Public profiles feel incomplete or inconsistent. Align LinkedIn, portfolio, and site copy with your application narrative and surface verifiable links to key work.",
  evidence:
    "Evidence coverage has gaps. Build a short exhibit set—letters, awards, metrics, and work samples—mapped explicitly to each criterion you will claim.",
  recommendationLetters:
    "Recommendation letters are a critical gap. Secure two to three senior independent recommenders briefed with metrics, dates, and criterion mapping before Stage 1.",
  futurePlans:
    "UK plans need more specificity. Clarify timeline, intended contribution, and why the UK is the right base so assessors see a credible post-endorsement path.",
};

function insightFor(
  item: ScoreBreakdownItem,
  kind: "strength" | "attention"
): string {
  const map = kind === "strength" ? STRENGTH_INSIGHTS : ATTENTION_INSIGHTS;
  return (
    map[item.id] ??
    (kind === "strength"
      ? `${item.label} is a relative strength in this profile. Package concrete examples with dates and outcomes so assessors can verify the contribution quickly.`
      : `${item.label} needs focused attention. Strengthen documentation and third-party validation here before Stage 1 so this criterion does not weaken the overall file.`)
  );
}

function expandInsightLines(
  lines: string[] | undefined,
  breakdown: ScoreBreakdownItem[],
  kind: "strength" | "attention"
): string[] {
  if (lines?.length && lines.every((l) => l.split(/\s+/).length >= 18)) {
    return lines;
  }
  const ordered =
    kind === "strength"
      ? [...breakdown].sort((a, b) => b.score - a.score)
      : [...breakdown].sort((a, b) => a.score - b.score);
  return ordered.slice(0, 3).map((b) => insightFor(b, kind));
}

function optionCount(answers: Record<string, unknown>, key: string) {
  const v = answers[key];
  return Array.isArray(v) ? v.length : v ? 1 : 0;
}

function hasAnswer(answers: Record<string, unknown>, key: string, value?: string) {
  const v = answers[key];
  if (value === undefined) {
    if (Array.isArray(v)) return v.length > 0;
    return Boolean(v);
  }
  if (Array.isArray(v)) return v.includes(value);
  return v === value;
}

export function potentialFromScore(score: number) {
  if (score >= 75) return { label: "Strong Potential", probability: "Strong" as const };
  if (score >= 50) return { label: "Moderate Potential", probability: "Moderate" as const };
  return { label: "Emerging Potential", probability: "Emerging" as const };
}

/** Fake assessment generator — replace with real AI/backend later */
export function buildFakeAssessment(
  payload: AssessPayload
): EligibilityAssessment {
  const score = clamp(Math.round(payload.readinessScore ?? 70), 28, 95);
  const { label: potentialLabel, probability } = potentialFromScore(score);

  const routeLabel =
    payload.routeId === "academia"
      ? "Academia & Research"
      : payload.routeId === "arts"
        ? "Arts & Culture"
        : "Digital Technology";

  const name =
    typeof payload.answers.contact_name === "string" &&
    payload.answers.contact_name.trim()
      ? payload.answers.contact_name.trim()
      : undefined;
  const email =
    typeof payload.answers.contact_email === "string" &&
    payload.answers.contact_email.trim()
      ? payload.answers.contact_email.trim()
      : undefined;

  const leadership = clamp(
    35 +
      optionCount(payload.answers, "current_role") * 12 +
      optionCount(payload.answers, "responsibilities") * 8 +
      (hasAnswer(payload.answers, "team_management", "Yes") ? 18 : 0),
    20,
    96
  );
  const innovation = clamp(
    30 +
      optionCount(payload.answers, "products") * 7 +
      optionCount(payload.answers, "platforms") * 5 +
      optionCount(payload.answers, "research_outputs") * 8 +
      optionCount(payload.answers, "creative_outputs") * 8,
    18,
    94
  );
  const impact = clamp(
    25 +
      optionCount(payload.answers, "impact_type") * 9 +
      (hasAnswer(payload.answers, "users") ? 15 : 0),
    15,
    92
  );
  const recognition = clamp(
    18 + optionCount(payload.answers, "recognition") * 9,
    12,
    90
  );
  const publicProfile = clamp(
    28 + optionCount(payload.answers, "profiles") * 6,
    15,
    95
  );
  const evidence = clamp(
    22 + optionCount(payload.answers, "evidence_available") * 7,
    15,
    93
  );
  const letters = clamp(
    hasAnswer(payload.answers, "recommendation", "Yes")
      ? 55 + optionCount(payload.answers, "recommenders") * 8
      : hasAnswer(payload.answers, "recommendation", "Maybe")
        ? 35 + optionCount(payload.answers, "recommenders") * 5
        : 18,
    10,
    92
  );
  const future = clamp(
    40 +
      optionCount(payload.answers, "goal") * 8 +
      (hasAnswer(payload.answers, "timeline", "Just Exploring") ? -10 : 20),
    25,
    98
  );

  const breakdown: ScoreBreakdownItem[] = [
    { id: "leadership", label: "Leadership", score: leadership },
    { id: "innovation", label: "Innovation", score: innovation },
    { id: "impact", label: "Impact", score: impact },
    { id: "recognition", label: "Recognition", score: recognition },
    { id: "publicProfile", label: "Public Profile", score: publicProfile },
    { id: "evidence", label: "Evidence", score: evidence },
    { id: "recommendationLetters", label: "Recommendation Letters", score: letters },
    { id: "futurePlans", label: "Future Plans", score: future },
  ];

  const evidenceChecklist: EvidenceItem[] = [
    {
      id: "resume",
      label: "Resume",
      completed: Boolean(payload.answers.resume_upload),
    },
    {
      id: "portfolio",
      label: "Portfolio",
      completed:
        hasAnswer(payload.answers, "profiles", "Portfolio") ||
        hasAnswer(payload.answers, "profiles", "Personal Website") ||
        hasAnswer(payload.answers, "profiles", "Behance"),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      completed: hasAnswer(payload.answers, "profiles", "LinkedIn"),
    },
    {
      id: "awards",
      label: "Awards",
      completed:
        hasAnswer(payload.answers, "recognition", "Industry Award") ||
        hasAnswer(payload.answers, "recognition", "National Award") ||
        hasAnswer(payload.answers, "recognition", "International Award") ||
        hasAnswer(payload.answers, "evidence_available", "Award Certificate"),
    },
    {
      id: "speaking",
      label: "Speaking",
      completed:
        hasAnswer(payload.answers, "recognition", "Conference Speaker") ||
        hasAnswer(payload.answers, "evidence_available", "Speaking Invitations"),
    },
    {
      id: "publications",
      label: "Publications",
      completed:
        hasAnswer(payload.answers, "evidence_available", "Publications") ||
        hasAnswer(payload.answers, "products", "Research Paper"),
    },
    {
      id: "letters",
      label: "Recommendation Letters",
      completed:
        hasAnswer(payload.answers, "recommendation", "Yes") ||
        hasAnswer(payload.answers, "evidence_available", "Recommendation Letters"),
    },
    {
      id: "press",
      label: "Press Coverage",
      completed:
        hasAnswer(payload.answers, "recognition", "Media Coverage") ||
        hasAnswer(payload.answers, "evidence_available", "Media Articles"),
    },
  ];

  const evidenceDone = evidenceChecklist.filter((e) => e.completed).length;
  const sorted = [...breakdown].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3).map((b) => insightFor(b, "strength"));
  const attentionAreas = [...breakdown]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((b) => insightFor(b, "attention"));

  const criteriaMatched = clamp(
    Math.round(
      breakdown.filter((b) => b.score >= 55).length +
        (evidenceDone >= 4 ? 1 : 0) +
        (letters >= 50 ? 1 : 0)
    ),
    2,
    10
  );

  const monthsAway =
    score >= 75 ? "3–6 months" : score >= 50 ? "6–12 months" : "12–18 months";

  const starRating = clamp(Math.round(score / 20), 2, 5);

  return {
    id: createId(),
    confidenceScore: score,
    summary: `${name ? `${name}'s` : "Your"} ${routeLabel} profile shows a confidence score of ${score}/100. Based on the evidence signals shared, there is a credible path toward Global Talent endorsement with focused packaging of leadership, impact, and third-party recognition.`,
    improvements: [
      "Strengthen recommendation letters from senior independent experts who can quantify your impact.",
      "Add clearer metrics for user reach, revenue, citations, or audience growth tied to your work.",
      "Tighten public profile consistency across LinkedIn, portfolio, and media mentions.",
      "Prepare 3–4 evidence exhibits that map directly to the endorsement criteria for your route.",
    ],
    nextSteps: [
      "Book a free 15-minute discovery call to review this assessment live.",
      "Gather missing evidence listed under improvements within the next 2–4 weeks.",
      "Choose a package that matches your readiness (Strategy Session or Full Review).",
      "Draft a criteria-mapped narrative before Stage 1 submission.",
    ],
    routeId: payload.routeId,
    contactName: name,
    contactEmail: email,
    createdAt: new Date().toISOString(),

    headline: `Your profile demonstrates promising ${routeLabel.toLowerCase()} achievements.`,
    potentialLabel,
    probability,
    targetScore: 75,
    starRating,
    evidenceUploaded: evidenceDone,
    criteriaMatched,
    criteriaTotal: 10,
    strengths,
    attentionAreas,
    overallRecommendation: `You are likely ${monthsAway} away from a competitive endorsement.`,
    breakdown,
    evidenceChecklist,
    priorityImprovements: [
      {
        id: "letters",
        priority: "high",
        title: "Strengthen recommendation letters",
        description:
          "Prioritise two to three letters from senior independent experts who can quantify your leadership and impact with specific outcomes. Generic praise will not help. Brief recommenders with metrics, dates, and criterion mapping so each letter clearly supports Stage 1 endorsement evidence standards.",
      },
      {
        id: "recognition",
        priority: "medium",
        title: "Build independent public recognition",
        description:
          "Increase third-party visibility through speaking, awards, press, or peer invitations that sit outside your employer. Independent recognition is weighted heavily. Aim for verifiable appearances or coverage that assessors can check online and that clearly relates to your field contribution.",
      },
      {
        id: "linkedin",
        priority: "easy",
        title: "Align and polish public profiles",
        description:
          "Make LinkedIn, portfolio, and personal site consistent with your application narrative. Highlight outcomes, not duties, and surface links to products, papers, or press. A coherent public footprint makes evidence easier to verify and reduces friction during endorsement review.",
      },
    ],
    roadmap: [
      { id: "assessment", title: "Assessment Completed", completed: true },
      { id: "evidence", title: "Gather Evidence", estimated: "2 weeks" },
      {
        id: "letters",
        title: "Strengthen Recommendation Letters",
        estimated: "3 weeks",
      },
      { id: "narrative", title: "Narrative Draft" },
      { id: "review", title: "Review Session" },
      { id: "stage1", title: "Stage 1 Submission" },
      { id: "endorsement", title: "Endorsement" },
      { id: "visa", title: "Visa Application" },
    ],
    status: {
      profileCompleted: 100,
      aiAnalysis: "Completed",
      expertReview: "Pending",
      pdfGenerated: "Completed",
      emailSent: "Pending",
    },
  };
}
