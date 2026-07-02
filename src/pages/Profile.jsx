import { useApp, ROLE_PERMISSIONS } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { User, LogOut } from "lucide-react";

const PERMISSION_LABELS = {
  canApproveBatch: "Approve waste batches",
  canRejectBatch: "Reject waste batches",
  canGenerateReport: "Generate compliance reports",
  canApproveDispatch: "Approve ash dispatch",
};

export default function Profile() {
  const { currentUser, role, permissions, logout } = useApp();

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Profile" subtitle="Your account and permissions" />
      <div className="p-8 max-w-xl flex flex-col gap-6">
        <div className="bg-base-panel border border-base-border rounded-lg p-6 shadow-panel flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent-dim flex items-center justify-center shrink-0">
            <User size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-text-primary">{currentUser?.name}</h2>
            <p className="text-sm text-text-secondary">{currentUser?.title}</p>
            <p className="text-xs font-mono text-text-tertiary mt-0.5">
              {currentUser?.id} · {currentUser?.shift}
            </p>
          </div>
        </div>

        <div className="bg-base-panel border border-base-border rounded-lg p-5 shadow-panel">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary mb-4">
            Current Role Permissions
          </h3>
          <ul className="flex flex-col gap-2.5">
            {Object.entries(ROLE_PERMISSIONS[role]).map(([key, allowed]) => (
              <li key={key} className="flex items-center justify-between text-sm">
                <span className="text-text-primary">{PERMISSION_LABELS[key]}</span>
                <span className={allowed ? "text-status-clear text-xs font-mono" : "text-text-tertiary text-xs font-mono"}>
                  {allowed ? "ALLOWED" : "RESTRICTED"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 justify-center bg-status-alertDim text-status-alert text-sm font-medium py-2.5 rounded-md hover:brightness-125 w-fit px-5 self-start"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}