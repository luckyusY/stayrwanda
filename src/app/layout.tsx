import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stayrwanda.com"),
  title: { default: "StayRwanda — Find your place in Rwanda", template: "%s | StayRwanda" },
  description: "Verified apartments, guesthouses and stays across Rwanda. Book local with confidence.",
  keywords: ["apartments in Kigali", "Rwanda apartments", "short stay Kigali"],
  openGraph: { title: "StayRwanda", description: "Stay local. Feel at home.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
