"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { UserCircle2 } from "lucide-react";
import { Wordmark } from "@/components/site-chrome";

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
    cardBox: "w-full shadow-none",
    card: "w-full border-0 shadow-none bg-transparent",
    headerTitle: "font-serif text-[var(--ink)] text-2xl font-semibold",
    headerSubtitle: "text-[var(--muted)] text-sm",
    socialButtonsBlockButton:
      "border-[var(--line)] shadow-sm hover:-translate-y-0.5 hover:bg-[var(--parchment)] transition-all duration-200",
    socialButtonsBlockButtonText: "font-semibold text-[var(--ink)]",
    formFieldInput:
      "shadow-inset focus:border-[var(--gold)] focus:shadow-gold transition-all duration-200",
    formButtonPrimary:
      "bg-[var(--ink)] shadow-button hover:-translate-y-0.5 hover:bg-[var(--ink-2)] transition-all duration-200",
    footerActionLink:
      "font-semibold text-[var(--gold-deep)] hover:text-[var(--gold)]",
  },
} as const;

export function AuthExperience({
  mode,
  clerkEnabled,
}: {
  mode: "sign-in" | "sign-up";
  clerkEnabled: boolean;
}) {
  const signingIn = mode === "sign-in";

  return (
    <main className="min-h-screen bg-[var(--parchment)] flex flex-col">
      {/* Minimal header — just the wordmark */}
      <header className="flex items-center justify-center py-6 border-b border-[var(--line)] bg-white">
        <Wordmark imgClass="h-12" />
      </header>

      <section className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-16">
        <div className="w-full max-w-md">
          {/* Short, clean title above the form */}
          <div className="mb-6 text-center">
            <h1 className="font-serif text-2xl font-semibold text-[var(--ink)]">
              {signingIn ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              {signingIn
                ? "Sign in to manage your stays and reservations."
                : "One account for bookings, saved stays and hosting."}
            </p>
          </div>

          {/* Clerk form — has its own 3D card, no extra wrapper needed */}
          <div className="auth-card-shell surface-3d-floating min-h-44 overflow-hidden bg-white p-1">
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
              <div className="p-5 text-center sm:p-9">
                <UserCircle2 size={44} className="mx-auto text-[var(--gold)] mb-4" />
                <h2 className="font-serif text-xl text-[var(--ink)]">
                  Accounts temporarily unavailable
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  Authentication has not been configured for this deployment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
