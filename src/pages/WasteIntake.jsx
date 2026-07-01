import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import StatusPill from "../components/StatusPill";
import { X } from "lucide-react";

export default function WasteIntake() {
  const { data, resolveBatch, permissions } = useApp();
  const [selected, setSelected] = useState(null);

  const batches = [...data.waste_batches].sort((a, b) => (a.status === "flagged" ? -1 : 1));

  return (
    <div className="flex-1 overflow-y-auto flex">
      <div className="flex-1 overflow-y-auto">
        <TopBar title="Waste Intake" subtitle="Incoming batches with AI density-anomaly screening" />
        <div className="p-8">
          <div className="bg-base-panel border border-base-border rounded-lg shadow-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-border text-left text-xs font-mono uppercase tracking-wide text-text-secondary">
                  <th className="px-4 py-3 font-medium">Batch</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Weight</th>
                  <th className="px-4 py-3 font-medium">Risk Score</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr
                    key={b.batch_id}
                    className="border-b border-base-hairline last:border-0 hover:bg-base-panelraised cursor-pointer"
                    onClick={() => setSelected(b)}
                  >
                    <td className="px-4 py-3 font-mono text-text-primary">{b.batch_id}</td>
                    <td className="px-4 py-3 text-text-secondary">{b.source}</td>
                    <td className="px-4 py-3 tabular text-text-primary">{b.weight_tons.toFixed(2)} t</td>
                    <td className="px-4 py-3 tabular text-text-primary">{b.ai_risk_score.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-accent text-xs font-medium">Inspect →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="w-96 shrink-0 border-l border-base-border bg-base-panel p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{selected.batch_id}</h2>
            <button onClick={() => setSelected(null)} className="text-text-tertiary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>

          <StatusPill status={selected.status} />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Source" value={selected.source} />
            <Field label="Weight" value={`${selected.weight_tons.toFixed(2)} t`} />
            <Field label="Expected Density" value={selected.expected_density.toFixed(3)} />
            <Field label="Actual Density" value={selected.actual_density.toFixed(3)} />
            <Field label="Risk Score" value={selected.ai_risk_score.toFixed(2)} />
            <Field label="Timestamp" value={selected.timestamp.replace("T", " ")} />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wide text-text-secondary">AI Reasoning</span>
            <p className="text-sm text-text-primary mt-1.5 leading-relaxed">{selected.ai_reasoning}</p>
          </div>

          {selected.status === "flagged" && (
            <div className="flex gap-2 mt-auto pt-4 border-t border-base-hairline">
              <button
                disabled={!permissions.canApproveBatch}
                onClick={() => {
                  resolveBatch(selected.batch_id, "approved");
                  setSelected(null);
                }}
                className="flex-1 bg-status-clearDim text-status-clear text-sm font-medium py-2 rounded-md hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Approve
              </button>
              <button
                disabled={!permissions.canRejectBatch}
                onClick={() => {
                  resolveBatch(selected.batch_id, "rejected");
                  setSelected(null);
                }}
                className="flex-1 bg-status-alertDim text-status-alert text-sm font-medium py-2 rounded-md hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          )}
          {selected.status !== "flagged" && (
            <p className="text-xs text-text-tertiary mt-auto pt-4 border-t border-base-hairline">
              No action required — batch cleared automatically.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <span className="block text-[11px] font-mono uppercase tracking-wide text-text-tertiary">{label}</span>
      <span className="block text-text-primary mt-0.5 tabular">{value}</span>
    </div>
  );
}
