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
    // TODO: Hash password, insert user, return user (sans password_hash)
    throw new Error("Not implemented");
  },

  async login(email: string, password: string) {
    // TODO: Find user by email, verify password, return session/token
    throw new Error("Not implemented");
  },

  async getUserById(id: string) {
    // TODO: Fetch user by ID
    throw new Error("Not implemented");
  },
};
