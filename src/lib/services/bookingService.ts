import { getDb } from "../db";

export const bookingService = {
  /**
   * Calculates available time slots for a given date and total duration.
   * Operating Hours: Mon-Sat, 9 AM to 5 PM.
   */
  async getAvailableSlots(dateString: string, totalDurationMinutes: number): Promise<string[]> {
    const db = getDb();

    // 1. Verify date is Mon-Sat
    // Ensure dateString is correctly formatted (e.g. YYYY-MM-DD or parse-able)
    const dateObj = new Date(dateString);
    const dayOfWeek = dateObj.getDay(); 
    // getDay() returns 0 for Sunday
    if (dayOfWeek === 0) {
      return []; // Closed on Sundays
    }

    // 2. Fetch existing bookings for that date
    // We only care about pending or confirmed bookings
    const existingBookings = await db("bookings")
      .join("services", "bookings.service_id", "=", "services.id")
      .where("bookings.date", dateString)
      .whereIn("bookings.status", ["pending", "confirmed"])
      .select("bookings.time_slot", "services.duration_minutes");

    // 3. Define operating hours limits
    const startHour = 9; // 9:00 AM
    const endHour = 17; // 5:00 PM
    const maxMinutes = (endHour - startHour) * 60; // Total operating minutes = 480

    // Build an availability array with 15-minute granularity
    // We'll mark blocked chunks as 'false' and free chunks as 'true'
    const scheduleGranularity = 15; 
    const scheduleLength = maxMinutes / scheduleGranularity;
    const availabilityMap = new Array(scheduleLength).fill(true);

    // Block existing bookings on the map
    existingBookings.forEach((booking) => {
      // time_slot is expected to be HH:mm (e.g., "09:00")
      const [bHourStr, bMinStr] = booking.time_slot.split(":");
      const bHour = parseInt(bHourStr, 10);
      const bMin = parseInt(bMinStr, 10);
      
      const startMinuteOffset = (bHour - startHour) * 60 + bMin;
      const startIndex = Math.floor(startMinuteOffset / scheduleGranularity);
      
      const duration = booking.duration_minutes;
      const endIndex = Math.ceil((startMinuteOffset + duration) / scheduleGranularity);

      for (let i = startIndex; i < endIndex; i++) {
        if (i >= 0 && i < scheduleLength) {
          availabilityMap[i] = false;
        }
      }
    });

    // 4. Find all start times that have enough continuous free time
    const availableStartTimes: string[] = [];
    const requiredIntervals = Math.ceil(totalDurationMinutes / scheduleGranularity);

    // Only iterate on the hour or half-hour (30 mins = 2 chunks)
    for (let i = 0; i <= scheduleLength - requiredIntervals; i += 2) {
      let isFree = true;
      for (let j = 0; j < requiredIntervals; j++) {
        if (!availabilityMap[i + j]) {
          isFree = false;
          break;
        }
      }

      if (isFree) {
        // Convert index back to HH:mm string
        let startMinutes = i * scheduleGranularity;
        let h = startHour + Math.floor(startMinutes / 60);
        let m = startMinutes % 60;
        
        let hh = h.toString().padStart(2, "0");
        let mm = m.toString().padStart(2, "0");
        
        availableStartTimes.push(`${hh}:${mm}`);
      }
    }

    return availableStartTimes;
  },

  /**
   * Converts the cart items into pending booking records within a transaction.
   * Staggers start times if the user bought multiple services.
   */
  async createCartBookings(userId: string, dateString: string, startTime: string) {
    const db = getDb();

    // Fetch the cart
    const items = await db("cart_items")
      .join("services", "cart_items.service_id", "=", "services.id")
      .where("cart_items.user_id", userId)
      .select(
        "cart_items.service_id",
        "cart_items.quantity",
        "services.duration_minutes"
      );

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Transaction protects against partial insertions
    const newBookings = await db.transaction(async (trx) => {
      let currentHour = parseInt(startTime.split(":")[0]);
      let currentMinute = parseInt(startTime.split(":")[1]);
      
      const insertedBookings = [];

      for (const item of items) {
        // Handle quantity properly (e.g. 2 TV mounts = 2 back-to-back bookings)
        for (let q = 0; q < item.quantity; q++) {
          const hh = currentHour.toString().padStart(2, "0");
          const mm = currentMinute.toString().padStart(2, "0");
          const slot = `${hh}:${mm}`;

          const [booking] = await trx("bookings")
            .insert({
              user_id: userId,
              service_id: item.service_id,
              date: dateString,
              time_slot: slot,
              status: "pending",
              payment_status: "pending",
            })
            .returning("*");

          insertedBookings.push(booking);

          // Advance the current time for the next item in the chronological setup
          currentMinute += item.duration_minutes;
          while (currentMinute >= 60) {
            currentHour += 1;
            currentMinute -= 60;
          }
        }
      }

      // After successful creation, clear the user's cart
      await trx("cart_items").where("user_id", userId).del();

      return insertedBookings;
    });

    return newBookings;
  }
};
