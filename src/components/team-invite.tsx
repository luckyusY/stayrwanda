"use client";

import { useState } from "react";

export function TeamInvite({ organizationId }: { organizationId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("reservations_agent");
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/invitations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ organizationId, email, role }) });
    const data = await res.json();
    setMessage(res.ok ? data.emailSent ? "Invitation sent." : "Invitation recorded; configure Resend to deliver email." : data.error);
    if (res.ok) setEmail("");
  }
  return (
    <form onSubmit={submit} className="surface-3d grid gap-3 p-5 sm:grid-cols-[1fr_220px_auto]">
      <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="team@example.com" className="field-3d min-h-11 px-3" />
      <select value={role} onChange={(event) => setRole(event.target.value)} className="field-3d px-3"><option value="organization_manager">Manager</option><option value="reservations_agent">Reservations agent</option><option value="content_editor">Content editor</option></select>
      <button className="button-3d bg-[var(--ink)] px-5 text-xs uppercase tracking-wider text-white">Invite</button>
      {message && <p className="text-sm text-[var(--muted)] sm:col-span-3">{message}</p>}
    </form>
  );
}
