import { NextResponse } from "next/server";
import { getAssessment } from "@/lib/eligibility-assessment";
import { buildAssessmentPdf } from "@/lib/build-assessment-pdf";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const assessment = getAssessment(id);

  if (!assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  // Real external PDF service can replace local generation later:
  // await fetch(`${process.env.ELIGIBILITY_API_URL}/assessments/${id}/pdf`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.ELIGIBILITY_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  // });

  const bytes = await buildAssessmentPdf(assessment);
  const filename = `skill-bridge-assessment-${id}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
