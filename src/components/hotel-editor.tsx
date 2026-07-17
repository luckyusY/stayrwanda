"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Hotel } from "@/lib/platform-types";

export function HotelEditor({ hotel }: { hotel: Hotel }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: hotel.name, description: hotel.description, template: hotel.template, amenities: hotel.amenities.join(", ") });
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  async function save() {
    setBusy("save");
    const res = await fetch(`/api/hotels/${hotel.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean) }) });
    const data = await res.json();
    setMessage(res.ok ? "Draft saved." : data.error);
    setBusy("");
    router.refresh();
  }
  async function submit() {
    setBusy("submit");
    const res = await fetch(`/api/hotels/${hotel.id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "submit" }) });
    const data = await res.json();
    setMessage(res.ok ? "Submitted for StayRwanda review." : data.error);
    setBusy("");
    router.refresh();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="surface-3d space-y-5 p-6">
        <label className="block text-sm font-semibold">Profile name<input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="field-3d mt-2 min-h-12 w-full px-3 font-normal" /></label>
        <label className="block text-sm font-semibold">Template<select value={form.template} onChange={(event) => setForm((current) => ({ ...current, template: event.target.value as Hotel["template"] }))} className="field-3d mt-2 min-h-12 w-full px-3 font-normal"><option value="classic">Classic Hospitality</option><option value="editorial">Editorial Residence</option><option value="modern">Modern Urban</option></select></label>
        <label className="block text-sm font-semibold">Amenities<input value={form.amenities} onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))} className="field-3d mt-2 min-h-12 w-full px-3 font-normal" /></label>
        <label className="block text-sm font-semibold">Property story<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="field-3d mt-2 min-h-48 w-full p-3 font-normal" /></label>
        <button onClick={save} disabled={!!busy} className="button-3d flex items-center gap-2 bg-[var(--ink)] px-6 py-3 text-xs uppercase tracking-wider text-white">{busy === "save" && <Loader2 size={15} className="animate-spin" />}Save draft</button>
        {message && <p className={`rounded-[var(--radius-control)] border p-3 text-sm ${message.includes("saved") || message.includes("Submitted") ? "surface-3d-success" : "surface-3d-error"}`}>{message}</p>}
      </section>
      <aside className="surface-3d h-fit p-6 lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Publication</p>
        <strong className="mt-2 block font-serif text-2xl capitalize">{hotel.status}</strong>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Submitting sends this profile to the platform review queue without changing the live version.</p>
        <button onClick={submit} disabled={!!busy || hotel.status === "pending"} className="button-3d mt-5 flex w-full items-center justify-center gap-2 bg-[var(--gold)] px-5 py-3 text-xs uppercase tracking-wider text-white disabled:opacity-50">{busy === "submit" && <Loader2 size={15} className="animate-spin" />}Submit for review</button>
      </aside>
    </div>
  );
}
