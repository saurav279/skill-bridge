export type ResourceArticle = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image?: string;
  /** Full article body — paragraphs */
  content: string[];
};

export const resources: ResourceArticle[] = [
  {
    slug: "using-ai-tools-for-gtv",
    title: "Using AI tools for your UK Global Talent Visa application?",
    date: "May 8, 2026",
    excerpt:
      "Where AI helps — and where human strategy still wins — when drafting statements and organising evidence for Stage 1 endorsement.",
    category: "Insights",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=800&fit=crop&q=80",
    content: [
      "AI writing tools can speed up first drafts — but Stage 1 endorsement is won on criteria fit, evidence credibility, and structure that reviewers can scan in minutes.",
      "Use AI to brainstorm bullet points, tidy grammar, or summarise long project histories. Do not outsource your narrative strategy. Panels look for authentic impact stories grounded in verifiable proof.",
      "Skill Bridge recommends a simple rule: AI drafts, humans decide. Map criteria first, then write. Always validate claims against documents you can annex — metrics, letters, press, and products shipped.",
      "If your pack already feels generic or ‘AI-smooth’, that is a signal to rebuild with sharper evidence and a clearer leadership arc. Strategy before polish.",
    ],
  },
  {
    slug: "gtv-and-national-innovation-visa",
    title: "UK Global Talent Visa & other innovation routes",
    date: "April 27, 2026",
    excerpt:
      "How Global Talent compares with other talent and innovation pathways — and how to choose the route that fits your profile.",
    category: "Insights",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=800&fit=crop&q=80",
    content: [
      "Global Talent is one of several UK routes for high-skill movers. It stands out because it is not employer-sponsored — once endorsed and granted, you have flexibility to work, freelance, or found.",
      "Other innovation or skilled routes may suit you better if your profile is role-tied, early-stage without recognition signals, or outside the fields covered by Global Talent endorsement bodies.",
      "Choosing poorly costs months. Skill Bridge starts with pathway fit: Digital Technology vs research vs arts, Exceptional Talent vs Promise, and whether your evidence is ready now or needs a build period.",
      "A discovery call is often enough to rule routes in or out before you invest in a full pack.",
    ],
  },
  {
    slug: "how-uk-attracts-global-tech-talent",
    title: "What endorsement panels look for in Digital Technology",
    date: "April 21, 2026",
    excerpt:
      "A practical look at leadership, impact, and innovation signals that strengthen Exceptional Talent and Promise applications.",
    category: "Guide",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=800&fit=crop&q=80",
    content: [
      "Digital Technology endorsement rewards leadership, innovation, and significant contribution — not job titles alone.",
      "Strong packs show measurable impact (users, revenue, research adoption), peer recognition (letters, awards, speaking), and a coherent story of how you moved the field or product category forward.",
      "Weak packs list responsibilities without outcomes, or dump unrelated certificates. Reviewers need a scannable evidence matrix tied to criteria.",
      "Whether you pursue Exceptional Talent or Promise, the bar is evidence — calibrated to career stage, but never vague.",
    ],
  },
  {
    slug: "evidence-matrix-checklist",
    title: "Building an evidence matrix that reviewers can scan",
    date: "March 12, 2026",
    excerpt:
      "A Skill Bridge checklist for mapping achievements to criteria without dumping unrelated documents into your pack.",
    category: "Guide",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=800&fit=crop&q=80",
    content: [
      "An evidence matrix maps each claim in your statement to a proof item: metric annex, letter, press clip, repo, patent, or award.",
      "Start with criteria, not with folders of PDFs. For each criterion, list 2–4 strongest proofs. Cut everything that does not earn its place.",
      "Order annexes for scanability: summary table first, then deep proof. Label files clearly. Assume a busy reviewer.",
      "Skill Bridge DIY Membership and Strategy Session both centre this matrix — it is the backbone of every strong Stage 1 pack.",
    ],
  },
  {
    slug: "recommendation-letters-that-land",
    title: "Recommendation letters that actually land",
    date: "February 3, 2026",
    excerpt:
      "Who to ask, what to brief, and how to keep letters specific, credible, and aligned with your criteria strategy.",
    category: "Insights",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&h=800&fit=crop&q=80",
    content: [
      "Letters should come from people who can credibly speak to your impact — ideally recognised in your field — not only close managers.",
      "Brief recommenders with your criteria map and 3–5 concrete examples they witnessed. Vague praise hurts more than it helps.",
      "Avoid identical tone across letters. Reviewers notice templates. Diversity of vantage points strengthens the case.",
      "Skill Bridge Review and Full Review packages include letter strategy and feedback so briefs stay specific and aligned.",
    ],
  },
  {
    slug: "from-skilled-worker-to-gtv",
    title: "Switching from Skilled Worker to Global Talent",
    date: "January 18, 2026",
    excerpt:
      "Why many tech professionals switch routes — and what to prepare before you start Stage 1 endorsement.",
    category: "Guide",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=800&fit=crop&q=80",
    content: [
      "Many tech professionals on Skilled Worker explore Global Talent for flexibility — changing employers, founding, or consulting without a sponsor.",
      "Switching starts with Stage 1 endorsement readiness, not with the visa form. Build evidence while you are still in role if needed.",
      "Time on eligible UK routes can matter for longer-term settlement goals — but strategy should still begin with criteria fit.",
      "Book a Skill Bridge discovery call if you are weighing the switch; we will be honest if waiting to strengthen evidence is wiser.",
    ],
  },
];

export const newsletters = [
  {
    title: "Endorsement Brief",
    description:
      "Monthly notes on criteria changes, evidence patterns, and client lessons from Stage 1 preparation.",
  },
  {
    title: "Talent Strategy Notes",
    description:
      "Short plays for founders and operators building recognition, media, and leadership proof over time.",
  },
];

export function getResource(slug: string) {
  return resources.find((r) => r.slug === slug);
}
