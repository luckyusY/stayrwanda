export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-white" aria-label="Loading stays">
      <div className="h-20 border-b border-[var(--line)] bg-white" />
      <div className="border-b border-[var(--line)] bg-[var(--parchment)] px-4 py-4"><div className="mx-auto h-14 max-w-5xl animate-pulse rounded-xl bg-[var(--line)]/65" /></div>
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-7 sm:px-6">
        <div className="h-3 w-32 rounded bg-[var(--line)]" />
        <div className="mt-5 flex items-end justify-between gap-4"><div><div className="h-9 w-40 rounded bg-[var(--line)]" /><div className="mt-3 h-4 w-64 max-w-[70vw] rounded bg-[var(--line)]" /></div><div className="size-11 rounded-lg bg-[var(--line)]" /></div>
        <div className="mt-7 space-y-5">
          {[1, 2, 3].map((item) => <div key={item} className="overflow-hidden rounded-xl border border-[var(--line)] bg-white sm:grid sm:grid-cols-[240px_1fr] sm:p-5"><div className="aspect-[16/10] bg-[var(--line)] sm:aspect-[4/3] sm:rounded-lg" /><div className="space-y-3 p-4 sm:p-0 sm:pl-5"><div className="h-5 w-36 rounded bg-[var(--line)]" /><div className="h-7 w-3/4 rounded bg-[var(--line)]" /><div className="h-4 w-full rounded bg-[var(--line)]" /><div className="h-10 w-2/3 rounded bg-[var(--line)]" /></div></div>)}
        </div>
      </div>
    </main>
  );
}
