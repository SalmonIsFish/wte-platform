import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";

const FIELDS = [
  { key: "contamination_risk_threshold", label: "Contamination Risk Threshold", min: 0.1, max: 1, step: 0.05, unit: "" },
  { key: "pm_limit_mg_nm3", label: "PM Emissions Limit", min: 20, max: 80, step: 1, unit: "mg/Nm³" },
  { key: "co_limit_mg_nm3", label: "CO Emissions Limit", min: 50, max: 150, step: 5, unit: "mg/Nm³" },
  { key: "ash_dispatch_threshold_tons", label: "Ash Dispatch Threshold", min: 10, max: 50, step: 1, unit: "tons" },
];

export default function Settings() {
  const { thresholds, setThresholds } = useApp();

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Settings" subtitle="Configure detection thresholds — changes apply live across the platform" />
      <div className="p-8">
        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel p-6 flex flex-col gap-6 max-w-xl">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-text-primary">{f.label}</label>
                <span className="text-sm font-mono tabular text-accent">
                  {thresholds[f.key]} {f.unit}
                </span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={thresholds[f.key]}
                onChange={(e) =>
                  setThresholds((prev) => ({ ...prev, [f.key]: parseFloat(e.target.value) }))
                }
                className="w-full accent-[#4FA3E3]"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-text-tertiary mt-4 max-w-xl">
          Lowering the contamination threshold or emissions limits will surface more alerts on the Waste Intake and
          Emissions screens immediately — useful for showing judges how sensitivity tuning works live.
        </p>
      </div>
    </div>
  );
}
