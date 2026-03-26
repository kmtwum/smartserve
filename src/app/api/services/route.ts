import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Fetch services from the database
  return NextResponse.json(
    { message: "Services endpoint — not yet implemented", services: [] },
    { status: 200 }
  );
}
