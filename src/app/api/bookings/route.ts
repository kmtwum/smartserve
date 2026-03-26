import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Create a new booking
  return NextResponse.json(
    { message: "Booking creation endpoint — not yet implemented" },
    { status: 501 }
  );
}
