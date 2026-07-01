export default function KpiCard({ label, value, unit, tone = "neutral", sublabel }) {
  const toneClass =
    tone === "alert"
      ? "text-status-alert"
      : tone === "warn"
      ? "text-status-warn"
      : tone === "clear"
      ? "text-status-clear"
      : "text-text-primary";

  return (
    <div className="bg-base-panel border border-base-border rounded-lg p-4 shadow-panel flex flex-col gap-1 min-w-0">
      <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-display text-3xl font-semibold tabular ${toneClass}`}>{value}</span>
        {unit && <span className="text-sm text-text-tertiary">{unit}</span>}
      </div>
      {sublabel && <span className="text-xs text-text-tertiary">{sublabel}</span>}
    </div>
  );
}
