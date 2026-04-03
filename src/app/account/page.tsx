import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import styles from "@/components/LoginForm.module.css";
import { bookingService } from "@/lib/services/bookingService";
import PayNowButton from "./PayNowButton";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookings = await bookingService.getUserBookings(session.user.id);
  
  // Group bookings by group_id
  const groupedBookings = bookings.reduce((acc, curr) => {
    const key = curr.group_id ?? curr.id; // Fallback to id if group_id is null (legacy)
    acc[key] ??= [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, typeof bookings>);

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
        
        {bookings.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>
            You have no recent bookings.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {Object.entries(groupedBookings).map(([groupId, rawGroup]) => {
              const group = rawGroup as typeof bookings;
              // Group's shared status
              const paymentStatus = group[0].payment_status;
              const datePrefix = new Date(group[0].date).toLocaleDateString();

              let totalGroupPrice = 0;
              group.forEach(b => {
                const price = typeof b.price === 'string' ? parseFloat(b.price) : Number(b.price);
                totalGroupPrice += price * b.quantity;
              });
              
              return (
                <div key={groupId} style={{ border: "1px solid var(--card-border)", padding: "1.5rem", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Order Summary</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Scheduled for: {datePrefix}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ 
                        fontSize: "0.875rem", 
                        textTransform: "capitalize", 
                        fontWeight: 600, 
                        color: paymentStatus === "paid" ? "#10b981" : "#f59e0b" 
                      }}>
                        {paymentStatus}
                      </p>
                      <p style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                        ${totalGroupPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {group.map((b) => (
                      <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.03)", borderRadius: "6px" }}>
                        <div>
                          <p style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                            {b.service_name} {b.quantity > 1 ? `(x${b.quantity})` : ''}
                          </p>
                          <p style={{ fontSize: "0.80rem", color: "var(--text-muted)" }}>Start Time: {b.time_slot}</p>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.875rem" }}>
                          <span>${( (typeof b.price === 'string' ? parseFloat(b.price) : Number(b.price)) * b.quantity ).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentStatus === "pending" && (
                    <PayNowButton groupId={group[0].group_id ?? group[0].id.toString()} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
