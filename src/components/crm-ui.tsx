"use client";

import { CountUp } from "@/components/count-up";
import { TiltCard } from "@/components/tilt-card";

export function CrmHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[var(--gold-deep)]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-serif text-4xl font-semibold text-[var(--ink)]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {copy}
        </p>
      </div>
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  const isNumeric = typeof value === "number" || !isNaN(Number(value));
  const numericValue = isNumeric ? Number(value) : 0;

  // Static Sparkline Coordinates based on label hash to look authentic and varied
  const hash = label.length % 3;
  const path =
    hash === 0
      ? "M 5 25 L 15 20 L 25 22 L 35 12 L 45 15 L 55 5"
      : hash === 1
      ? "M 5 10 L 15 15 L 25 5 L 35 18 L 45 8 L 55 12"
      : "M 5 22 L 15 12 L 25 18 L 35 5 L 45 10 L 55 2";

  return (
    <TiltCard strength={6} className="w-full">
      <div className="surface-3d surface-3d-lift p-5 bg-white border border-[var(--line)] rounded-xl relative overflow-hidden flex flex-col justify-between h-full select-none">
        <div>
          <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            {label}
          </span>
          <strong className="mt-3 block font-serif text-4xl text-[var(--ink)] leading-none">
            {isNumeric ? <CountUp value={numericValue} /> : value}
          </strong>
        </div>
        
        <div className="mt-5 flex items-center justify-between">
          <small className="block text-[var(--muted)] text-xs font-medium">
            {detail}
          </small>
          
          <svg className="h-6 w-14 overflow-visible shrink-0" viewBox="0 0 60 30">
            <path
              d={path}
              fill="none"
              stroke="var(--gold-mid)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </TiltCard>
  );
}

export function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="surface-3d p-12 text-center rounded-xl bg-white border border-[var(--line)] max-w-md mx-auto">
      <h2 className="font-serif text-2xl text-[var(--ink)]">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
        {copy}
      </p>
    </div>
  );
}

export function Pill({ value }: { value: string }) {
  const live = ["published", "confirmed", "active", "completed"].includes(value);
  const pending = ["pending", "invited", "draft"].includes(value);
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
        live
          ? "bg-[#e8f5ec] text-[#1a4731] border border-[#d4edda]"
          : pending
          ? "bg-[#fff4df] text-[#9a6511] border border-[#ffeeba]"
          : "bg-[#f2eeee] text-[#855] border border-[#f5c6cb]"
      }`}
    >
      {value}
    </span>
  );
}
