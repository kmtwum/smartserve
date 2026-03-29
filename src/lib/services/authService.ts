import bcrypt from "bcryptjs";
import { getDb } from "../db";

// Authentication service
// Handles user registration, login, and session management.

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address_line?: string;
    city?: string;
    zip_code?: string;
  }) {
    const db = getDb();
    
    // Check if user exists
    const existingUser = await db("users").where({ email: data.email }).first();
    if (existingUser) {
      throw new Error("Email Already Exists");
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);

    const [newUser] = await db("users").insert({
      name: data.name,
      email: data.email,
      password_hash,
      phone: data.phone,
      address_line: data.address_line,
      city: data.city,
      zip_code: data.zip_code,
    }).returning(["id", "name", "email"]);

    return newUser;
  },

  async login(email: string, password: string) {
    const db = getDb();
    
    const user = await db("users").where({ email }).first();
    if (!user) return null;

    const passwordsMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordsMatch) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },

  async getUserById(id: string) {
    const db = getDb();
    const user = await db("users").where({ id }).first();
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address_line: user.address_line,
      city: user.city,
      zip_code: user.zip_code,
    };
  },
};
