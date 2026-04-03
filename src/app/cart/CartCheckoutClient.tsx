"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, isSunday, isBefore, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./page.module.css";
import type { PopulatedCartItem } from "@/lib/services/cartService";

interface CartData {
  items: PopulatedCartItem[];
  totalCost: number;
  totalDuration: number;
}

export default function CartCheckoutClient({ cart }: { cart: CartData }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const router = useRouter();

  // Fetch available slots when user clicks a date
  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setAvailableSlots([]);

    if (!date) return;

    setIsFetchingSlots(true);
    try {
      // Create local YYYY-MM-DD string preserving the exact picked calendar day
      // timezone offset trick isn't always reliable but easiest is just grabbing Y, M, D
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const res = await fetch(`/api/bookings/availability?date=${dateString}&duration=${cart.totalDuration}`);
      if (!res.ok) throw new Error("Could not fetch slots");
      
      const data = await res.json();
      setAvailableSlots(data.availableSlots ?? []);
    } catch (err) {
      console.error(err);
      alert("Error checking availability. Please try another date.");
    } finally {
      setIsFetchingSlots(false);
    }
  };

  const removeItem = async (serviceId: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, action: "remove" }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const updateQuantity = async (serviceId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      return removeItem(serviceId);
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, action: "update", quantity: newQuantity }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    setIsBooking(true);
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateString,
          timeSlot: selectedSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Booking failed");
      }

      // Automatically spin up a Stripe checkout session with the newly created bookings
      // The bookings API should now return the newly generated group_id (the first item's group_id is sufficient)
      const groupId = data.bookings?.[0]?.group_id;

      if (groupId) {
        const checkoutRes = await fetch("/api/payments/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId }),
        });

        const checkoutData = await checkoutRes.json();
        
        if (checkoutRes.ok && checkoutData.url) {
          // Send user straight to Stripe
          window.location.href = checkoutData.url;
          return;
        } else {
          throw new Error(checkoutData.message ?? "Failed to initiate payment");
        }
      }

      // Fallback
      router.push("/account");
      router.refresh();

    } catch (err: any) {
      alert(err.message ?? "Failed to confirm booking.");
      setIsBooking(false);
    }
  };

  // Prevent users from booking in the past
  const disabledDays = (date: Date) => {
    return isSunday(date) || isBefore(date, startOfDay(new Date()));
  };

  return (
    <div className={styles.layout}>
      {/* Left side: Cart items summary */}
      <div className={styles.cartSection}>
        <h2 className={styles.sectionTitle}>Selected Services</h2>
        
        <div className={styles.cartList}>
          {cart.items.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                  <span>{item.duration_minutes * item.quantity} min</span>
                </div>
              </div>
              <div className={styles.itemActions}>
                <div className={styles.quantitySelector}>
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.service_id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.service_id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeItem(item.service_id)}
                  className={styles.removeBtn}
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <span>Total</span>
          <span>${cart.totalCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Right side: Scheduling */}
      <div className={styles.calendarSection}>
        <h2 className={styles.sectionTitle}>Pick an Installation Date</h2>
        <div className={styles.rdpContainer}>
          <style dangerouslySetInnerHTML={{__html: `
            .rdp { --rdp-accent-color: var(--primary); --rdp-background-color: var(--card-bg); margin: 0; }
            .rdp-day_selected { font-weight: bold; }
            .rdp-day_selected:hover { background-color: var(--primary-hover); }
          `}} />
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDays}
          />
        </div>

        {selectedDate && (
          <div className={styles.slotsContainer}>
            <h3 style={{ fontSize: "1rem", fontWeight: 500 }}>
              Available times for {format(selectedDate, "MMM d, yyyy")}
            </h3>
            
            {isFetchingSlots ? (
              <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Checking schedule...</p>
            ) : availableSlots.length > 0 ? (
              <div className={styles.slotsGrid}>
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotBtnSelected : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
                No time slots available for this length ({cart.totalDuration}min) on this date.
              </p>
            )}
          </div>
        )}

        <button 
          className={styles.confirmBtn}
          disabled={!selectedDate || !selectedSlot || isBooking}
          onClick={confirmBooking}
        >
          {isBooking ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
