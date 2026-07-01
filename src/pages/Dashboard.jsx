import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import KpiCard from "../components/KpiCard";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from "recharts";

function buildDailyIntake(waste_batches) {
  const byDay = {};
  for (const b of waste_batches) {
    const day = b.timestamp.slice(0, 10);
    if (!byDay[day]) byDay[day] = { day, tons: 0, flagged: 0 };
    byDay[day].tons += b.weight_tons;
    if (b.status === "flagged") byDay[day].flagged += 1;
  }
  return Object.values(byDay).sort((a, b) => a.day.localeCompare(b.day));
}

export default function Dashboard() {
  const { data } = useApp();
  const { kpi_summary, activity_feed } = data;
  const daily = buildDailyIntake(data.waste_batches);
  const flaggedDay = daily.find((d) => d.flagged > 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Dashboard" subtitle="Live status across intake, burner, emissions and ash offtake" />

      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          <KpiCard label="Today's Intake" value={kpi_summary.todays_intake_tons} unit="tons" />
          <KpiCard
            label="Active Alerts"
            value={kpi_summary.active_alerts}
            tone={kpi_summary.active_alerts > 0 ? "alert" : "clear"}
            sublabel={kpi_summary.active_alerts > 0 ? "Requires review" : "Nothing flagged"}
          />
          <KpiCard
            label="Emissions Status"
            value={kpi_summary.emissions_status === "compliant" ? "Compliant" : "Breach"}
            tone={kpi_summary.emissions_status === "compliant" ? "clear" : "alert"}
          />
          <KpiCard label="Ash Pending" value={kpi_summary.ash_pending_tons} unit="tons" tone="warn" sublabel="Matched to buyer" />
        </div>

        <div className="bg-base-panel border border-base-border rounded-lg p-5 shadow-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">
              7-Day Intake
            </h2>
            {flaggedDay && (
              <span className="text-xs font-mono text-status-alert">
                ● Contamination flagged {flaggedDay.day}
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={daily}>
              <CartesianGrid stroke="#2A2F35" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#8B9199", fontSize: 11 }} axisLine={{ stroke: "#2A2F35" }} tickLine={false} />
              <YAxis tick={{ fill: "#8B9199", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1C2024", border: "1px solid #2A2F35", borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: "#E8EAED" }}
              />
              <Bar dataKey="tons" fill="#4FA3E3" radius={[3, 3, 0, 0]} barSize={28} />
              {flaggedDay && (
                <ReferenceDot x={flaggedDay.day} y={flaggedDay.tons} r={6} fill="#E85D4C" stroke="none" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-panel border border-base-border rounded-lg p-5 shadow-panel">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary mb-3">
            Recent Activity
          </h2>
          <ul className="flex flex-col gap-3">
            {activity_feed.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-text-tertiary font-mono text-xs mt-0.5 w-32 shrink-0">
                  {a.timestamp.slice(0, 16).replace("T", " ")}
                </span>
                <span className="text-text-primary">{a.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
