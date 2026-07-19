"use client";

import { useState } from "react";
import { Popout } from "./popout";
import { SlidersHorizontal, Check } from "lucide-react";

export function FilterGroup({
  title,
  options,
  selected,
  toggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  toggle: (option: string) => void;
}) {
  return (
    <div className="border-b border-[var(--line)] p-5 last:border-0">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">{title}</h4>
      <div className="mt-4 space-y-3.5">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 py-2 text-sm group">
            <button
              type="button"
              onClick={() => toggle(option)}
              className={`grid size-6 sm:size-5 shrink-0 place-items-center rounded shadow-[inset_0_1px_2px_rgba(20,34,58,.12)] transition-colors ${
                selected.includes(option)
                  ? "border-[var(--gold)] bg-[var(--gold)] text-white"
                  : "border-[var(--muted)] group-hover:border-[var(--gold-mid)]"
              }`}
              aria-label={`Filter by ${option}`}
            >
              {selected.includes(option) && <Check size={13} />}
            </button>
            <span className="text-[var(--foreground)]">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function FilterDialog({
  selectedTypes,
  toggleType,
  onClear,
  resultCount,
}: {
  selectedTypes: string[];
  toggleType: (type: string) => void;
  onClear: () => void;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      className="interactive-3d flex items-center gap-2 !border-[var(--gold)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold-deep)] lg:hidden shadow-sm bg-white"
    >
      <SlidersHorizontal size={16} /> Filters
      {selectedTypes.length > 0 && (
        <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-[var(--gold)] text-[10px] text-white">
          {selectedTypes.length}
        </span>
      )}
    </button>
  );

  return (
    <Popout
      variant="sheet"
      isOpen={open}
      onClose={() => setOpen(false)}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Filters"
      showLogo={false}
      className="flex h-full w-full flex-col bg-white"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onClear}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)] hover:underline"
          >
            Clear all
          </button>
          <button
            onClick={() => setOpen(false)}
            className="button-3d bg-[var(--ink)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md hover:bg-[var(--ink-2)]"
          >
            Show {resultCount} stays
          </button>
        </div>
      }
    >
      <div className="bg-white pb-2">
        <FilterGroup
          title="Property type"
          options={["Furnished apartment", "Serviced apartment", "Furnished home"]}
          selected={selectedTypes}
          toggle={toggleType}
        />
        <FilterGroup
          title="Amenities"
          options={["Fully furnished", "Private parking", "Kitchen", "Balcony"]}
          selected={[]}
          toggle={() => {}}
        />
        <FilterGroup
          title="Neighbourhood"
          options={["Kibagabaga", "Kimironko", "Kagarama", "Kigali"]}
          selected={[]}
          toggle={() => {}}
        />
      </div>
    </Popout>
  );
}
