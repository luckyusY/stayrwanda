"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error || "Sign in failed.");
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      <label className="block text-sm font-semibold text-[var(--ink)]">
        Password
        <div className="search-field-well mt-2 flex items-center px-3 focus-within:!border-[var(--gold)]">
          <LockKeyhole size={18} className="text-[var(--gold-deep)]" />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="search-field-input min-h-11 px-2"
            placeholder="Enter admin password"
            autoFocus
            required
          />
        </div>
      </label>
      {error && (
        <p className="surface-3d-error rounded-[var(--radius-control)] border px-3 py-2 text-sm font-semibold text-[#b4453a]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--ink)] text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-[var(--ink-2)] disabled:opacity-60"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
