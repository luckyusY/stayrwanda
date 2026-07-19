"use client";

import { useState } from "react";
import { Popout } from "./popout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarPopout({ 
  checkIn, 
  checkOut, 
  onChange,
  children
}: { 
  checkIn: string; 
  checkOut: string; 
  onChange: (checkIn: string, checkOut: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"in" | "out">("in");

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const handleSelect = (day: number, month: number) => {
    // Mock date formatting: 2026-MM-DD
    const d = `2026-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    if (step === "in") {
      onChange(d, "");
      setStep("out");
    } else {
      // If selected checkout is before checkin, swap them
      if (new Date(d) < new Date(checkIn)) {
        onChange(d, checkIn);
      } else {
        onChange(checkIn, d);
      }
      setTimeout(() => setOpen(false), 300);
      setStep("in");
    }
  };

  return (
    <Popout
      variant="dialog"
      isOpen={open}
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      trigger={<div className="w-full">{children}</div>}
      title="Select dates"
      className="w-[90vw] max-w-[680px] rounded-xl bg-white shadow-2xl"
      wrapperClassName="relative w-full"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4 md:px-8">
        <div>
          <p className="text-sm text-[var(--muted)]">
            {step === "in" ? "Select your check-in date" : "Select your check-out date"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="grid size-9 place-items-center rounded-full border border-[var(--line)] transition-colors hover:bg-[var(--parchment)]">
            <ChevronLeft size={18} />
          </button>
          <button className="grid size-9 place-items-center rounded-full border border-[var(--line)] transition-colors hover:bg-[var(--parchment)]">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-8 px-6 py-5 md:grid-cols-2 md:px-8">
        {/* Month 1 */}
        <div>
          <h3 className="mb-4 text-center font-medium text-[var(--ink)]">October 2026</h3>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
            {days.map(d => <div key={d} className="font-semibold text-[var(--muted)] uppercase tracking-wider text-[10px] pb-2">{d}</div>)}
            {/* Empty slots for offset */}
            <div /><div /><div /><div />
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const d = `2026-10-${day.toString().padStart(2, "0")}`;
              const isSelected = d === checkIn || d === checkOut;
              const isBetween = checkIn && checkOut && new Date(d) > new Date(checkIn) && new Date(d) < new Date(checkOut);
              const isPast = day < 12;
              
              let bg = "hover:bg-[var(--parchment)]";
              let text = "text-[var(--ink)]";
              
              if (isSelected) {
                bg = "bg-[var(--ink)]";
                text = "text-white";
              } else if (isBetween) {
                bg = "bg-[var(--parchment)] rounded-none";
                text = "text-[var(--ink)]";
              } else if (isPast) {
                bg = "";
                text = "text-[#ccc] line-through";
              }

              return (
                <button 
                  key={day}
                  disabled={isPast}
                  onClick={() => handleSelect(day, 10)}
                  className={`mx-auto grid size-10 place-items-center rounded-full transition-colors ${bg} ${text}`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Month 2 */}
        <div>
          <h3 className="mb-4 text-center font-medium text-[var(--ink)]">November 2026</h3>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
            {days.map(d => <div key={d} className="font-semibold text-[var(--muted)] uppercase tracking-wider text-[10px] pb-2">{d}</div>)}
            {/* Empty slots for offset */}
            <div />
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const d = `2026-11-${day.toString().padStart(2, "0")}`;
              const isSelected = d === checkIn || d === checkOut;
              const isBetween = checkIn && checkOut && new Date(d) > new Date(checkIn) && new Date(d) < new Date(checkOut);
              
              let bg = "hover:bg-[var(--parchment)]";
              let text = "text-[var(--ink)]";
              
              if (isSelected) {
                bg = "bg-[var(--ink)]";
                text = "text-white";
              } else if (isBetween) {
                bg = "bg-[var(--parchment)] rounded-none";
                text = "text-[var(--ink)]";
              }

              return (
                <button 
                  key={day}
                  onClick={() => handleSelect(day, 11)}
                  className={`mx-auto grid size-10 place-items-center rounded-full transition-colors ${bg} ${text}`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[var(--line)] px-6 py-4 md:px-8">
        <button onClick={() => { onChange("", ""); setStep("in"); }} className="rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--ink)] transition-colors hover:bg-[var(--parchment)]">Clear dates</button>
        <button onClick={() => setOpen(false)} className="bg-[var(--ink)] px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-colors hover:bg-[var(--ink-2)]">Apply</button>
      </div>
    </Popout>
  );
}
