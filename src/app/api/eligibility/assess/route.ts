import { NextResponse } from "next/server";
import {
  buildFakeAssessment,
  saveAssessment,
} from "@/lib/eligibility-assessment";

export async function POST(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  let body: {
    routeId?: string;
    answers?: Record<string, unknown>;
    readinessScore?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.routeId || !body.answers) {
    return NextResponse.json(
      { error: "routeId and answers are required" },
      { status: 400 }
    );
  }

  const answers = { ...body.answers };
  for (const [key, value] of Object.entries(answers)) {
    if (
      value &&
      typeof value === "object" &&
      "name" in value &&
      "size" in value
    ) {
      answers[key] = { name: String((value as { name: string }).name) };
    }
  }

  const assessment = saveAssessment(
    buildFakeAssessment({
      routeId: body.routeId,
      answers,
      readinessScore: body.readinessScore,
    })
  );

  return NextResponse.json({
    id: assessment.id,
    confidenceScore: assessment.confidenceScore,
    summary: assessment.summary,
    improvements: assessment.improvements,
    nextSteps: assessment.nextSteps,
  });
}
