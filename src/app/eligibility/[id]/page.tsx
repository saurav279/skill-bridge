import type { Metadata } from "next";
import { AssessmentResult } from "@/components/eligibility/assessment-result";

export const metadata: Metadata = {
  title: "Your Global Talent Report",
  description:
    "View your Skill Bridge Global Talent Visa eligibility assessment report.",
};

type Props = { params: Promise<{ id: string }> };

export default async function EligibilityAssessmentPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="bg-white">
      <AssessmentResult id={id} />
    </main>
  );
}
