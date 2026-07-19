import { currentIdentity } from "@/lib/auth";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminStatusPage() {
  const identity = await currentIdentity();
  const isAdmin = identity?.platformAdmin || false;

  return (
    <main className="min-h-screen bg-[var(--parchment)] flex items-center justify-center p-6">
      <div className="surface-3d-floating p-8 max-w-md w-full bg-white text-center shadow-xl rounded-2xl border border-[var(--line)]">
        <div className={`mx-auto grid size-16 place-items-center rounded-full ${
          isAdmin ? "bg-[var(--green-light)] text-[var(--rwanda-green)]" : "bg-red-50 text-[var(--terracotta)]"
        }`}>
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="mt-6 font-serif text-2xl font-semibold text-[var(--ink)]">
          {isAdmin ? "Admin Connected" : "Access Denied"}
        </h1>
        
        <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
          {isAdmin 
            ? `You are connected as a platform admin (${identity?.email}).` 
            : "No active admin session detected. Please sign in with an administrator account."}
        </p>

        {isAdmin ? (
          <div className="mt-8 space-y-3">
            <Link
              href="/admin"
              className="button-3d flex items-center justify-center gap-2 bg-[var(--ink)] text-white py-3 px-6 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              className="interactive-3d flex items-center justify-center gap-2 text-[var(--ink)] py-3 px-6 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              <Home size={16} /> Live Site
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            <Link
              href="/sign-in?redirect_url=/admin-status"
              className="button-3d flex items-center justify-center gap-2 bg-[var(--gold)] text-white py-3 px-6 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="interactive-3d flex items-center justify-center gap-2 text-[var(--ink)] py-3 px-6 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              <Home size={16} /> Live Site
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
