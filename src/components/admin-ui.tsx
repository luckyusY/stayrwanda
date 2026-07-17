const STYLES: Record<string, string> = {
  active: "bg-[var(--green-light)] text-[var(--rwanda-green)]",
  confirmed: "bg-[var(--green-light)] text-[var(--rwanda-green)]",
  completed: "bg-[var(--mist)] text-[var(--muted)]",
  pending: "bg-[var(--gold-pale)] text-[var(--gold-deep)]",
  inactive: "bg-[var(--mist)] text-[var(--muted)]",
  cancelled: "bg-[#fdeced] text-[var(--terracotta)]",
  rejected: "bg-[#fdeced] text-[var(--terracotta)]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
        STYLES[status] || "bg-[var(--mist)] text-[var(--muted)]"
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function formatRWF(amount?: number) {
  if (!amount || !Number.isFinite(amount)) return "—";
  return `RWF ${amount.toLocaleString("en-US")}`;
}
