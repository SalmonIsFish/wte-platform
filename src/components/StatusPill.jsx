const VARIANTS = {
  clear: { dot: "status-dot--clear", text: "text-status-clear", bg: "bg-status-clearDim" },
  compliant: { dot: "status-dot--clear", text: "text-status-clear", bg: "bg-status-clearDim" },
  warn: { dot: "status-dot--warn", text: "text-status-warn", bg: "bg-status-warnDim" },
  pending_approval: { dot: "status-dot--warn", text: "text-status-warn", bg: "bg-status-warnDim" },
  flagged: { dot: "status-dot--alert", text: "text-status-alert", bg: "bg-status-alertDim" },
  breach: { dot: "status-dot--alert", text: "text-status-alert", bg: "bg-status-alertDim" },
  resolved: { dot: "status-dot--clear", text: "text-status-clear", bg: "bg-status-clearDim" },
  approved: { dot: "status-dot--clear", text: "text-status-clear", bg: "bg-status-clearDim" },
};

export default function StatusPill({ status, label }) {
  const v = VARIANTS[status] ?? VARIANTS.clear;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono uppercase tracking-wide ${v.bg} ${v.text}`}
    >
      <span className={`status-dot ${v.dot}`} />
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}
