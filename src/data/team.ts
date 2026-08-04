import type { TeamMember, Milestone, ValueItem } from "@/types";

export const values: ValueItem[] = [
  {
    title: "Integrity",
    description:
      "We only take on profiles we believe we can strengthen honestly. No overselling, no fabricated narratives.",
    icon: "integrity",
  },
  {
    title: "Transparency",
    description:
      "Clear scopes, timelines, and feedback. You always know the status of your evidence pack and next decisions.",
    icon: "transparency",
  },
  {
    title: "Expertise",
    description:
      "Deep familiarity with exceptional talent criteria across technology, research, design, and creative leadership.",
    icon: "expertise",
  },
  {
    title: "Client First",
    description:
      "Your career story comes first. Strategy, writing, and pacing adapt to your strengths — not a rigid template.",
    icon: "client",
  },
];

export const team: TeamMember[] = [
  {
    name: "Elena Voss",
    role: "Founder & Principal Consultant",
    bio: "Former product and policy advisor who built Skill Bridge to give exceptional talent a strategy firm — not a paperwork mill.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop&q=80",
    founder: true,
  },
  {
    name: "Marcus Reid",
    role: "Senior Talent Strategist",
    bio: "Specializes in digital technology and founder pathways, with a focus on evidence architecture and recommender strategy.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop&q=80",
  },
  {
    name: "Priya Nair",
    role: "Evidence Lead",
    bio: "Turns complex careers into clear, reviewer-ready packs. Background in research communications and editorial strategy.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop&q=80",
  },
  {
    name: "Tomás Silva",
    role: "Client Success Partner",
    bio: "Owns timelines, stakeholder coordination, and a calm path from kickoff to submission.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&q=80",
  },
];

export const milestones: Milestone[] = [
  {
    year: "2019",
    title: "Skill Bridge founded",
    description:
      "Launched as a boutique practice for exceptional digital talent seeking Global Talent pathways.",
  },
  {
    year: "2021",
    title: "100+ applications guided",
    description:
      "Crossed a hundred guided applications with a focus on quality over volume.",
  },
  {
    year: "2023",
    title: "Expanded sector coverage",
    description:
      "Formalized playbooks for research, design, and growth leadership profiles.",
  },
  {
    year: "2025",
    title: "Global client base",
    description:
      "Clients from 20+ countries, unified by one standard: evidence-driven excellence.",
  },
];
