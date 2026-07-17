"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, ExternalLink, Plus, Search, Trash2, X } from "lucide-react";
import { StatusBadge } from "@/components/admin-ui";
import type { StoredProperty } from "@/lib/data";

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Live" },
  { key: "pending", label: "Pending" },
  { key: "inactive", label: "Inactive" },
  { key: "rejected", label: "Rejected" },
] as const;

export function AdminProperties({ properties }: { properties: StoredProperty[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: properties.length };
    for (const property of properties) map[property.status] = (map[property.status] || 0) + 1;
    return map;
  }, [properties]);

  const rows = properties.filter((property) => {
    if (tab !== "all" && property.status !== tab) return false;
    if (!query.trim()) return true;
    const haystack = `${property.title} ${property.neighborhood} ${property.location} ${property.type}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  async function setStatus(slug: string, status: string) {
    setBusy(slug);
    await fetch(`/api/properties/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setBusy(null);
  }

  async function remove(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(slug);
    await fetch(`/api/properties/${slug}`, { method: "DELETE" });
    router.refresh();
    setBusy(null);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="surface-3d flex min-w-0 flex-1 items-center gap-2 px-3">
          <Search size={18} className="text-[#667085]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, area or type"
            className="min-h-11 w-full min-w-0 text-sm outline-none"
          />
        </div>
        <Link
          href="/admin/properties/new"
          className="button-3d flex min-h-11 items-center gap-2 bg-[#006ce4] px-4 text-sm font-bold text-white hover:bg-[#0057b8]"
        >
          <Plus size={18} /> Add listing
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-1 border-b border-[#e4e7ec]">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold ${
              tab === key
                ? "border-[#006ce4] text-[#006ce4]"
                : "border-transparent text-[#667085] hover:text-[#1a1a1a]"
            }`}
          >
            {label}
            <span className="ml-1.5 rounded-full bg-[#f2f4f7] px-1.5 py-0.5 text-xs text-[#475467]">
              {counts[key] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="surface-3d overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-[#667085]">No properties match this view.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-[#667085]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Property</th>
                  <th className="px-3 py-3 font-semibold">Area</th>
                  <th className="px-3 py-3 font-semibold">Photos</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef1f5]">
                {rows.map((property) => (
                  <tr key={property.slug} className={busy === property.slug ? "opacity-50" : "hover:bg-[#f9fafb]"}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#eef1f5]">
                          {property.image && (
                            <Image
                              src={property.image}
                              alt={property.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{property.title}</p>
                          <p className="truncate text-xs text-[#667085]">{property.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#475467]">{property.neighborhood}</td>
                    <td className="px-3 py-3 text-[#475467]">{property.photoCount ?? property.images?.length ?? 0}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {property.status === "pending" && (
                          <>
                            <ActionButton
                              tone="green"
                              label="Approve"
                              icon={Check}
                              onClick={() => setStatus(property.slug, "active")}
                            />
                            <ActionButton
                              tone="red"
                              label="Reject"
                              icon={X}
                              onClick={() => setStatus(property.slug, "rejected")}
                            />
                          </>
                        )}
                        {property.status === "active" && (
                          <ActionButton
                            tone="gray"
                            label="Unpublish"
                            onClick={() => setStatus(property.slug, "inactive")}
                          />
                        )}
                        {(property.status === "inactive" || property.status === "rejected") && (
                          <ActionButton
                            tone="green"
                            label="Publish"
                            icon={Check}
                            onClick={() => setStatus(property.slug, "active")}
                          />
                        )}
                        <Link
                          href={`/stays/${property.slug}`}
                          target="_blank"
                          className="interactive-3d grid size-8 place-items-center !border-[#d0d5dd] text-[#475467] hover:bg-[#f2f4f7]"
                          aria-label="Preview"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <button
                          onClick={() => remove(property.slug, property.title)}
                          className="interactive-3d grid size-8 place-items-center !border-[#f2c1c1] text-[#c00] hover:bg-[#fdeced]"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  tone,
}: {
  label: string;
  icon?: typeof Check;
  onClick: () => void;
  tone: "green" | "red" | "gray";
}) {
  const tones = {
    green: "border-[#bfe3c9] text-[#008234] hover:bg-[#e7f5ea]",
    red: "border-[#f2c1c1] text-[#c00] hover:bg-[#fdeced]",
    gray: "border-[#d0d5dd] text-[#475467] hover:bg-[#f2f4f7]",
  };
  return (
    <button
      onClick={onClick}
      className={`interactive-3d flex h-8 items-center gap-1 px-2.5 text-xs font-bold ${tones[tone]}`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}
