import { NextResponse } from "next/server";
import { getAssessment } from "@/lib/eligibility-assessment";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const assessment = getAssessment(id);

  if (!assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(assessment);
}
