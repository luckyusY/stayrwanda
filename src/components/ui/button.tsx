"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "gold" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden text-xs font-semibold uppercase tracking-[0.18em] transition-[transform,background-color,color,border-color] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const SIZES: Record<Size, string> = {
  sm: "px-5 py-2.5",
  md: "px-7 py-3.5",
  lg: "px-9 py-4",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[var(--ink)] text-white hover:bg-[var(--ink-2)]",
  gold: "bg-[var(--gold)] text-white hover:bg-[var(--gold-deep)]",
  outline: "border border-[var(--gold)] text-[var(--gold-deep)] hover:bg-[var(--gold)] hover:text-white",
  ghost: "text-[var(--ink)] hover:text-[var(--gold-deep)]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 ease-out group-hover:translate-x-full"
    />
  );
}

function Inner({
  variant,
  loading,
  withArrow,
  children,
}: {
  variant: Variant;
  loading?: boolean;
  withArrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      {(variant === "primary" || variant === "gold") && <Sheen />}
      <span className="relative inline-flex items-center gap-2">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
        {withArrow && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        )}
      </span>
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  withArrow = false,
  className = "",
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${SIZES[size]} ${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`;
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      <Inner variant={variant} loading={loading} withArrow={withArrow}>
        {children}
      </Inner>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  withArrow = false,
  className = "",
  href,
  children,
  ...rest
}: CommonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = `${base} ${SIZES[size]} ${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`;
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner variant={variant} withArrow={withArrow}>
        {children}
      </Inner>
    </Link>
  );
}
