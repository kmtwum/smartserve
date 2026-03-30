"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  id: number;
  name: string;
  description: string;
  price: string | number;
  duration_minutes: number;
  index?: number;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export default function ServiceCard({
  id,
  name,
  description,
  price,
  duration_minutes,
  index = 0,
}: ServiceCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: id, action: "add" }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }
      
      router.refresh();

      import("react-hot-toast").then((mod) => {
        mod.toast.success(
          (t) => (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span>
                <strong>{name}</strong> added to cart!
              </span>
              <button
                onClick={() => {
                  mod.toast.dismiss(t.id);
                  router.push("/cart");
                }}
                style={{
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                View Cart
              </button>
            </div>
          ),
          { duration: 4000 }
        );
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong adding item to the cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const formattedPrice = typeof price === "string" ? parseFloat(price).toFixed(2) : price.toFixed(2);
  const style = { animationDelay: `${index * 0.1}s` };

  return (
    <div className={styles.card} style={style}>
      <div className={styles.decorativeTop}>
        <div className={styles.mesh}></div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.priceBadge}>${formattedPrice}</span>
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.footer}>
          <span className={styles.duration}>
            <span className={styles.durationIcon}>⏱</span>
            {formatDuration(duration_minutes)}
          </span>
          <button 
            className={styles.addToCartBtn} 
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
