/**
 * Master eligibility questionnaire config.
 * Frontend is fully data-driven — edit this file to add routes/questions.
 */

export type QuestionType = "checkbox" | "radio" | "chips" | "file" | "text";

export type ShowIf = Record<string, string | string[]>;

export type EligibilityQuestion = {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[];
  maxSelection?: number;
  showIf?: ShowIf;
  accept?: string[];
  optional?: boolean;
  tooltip?: string;
  /** Scoring weight for future readiness score (0–1 scale contribution) */
  weight?: number;
  /** Optional AI prompt hint for advisors reviewing answers */
  aiPrompt?: string;
};

export type EligibilitySection = {
  id: string;
  title: string;
  icon: string;
  carousel?: boolean;
  description?: string;
  questions: EligibilityQuestion[];
};

export type EligibilityRoute = {
  id: string;
  name: string;
  description: string;
  sections: string[];
};

export const eligibilityRoutes: EligibilityRoute[] = [
  {
    id: "digital-technology",
    name: "Digital Technology",
    description:
      "Founders, engineers, product leaders, designers, and digital innovators.",
    sections: [
      "leadership",
      "innovation",
      "impact",
      "recognition",
      "publicProfile",
      "evidence",
      "recommendationLetters",
      "futurePlans",
      "resume",
    ],
  },
  {
    id: "academia",
    name: "Academia & Research",
    description:
      "Researchers, academics, and scientists pursuing research pathways.",
    sections: [
      "leadership",
      "research",
      "impact",
      "recognition",
      "publicProfile",
      "evidence",
      "recommendationLetters",
      "futurePlans",
      "resume",
    ],
  },
  {
    id: "arts",
    name: "Arts & Culture",
    description:
      "Creative leaders across arts, culture, design, film, and fashion.",
    sections: [
      "leadership",
      "creativeWork",
      "impact",
      "recognition",
      "publicProfile",
      "evidence",
      "recommendationLetters",
      "futurePlans",
      "resume",
    ],
  },
];

export const eligibilitySections: Record<string, EligibilitySection> = {
  leadership: {
    id: "leadership",
    title: "Leadership",
    icon: "Users",
    carousel: true,
    description: "Tell us about your role and leadership responsibilities.",
    questions: [
      {
        id: "current_role",
        type: "checkbox",
        title: "Which best describes your current role?",
        maxSelection: 2,
        weight: 0.8,
        tooltip: "Select up to two roles that best fit your profile.",
        options: [
          "Founder",
          "Co-Founder",
          "CTO",
          "Engineering Manager",
          "Tech Lead",
          "Senior Engineer",
          "Product Manager",
          "Research Lead",
          "Other",
        ],
        aiPrompt:
          "Summarise leadership seniority from selected roles for Exceptional Talent vs Promise framing.",
      },
      {
        id: "team_management",
        type: "radio",
        title: "Have you led a team?",
        weight: 0.7,
        options: ["Yes", "No"],
      },
      {
        id: "team_size",
        showIf: { team_management: "Yes" },
        type: "chips",
        title: "Team Size",
        weight: 0.5,
        options: ["2-5", "6-10", "11-20", "20+"],
      },
      {
        id: "responsibilities",
        type: "checkbox",
        title: "Which responsibilities have you had?",
        weight: 0.6,
        options: [
          "Hiring",
          "Architecture",
          "Budget",
          "Roadmap",
          "Investor Meetings",
          "Business Strategy",
        ],
      },
    ],
  },

  innovation: {
    id: "innovation",
    title: "Innovation",
    icon: "Sparkles",
    carousel: true,
    description: "What have you built or shipped?",
    questions: [
      {
        id: "products",
        type: "checkbox",
        title: "Have you built any of these?",
        weight: 0.9,
        options: [
          "Startup",
          "SaaS",
          "AI Product",
          "Mobile App",
          "Open Source Library",
          "Framework",
          "API",
          "Patent",
          "Research Paper",
          "Marketplace",
        ],
      },
      {
        id: "public_work",
        type: "radio",
        title: "Is your work publicly accessible?",
        weight: 0.6,
        options: ["Yes", "No"],
      },
      {
        id: "platforms",
        showIf: { public_work: "Yes" },
        type: "checkbox",
        title: "Where can we find it?",
        weight: 0.5,
        options: [
          "GitHub",
          "Product Hunt",
          "App Store",
          "Google Play",
          "Website",
          "NPM",
          "HuggingFace",
          "Kaggle",
        ],
      },
    ],
  },

  research: {
    id: "research",
    title: "Research",
    icon: "BookOpen",
    carousel: true,
    description: "Your academic and research contribution.",
    questions: [
      {
        id: "research_outputs",
        type: "checkbox",
        title: "Which research outputs have you produced?",
        weight: 0.9,
        options: [
          "Peer-reviewed papers",
          "Citations / h-index evidence",
          "Grants / funding",
          "Patents",
          "Open datasets",
          "Lab leadership",
          "PhD supervision",
          "Conference keynotes",
        ],
      },
      {
        id: "research_field",
        type: "chips",
        title: "Primary field",
        weight: 0.4,
        options: [
          "AI / ML",
          "Life Sciences",
          "Engineering",
          "Physics",
          "Social Sciences",
          "Other",
        ],
      },
      {
        id: "peer_review",
        type: "radio",
        title: "Have you peer-reviewed for journals or conferences?",
        weight: 0.5,
        options: ["Yes", "No"],
      },
    ],
  },

  creativeWork: {
    id: "creativeWork",
    title: "Creative Work",
    icon: "Palette",
    carousel: true,
    description: "Your creative practice and body of work.",
    questions: [
      {
        id: "creative_medium",
        type: "checkbox",
        title: "Which best describes your practice?",
        weight: 0.8,
        options: [
          "Visual Arts",
          "Design",
          "Fashion",
          "Film / TV",
          "Music",
          "Architecture",
          "Literature",
          "Digital / Interactive",
          "Other",
        ],
      },
      {
        id: "exhibitions",
        type: "radio",
        title: "Have you exhibited, screened, or published publicly?",
        weight: 0.7,
        options: ["Yes", "No"],
      },
      {
        id: "creative_platforms",
        showIf: { exhibitions: "Yes" },
        type: "checkbox",
        title: "Where has your work appeared?",
        weight: 0.5,
        options: [
          "Gallery / Museum",
          "Festival",
          "Streaming",
          "Publication",
          "Commission",
          "Portfolio site",
          "Behance / Dribbble",
        ],
      },
    ],
  },

  impact: {
    id: "impact",
    title: "Impact",
    icon: "TrendingUp",
    carousel: true,
    description: "Measurable outcomes of your work.",
    questions: [
      {
        id: "impact_type",
        type: "checkbox",
        title: "What impact has your work made?",
        weight: 0.9,
        options: [
          "Revenue Growth",
          "Cost Savings",
          "Business Growth",
          "User Growth",
          "AI Adoption",
          "Government Project",
          "Academic Impact",
        ],
      },
      {
        id: "users",
        type: "chips",
        title: "Estimated Users",
        weight: 0.7,
        options: ["<1k", "1k-10k", "10k-100k", "100k-1M", "1M+"],
      },
    ],
  },

  recognition: {
    id: "recognition",
    title: "Recognition",
    icon: "Award",
    carousel: true,
    description: "Awards, speaking, and public recognition.",
    questions: [
      {
        id: "recognition",
        type: "checkbox",
        title: "Select all that apply",
        weight: 0.85,
        options: [
          "Industry Award",
          "National Award",
          "International Award",
          "Conference Speaker",
          "Media Coverage",
          "Podcast Guest",
          "Judge",
          "Mentor",
          "Hackathon Winner",
        ],
      },
    ],
  },

  publicProfile: {
    id: "publicProfile",
    title: "Public Profile",
    icon: "Globe",
    carousel: true,
    description: "Where your professional presence lives online.",
    questions: [
      {
        id: "profiles",
        type: "checkbox",
        title: "Which professional profiles do you have?",
        weight: 0.4,
        options: [
          "LinkedIn",
          "GitHub",
          "Personal Website",
          "Portfolio",
          "Google Scholar",
          "Crunchbase",
          "Medium",
          "Dev.to",
          "Behance",
          "Dribbble",
          "YouTube",
        ],
      },
    ],
  },

  evidence: {
    id: "evidence",
    title: "Evidence",
    icon: "FileStack",
    carousel: true,
    description: "What proof you can assemble for Stage 1.",
    questions: [
      {
        id: "evidence_available",
        type: "checkbox",
        title: "Which evidence can you provide?",
        weight: 0.9,
        tooltip: "Select everything you can realistically obtain within 8–12 weeks.",
        options: [
          "Employment Letter",
          "Recommendation Letters",
          "Promotion Letter",
          "Award Certificate",
          "Patent",
          "Publications",
          "Media Articles",
          "Speaking Invitations",
          "GitHub Repository",
          "Revenue Proof",
          "Funding Proof",
        ],
        aiPrompt:
          "Map selected evidence types to Digital Technology / research / arts criteria gaps.",
      },
    ],
  },

  recommendationLetters: {
    id: "recommendationLetters",
    title: "Recommendation Letters",
    icon: "Mail",
    carousel: true,
    description: "Recommenders who can speak to your impact.",
    questions: [
      {
        id: "recommendation",
        type: "radio",
        title: "Can you obtain recommendation letters?",
        weight: 0.8,
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: "recommenders",
        type: "checkbox",
        title: "Who could provide them?",
        weight: 0.6,
        options: [
          "CEO",
          "CTO",
          "Founder",
          "Professor",
          "Industry Expert",
          "Investor",
          "Government Official",
          "Senior Manager",
        ],
      },
    ],
  },

  futurePlans: {
    id: "futurePlans",
    title: "Future Plans",
    icon: "Map",
    carousel: true,
    description: "Why the UK — and when.",
    questions: [
      {
        id: "goal",
        type: "checkbox",
        title: "Why do you want to move to the UK?",
        weight: 0.3,
        options: [
          "Career Growth",
          "Start a Business",
          "Research",
          "Join a UK Company",
          "Expand Existing Business",
          "Networking",
          "Family",
        ],
      },
      {
        id: "timeline",
        type: "radio",
        title: "When are you planning to apply?",
        weight: 0.2,
        options: [
          "Within 3 months",
          "Within 6 months",
          "Within 12 months",
          "Just Exploring",
        ],
      },
    ],
  },

  resume: {
    id: "resume",
    title: "Upload Resume",
    icon: "Upload",
    carousel: true,
    description: "Optional — helps us prepare for your discovery call.",
    questions: [
      {
        id: "resume_upload",
        type: "file",
        title: "Upload your resume",
        accept: [".pdf", ".doc", ".docx"],
        optional: true,
        weight: 0.1,
      },
      {
        id: "contact_name",
        type: "text",
        title: "Your full name",
        weight: 0,
      },
      {
        id: "contact_email",
        type: "text",
        title: "Your email",
        weight: 0,
        tooltip: "We will use this to invite you to a free discovery call.",
      },
    ],
  },
};

export function getSectionsForRoute(routeId: string): EligibilitySection[] {
  const route = eligibilityRoutes.find((r) => r.id === routeId);
  if (!route) return [];
  return route.sections
    .map((id) => eligibilitySections[id])
    .filter(Boolean);
}

/** Evaluate showIf against current answers */
export function isQuestionVisible(
  question: EligibilityQuestion,
  answers: Record<string, unknown>
): boolean {
  if (!question.showIf) return true;
  return Object.entries(question.showIf).every(([key, expected]) => {
    const value = answers[key];
    if (Array.isArray(expected)) {
      if (Array.isArray(value)) {
        return expected.some((e) => value.includes(e));
      }
      return expected.includes(String(value));
    }
    if (Array.isArray(value)) {
      return value.includes(expected);
    }
    return value === expected;
  });
}

/** Rough readiness score 0–100 from weighted answered questions */
export function computeReadinessScore(
  sections: EligibilitySection[],
  answers: Record<string, unknown>
): number {
  let totalWeight = 0;
  let earned = 0;

  for (const section of sections) {
    for (const q of section.questions) {
      if (!isQuestionVisible(q, answers)) continue;
      const w = q.weight ?? 0.5;
      totalWeight += w;
      const val = answers[q.id];
      const filled =
        val !== undefined &&
        val !== null &&
        val !== "" &&
        !(Array.isArray(val) && val.length === 0) &&
        !(val instanceof File === false && val === null);
      if (filled) {
        if (Array.isArray(val)) {
          earned += w * Math.min(1, val.length / Math.max(1, (q.options?.length ?? 4) / 3));
        } else if (typeof val === "string" && (val === "No" || val === "Just Exploring")) {
          earned += w * 0.25;
        } else {
          earned += w;
        }
      }
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round(Math.min(100, (earned / totalWeight) * 100));
}
