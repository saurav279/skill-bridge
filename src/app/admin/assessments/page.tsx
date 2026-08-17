import type { Metadata } from "next";
import { AssessmentsView } from "@/components/admin/assessment-views";

export const metadata: Metadata = {
  title: "Assessments",
};

export default function AdminAssessmentsPage() {
  return <AssessmentsView />;
}
