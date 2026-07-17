import { SignIn, SignUp } from "@clerk/nextjs";
import { Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { clerkConfigured } from "@/lib/env";

const appearance = {
  variables: {
    colorPrimary: "#102a43",
    colorText: "#102a43",
    colorTextSecondary: "#64748b",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#102a43",
    borderRadius: "0.25rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full rounded-xl shadow-[0_3px_8px_rgba(20,34,58,.08),0_24px_60px_rgba(20,34,58,.14)]",
    card: "w-full rounded-xl border border-[#d9d3c7] shadow-none",
    headerTitle: "font-serif text-[#102a43]",
    headerSubtitle: "text-[#64748b]",
    socialButtonsBlockButton: "border-[#d9d3c7] shadow-[0_2px_0_rgba(20,34,58,.08),0_6px_14px_rgba(20,34,58,.06)] hover:-translate-y-0.5 hover:bg-[#f7f3eb] hover:shadow-[0_3px_0_rgba(20,34,58,.08),0_10px_20px_rgba(20,34,58,.09)]",
    socialButtonsBlockButtonText: "font-semibold text-[#102a43]",
    formFieldInput: "shadow-[inset_0_1px_2px_rgba(20,34,58,.08),0_1px_0_rgba(255,255,255,.9)] focus:shadow-[0_0_0_3px_rgba(176,141,87,.14),0_8px_18px_rgba(20,34,58,.07)]",
    formButtonPrimary: "bg-[#102a43] shadow-[0_2px_0_rgba(9,18,33,.35),0_9px_20px_rgba(20,34,58,.18)] hover:-translate-y-0.5 hover:bg-[#1e4770] hover:shadow-[0_3px_0_rgba(9,18,33,.3),0_13px_25px_rgba(20,34,58,.22)]",
    footerActionLink: "font-semibold text-[#9a6b28] hover:text-[#714916]",
  },
} as const;

export function AuthExperience({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signingIn = mode === "sign-in";

  return (
    <main>
      <SiteHeader />
      <section className="bg-[var(--cream)] px-4 py-12 sm:px-6 sm:py-20">
        <div className="surface-3d mx-auto grid max-w-5xl overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[var(--ink)] p-8 text-white sm:p-12">
            <p className="eyebrow !text-[var(--gold)]">StayRwanda account</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">
              {signingIn ? "Welcome back" : "Your Rwanda stays, together"}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              {signingIn
                ? "Sign in securely to manage requests, saved properties and your hospitality workspace."
                : "Create one secure account for bookings, favourites and property management."}
            </p>
            <div className="mt-9 space-y-4 text-sm text-white/80">
              {["Email or social sign-in", "Secure session management", "One account across guest and host tools"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-white/10 text-[var(--gold)]"><Check size={15} /></span>
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50"><ShieldCheck size={16} /> Authentication by Clerk</p>
              <p className="mt-3 text-xs leading-5 text-white/50">Google, Apple, Facebook, Microsoft and GitHub appear automatically when enabled for your Clerk instance.</p>
            </div>
          </div>

          <div className="grid min-h-[620px] place-items-center p-5 sm:p-10">
            {clerkConfigured ? (
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
              <div className="max-w-md text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--cream)] text-[var(--gold-deep)]"><LockKeyhole size={25} /></span>
                <h2 className="mt-5 font-serif text-3xl text-[var(--ink)]">Accounts are temporarily unavailable</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Authentication has not been connected for this deployment. Please try again after the site administrator completes the secure account setup.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
