import { NavLink } from "react-router-dom";
import { LayoutDashboard, PackageSearch, Wind, Recycle, Settings as SettingsIcon } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/intake", label: "Waste Intake", icon: PackageSearch },
  { to: "/emissions", label: "Emissions", icon: Wind },
  { to: "/ash", label: "Ash Offtake", icon: Recycle },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-base-panel border-r border-base-border flex flex-col">
      <div className="px-5 py-5 border-b border-base-border">
        <div className="flex items-center gap-2">
          <span className="status-dot status-dot--clear" />
          <span className="font-display text-sm font-semibold tracking-wide">WTE INTELLIGENCE</span>
        </div>
        <span className="text-[11px] text-text-tertiary font-mono">PLANT-04 · SELANGOR</span>
      </div>
      <nav className="flex-1 py-3 px-2 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-dim text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-base-panelraised"
              }`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-base-border text-[11px] text-text-tertiary font-mono">
        DECISION-SUPPORT ONLY
        <br />
        HUMAN APPROVAL REQUIRED
      </div>
    </aside>
  );
}
