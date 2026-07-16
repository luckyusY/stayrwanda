import type { Metadata } from "next";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/env";
import { CurrencyProvider } from "@/components/currency-provider";


export const metadata: Metadata = {
  metadataBase: new URL("https://stayrwanda.com"),
  title: { default: "StayRwanda — Timeless stays across Rwanda", template: "%s | StayRwanda" },
  description: "Discover handpicked furnished apartments, residences and guesthouses across Rwanda. Reserve with confidence.",
  keywords: ["apartments in Kigali", "Rwanda apartments", "luxury stays Kigali", "furnished homes Rwanda"],
  openGraph: { title: "StayRwanda", description: "Timeless stays across Rwanda.", type: "website" },
  icons: { icon: "/brand/stayrwanda-mark.png", apple: "/brand/stayrwanda-mark.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = <CurrencyProvider><ScrollProgress />{children}</CurrencyProvider>;
  return (
    <html lang="en">
      <body>{clerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content}</body>
    </html>
  );
}
