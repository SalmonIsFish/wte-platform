import { useState } from "react";
import { useApp, ROLES, ROLE_PERMISSIONS } from "../context/AppContext";
import TopBar from "../components/TopBar";

const FIELDS = [
  { key: "contamination_risk_threshold", label: "Contamination Risk Threshold", min: 0.1, max: 1, step: 0.05, unit: "" },
  { key: "pm_limit_mg_nm3", label: "PM Emissions Limit", min: 20, max: 80, step: 1, unit: "mg/Nm³" },
  { key: "co_limit_mg_nm3", label: "CO Emissions Limit", min: 50, max: 150, step: 5, unit: "mg/Nm³" },
  { key: "ash_dispatch_threshold_tons", label: "Ash Dispatch Threshold", min: 10, max: 50, step: 1, unit: "tons" },
];

const PERMISSION_LABELS = {
  canApproveBatch: "Approve batches",
  canRejectBatch: "Reject batches",
  canGenerateReport: "Generate reports",
  canApproveDispatch: "Approve dispatch",
};

export default function Settings() {
  const { thresholds, setThresholds } = useApp();
  const [company, setCompany] = useState({
    plantName: "Plant-04",
    location: "Selangor, Malaysia",
    concessionaire: "GreenCycle Energy Sdn Bhd",
    registrationId: "WTE-MY-0004",
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Settings" subtitle="Configure detection thresholds — changes apply live across the platform" />
      <div className="p-8 flex flex-col gap-6 max-w-2xl">

        {/* Company Profile */}
        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel p-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary mb-4">
            Company Profile
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "plantName", label: "Plant Name" },
              { key: "location", label: "Location" },
              { key: "concessionaire", label: "Concessionaire" },
              { key: "registrationId", label: "Registration ID" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-text-tertiary mb-1.5">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={company[f.key]}
                  onChange={(e) => setCompany((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-base-panelraised border border-base-hairline rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Detection Thresholds */}
        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel p-6 flex flex-col gap-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Detection Thresholds
          </h3>
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
          <p className="text-xs text-text-tertiary">
            Lowering the contamination threshold or emissions limits will surface more alerts on the Waste Intake and
            Emissions screens immediately.
          </p>
        </div>

        {/* User Permissions Matrix */}
        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel p-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary mb-4">
            User Permissions
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-mono uppercase tracking-wide text-text-tertiary border-b border-base-hairline">
                <th className="pb-2 font-medium">Role</th>
                {Object.values(PERMISSION_LABELS).map((label) => (
                  <th key={label} className="pb-2 font-medium text-center">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.id} className="border-b border-base-hairline last:border-0">
                  <td className="py-2.5 text-text-primary font-medium">{r.label}</td>
                  {Object.keys(PERMISSION_LABELS).map((key) => (
                    <td key={key} className="py-2.5 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          ROLE_PERMISSIONS[r.id][key] ? "bg-status-clear" : "bg-base-hairline"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-text-tertiary mt-3">
            Defined in code — this view is read-only for the demo. A production version would let an admin edit
            role permissions here directly.
          </p>
        </div>
      </div>
    </div>
  );
}