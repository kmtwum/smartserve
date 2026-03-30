import { getDb } from "../db";

export interface CartItem {
  id: number;
  user_id: string;
  service_id: number;
  quantity: number;
}

export interface PopulatedCartItem extends CartItem {
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export const cartService = {
  /**
   * Retrieves the user's cart containing populated service details.
   */
  async getCart(userId: string) {
    const db = getDb();

    // Join cart_items with services to get cost and duration
    const items = await db("cart_items")
      .join("services", "cart_items.service_id", "=", "services.id")
      .where("cart_items.user_id", userId)
      .select(
        "cart_items.id",
        "cart_items.user_id",
        "cart_items.service_id",
        "cart_items.quantity",
        "services.name",
        "services.description",
        "services.price",
        "services.duration_minutes"
      )
      .orderBy("cart_items.id", "asc");

    let totalCost = 0;
    let totalDuration = 0;

    items.forEach((item) => {
      // In PostgreSQL, NUMERIC is returned as a string by pg driver
      const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const qty = item.quantity;
      totalCost += price * qty;
      totalDuration += item.duration_minutes * qty;
    });

    return {
      items: items as PopulatedCartItem[],
      totalCost,
      totalDuration,
    };
  },

  /**
   * Adds a service to the user's cart, incrementing quantity if it exists.
   */
  async addToCart(userId: string, serviceId: number, quantity: number = 1) {
    const db = getDb();

    // Check if item already exists in cart limits
    const existing = await db("cart_items")
      .where({ user_id: userId, service_id: serviceId })
      .first();

    if (existing) {
      const [updated] = await db("cart_items")
        .where({ id: existing.id })
        .increment("quantity", quantity)
        .returning("*");
      return updated;
    }

    const [newItem] = await db("cart_items")
      .insert({
        user_id: userId,
        service_id: serviceId,
        quantity,
      })
      .returning("*");

    return newItem;
  },

  /**
   * Removes a service from the user's cart (decrements or drops).
   */
  async removeFromCart(userId: string, serviceId: number, completely: boolean = false) {
    const db = getDb();
    
    if (completely) {
      return db("cart_items")
        .where({ user_id: userId, service_id: serviceId })
        .del();
    }

    const existing = await db("cart_items")
      .where({ user_id: userId, service_id: serviceId })
      .first();

    if (!existing) return 0;

    if (existing.quantity > 1) {
      const [updated] = await db("cart_items")
        .where({ id: existing.id })
        .decrement("quantity", 1)
        .returning("*");
      return updated;
    } else {
      await db("cart_items").where({ id: existing.id }).del();
      return { id: existing.id, deleted: true };
    }
  },

  /**
   * Clears the user's cart entirely.
   */
  async clearCart(userId: string) {
    const db = getDb();
    return db("cart_items").where({ user_id: userId }).del();
  },
};
