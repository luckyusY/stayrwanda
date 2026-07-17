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
    cardBox: "w-full shadow-none",
    card: "w-full border border-[#d9d3c7] shadow-none",
    headerTitle: "font-serif text-[#102a43]",
    headerSubtitle: "text-[#64748b]",
    socialButtonsBlockButton: "border-[#d9d3c7] hover:bg-[#f7f3eb]",
    socialButtonsBlockButtonText: "font-semibold text-[#102a43]",
    formButtonPrimary: "bg-[#102a43] hover:bg-[#1e4770]",
    footerActionLink: "font-semibold text-[#9a6b28] hover:text-[#714916]",
  },
} as const;

export function AuthExperience({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signingIn = mode === "sign-in";

  return (
    <main>
      <SiteHeader />
      <section className="bg-[var(--cream)] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-5xl overflow-hidden border border-[var(--line)] bg-white lg:grid-cols-[0.9fr_1.1fr]">
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
