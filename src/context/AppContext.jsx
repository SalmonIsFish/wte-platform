import { createContext, useContext, useMemo, useState } from "react";
import rawData from "../data/demo_dataset.json";

const AppContext = createContext(null);

export const ROLES = [
  { id: "operator", label: "Plant Operator" },
  { id: "supervisor", label: "Shift Supervisor" },
  { id: "compliance", label: "Compliance Officer" },
];

// Each role sees the same data but has different allowed actions.
// This is what satisfies the "User Management" required module without
// building real auth for a hackathon demo — the pitch is honest about that.
export const ROLE_PERMISSIONS = {
  operator: { canApproveBatch: true, canRejectBatch: true, canGenerateReport: false, canApproveDispatch: false },
  supervisor: { canApproveBatch: true, canRejectBatch: true, canGenerateReport: true, canApproveDispatch: true },
  compliance: { canApproveBatch: false, canRejectBatch: false, canGenerateReport: true, canApproveDispatch: false },
};

export function AppProvider({ children }) {
  const [role, setRole] = useState("supervisor");

  // Settings module: configurable thresholds. Changing these client-side
  // re-derives batch/emissions status live, so Settings actually does something
  // in the demo instead of being a static form.
  const [thresholds, setThresholds] = useState({
    contamination_risk_threshold: rawData.meta.thresholds.contamination_risk_threshold,
    pm_limit_mg_nm3: rawData.meta.thresholds.pm_limit_mg_nm3,
    co_limit_mg_nm3: rawData.meta.thresholds.co_limit_mg_nm3,
    ash_dispatch_threshold_tons: rawData.meta.thresholds.ash_dispatch_threshold_tons,
  });

  // batch operator_action overrides, keyed by batch_id — lets Approve/Reject
  // clicks in the UI feel real without needing a backend.
  const [batchActions, setBatchActions] = useState({});
  const [dispatchApproved, setDispatchApproved] = useState(false);

  const data = useMemo(() => {
    const waste_batches = rawData.waste_batches.map((b) => {
      const risk_status =
        b.ai_risk_score >= thresholds.contamination_risk_threshold ? "flagged" : "clear";
      return {
        ...b,
        status: batchActions[b.batch_id] ? "resolved" : risk_status,
        operator_action: batchActions[b.batch_id] ?? b.operator_action,
      };
    });

    const emissions_readings = rawData.emissions_readings.map((e) => ({
      ...e,
      compliance_status:
        e.pm_mg_nm3 > thresholds.pm_limit_mg_nm3 || e.co_mg_nm3 > thresholds.co_limit_mg_nm3
          ? "breach"
          : "compliant",
    }));

    const flaggedBatches = waste_batches.filter((b) => b.status === "flagged");
    const breachDays = emissions_readings.filter((e) => e.compliance_status === "breach");

    return {
      ...rawData,
      waste_batches,
      emissions_readings,
      kpi_summary: {
        ...rawData.kpi_summary,
        active_alerts: flaggedBatches.length,
        emissions_status: breachDays.length > 0 ? "breach" : "compliant",
      },
      ash_log: rawData.ash_log.map((a) => ({
        ...a,
        dispatch_status: dispatchApproved ? "approved" : a.dispatch_status,
      })),
    };
  }, [thresholds, batchActions, dispatchApproved]);

  const resolveBatch = (batch_id, action) => {
    setBatchActions((prev) => ({ ...prev, [batch_id]: action }));
  };

  const value = {
    role,
    setRole,
    permissions: ROLE_PERMISSIONS[role],
    thresholds,
    setThresholds,
    data,
    resolveBatch,
    dispatchApproved,
    setDispatchApproved,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
