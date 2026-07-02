// src/components/TopBar.jsx — full file:
import { useApp, ROLES } from "../context/AppContext";
import { ChevronDown } from "lucide-react";

export default function TopBar({ title, subtitle }) {
  const { role, switchRole } = useApp();

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-base-border">
      <div>
        <h1 className="font-display text-xl font-semibold text-text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-mono uppercase tracking-wide text-text-tertiary">Viewing as</span>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value)}
            className="appearance-none bg-base-panelraised border border-base-hairline rounded-md pl-3 pr-8 py-2 text-sm font-medium text-text-primary cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary" />
        </div>
      </div>
    </header>
  );
}