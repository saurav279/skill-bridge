import type { ServicePackage } from "@/types";

export const packages: ServicePackage[] = [
  {
    slug: "profiling-strategy",
    name: "Profiling Strategy",
    tagline: "Clarity before commitment",
    description:
      "A focused engagement to map your profile against Global Talent criteria, identify evidence gaps, and define the strongest pathway forward — without a full application build yet.",
    priceLabel: "Strategy package",
    priceNote: "Ideal as a first step or second opinion",
    features: [
      "Eligibility & pathway assessment",
      "Strength / gap analysis of your profile",
      "Evidence prioritization matrix",
      "Written strategy memo with next steps",
      "1 strategy call with a consultant",
      "Recommender guidance overview",
    ],
    idealFor:
      "Professionals who want a clear, evidence-driven plan before investing in a full application.",
    ctaLabel: "Book Profiling Strategy",
    ctaHref: "/consultation",
  },
  {
    slug: "comprehensive-package",
    name: "Comprehensive Package",
    tagline: "End-to-end endorsement readiness",
    description:
      "Full-service guidance from strategy through submission — personalized narrative, evidence architecture, letter coordination, document preparation, and expert review at every stage.",
    priceLabel: "Full engagement",
    priceNote: "Most popular for serious applicants",
    featured: true,
    features: [
      "Everything in Profiling Strategy",
      "Personal statement drafting & refinement",
      "Complete evidence pack assembly",
      "Recommendation letter strategy & review",
      "Document checklist & annex preparation",
      "Unlimited revision rounds within scope",
      "Submission support & follow-up guidance",
      "Dedicated consultant throughout",
    ],
    idealFor:
      "Founders, researchers, designers, and operators ready to pursue endorsement with white-glove support.",
    ctaLabel: "Start Comprehensive Package",
    ctaHref: "/consultation",
  },
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}
