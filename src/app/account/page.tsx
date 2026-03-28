import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import styles from "@/components/LoginForm.module.css";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>My Account</h1>
      
      <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", padding: "2rem", borderRadius: "12px", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Profile Information</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          <strong>Name:</strong> {session.user.name}
        </p>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          <strong>Email:</strong> {session.user.email}
        </p>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className={styles.button} style={{ width: "auto", backgroundColor: "var(--card-border)", color: "var(--foreground)"}}>
            Sign Out
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)", padding: "2rem", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Booking History</h2>
        <p style={{ color: "var(--text-muted)" }}>
          You have no recent bookings.
        </p>
      </div>
    </main>
  );
}
