"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Popout } from "./popout";
import { Globe2, Search } from "lucide-react";

export const CURRENCIES = [
  { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼", rate: 1 },
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 1400 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 1520 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 1780 },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", rate: 10.5 },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬", rate: 0.36 },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", rate: 0.54 },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]["code"];

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
    const saved = localStorage.getItem("stayrwanda-currency") as CurrencyCode;
    if (saved && CURRENCIES.some((c) => c.code === saved)) setCurrencyState(saved);
  }, []);

  const value = useMemo<Value>(() => {
    const active = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
    return {
      currency,
      setCurrency: (next) => {
        setCurrencyState(next);
        localStorage.setItem("stayrwanda-currency", next);
      },
      format: (rwf) => {
        const converted = rwf / active.rate;
        return new Intl.NumberFormat("en-RW", {
          style: "currency",
          currency: active.code,
          maximumFractionDigits: 0,
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

  return (
    <Popout
      variant="dropdown"
      isOpen={open}
      onClose={() => setOpen(false)}
      trigger={
        <div className={`flex items-center gap-1.5 px-2 text-sm font-medium transition-colors ${light ? "text-white/90 hover:text-white" : "text-[var(--ink)] hover:text-[var(--gold-deep)]"}`}>
          <Globe2 size={17} /> {currency}
        </div>
      }
      align="right"
      className="p-3"
    >
      <div className="mb-3 font-serif font-semibold text-[var(--ink)]">Select Currency</div>
      <div className="field-3d flex items-center gap-2 rounded px-2 py-1.5 mb-3">
        <Search size={14} className="text-[var(--muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent text-xs outline-none"
        />
      </div>
      <div className="flex max-h-64 flex-col gap-1 overflow-y-auto pr-1">
        {filtered.map((c) => {
          const isActive = c.code === currency;
          return (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={`flex items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--parchment)] ${
                isActive ? "border-l-2 border-[var(--gold)] bg-[var(--gold-pale)] font-medium text-[var(--gold-deep)]" : "text-[var(--ink)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </span>
              <span className="text-xs text-[var(--muted)]">{c.code}</span>
            </button>
          );
        })}
      </div>
    </Popout>
  );
}
