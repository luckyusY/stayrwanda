"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popout } from "./popout";
import { useIsMobile } from "@/hooks/use-is-mobile";

type CalendarPopoutProps = {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  children: React.ReactNode;
  minDate?: string;
};

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-RW", { month: "long", year: "numeric" });

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateString(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day || 1);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function monthCells(month: Date) {
  const leading = month.getDay();
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: count }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1)),
  ];
}

export function CalendarPopout({ checkIn, checkOut, onChange, children, minDate }: CalendarPopoutProps) {
  const isMobile = useIsMobile();
  const today = useMemo(() => minDate || toDateString(new Date()), [minDate]);
  const [open, setOpen] = useState(false);
  const [draftIn, setDraftIn] = useState(checkIn);
  const [draftOut, setDraftOut] = useState(checkOut);
  const [step, setStep] = useState<"in" | "out">(checkIn && !checkOut ? "out" : "in");
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(checkIn ? fromDateString(checkIn) : fromDateString(today)));

  const months = useMemo(
    () => Array.from({ length: isMobile ? 1 : 2 }, (_, index) => addMonths(visibleMonth, index)),
    [isMobile, visibleMonth],
  );

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraftIn(checkIn);
      setDraftOut(checkOut);
      setStep(checkIn && !checkOut ? "out" : "in");
      setVisibleMonth(startOfMonth(checkIn ? fromDateString(checkIn) : fromDateString(today)));
    }
    setOpen(next);
  };

  const selectDate = (value: string) => {
    if (step === "in" || (draftIn && draftOut)) {
      setDraftIn(value);
      setDraftOut("");
      setStep("out");
      return;
    }

    if (!draftIn || value <= draftIn) {
      setDraftIn(value);
      setDraftOut("");
      setStep("out");
      return;
    }

    setDraftOut(value);
  };

  const apply = () => {
    if (!draftIn || !draftOut || draftOut <= draftIn) return;
    onChange(draftIn, draftOut);
    setOpen(false);
  };

  return (
    <Popout
      variant="dialog"
      isOpen={open}
      onClose={() => setOpen(false)}
      onOpenChange={handleOpenChange}
      trigger={<div className="w-full">{children}</div>}
      title="Select dates"
      showLogo
      className="w-full bg-white shadow-2xl sm:w-[min(94vw,720px)] sm:rounded-xl"
      wrapperClassName="relative w-full"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftIn("");
                setDraftOut("");
                setStep("in");
              }}
              className="min-h-11 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]"
            >
              Clear
            </button>
          </div>
          <button
            type="button"
            disabled={!draftIn || !draftOut || draftOut <= draftIn}
            onClick={apply}
            className="button-3d min-h-11 bg-[var(--ink)] px-5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-45"
          >
            Apply dates
          </button>
        </div>
      }
    >
      <div className="flex min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--line)] px-4 py-3 sm:px-6">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
            disabled={addMonths(visibleMonth, -1) < startOfMonth(fromDateString(today))}
            className="grid size-11 place-items-center rounded-full border border-[var(--line)] disabled:opacity-35"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gold-deep)]">
              {step === "in" ? "Choose check-in" : draftOut ? "Review your dates" : "Choose check-out"}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {draftIn || "Check-in"} <span aria-hidden>→</span> {draftOut || "Check-out"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
            className="grid size-11 place-items-center rounded-full border border-[var(--line)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mobile-scroll-region grid gap-6 px-3 py-4 sm:grid-cols-2 sm:px-6 sm:py-5">
          {months.map((month) => (
            <section key={month.toISOString()} aria-label={MONTH_FORMATTER.format(month)}>
              <h3 className="mb-3 text-center font-serif text-lg font-semibold text-[var(--ink)]">{MONTH_FORMATTER.format(month)}</h3>
              <div className="grid grid-cols-7 text-center">
                {DAY_LABELS.map((day) => (
                  <div key={day} className="pb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">{day}</div>
                ))}
                {monthCells(month).map((date, index) => {
                  if (!date) return <span key={`empty-${index}`} aria-hidden />;
                  const value = toDateString(date);
                  const selected = value === draftIn || value === draftOut;
                  const inRange = !!draftIn && !!draftOut && value > draftIn && value < draftOut;
                  const disabled = value < today;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={disabled}
                      data-testid="calendar-day"
                      data-date={value}
                      aria-pressed={selected}
                      aria-label={new Intl.DateTimeFormat("en-RW", { dateStyle: "full" }).format(date)}
                      onClick={() => selectDate(value)}
                      className={`mx-auto grid size-10 place-items-center rounded-full text-sm transition-colors disabled:text-[var(--line)] ${
                        selected
                          ? "bg-[var(--ink)] font-semibold text-white shadow-md"
                          : inRange
                            ? "bg-[var(--gold-pale)] text-[var(--ink)]"
                            : "text-[var(--ink)] hover:bg-[var(--parchment)]"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Popout>
  );
}
