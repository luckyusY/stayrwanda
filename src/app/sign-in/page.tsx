import { SignIn } from "@clerk/nextjs";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { clerkConfigured } from "@/lib/env";
export default function SignInPage(){return <main><SiteHeader/><section className="grid min-h-[620px] place-items-center bg-[var(--cream)] p-6">{clerkConfigured?<SignIn routing="hash" fallbackRedirectUrl="/account"/>:<div className="max-w-md border border-[var(--line)] bg-white p-8 text-center"><h1 className="font-serif text-3xl text-[var(--ink)]">Sign-in setup in progress</h1><p className="mt-3 text-sm text-[var(--muted)]">Clerk environment keys are required to enable secure accounts.</p></div>}</section><SiteFooter/></main>}
