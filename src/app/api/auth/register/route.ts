import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Implement user registration
  return NextResponse.json(
    { message: "Register endpoint — not yet implemented" },
    { status: 501 }
  );
}
