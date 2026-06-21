const STYLES: Record<string, string> = {
  active: "bg-[#e7f5ea] text-[#008234]",
  confirmed: "bg-[#e7f5ea] text-[#008234]",
  completed: "bg-[#eef1f5] text-[#475467]",
  pending: "bg-[#fff4e5] text-[#b25e00]",
  inactive: "bg-[#eef1f5] text-[#475467]",
  cancelled: "bg-[#fdeced] text-[#c00]",
  rejected: "bg-[#fdeced] text-[#c00]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
        STYLES[status] || "bg-[#eef1f5] text-[#475467]"
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
