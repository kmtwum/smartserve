import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Create a Stripe checkout session
  return NextResponse.json(
    { message: "Checkout session endpoint — not yet implemented" },
    { status: 501 }
  );
}
