"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Popout } from "@/components/popout";
import { CountryFlag } from "@/components/country-flag";

const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", flagCode: "GB" as const },
  { code: "fr", label: "French", nativeLabel: "Français", flagCode: "FR" as const },
  { code: "rw", label: "Kinyarwanda", nativeLabel: "Ikinyarwanda", flagCode: "RW" as const },
] as const;

export function buildGoogleTranslateUrl(pageUrl: string, language: string) {
  const translateUrl = new URL("https://translate.google.com/translate");
  translateUrl.searchParams.set("sl", "en");
  translateUrl.searchParams.set("tl", language);
  translateUrl.searchParams.set("u", pageUrl);
  return translateUrl.toString();
}

export function LanguageControl({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);

  const chooseLanguage = (language: string) => {
    setOpen(false);
    if (language === "en") return;
    window.location.assign(buildGoogleTranslateUrl(window.location.href, language));
  };

  return (
    <Popout
      variant="dropdown"
      mobileVariant="dialog"
      isOpen={open}
      onOpenChange={setOpen}
      onClose={() => setOpen(false)}
      align="right"
      title="Language"
      showLogo
      className="w-full bg-white p-0 sm:w-72"
      trigger={
        <button
          type="button"
          aria-label="Choose language"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 transition-colors md:min-w-[4.25rem] md:px-2 ${
            light
              ? "text-white/90 hover:bg-white/10 hover:text-white"
              : "text-[var(--ink)] hover:bg-[var(--parchment)] hover:text-[var(--gold-deep)]"
          }`}
        >
          <span className="grid size-9 place-items-center md:size-auto">
            <CountryFlag code="GB" />
          </span>
          <span className="hidden text-[11px] font-semibold leading-none tracking-wide md:block">EN</span>
          <span className={`hidden text-[9px] font-medium uppercase leading-none tracking-[0.12em] md:block ${light ? "text-white/55" : "text-[var(--muted)]"}`}>
            Language
          </span>
        </button>
      }
    >
      <div className="p-3">
        <p className="px-2 pb-2 text-xs leading-relaxed text-[var(--muted)]">
          Translate this page with Google Translate.
        </p>
        <div className="space-y-1" role="listbox" aria-label="Website language">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              role="option"
              aria-selected={language.code === "en"}
              onClick={() => chooseLanguage(language.code)}
              className={`flex min-h-12 w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--parchment)] ${
                language.code === "en" ? "bg-[var(--gold-pale)] text-[var(--gold-deep)]" : "text-[var(--ink)]"
              }`}
            >
              <span className="flex items-center gap-3">
                <CountryFlag code={language.flagCode} />
                <span>
                <span className="block text-sm font-semibold">{language.nativeLabel}</span>
                {language.nativeLabel !== language.label && (
                  <span className="block text-[11px] text-[var(--muted)]">{language.label}</span>
                )}
                </span>
              </span>
              {language.code === "en" && <Check size={17} aria-hidden />}
            </button>
          ))}
        </div>
        <p className="mt-3 border-t border-[var(--line)] px-2 pt-3 text-[10px] text-[var(--muted)]">
          Translation opens securely through Google Translate.
        </p>
      </div>
    </Popout>
  );
}
