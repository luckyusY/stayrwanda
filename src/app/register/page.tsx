import { SignUp } from "@clerk/nextjs";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { clerkConfigured } from "@/lib/env";
export default function RegisterPage(){return <main><SiteHeader/><section className="grid min-h-[680px] place-items-center bg-[var(--cream)] p-6">{clerkConfigured?<SignUp routing="hash" fallbackRedirectUrl="/account"/>:<div className="max-w-md border border-[var(--line)] bg-white p-8 text-center"><h1 className="font-serif text-3xl text-[var(--ink)]">Registration setup in progress</h1><p className="mt-3 text-sm text-[var(--muted)]">Add Clerk environment keys to enable secure email and social registration.</p></div>}</section><SiteFooter/></main>}
