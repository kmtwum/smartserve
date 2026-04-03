"use client";

import { useState } from "react";
import styles from "@/components/LoginForm.module.css"; // Reuse existing button styles

export default function PayNowButton({ groupId }: { groupId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to initiate payment");
      }
    } catch (err: any) {
      alert(err.message || "Checkout failed");
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isProcessing}
      className={styles.button}
      style={{
        width: "auto",
        padding: "0.5rem 1rem",
        marginTop: "1rem",
        fontSize: "0.875rem",
      }}
    >
      {isProcessing ? "Redirecting..." : "Pay Now"}
    </button>
  );
}
