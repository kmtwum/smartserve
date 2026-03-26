import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Implement user login
  return NextResponse.json(
    { message: "Login endpoint — not yet implemented" },
    { status: 501 }
  );
}
