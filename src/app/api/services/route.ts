import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const services = await db("services").select("*").orderBy("id", "asc");
    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
