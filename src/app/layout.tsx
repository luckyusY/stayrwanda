import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

// Classic hospitality pairing: an elegant serif for display headings and a
// refined, wide humanist sans for everything else.
const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const sans = Jost({
  variable: "--font-sans-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stayrwanda.com"),
  title: { default: "StayRwanda — Timeless stays across Rwanda", template: "%s | StayRwanda" },
  description: "Discover handpicked furnished apartments, residences and guesthouses across Rwanda. Reserve with confidence.",
  keywords: ["apartments in Kigali", "Rwanda apartments", "luxury stays Kigali", "furnished homes Rwanda"],
  openGraph: { title: "StayRwanda", description: "Timeless stays across Rwanda.", type: "website" },
  icons: { icon: "/brand/stayrwanda-mark.png", apple: "/brand/stayrwanda-mark.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
