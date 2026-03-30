import { NextResponse } from "next/server";
import { paymentService } from "@/lib/services/paymentService";

// Next.js config to disable body parsing, so we receive the raw string/buffer 
// needed for Stripe crypto signature verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ message: "Missing Stripe signature" }, { status: 400 });
    }

    // In App Router, we just await the raw text body
    const reqBody = await req.text();

    await paymentService.handleWebhook(reqBody, signature);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe Webhook Event Failed:", error.message);
    return NextResponse.json({ message: "Webhook handler failed" }, { status: 400 });
  }
}
