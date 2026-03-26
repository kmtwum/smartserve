import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Handle Stripe webhook events
  return NextResponse.json(
    { message: "Stripe webhook endpoint — not yet implemented" },
    { status: 501 }
  );
}
