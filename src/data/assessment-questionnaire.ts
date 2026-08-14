/**
 * Master assessment questionnaire config.
 * Frontend is fully data-driven — edit this file to add routes/questions.
 */

import { isCompletePhoneNumber } from "@/lib/intake-details";

export type QuestionType = "checkbox" | "radio" | "chips" | "file" | "text" | "phone";

export type ShowIf = Record<string, string | string[]>;

export type AssessmentQuestion = {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[];
  maxSelection?: number;
  showIf?: ShowIf;
  accept?: string[];
  optional?: boolean;
  tooltip?: string;
};

export type AssessmentSection = {
  id: string;
  title: string;
  icon: string;
  description?: string;
  questions: AssessmentQuestion[];
};

export type AssessmentRoute = {
  id: string;
  name: string;
  description: string;
  sections: string[];
};

export const AssessmentRoutes: AssessmentRoute[] = [
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
      "personalDetails",
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
      "personalDetails",
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
      "personalDetails",
    ],
  },
];

export const AssessmentSections: Record<string, AssessmentSection> = {
  leadership: {
    id: "leadership",
    title: "Leadership",
    icon: "Users",
    description: "Tell us about your role and leadership responsibilities.",
    questions: [
      {
        id: "current_role",
        type: "checkbox",
        title: "Which best describes your current role?",
        maxSelection: 2,
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
          "Performance Marketing",
          "Digital Marketing Manager",
          "Other",
        ],
      },
      {
        id: "team_management",
        type: "radio",
        title: "Have you led a team?",
        options: ["Yes", "No"],
      },
      {
        id: "team_size",
        showIf: { team_management: "Yes" },
        type: "chips",
        title: "Team Size",
        options: ["2-5", "6-10", "11-20", "20+"],
      },
      {
        id: "responsibilities",
        type: "checkbox",
        title: "Which responsibilities have you had?",
        options: [
          "Hiring",
          "Architecture",
          "Budget",
          "Roadmap",
          "Investor Meetings",
          "Business Strategy",
          "Other",
        ],
      },
    ],
  },

  innovation: {
    id: "innovation",
    title: "Innovation",
    icon: "Sparkles",
    description: "What have you built or worked or shipped?",
    questions: [
      {
        id: "products",
        type: "checkbox",
        title: "Have you built, worked on, or shipped any of these?",
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
          "Other",
        ],
      },
      {
        id: "public_work",
        type: "radio",
        title: "Is your work publicly accessible?",
        options: ["Yes", "No"],
      },
      {
        id: "platforms",
        showIf: { public_work: "Yes" },
        type: "checkbox",
        title: "Where can we find it?",
        options: [
          "GitHub",
          "Product Hunt",
          "App Store",
          "Google Play",
          "Website",
          "NPM",
          "HuggingFace",
          "Kaggle",
          "Other",
        ],
      },
    ],
  },

  research: {
    id: "research",
    title: "Research",
    icon: "BookOpen",
    description: "Your academic and research contribution.",
    questions: [
      {
        id: "research_outputs",
        type: "checkbox",
        title: "Which research outputs have you produced?",
        options: [
          "Peer-reviewed papers",
          "Citations / h-index evidence",
          "Grants / funding",
          "Patents",
          "Open datasets",
          "Lab leadership",
          "PhD supervision",
          "Conference keynotes",
          "Other",
        ],
      },
      {
        id: "research_field",
        type: "chips",
        title: "Primary field",
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
        options: ["Yes", "No"],
      },
    ],
  },

  creativeWork: {
    id: "creativeWork",
    title: "Creative Work",
    icon: "Palette",
    description: "Your creative practice and body of work.",
    questions: [
      {
        id: "creative_medium",
        type: "checkbox",
        title: "Which best describes your practice?",
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
        options: ["Yes", "No"],
      },
      {
        id: "creative_platforms",
        showIf: { exhibitions: "Yes" },
        type: "checkbox",
        title: "Where has your work appeared?",
        options: [
          "Gallery / Museum",
          "Festival",
          "Streaming",
          "Publication",
          "Commission",
          "Portfolio site",
          "Behance / Dribbble",
          "Other",
        ],
      },
    ],
  },

  impact: {
    id: "impact",
    title: "Impact",
    icon: "TrendingUp",
    description: "Measurable outcomes of your work.",
    questions: [
      {
        id: "impact_type",
        type: "checkbox",
        title: "What impact has your work made?",
        options: [
          "Revenue Growth",
          "Cost Savings",
          "Business Growth",
          "User Growth",
          "AI Adoption",
          "Government Project",
          "Academic Impact",
          "Other",
        ],
      },
      {
        id: "users",
        type: "chips",
        title: "Estimated Users",
        options: ["<1k", "1k-10k", "10k-100k", "100k-1M", "1M+"],
      },
    ],
  },

  recognition: {
    id: "recognition",
    title: "Recognition",
    icon: "Award",
    description: "Awards, speaking, and public recognition.",
    questions: [
      {
        id: "recognition",
        type: "checkbox",
        title: "Select all that apply",
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
          "Other",
        ],
      },
    ],
  },

  publicProfile: {
    id: "publicProfile",
    title: "Public Profile",
    icon: "Globe",
    description: "Where your professional presence lives online.",
    questions: [
      {
        id: "profiles",
        type: "checkbox",
        title: "Which professional profiles do you have?",
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
          "Other",
        ],
      },
    ],
  },

  evidence: {
    id: "evidence",
    title: "Evidence",
    icon: "FileStack",
    description: "What proof you can assemble for Stage 1.",
    questions: [
      {
        id: "evidence_available",
        type: "checkbox",
        title: "Which evidence can you provide?",
        tooltip:
          "Select everything you can realistically obtain within 8–12 weeks.",
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
          "Other",
        ],
      },
    ],
  },

  recommendationLetters: {
    id: "recommendationLetters",
    title: "Recommendation Letters",
    icon: "Mail",
    description: "Recommenders who can speak to your impact.",
    questions: [
      {
        id: "recommendation",
        type: "radio",
        title: "Can you obtain recommendation letters?",
        options: ["Yes", "Maybe", "No"],
      },
      {
        id: "recommenders",
        type: "checkbox",
        title: "Who could provide them?",
        options: [
          "CEO",
          "CTO",
          "Founder",
          "Professor",
          "Industry Expert",
          "Investor",
          "Government Official",
          "Senior Manager",
          "Other",
        ],
      },
    ],
  },

  futurePlans: {
    id: "futurePlans",
    title: "Future Plans",
    icon: "Map",
    description: "Why the UK — and when.",
    questions: [
      {
        id: "goal",
        type: "checkbox",
        title: "Why do you want to move to the UK?",
        options: [
          "Career Growth",
          "Start a Business",
          "Research",
          "Join a UK Company",
          "Expand Existing Business",
          "Networking",
          "Family",
          "Other",
        ],
      },
      {
        id: "timeline",
        type: "radio",
        title: "When are you planning to apply?",
        options: [
          "Within 3 months",
          "Within 6 months",
          "Within 12 months",
          "Just Exploring",
          "Other",
        ],
      },
    ],
  },

  personalDetails: {
    id: "personalDetails",
    title: "Personal Details",
    icon: "User",
    description: "Your contact details and resume for the discovery call.",
    questions: [
      {
        id: "name",
        type: "text",
        title: "Your full name",
      },
      {
        id: "email",
        type: "text",
        title: "Your email",
        tooltip: "We will use this to send your assessment results.",
      },
      {
        id: "phone",
        type: "phone",
        title: "Phone",
      },
      {
        id: "livesInUk",
        type: "radio",
        title: "Do you live in the UK?",
        options: ["Yes", "No"],
      },
      {
        id: "ukVisa",
        type: "radio",
        title: "Which visa are you on?",
        options: ["PSW Visa", "Skill Worker Visa", "Dependent Visa", "Student Visa", "Others"],
        showIf: { livesInUk: "Yes" },
      },
      {
        id: "ukVisaOther",
        type: "text",
        title: "Please specify your visa",
        showIf: { ukVisa: "Others" },
      },
      {
        id: "resume",
        type: "file",
        title: "Upload your resume",
        accept: [".pdf"],
        optional: true,
      },
    ],
  },
};

export function getSectionsForRoute(routeId: string): AssessmentSection[] {
  const route = AssessmentRoutes.find((r) => r.id === routeId);
  if (!route) return [];
  return route.sections
    .map((id) => AssessmentSections[id])
    .filter(Boolean);
}

export function isQuestionVisible(
  question: AssessmentQuestion,
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTHER_OPTION = "Other";

/** Required unless `optional: true`. */
export function isQuestionAnswered(
  question: AssessmentQuestion,
  value: unknown
): boolean {
  if (question.optional) return true;

  switch (question.type) {
    case "text": {
      const text = typeof value === "string" ? value.trim() : "";
      if (!text) return false;
      if (question.id.includes("email")) return EMAIL_RE.test(text);
      return true;
    }
    case "phone": {
      return typeof value === "string" && isCompletePhoneNumber(value);
    }
    case "radio":
    case "chips": {
      if (typeof value !== "string" || !value.trim()) return false;
      return value !== OTHER_OPTION;
    }
    case "checkbox": {
      if (!Array.isArray(value) || value.length === 0) return false;
      return value.some(
        (v) => typeof v === "string" && v.trim() !== "" && v !== OTHER_OPTION
      );
    }
    case "file":
      return (
        value instanceof File ||
        (typeof value === "string" && value.trim().length > 0)
      );
    default:
      return false;
  }
}

export function areQuestionsAnswered(
  questions: AssessmentQuestion[],
  answers: Record<string, unknown>
): boolean {
  return questions
    .filter((q) => isQuestionVisible(q, answers))
    .every((q) => isQuestionAnswered(q, answers[q.id]));
}

export function areSectionsAnswered(
  sections: AssessmentSection[],
  answers: Record<string, unknown>
): boolean {
  return sections.every((section) =>
    areQuestionsAnswered(section.questions, answers)
  );
}
