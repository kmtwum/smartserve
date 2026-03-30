import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cartService } from "@/lib/services/cartService";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await cartService.getCart(session.user.id);
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { serviceId, action = "add" } = await request.json();

    if (!serviceId) {
      return NextResponse.json({ message: "serviceId is required" }, { status: 400 });
    }

    if (action === "add") {
      const item = await cartService.addToCart(session.user.id, serviceId);
      return NextResponse.json({ message: "Item added", item }, { status: 200 });
    } else if (action === "remove") {
      const result = await cartService.removeFromCart(session.user.id, serviceId, true);
      return NextResponse.json({ message: "Item removed", result }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
