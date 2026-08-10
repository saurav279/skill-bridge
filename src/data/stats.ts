import type { Stat, ProcessStep, WhyChooseItem } from "@/types";

export const stats: Stat[] = [
  { value: "100+", label: "Applications Guided" },
  { value: "95%", label: "Approval Success Rate" },
  { value: "20+", label: "Countries Served" },
  { value: "4.9★", label: "Client Rating" },
];

export const whyChooseUs: WhyChooseItem[] = [
  {
    title: "Personalized Strategy",
    description:
      "Every profile is unique. We map your achievements to the strongest endorsement pathway and build a narrative that reviewers respect.",
    icon: "strategy",
  },
  {
    title: "Evidence Planning",
    description:
      "We structure letters, media, metrics, and impact proof into a coherent evidence set — not a document dump.",
    icon: "evidence",
  },
  {
    title: "End-to-End Guidance",
    description:
      "From assessment review through submission and follow-up, you get a clear plan, deadlines, and expert review at every stage.",
    icon: "guidance",
  },
  {
    title: "Dedicated Experts",
    description:
      "Work with consultants who understand exceptional talent criteria across tech, research, design, and creative industries.",
    icon: "experts",
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Assessment Review",
    description:
      "We assess your career trajectory, recognition, and impact to determine the strongest Global Talent route.",
  },
  {
    step: 2,
    title: "Evidence Planning",
    description:
      "We design a tailored evidence matrix — letters, publications, products shipped, press, and leadership proof.",
  },
  {
    step: 3,
    title: "Application Preparation",
    description:
      "We craft your personal statement, coordinate recommenders, and package materials with precision.",
  },
  {
    step: 4,
    title: "Submission Support",
    description:
      "We review the full pack, guide portal submission, and prepare you for any follow-up requests.",
  },
  {
    step: 5,
    title: "Visa Success",
    description:
      "Celebrate endorsement and navigate the next steps toward your Global Talent Visa with clarity.",
  },
];
