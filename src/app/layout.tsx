import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "smart.serve — Home Installation Services",
  description:
    "Book professional home appliance and device installation services. Browse, schedule, and pay — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        {children}
        <Toaster position="bottom-center" toastOptions={{ style: { background: 'var(--card-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' } }} />
      </body>
    </html>
  );
}

