import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Fetch available time slots for a given date
  return NextResponse.json(
    { message: "Availability endpoint — not yet implemented", slots: [] },
    { status: 200 }
  );
}
