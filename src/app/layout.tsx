import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/env";
import { CurrencyProvider } from "@/components/currency-provider";
import { MagneticCursor } from "@/components/magnetic-cursor";
import { ToastProvider } from "@/components/toast";
import { NewsletterModal } from "@/components/newsletter-modal";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { OverlayStackProvider } from "@/components/overlay-stack";
import { AuthAvailabilityProvider } from "@/components/auth-availability";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stayrwanda.com"),
  title: { default: "StayRwanda — Timeless stays across Rwanda", template: "%s | StayRwanda" },
  description: "Discover handpicked furnished apartments, residences and guesthouses across Rwanda. Reserve with confidence.",
  keywords: ["apartments in Kigali", "Rwanda apartments", "luxury stays Kigali", "furnished homes Rwanda"],
  openGraph: { title: "StayRwanda", description: "Timeless stays across Rwanda.", type: "website" },
  icons: { icon: "/brand/stayrwanda-mark.png", apple: "/brand/stayrwanda-mark.png" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StayRwanda",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#14223a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1c2e" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = (
    <OverlayStackProvider>
      <AuthAvailabilityProvider enabled={clerkConfigured}>
        <CurrencyProvider>
          <ToastProvider>
            <ScrollProgress />
            <MagneticCursor />
            {children}
            <MobileBottomNav clerkEnabled={clerkConfigured} />
            <NewsletterModal />
          </ToastProvider>
        </CurrencyProvider>
      </AuthAvailabilityProvider>
    </OverlayStackProvider>
  );
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className={`${inter.className} pb-safe`}>{clerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content}</body>
    </html>
  );
}
