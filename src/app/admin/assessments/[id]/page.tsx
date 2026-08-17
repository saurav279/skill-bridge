import type { Metadata } from "next";
import { AssessmentDetailView } from "@/components/admin/assessment-views";

export const metadata: Metadata = {
  title: "Assessment",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminAssessmentDetailPage({ params }: Props) {
  const { id } = await params;
  return <AssessmentDetailView id={id} />;
}
