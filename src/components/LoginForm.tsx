"use client";

import { useActionState } from "react";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { authenticate } from "@/lib/actions";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className={styles.container}>
      <form action={formAction} className={styles.form}>
        <h2 className={styles.title}>Welcome Back</h2>
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        
        <div className={styles.field}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={styles.input}
            placeholder="you@example.com"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={isPending} className={styles.button}>
          {isPending ? "Signing in..." : "Sign in"}
        </button>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={styles.link}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

