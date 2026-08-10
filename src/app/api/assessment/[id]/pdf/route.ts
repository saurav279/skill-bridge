import { NextResponse } from "next/server";
import { buildAssessmentPdf } from "@/lib/build-assessment-pdf";
import { getApiBaseUrl } from "@/services/fetchApi";
import type { Assessment } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const response = await fetch(`${getApiBaseUrl()}/assessments/${id}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 404
              ? "Assessment not found"
              : "Failed to load assessment for PDF.",
        },
        { status: response.status }
      );
    }

    const assessment = (await response.json()) as Assessment;
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
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "PDF generation failed.",
      },
      { status: 500 }
    );
  }
}
