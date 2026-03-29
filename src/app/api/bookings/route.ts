import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bookingService } from "@/lib/services/bookingService";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { date, timeSlot } = await request.json();

    if (!date || !timeSlot) {
      return NextResponse.json(
        { message: "date and timeSlot are required" },
        { status: 400 }
      );
    }

    // Call the booking service to create bookings for elements in the cart
    const bookings = await bookingService.createCartBookings(
      session.user.id,
      date,
      timeSlot
    );

    return NextResponse.json(
      { message: "Bookings created successfully", bookings },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create booking POST error:", error);
    
    // e.g. "Cart is empty"
    if (error.message === "Cart is empty") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
