/** A verified figure. Render only with real data from FMECC (planning/DESIGN.md §7.2). */
export function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-5">
      <span className="font-mono text-heading-md text-ink tabular-nums">{value}</span>
      <span className="text-body-sm text-ink-muted">{label}</span>
      {note && <span className="text-body-sm text-ink-subtle">{note}</span>}
    </div>
  );
}
