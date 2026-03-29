import { NextResponse } from "next/server";
import { bookingService } from "@/lib/services/bookingService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const duration = searchParams.get("duration");

    if (!date || !duration) {
      return NextResponse.json(
        { message: "date and duration query parameters are required" },
        { status: 400 }
      );
    }

    const durationMinutes = parseInt(duration, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      return NextResponse.json(
        { message: "Invalid duration" },
        { status: 400 }
      );
    }

    const availableSlots = await bookingService.getAvailableSlots(date, durationMinutes);

    return NextResponse.json({ availableSlots }, { status: 200 });
  } catch (error) {
    console.error("Availability GET error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
