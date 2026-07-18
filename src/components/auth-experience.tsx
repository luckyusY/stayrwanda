"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { Check, ShieldCheck, UserCircle2 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const testimonials = [
  { quote: "I found my Kigali apartment in less than 10 minutes.", author: "Jane M., Expat" },
  { quote: "MTN Mobile Money support makes reserving stays incredibly easy.", author: "Jean de Dieu K., Kigali" },
  { quote: "Every residence is verified. What I saw online was exactly what I got.", author: "Sarah W., NGO Consultant" }
];

const appearance = {
  variables: {
    colorPrimary: "#14223a",
    colorText: "#1f2430",
    colorTextSecondary: "#6b6256",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#1f2430",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full rounded-xl shadow-none",
    card: "w-full rounded-xl border border-[var(--line)] shadow-none bg-transparent",
    headerTitle: "font-serif text-[var(--ink)] text-2xl font-semibold",
    headerSubtitle: "text-[var(--muted)] text-sm",
    socialButtonsBlockButton: "border-[var(--line)] shadow-sm hover:-translate-y-0.5 hover:bg-[var(--parchment)] transition-all duration-200",
    socialButtonsBlockButtonText: "font-semibold text-[var(--ink)]",
    formFieldInput: "shadow-inset focus:border-[var(--gold)] focus:shadow-gold transition-all duration-200",
    formButtonPrimary: "bg-[var(--ink)] shadow-button hover:-translate-y-0.5 hover:bg-[var(--ink-2)] transition-all duration-200",
    footerActionLink: "font-semibold text-[var(--gold-deep)] hover:text-[var(--gold)]",
  },
} as const;

export function AuthExperience({ mode, clerkEnabled }: { mode: "sign-in" | "sign-up"; clerkEnabled: boolean }) {
  const signingIn = mode === "sign-in";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--parchment)]">
      <SiteHeader />
      <section className="px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-xl lg:grid-cols-[0.95fr_1.05fr]">
          
          {/* Visual Left Panel with animated quote rotator */}
          <div className="relative flex flex-col justify-between bg-[var(--ink)] p-8 text-white sm:p-12 overflow-hidden">
            {/* Subtle background lines */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: "repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)",
              backgroundSize: "10px 10px"
            }} />
            
            <div className="relative z-10">
              <p className="eyebrow !text-[var(--gold)]">StayRwanda account</p>
              <h1 className="mt-6 font-display text-4xl font-light leading-tight sm:text-5xl text-gradient-gold">
                {signingIn ? "Welcome back" : "Your Rwanda stays, together"}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
                {signingIn
                  ? "Sign in securely to manage requests, saved properties and your hospitality workspace."
                  : "Create one secure account for bookings, favourites and property management."}
              </p>
              
              <div className="mt-9 space-y-4 text-sm text-white/80">
                {["Email or social sign-in", "Secure session management", "One account across guest and host tools"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-full bg-white/10 text-[var(--gold)]">
                      <Check size={14} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Slider */}
            <div className="relative z-10 mt-12 min-h-24 border-t border-white/10 pt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="font-serif text-lg italic text-[var(--gold-pale)]">
                    &ldquo;{testimonials[index].quote}&rdquo;
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-white/50">
                    — {testimonials[index].author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10 mt-8 border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                <ShieldCheck size={16} /> Authentication by Clerk
              </p>
            </div>
          </div>

          {/* Form Right Panel (3D elevated form wrapper) */}
          <div className="grid min-h-[620px] place-items-center p-5 sm:p-10 bg-[var(--parchment)]">
            <div className="w-full max-w-md form-card-3d bg-white p-6 rounded-xl border border-[var(--line)]">
              {clerkEnabled ? (
                signingIn ? (
                  <SignIn
                    path="/sign-in"
                    routing="path"
                    signUpUrl="/register"
                    fallbackRedirectUrl="/account"
                    appearance={appearance}
                  />
                ) : (
                  <SignUp
                    path="/register"
                    routing="path"
                    signInUrl="/sign-in"
                    fallbackRedirectUrl="/account"
                    appearance={appearance}
                  />
                )
              ) : (
                <div className="text-center py-10 flex flex-col items-center">
                  <UserCircle2 size={48} className="text-[var(--gold)] mb-4" />
                  <h2 className="font-serif text-3xl text-[var(--ink)]">Accounts are temporarily unavailable</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    Authentication has not been connected for this deployment. Please try again after the site administrator completes the secure account setup.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
