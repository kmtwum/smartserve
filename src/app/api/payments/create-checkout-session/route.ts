import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { paymentService } from "@/lib/services/paymentService";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await request.json();

    if (!groupId) {
      return NextResponse.json(
        { message: "groupId is required to create a checkout session" },
        { status: 400 }
      );
    }

    const checkoutUrl = await paymentService.createCheckoutSession(groupId, session.user.id);

    return NextResponse.json({ url: checkoutUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Create Checkout Session POST error:", error);
    
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
