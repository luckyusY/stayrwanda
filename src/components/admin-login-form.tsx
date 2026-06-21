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
      <label className="block text-sm font-bold">
        Password
        <div className="mt-2 flex items-center rounded-lg border border-[#868686] px-3 focus-within:border-[#006ce4]">
          <LockKeyhole size={18} className="text-[#667085]" />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-11 w-full px-2 font-normal outline-none"
            placeholder="Enter admin password"
            autoFocus
            required
          />
        </div>
      </label>
      {error && (
        <p className="rounded-lg bg-[#fdeced] px-3 py-2 text-sm font-semibold text-[#c00]">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#006ce4] font-bold text-white hover:bg-[#0057b8] disabled:opacity-60"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
