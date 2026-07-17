"use client";

import { useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  icon?: React.ReactNode;
};

/** Input/textarea with an animated floating label, focus ring and error state. */
export function FloatingField({
  label,
  value,
  onChange,
  type = "text",
  name,
  autoComplete,
  required,
  error,
  multiline = false,
  icon,
}: Props) {
  const [focused, setFocused] = useState(false);
  // Date/time inputs render their own UI, so keep the label pinned to avoid overlap.
  const intrinsic = ["date", "time", "datetime-local", "month", "week"].includes(type);
  const floated = multiline || intrinsic || focused || value.length > 0;

  const borderColor = error
    ? "field-3d-error"
    : focused
      ? "!border-[var(--gold)]"
      : "";

  const sharedProps = {
    id: name,
    name,
    value,
    required,
    autoComplete,
    placeholder: " ",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  return (
    <div>
      <div className={`field-3d relative flex overflow-hidden transition-all duration-200 ${borderColor}`}>
        {icon && (
          <span className="grid w-12 shrink-0 place-items-center text-[var(--gold-deep)]">{icon}</span>
        )}
        {multiline ? (
          <textarea {...sharedProps} className="peer w-full resize-none bg-transparent px-4 pb-2 pt-6 text-sm outline-none" rows={4} />
        ) : (
          <input
            {...sharedProps}
            type={type}
            className={`peer h-14 w-full bg-transparent pt-4 text-sm outline-none ${icon ? "pr-4" : "px-4"}`}
          />
        )}
        <label
          htmlFor={name}
          className={`pointer-events-none absolute origin-left text-[var(--muted)] transition-all duration-200 ${
            icon ? "left-12" : "left-4"
          } ${floated ? "top-2 text-[0.62rem] uppercase tracking-[0.16em]" : "top-1/2 -translate-y-1/2 text-sm"}`}
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-[#b4453a]">{error}</p>}
    </div>
  );
}
