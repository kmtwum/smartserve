import Stripe from "stripe";
import { getDb } from "../db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16" as any, 
});

export const paymentService = {
  /**
   * Generates a Stripe Checkout Session for a bundled group of bookings.
   * Uses the group_id to fetch all related bookings and creates Stripe line items.
   */
  async createCheckoutSession(groupId: string, userId: string) {
    const db = getDb();
    
    // Fetch all bookings for this group to generate line items
    // Support legacy individual bookings by checking if groupId matches a specific booking id
    const bookings = await db("bookings")
      .join("services", "bookings.service_id", "=", "services.id")
      .where(function() {
        this.where("bookings.group_id", groupId).orWhere("bookings.id", groupId);
      })
      .andWhere("bookings.user_id", userId)
      .select("services.name", "services.price", "bookings.quantity");

    if (bookings.length === 0) {
      throw new Error("No bookings found for this group.");
    }

    // Build Stripe Line Items
    const lineItems = bookings.map((b) => {
      // In PostgreSQL numeric comes back as string sometimes
      const unitAmount = Math.round(parseFloat(b.price) * 100);
      
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: b.name,
          },
          unit_amount: unitAmount,
        },
        quantity: b.quantity, 
      };
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/account?payment=success`,
      cancel_url: `${baseUrl}/account?payment=cancelled`,
      metadata: {
        groupId, // Inject the group ID so the webhook knows what to confirm
      },
    });

    return session.url;
  },

  /**
   * Handles incoming Stripe webhooks. Checks the signature and marks orders paid.
   * Uses the generic raw body string to prevent signature validation bugs.
   */
  async handleWebhook(rawBody: string | Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error("Invalid signature");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const groupId = session.metadata?.groupId;

      if (groupId) {
        const db = getDb();
        console.log(`Webhook Event: Marking booking group/id ${groupId} as paid.`);
        
        await db("bookings")
          .where("group_id", groupId)
          .orWhere("id", groupId)
          .update({
            payment_status: "paid",
            status: "confirmed"
          });

        // Query the first booking of this group to find the userId so we can send the notification
        const bookingRecord = await db("bookings").where("group_id", groupId).orWhere("id", groupId).first();
        if (bookingRecord?.user_id) {
          // Fire-and-forget background notification (does not block webhook response)
          // Import inline to avoid circular dependencies if any
          const { notificationService } = require("./notificationService");
          notificationService.sendBookingConfirmation(bookingRecord.user_id, groupId).catch(console.error);
        }
      }
    }

    return { received: true };
  }
};
