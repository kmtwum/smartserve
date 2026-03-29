import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cartService } from "@/lib/services/cartService";
import CartCheckoutClient from "./CartCheckoutClient";
import styles from "./page.module.css";
import Link from "next/link";

export default async function CartPage() {
  const session = await auth();

  // Protect the cart page
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch populated cart data on the server
  const cartData = await cartService.getCart(session.user.id);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Cart</h1>
      </div>

      {cartData.items.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Your cart is empty</h2>
          <p>Browse our catalog to find installation services for your home.</p>
          <Link href="/services" style={{ color: "var(--primary)", marginTop: "1rem", display: "inline-block" }}>
            View Services &rarr;
          </Link>
        </div>
      ) : (
        <CartCheckoutClient cart={cartData} />
      )}
    </main>
  );
}
