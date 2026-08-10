export type Stat = {
  value: string;
  label: string;
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: "strategy" | "evidence" | "guidance" | "experts";
};

export type CaseStudy = {
  slug: string;
  name: string;
  role: string;
  country: string;
  visaType: string;
  image: string;
  challenge: string;
  strategy: string;
  result: string;
  approvalTimeline: string;
  overview: string;
  evidenceStrategy: string[];
  timeline: { label: string; detail: string }[];
  documentsPrepared: string[];
  outcome: string;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  featured?: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string;
  linkedIn?: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  founder?: boolean;
};

export type Milestone = {
  year: string;
  title: string;
  description: string;
};

export type ValueItem = {
  title: string;
  description: string;
  icon: "integrity" | "transparency" | "expertise" | "client";
};

export type ServicePackage = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Longer page copy for the package detail page */
  overview?: string;
  priceLabel?: string;
  priceNote?: string;
  featured?: boolean;
  features: string[];
  idealFor: string;
  ctaLabel: string;
  ctaHref?: string;
  /** YouTube (or other) embed URL for the reference video */
  videoEmbedUrl?: string;
  videoTitle?: string;
  steps?: { title: string; detail: string }[];
};

export type {
  PriorityLevel,
  ProbabilityLabel,
  ScoreBreakdownItem,
  PriorityImprovement,
  Assessment,
  AssessSectionAnswers,
  AssessPayload,
  AssessSummary,
} from "./assessment";

export {
  potentialFromScore,
  starRatingFromScore,
} from "./assessment";

