import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { getDb } from '../db';
import { authService } from './authService';

// Initialize clients lazily to prevent Next.js static build errors 
// when environment variables are purposely missing.

export const notificationService = {
  /**
   * Dispatches automated booking confirmation alerts over Email & SMS.
   * Tolerates missing environment variables for local testing without breaking logic.
   */
  async sendBookingConfirmation(userId: string, groupId: string) {
    try {
      const db = getDb();
      const user = await authService.getUserById(userId);
      
      if (!user) {
        console.error(`Notification abort: User ${userId} not found`);
        return;
      }

      // Fetch the bundle of services confirmed
      const bookings = await db("bookings")
        .join("services", "bookings.service_id", "=", "services.id")
        .where(function() {
          this.where("bookings.group_id", groupId).orWhere("bookings.id", groupId);
        })
        .select("bookings.date", "bookings.time_slot", "services.name", "services.price");

      if (!bookings.length) return;

      const orderDate = new Date(bookings[0].date).toLocaleDateString();
      const orderTime = bookings[0].time_slot;
      
      const serviceNames = bookings.map(b => b.name).join(", ");
      const totalAmount = bookings.reduce((sum, b) => sum + Number(b.price), 0).toFixed(2);

      // 1. Send SMS (Twilio)
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && user.phone) {
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
        if (twilioPhone) {
          const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          await twilioClient.messages.create({
            body: `Smart.Serve: Your booking for ${serviceNames} on ${orderDate} at ${orderTime} is confirmed! Total: $${totalAmount}. Thank you!`,
            from: twilioPhone,
            to: user.phone
          });
          console.log(`Twilio SMS sent to ${user.phone}`);
        } else {
          console.log(`Twilio skipped: ENV TWILIO_PHONE_NUMBER missing`);
        }
      } else {
        console.log(`Twilio skipped: Keys or User phone missing`);
      }

      // 2. Send Email (SendGrid)
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL && user.email) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        // Generic Raw HTML receipt
        const htmlBody = `
          <div style="font-family: sans-serif; padding: 20px; color: #333">
            <h2>Booking Confirmed! ✅</h2>
            <p>Hi ${user.name},</p>
            <p>Thank you for choosing <strong>Smart.Serve</strong>. Your installation has been scheduled successfully.</p>
            
            <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 20px;">
              <tr style="border-bottom: 2px solid #eaeaea;">
                <th style="text-align: left; padding: 10px 0;">Date & Time</th>
                <td style="text-align: right; padding: 10px 0;">${orderDate} at ${orderTime}</td>
              </tr>
              <tr style="border-bottom: 2px solid #eaeaea;">
                <th style="text-align: left; padding: 10px 0;">Services</th>
                <td style="text-align: right; padding: 10px 0;">${serviceNames}</td>
              </tr>
              <tr>
                <th style="text-align: left; padding: 10px 0;">Total Paid</th>
                <td style="text-align: right; padding: 10px 0;"><strong>$${totalAmount}</strong></td>
              </tr>
            </table>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              If you have any questions or need to reschedule, please reply to this email or sign in to your Smart.Serve account dashboard.
            </p>
          </div>
        `;

        await sgMail.send({
          to: user.email,
          from: process.env.SENDGRID_FROM_EMAIL,
          subject: "Smart.Serve Booking Confirmation",
          html: htmlBody,
        });

        console.log(`SendGrid Email sent to ${user.email}`);
      } else {
        console.log(`SendGrid skipped: ENV details missing`);
      }

    } catch (err: any) {
      console.error(`Notification Service error: ${err.message}`);
      // Do not throw here so we don't accidentally crash the webhook response logic
    }
  }
};
