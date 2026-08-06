import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  let email: string | undefined;

  try {
    const body = (await request.json()) as { email?: string };
    email = body.email;
  } catch {
    // optional body
  }

  // TODO: wire real email delivery backend
  // await fetch(`${process.env.ELIGIBILITY_API_URL}/assessments/${id}/email`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.ELIGIBILITY_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ email }),
  // });

  return NextResponse.json({
    ok: true,
    id,
    email: email ?? null,
    message: "Email delivery is not connected yet.",
  });
}
