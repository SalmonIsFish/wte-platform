import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import StatusPill from "../components/StatusPill";
import { Truck } from "lucide-react";

export default function AshOfftake() {
  const { data, permissions, dispatchApproved, setDispatchApproved } = useApp();

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Ash Offtake" subtitle="Match accumulated ash to registered construction-material buyers" />
      <div className="p-8">
        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-border text-left text-xs font-mono uppercase tracking-wide text-text-secondary">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Ash Accumulated</th>
                <th className="px-4 py-3 font-medium">Matched Buyer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.ash_log.map((a, i) => (
                <tr key={i} className="border-b border-base-hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-text-primary">{a.date}</td>
                  <td className="px-4 py-3 tabular text-text-primary">{a.ash_accumulated_tons.toFixed(2)} t</td>
                  <td className="px-4 py-3 text-text-secondary">{a.matched_buyer}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={a.dispatch_status} label={a.dispatch_status.replace(/_/g, " ")} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.dispatch_status !== "approved" && !dispatchApproved && (
                      <button
                        disabled={!permissions.canApproveDispatch}
                        onClick={() => setDispatchApproved(true)}
                        className="flex items-center gap-1.5 ml-auto bg-accent-dim text-accent text-xs font-medium px-3 py-1.5 rounded-md hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Truck size={13} />
                        Request Dispatch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-tertiary mt-4">
          Dispatch is always human-approved — the system recommends a match and quantity, it never books logistics automatically.
        </p>
      </div>
    </div>
  );
}
