import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import StatusPill from "../components/StatusPill";
import { FileText, Check } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

export default function Emissions() {
  const { data, permissions, thresholds } = useApp();
  const [generated, setGenerated] = useState(false);
  const readings = data.emissions_readings;
  const breach = readings.find((r) => r.compliance_status === "breach");

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Emissions & Compliance" subtitle="PM and CO readings vs. DOE limits" />
      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <ChartPanel
            title="Particulate Matter (PM)"
            unit="mg/Nm³"
            dataKey="pm_mg_nm3"
            limit={thresholds.pm_limit_mg_nm3}
            data={readings}
          />
          <ChartPanel
            title="Carbon Monoxide (CO)"
            unit="mg/Nm³"
            dataKey="co_mg_nm3"
            limit={thresholds.co_limit_mg_nm3}
            data={readings}
          />
        </div>

        <div className="bg-base-panel border border-base-border rounded-lg shadow-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-border text-left text-xs font-mono uppercase tracking-wide text-text-secondary">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">PM (mg/Nm³)</th>
                <th className="px-4 py-3 font-medium">CO (mg/Nm³)</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r) => (
                <tr key={r.date} className="border-b border-base-hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-text-primary">{r.date}</td>
                  <td className={`px-4 py-3 tabular ${r.pm_mg_nm3 > thresholds.pm_limit_mg_nm3 ? "text-status-alert" : "text-text-primary"}`}>
                    {r.pm_mg_nm3.toFixed(1)}
                  </td>
                  <td className={`px-4 py-3 tabular ${r.co_mg_nm3 > thresholds.co_limit_mg_nm3 ? "text-status-alert" : "text-text-primary"}`}>
                    {r.co_mg_nm3.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.compliance_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-base-panel border border-base-border rounded-lg p-5 shadow-panel flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold text-text-primary">Compliance Report</h3>
            <p className="text-xs text-text-secondary mt-1">
              {breach
                ? `1 breach event detected (${breach.date}) — included in report`
                : "No breaches in current 7-day window"}
            </p>
          </div>
          <button
            disabled={!permissions.canGenerateReport}
            onClick={() => setGenerated(true)}
            className="flex items-center gap-2 bg-accent-dim text-accent text-sm font-medium px-4 py-2 rounded-md hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generated ? <Check size={16} /> : <FileText size={16} />}
            {generated ? "Report Generated" : "Generate Compliance Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ title, unit, dataKey, limit, data }) {
  return (
    <div className="bg-base-panel border border-base-border rounded-lg p-5 shadow-panel">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-text-secondary">{title}</h2>
        <span className="text-xs font-mono text-text-tertiary">Limit: {limit} {unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid stroke="#2A2F35" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#8B9199", fontSize: 10 }} axisLine={{ stroke: "#2A2F35" }} tickLine={false} tickFormatter={(d) => d.slice(5)} />
          <YAxis tick={{ fill: "#8B9199", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#1C2024", border: "1px solid #2A2F35", borderRadius: 6, fontSize: 12 }} />
          <ReferenceLine y={limit} stroke="#E85D4C" strokeDasharray="4 4" strokeWidth={1} />
          <Line type="monotone" dataKey={dataKey} stroke="#4FA3E3" strokeWidth={2} dot={{ r: 3, fill: "#4FA3E3" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
