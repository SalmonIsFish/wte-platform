import { useState } from "react";
import { useApp } from "../context/AppContext";
import { LogIn } from "lucide-react";

export default function Login() {
  const { login } = useApp();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(userId.trim(), password);
    if (!result.success) setError(result.error);
  };

  const fillDemo = (id) => {
    setUserId(id);
    setPassword("demo123");
    setError("");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-base-bg">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="status-dot status-dot--clear" />
          <span className="font-display text-base font-semibold tracking-wide text-text-primary">
            WTE INTELLIGENCE
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-base-panel border border-base-border rounded-lg p-6 shadow-panel flex flex-col gap-4"
        >
          <div>
            <h1 className="font-display text-lg font-semibold text-text-primary">Sign in</h1>
            <p className="text-sm text-text-secondary mt-1">Plant-04 · Selangor</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wide text-text-secondary">Operator ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. supervisor1"
              className="bg-base-panelraised border border-base-hairline rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wide text-text-secondary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-base-panelraised border border-base-hairline rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {error && <p className="text-xs text-status-alert">{error}</p>}

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-accent-dim text-accent text-sm font-medium py-2.5 rounded-md hover:brightness-125 mt-1"
          >
            <LogIn size={15} />
            Sign in
          </button>
        </form>

        <div className="mt-4 bg-base-panel/50 border border-base-hairline rounded-lg p-4">
          <p className="text-[11px] font-mono uppercase tracking-wide text-text-tertiary mb-2">
            Demo accounts (password: demo123)
          </p>
          <div className="flex flex-col gap-1.5">
            <button onClick={() => fillDemo("operator1")} className="text-left text-xs text-accent hover:underline">
              operator1 — Plant Operator
            </button>
            <button onClick={() => fillDemo("supervisor1")} className="text-left text-xs text-accent hover:underline">
              supervisor1 — Shift Supervisor
            </button>
            <button onClick={() => fillDemo("compliance1")} className="text-left text-xs text-accent hover:underline">
              compliance1 — Compliance Officer
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-tertiary mt-4">
          Simulated authentication for demo purposes — not connected to a real auth server.
        </p>
      </div>
    </div>
  );
}