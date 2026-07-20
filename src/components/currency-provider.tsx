"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Popout } from "./popout";
import { ChevronDown, Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { CountryFlag } from "@/components/country-flag";

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

// Unicode escapes keep the country flags intact regardless of source-file encoding.
const CURRENCY_COUNTRIES: Record<CurrencyCode, { country: string; flagCode: "RW" | "US" | "EU" | "GB" | "KE" | "UG" | "TZ" }> = {
  RWF: { country: "Rwanda", flagCode: "RW" },
  USD: { country: "United States", flagCode: "US" },
  EUR: { country: "European Union", flagCode: "EU" },
  GBP: { country: "United Kingdom", flagCode: "GB" },
  KES: { country: "Kenya", flagCode: "KE" },
  UGX: { country: "Uganda", flagCode: "UG" },
  TZS: { country: "Tanzania", flagCode: "TZ" },
};

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
    let restoreTimer: ReturnType<typeof setTimeout> | undefined;

    try {
      const saved = localStorage.getItem("stayrwanda-currency") as CurrencyCode | null;
      if (saved && CURRENCIES.some((c) => c.code === saved)) {
        // Restore after hydration so server and client initially render the same currency.
        restoreTimer = setTimeout(() => setCurrencyState(saved), 0);
      }
    } catch {
      // ignore private-mode / SSR storage errors
    }

    return () => {
      if (restoreTimer) clearTimeout(restoreTimer);
    };
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
  const isMobile = useIsMobile();

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeMeta = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
  const activeCountry = CURRENCY_COUNTRIES[activeMeta.code];

  return (
    <Popout
      variant="dropdown"
      mobileVariant="dialog"
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
        <button
          type="button"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 transition-colors md:min-w-[4.25rem] md:px-2 ${
            light
              ? "text-white/90 hover:bg-white/10 hover:text-white"
              : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
          }`}
          aria-label={`${currency} currency`}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="relative grid size-9 place-items-center md:size-auto">
            <CountryFlag code={activeCountry.flagCode} />
          </span>
          <span className="text-[8px] font-bold uppercase leading-none tracking-[0.08em] md:hidden">{currency}</span>
          <span className="hidden items-center gap-0.5 text-[11px] font-semibold leading-none tracking-wide md:inline-flex">
            {currency}
            <ChevronDown
              size={11}
              className={`opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </span>
          <span
            className={`hidden text-[9px] font-medium uppercase leading-none tracking-[0.12em] md:block ${
              light ? "text-white/55" : "text-[var(--muted)]"
            }`}
          >
            Currency
          </span>
        </button>
      }
      align="right"
      title="Currency"
      showLogo
      className="z-[60] w-full sm:w-[280px] p-0"
    >
      {/* Brand header — logo always visible */}
      <div className="p-3">
        <div className="mb-3 font-serif text-lg font-semibold text-[var(--ink)]">Select currency</div>
        <div className="search-field-well mb-3 flex items-center gap-2 px-2.5 py-2">
          <Search size={14} className="shrink-0 text-[var(--gold-deep)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to filter currencies…"
            className="search-field-input text-xs"
            autoFocus={!isMobile}
          />
        </div>
        <div className="flex max-h-64 sm:max-h-64 max-h-[50dvh] flex-col gap-0.5 overflow-y-auto overscroll-contain pr-0.5" role="listbox">
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
                  <span className="flex min-w-0 items-center gap-2.5">
                    <CountryFlag code={CURRENCY_COUNTRIES[c.code].flagCode} />
                    <span className="flex min-w-0 flex-col">
                      <span>{c.name}</span>
                      <span className="text-[11px] font-normal text-[var(--muted)]">{CURRENCY_COUNTRIES[c.code].country}</span>
                    </span>
                  </span>
                  <span className="text-xs font-medium text-[var(--muted)]">{c.code}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Popout>
  );
}
