"use client";

import { useState } from "react";
import { Popout } from "./popout";
import { Search, MapPin, History, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchCommand({ 
  light = false 
}: { 
  light?: boolean 
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?destination=${encodeURIComponent(query)}`);
  };

  const selectDestination = (dest: string) => {
    setOpen(false);
    router.push(`/search?destination=${encodeURIComponent(dest)}`);
  };

  const trigger = (
    <div className={`flex items-center gap-2 rounded-full border px-4 py-2 cursor-pointer transition-colors ${
      light 
        ? "border-white/20 bg-white/10 text-white placeholder-white/60 hover:bg-white/20" 
        : "border-[var(--line)] bg-[var(--parchment)] hover:border-[var(--gold)] hover:bg-white"
    }`}>
      <Search size={16} className={light ? "text-white/60" : "text-[var(--gold-deep)]"} />
      <span className={`text-sm ${light ? "text-white/80" : "text-[var(--muted)]"}`}>Search destinations...</span>
    </div>
  );

  return (
    <Popout
      variant="dialog"
      isOpen={open}
      onClose={() => setOpen(false)}
      trigger={trigger}
      title="Search"
      className="w-[95vw] max-w-[600px] rounded-2xl border border-[var(--line)] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
    >
      <form onSubmit={handleSearch} className="flex items-center gap-3 border-b border-[var(--line)] bg-white px-6 py-5">
        <Search size={22} className="shrink-0 text-[var(--gold-deep)]" />
        <div className="search-field-well min-w-0 flex-1 px-3 py-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where to in Rwanda? e.g. Kigali, Kibagabaga"
            className="search-field-input font-serif text-lg"
          />
        </div>
        <button type="submit" className="hidden" />
      </form>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] mb-4">Recent searches</h3>
            <ul className="space-y-2">
              {[
                "Kigali Heights",
                "Kibagabaga, Kigali",
                "Serviced apartments"
              ].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => selectDestination(item)}
                    className="flex w-full items-center gap-3 text-left p-2 -mx-2 rounded-lg transition-colors hover:bg-[var(--parchment)] text-[var(--ink)] group"
                  >
                    <History size={15} className="text-[var(--muted)] group-hover:text-[var(--gold-mid)]" />
                    <span className="font-medium text-sm">{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] mb-4">Popular destinations</h3>
            <ul className="space-y-2">
              {[
                { name: "Kigali", subtitle: "Capital city" },
                { name: "Nyarutarama", subtitle: "Premium district" },
                { name: "Kimihurura", subtitle: "Dining & nightlife" },
                { name: "Gisenyi", subtitle: "Lake Kivu" }
              ].map((item) => (
                <li key={item.name}>
                  <button 
                    onClick={() => selectDestination(item.name)}
                    className="flex w-full items-center justify-between text-left p-2 -mx-2 rounded-lg transition-colors hover:bg-[var(--parchment)] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded bg-[var(--parchment)] text-[var(--gold-deep)] group-hover:bg-white group-hover:shadow-sm">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <span className="block font-medium text-sm text-[var(--ink)]">{item.name}</span>
                        <span className="block text-[11px] text-[var(--muted)]">{item.subtitle}</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-[var(--muted)] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--gold-deep)]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Popout>
  );
}
