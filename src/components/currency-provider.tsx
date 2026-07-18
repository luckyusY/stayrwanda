"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Popout } from "./popout";
import { ChevronDown, Globe2, Search } from "lucide-react";

export const CURRENCIES = [
  { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼", rate: 1 },
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 1400 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 1520 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 1780 },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", rate: 10.5 },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬", rate: 0.36 },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", rate: 0.54 },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

type Value = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (rwf: number) => string;
};

const Context = createContext<Value>({
  currency: "RWF",
  setCurrency: () => {},
  format: (value) => `RWF ${value.toLocaleString()}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("RWF");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("stayrwanda-currency") as CurrencyCode | null;
      if (saved && CURRENCIES.some((c) => c.code === saved)) setCurrencyState(saved);
    } catch {
      // ignore private-mode / SSR storage errors
    }
  }, []);

  const value = useMemo<Value>(() => {
    const active = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
    return {
      currency,
      setCurrency: (next) => {
        setCurrencyState(next);
        try {
          localStorage.setItem("stayrwanda-currency", next);
        } catch {
          // ignore
        }
      },
      format: (rwf) => {
        const converted = rwf / active.rate;
        return new Intl.NumberFormat("en-RW", {
          style: "currency",
          currency: active.code,
          maximumFractionDigits: active.code === "RWF" || active.code === "UGX" || active.code === "TZS" ? 0 : 2,
        }).format(converted);
      },
    };
  }, [currency]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useCurrency = () => useContext(Context);

export function CurrencyControl({ light = false }: { light?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeMeta = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <Popout
      variant="dropdown"
      isOpen={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
      onClose={() => {
        setOpen(false);
        setSearch("");
      }}
      trigger={
        <div
          className={`flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors ${
            light
              ? "text-white/90 hover:bg-white/10 hover:text-white"
              : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
          }`}
          aria-label={`${currency} currency`}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <Globe2 size={16} className="shrink-0 opacity-90" />
          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold leading-none tracking-wide">
            {activeMeta.flag} {currency}
            <ChevronDown
              size={11}
              className={`opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </span>
          <span
            className={`text-[9px] font-medium uppercase leading-none tracking-[0.12em] ${
              light ? "text-white/55" : "text-[var(--muted)]"
            }`}
          >
            Currency
          </span>
        </div>
      }
      align="right"
      className="z-[60] w-[280px] max-w-[min(280px,90vw)] p-3"
    >
      <div className="mb-3 font-serif text-lg font-semibold text-[var(--ink)]">Select currency</div>
      <div className="field-3d mb-3 flex items-center gap-2 rounded px-2 py-1.5">
        <Search size={14} className="shrink-0 text-[var(--muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search currency…"
          className="w-full bg-transparent text-xs outline-none"
          autoFocus
        />
      </div>
      <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto overscroll-contain pr-0.5" role="listbox">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-[var(--muted)]">No currencies match</p>
        ) : (
          filtered.map((c) => {
            const isActive = c.code === currency;
            return (
              <button
                key={c.code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--parchment)] ${
                  isActive
                    ? "border-l-2 border-[var(--gold)] bg-[var(--gold-pale)] font-semibold text-[var(--gold-deep)]"
                    : "text-[var(--ink)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{c.flag}</span>
                  <span>{c.name}</span>
                </span>
                <span className="text-xs font-medium text-[var(--muted)]">{c.code}</span>
              </button>
            );
          })
        )}
      </div>
    </Popout>
  );
}
