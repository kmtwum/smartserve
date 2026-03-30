"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./LoginForm.module.css"; // Reuse styling

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "Registration failed");
      }

      // Automatically log in after registration
      const signInUrl = "/api/auth/callback/credentials";
      const loginRes = await fetch(signInUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password, redirect: "false" }),
      });

      if (!loginRes.ok) {
        throw new Error("Account created but automatic login failed");
      }

      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create an Account</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.field}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="John Doe"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Min. 6 characters"
          />
        </div>

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Creating account..." : "Sign up"}
        </button>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
