/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pill } from "@/components/crm-ui";

export function AdminHotels({ hotels }: { hotels: Array<Record<string, any>> }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState("");
  const rows = useMemo(() => hotels.filter((hotel) => (status === "all" || hotel.status === status) && `${hotel.name} ${hotel.slug} ${hotel.location?.neighborhood}`.toLowerCase().includes(query.toLowerCase())), [hotels, query, status]);
  async function publish(id: string) {
    setBusy(id);
    await fetch(`/api/hotels/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "publish" }) });
    router.refresh();
    setBusy("");
  }
  return (
    <>
      <div className="surface-3d mb-4 flex gap-3 p-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search property or neighbourhood" className="field-3d min-h-11 flex-1 px-3" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="field-3d px-3"><option value="all">All statuses</option><option>pending</option><option>published</option><option>draft</option><option>rejected</option></select>
      </div>
      <div className="surface-3d overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-[#667085]"><tr><th className="p-4">Property</th><th>Organization</th><th>Template</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody className="divide-y">
            {rows.map((hotel) => (
              <tr key={hotel.id} className={busy === hotel.id ? "opacity-50" : ""}>
                <td className="p-4"><div className="flex items-center gap-3"><div className="relative size-12 overflow-hidden rounded bg-[#eee]">{hotel.heroImage && <Image src={hotel.heroImage} alt="" fill className="object-cover" />}</div><div><strong>{hotel.name}</strong><small className="block text-[#667085]">{hotel.location?.neighborhood} · {hotel.category}</small></div></div></td>
                <td>{hotel.organizationName || hotel.organizationId}</td><td className="capitalize">{hotel.template}</td><td><Pill value={hotel.status} /></td>
                <td><div className="flex gap-2">{hotel.status === "pending" && <button onClick={() => publish(hotel.id)} className="interactive-3d border-green-700 px-3 py-1.5 text-xs font-bold text-green-700">Approve & publish</button>}<Link href={`/hotels/${hotel.slug}`} target="_blank" className="interactive-3d px-3 py-1.5 text-xs">Preview</Link></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
