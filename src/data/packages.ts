import type { PackageFeature, ServicePackage } from "@/types";

const DEFAULT_VIDEO =
  "https://www.youtube.com/embed/ScMzIvxBSi4"; /* replace with your package walkthrough */

const included = (label: string): PackageFeature => ({ label, included: true });
const excluded = (label: string): PackageFeature => ({ label, included: false });

/**
 * Package ladder aligned with michellehua.co.uk structure,
 * rebranded for Skill Bridge.
 */
const DEFAULT_SLOT_MINUTES = 30;

export const packages: ServicePackage[] = [
  {
    slug: "strategy-call",
    name: "Strategy Call",
    tagline: "Start here",
    description:
      "A focused 30-minute consultation to review your profile, discuss Global Talent fit, and leave with a clear recommended next step.",
    overview:
      "The Strategy Call is a paid 30-minute 1:1. We review your background at a high level, discuss whether a Global Talent pathway is a strong fit, and recommend the right package — before you commit to a fuller engagement.",
    priceLabel: "£45",
    priceNote: "One-time · 30 minutes",
    slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    features: [
      included("30-minute 1:1 consultation"),
      included("High-level profile review"),
      included("Pathway fit discussion"),
      included("Recommended next package"),
      included("Calendar invite after payment"),
      excluded("Written strategy memo"),
      excluded("Full Review"),
      excluded("Weekly Support"),
    ],
    idealFor:
      "Anyone who wants an honest read on fit and next steps before investing in a course, review, or coaching package.",
    ctaLabel: "Book Strategy Call",
    ctaHref: "/packages/strategy-call",
    videoEmbedUrl: DEFAULT_VIDEO,
    videoTitle: "Strategy Call overview",
    steps: [
      {
        title: "Share your details",
        detail: "Tell us your name, email, and a short note on what you’d like to cover.",
      },
      {
        title: "Pick a UK time slot",
        detail: "Choose a 30-minute slot. Times are shown in Europe/London.",
      },
      {
        title: "Pay and join",
        detail: "Pay securely with Stripe. Your calendar invite follows once payment is confirmed.",
      },
    ],
  },
  {
    slug: "leadership-enhancement",
    name: "Leadership Enhancement",
    tagline: "Build the leadership narrative",
    description:
      "A self-paced course that helps you articulate leadership, impact, and innovation — the foundations endorsement panels look for in Digital Technology profiles.",
    overview:
      "Leadership Enhancement is your foundation. You will learn how to frame leadership, innovation, and impact in language endorsement panels recognise — before you invest in heavier coaching. Complete modules at your own pace, then upgrade when you are ready for strategy or review.",
    priceLabel: "£499",
    priceNote: "One-time",
    features: [
      included("Leadership in Tech profile review"),
      included("Frameworks for Impact & Recognition"),
      included("Self-paced modules"),
      included("Part support via media coverage"),
      excluded("Full Review"),
      excluded("Weekly Support"),
      excluded("Full support through Endorsement Stage"),
    ],
    idealFor:
      "Early-stage applicants who need to strengthen how they present leadership and public profile before a full strategy engagement.",
    slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    ctaLabel: "Explore Course",
    ctaHref: "/packages/leadership-enhancement",
    videoEmbedUrl: DEFAULT_VIDEO,
    videoTitle: "Leadership Enhancement overview",
    steps: [
      { title: "Enrol & access", detail: "Get immediate access to the course modules and worksheets." },
      { title: "Build your narrative", detail: "Work through leadership, impact, and innovation frameworks with examples." },
      { title: "Map early evidence", detail: "Start a lightweight evidence list aligned to Digital Technology criteria." },
      { title: "Decide next step", detail: "Upgrade to Strategy Session or DIY Membership when you are ready for deeper support." },
    ],
  },
  {
    slug: "diy-membership",
    name: "DIY Membership Area",
    tagline: "Templates and guidance, on your schedule",
    description:
      "Access Skill Bridge DIY resources — checklists, evidence templates, and structured prompts so you can prepare materials independently with expert frameworks.",
    overview:
      "DIY Membership gives you Skill Bridge templates without full 1:1 coaching. Use checklists, letter prompts, and criteria worksheets to organise your pack on your timeline — ideal if you are disciplined and want professional structure at a lower investment.",
    priceLabel: "£699",
    priceNote: "One-time",
    features: [
      included("Leadership in Tech Course"),
      included("DIY Membership Area"),
      included("Evidence & letter templates"),
      included("Criteria mapping worksheets"),
      included("Part support"),
      excluded("Extra Leadership Enhancement"),
      excluded("Full Review"),
      excluded("Weekly Support"),
      excluded("Personalized Strategy"),
      excluded("Full support through Endorsement Stage"),
    ],
    idealFor:
      "Self-starters who want professional templates and structure without full 1:1 coaching.",
    slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    ctaLabel: "Explore DIY Membership",
    ctaHref: "/packages/diy-membership",
    videoEmbedUrl: DEFAULT_VIDEO,
    videoTitle: "DIY Membership Area walkthrough",
    steps: [
      { title: "Unlock the membership area", detail: "Access templates, checklists, and criteria worksheets." },
      { title: "Complete the course modules", detail: "Leadership in Tech Course is included to sharpen your narrative." },
      { title: "Build your draft pack", detail: "Use DIY tools to structure statement outlines and evidence lists." },
      { title: "Optional upgrade", detail: "Move to Strategy Session or Review Only when you want expert eyes on your draft." },
    ],
  },
  {
    slug: "strategy-session",
    name: "Strategy Session",
    tagline: "Clarity before commitment",
    description:
      "A focused strategy engagement to map your profile against Global Talent criteria, identify gaps, and leave with a written pathway plan.",
    overview:
      "The Strategy Session is a clarity engagement. We assess Exceptional Talent vs Promise fit, prioritise evidence, and deliver a written memo so you know exactly what to strengthen — before committing to a full review or bespoke coaching.",
    priceLabel: "£1,500",
    priceNote: "One-time",
    features: [
      included("Leadership in Tech Course"),
      included("DIY Membership Area"),
      included("Strategy Session"),
      included("Assessment & pathway assessment"),
      included("Written strategy memo"),
      included("Part support"),
      included("Personalized Plan"),
      excluded("Extra Leadership Enhancement"),
      excluded("Full Review"),
      excluded("Weekly Support"),
      excluded("Full support through Endorsement Stage"),
    ],
    idealFor:
      "Professionals who want a clear, evidence-driven personalized plan before investing in a full review.",
    slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    ctaLabel: "Explore Strategy Session",
    ctaHref: "/packages/strategy-session",
    videoEmbedUrl: DEFAULT_VIDEO,
    videoTitle: "Strategy Session explained",
    steps: [
      { title: "Intake & profile review", detail: "Share CV, highlights, and goals. We prepare for your strategy call." },
      { title: "Strategy call", detail: "Deep-dive on pathway, criteria, gaps, and recommender approach." },
      { title: "Written memo", detail: "Receive a clear plan: evidence priorities, risks, and recommended next package." },
      { title: "Decide how to proceed", detail: "Continue DIY, move to Review Only / Full Review, or pause with clarity." },
    ],
  },
  {
    slug: "review-only",
    name: "Review Only Package",
    tagline: "Expert sense-check of your draft pack",
    description:
      "Already drafting your endorsement materials? We review your statement, evidence structure, and letters — spotting gaps and strengthening presentation before you submit.",
    overview:
      "Review Only is for applicants who already have drafts. We stress-test your statement, evidence annexes, and letters against criteria — then give precise rewrite guidance so you submit with confidence.",
    priceLabel: "£2,000",
    priceNote: "One-time · Review focused",
    features: [
      included("Leadership Enhancement"),
      included("DIY Membership Area"),
      included("Full pack review & sense-check"),
      included("Gap analysis & rewrite guidance"),
      included("Letter feedback"),
      included("Part support"),
      excluded("Weekly Support"),
      excluded("Full support through Endorsement Stage"),
    ],
    idealFor:
      "Applicants who have drafted materials and need an expert review before submission.",
    slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    ctaLabel: "Explore Review Only",
    ctaHref: "/packages/review-only",
    videoEmbedUrl: DEFAULT_VIDEO,
    videoTitle: "Review Only Package overview",
    steps: [
      { title: "Submit your draft pack", detail: "Share statement drafts, evidence list, and letter drafts." },
      { title: "Expert review", detail: "We diagnose structure, criteria fit, and presentation gaps." },
      { title: "Feedback & rewrite guide", detail: "Receive actionable notes and priorities for strengthening the pack." },
      { title: "Final sense-check", detail: "Optional follow-up review within scope before you submit." },
    ],
  },
  {
    slug: "full-review",
    name: "Full Review Package",
    tagline: "Strategy + review through submission readiness",
    description:
      "Our most popular engagement: strategy, narrative drafting support, evidence architecture, letter guidance, and iterative review until your Stage 1 pack is endorsement-ready.",
    overview:
      "Full Review combines strategy and iterative review. We help you shape narrative and evidence, guide letters, and run revision rounds until the pack is coherent, criteria-aligned, and ready for Stage 1 submission — with weekly coaching across a four-week window.",
    priceLabel: "£3,000",
    priceNote: "Installments available · Most popular",
    featured: true,
    features: [
      included("Leadership Enhancement"),
      included("DIY Membership Area"),
      included("Strategy Session"),
      included("Full review & revisions"),
      included("Evidence pack assembly guidance"),
      included("Letter strategy & review"),
      included("Submission readiness support"),
      included("Part-to-full support continuum"),
      included("Weekly Support for 4 weeks"),
      excluded("Full support through Endorsement Stage"),
    ],
    idealFor:
      "Serious applicants who want structured strategy plus thorough review with full weekly coaching.",
    slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    ctaLabel: "Explore Full Review",
    ctaHref: "/packages/full-review",
    videoEmbedUrl: DEFAULT_VIDEO,
    videoTitle: "Full Review Package walkthrough",
    steps: [
      { title: "Kickoff & strategy", detail: "Pathway selection, criteria map, and evidence priorities." },
      { title: "Draft & assemble", detail: "Statement support, evidence annex structure, letter briefs." },
      { title: "Iterative review", detail: "Revision rounds until narrative and proof are endorsement-ready." },
      { title: "Submission readiness", detail: "Final QA checklist and guidance for portal submission." },
    ],
  },
  {
    slug: "bespoke-coaching",
    name: "Bespoke 1-to-1 Support",
    tagline: "Undivided attention, end-to-end",
    description:
      "White-glove coaching with dedicated sessions, full support across criteria, structure, evidence, letters, and submission — limited seats each month.",
    overview:
      "Bespoke 1-to-1 Support is Skill Bridge’s highest-touch engagement. You work with a dedicated consultant through unlimited weekly calls, full support across criteria selection, application structure, evidence architecture, recommendation letters, and the endorsement stage. Seats are limited so you get undivided attention — ideal for founders and senior talent who want a tightly managed path to Stage 1 endorsement.",
    priceLabel: "£4,000",
    priceNote: "Installments available · Full support",
    features: [
      included("Leadership Enhancement"),
      included("DIY Membership Area"),
      included("Strategy Session"),
      included("Full Review Package inclusions"),
      included("Bespoke 1-to-1 coaching calls"),
      included("Full support through Endorsement Stage"),
      included("Priority turnaround"),
      included("Dedicated consultant"),
      included("Unlimited weekly calls"),
    ],
    idealFor:
      "Founders and senior talent who want maximum 1:1 support and a tightly managed path to endorsement.",
    slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    ctaLabel: "Explore Bespoke Coaching",
    ctaHref: "/packages/bespoke-coaching",
    videoEmbedUrl: DEFAULT_VIDEO,
    videoTitle: "Bespoke 1-to-1 Support — what to expect",
    steps: [
      {
        title: "Discovery & kickoff",
        detail:
          "Assessment conversation, goals, timeline, and consultant matching. We lock scope, milestones, and call cadence.",
      },
      {
        title: "Criteria & narrative strategy",
        detail:
          "Choose Exceptional Talent or Promise, map criteria, and design the story arc reviewers will follow.",
      },
      {
        title: "Evidence & letters — weekly coaching",
        detail:
          "Build the evidence matrix, brief recommenders, draft and refine statements with dedicated 1-to-1 calls.",
      },
      {
        title: "Full pack assembly",
        detail:
          "Annexes, ordering, and presentation polished for scanability. Priority turnaround on reviews.",
      },
      {
        title: "Submission support",
        detail:
          "Final QA, portal guidance, and clear next steps after Stage 1 decision — with full support throughout.",
      },
    ],
  },
];

export const whyWorkWithSkillBridge = [
  {
    title: "Strategy before paperwork",
    description:
      "We map criteria and evidence first — so you never dump documents without a coherent narrative.",
  },
  {
    title: "Selective intake",
    description:
      "We only take profiles we believe we can strengthen honestly. No volume processing.",
  },
  {
    title: "Reviewer-ready structure",
    description:
      "Packs are organised for how endorsement panels actually read — clear, scannable, credible.",
  },
  {
    title: "Experienced consultants",
    description:
      "Digital Technology specialists who understand founders, engineers, researchers, and design leaders.",
  },
];

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}
