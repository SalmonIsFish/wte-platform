import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import StatusPill from "../components/StatusPill";
import { FileText, Check, Bell, BellRing, Search } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import jsPDF from "jspdf";

// Hardcoded demo contacts — in production this would pull from a plant staff directory / on-call roster
const RECOMMENDED_CONTACTS = {
  pm: { role: "Compliance Officer", name: "Aisyah Rahman", phone: "+60 12-345 6789" },
  co: { role: "Shift Engineer", name: "Farid Aziz", phone: "+60 13-789 0123" },
};

function getBreachRecommendations(reading, thresholds) {
  const recs = [];
  const pmOver = reading.pm_mg_nm3 > thresholds.pm_limit_mg_nm3;
  const coOver = reading.co_mg_nm3 > thresholds.co_limit_mg_nm3;

  if (pmOver) {
    const pctOver = (
      ((reading.pm_mg_nm3 - thresholds.pm_limit_mg_nm3) / thresholds.pm_limit_mg_nm3) *
      100
    ).toFixed(0);
    recs.push({
      severity: pctOver > 20 ? "high" : "moderate",
      text: `PM reading is ${pctOver}% above the DOE limit. Recommend increasing filtration cycle frequency and inspecting the electrostatic precipitator.`,
      contact: RECOMMENDED_CONTACTS.pm,
    });
  }
  if (coOver) {
    recs.push({
      severity: "moderate",
      text: `CO reading exceeds limit — recommend checking combustion air supply and burner temperature stability.`,
      contact: RECOMMENDED_CONTACTS.co,
    });
  }
  return recs;
}

export default function Emissions() {
  const { data, permissions, thresholds } = useApp();
  const [generated, setGenerated] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [notifiedDates, setNotifiedDates] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const readings = data.emissions_readings;
  const breach = readings.find((r) => r.compliance_status === "breach");

  const filteredReadings = useMemo(() => {
    let list = readings;
    if (statusFilter !== "all") list = list.filter((r) => r.compliance_status === statusFilter);
    if (query.trim()) list = list.filter((r) => r.date.includes(query.trim()));
    return list;
  }, [readings, query, statusFilter]);

  // Fire a browser notification the moment a breach reading is present,
  // once per breach date, only if the user has opted in.
  useEffect(() => {
    if (!alertsEnabled || !breach) return;
    if (notifiedDates.includes(breach.date)) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    new Notification("⚠ Emissions Compliance Breach", {
      body: `${breach.date} — PM/CO readings exceeded DOE limits. Review required.`,
      tag: `breach-${breach.date}`,
    });
    setNotifiedDates((prev) => [...prev, breach.date]);
  }, [alertsEnabled, breach, notifiedDates]);

  const handleEnableAlerts = async () => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      setAlertsEnabled(true);
      return;
    }
    const result = await Notification.requestPermission();
    if (result === "granted") setAlertsEnabled(true);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    const plantId = "PLANT-04";
    const today = new Date().toISOString().slice(0, 10);

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("Emissions Compliance Report", 14, 20);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Plant: ${plantId} · Selangor`, 14, 27);
    doc.text(`Generated: ${today}`, 14, 32);
    doc.text(`Reporting window: ${readings[0].date} to ${readings[readings.length - 1].date}`, 14, 37);

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Applied DOE Limits", 14, 48);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(`PM: ${thresholds.pm_limit_mg_nm3} mg/Nm³   CO: ${thresholds.co_limit_mg_nm3} mg/Nm³`, 14, 54);

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Compliance Summary", 14, 65);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(
      breach
        ? `1 breach event detected on ${breach.date}. PM: ${breach.pm_mg_nm3} mg/Nm³ (limit ${thresholds.pm_limit_mg_nm3}), CO: ${breach.co_mg_nm3} mg/Nm³ (limit ${thresholds.co_limit_mg_nm3}).`
        : "No breaches detected in this reporting window.",
      14,
      71,
      { maxWidth: 180 }
    );

    let y = 88;
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Daily Readings", 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Date", 14, y);
    doc.text("PM (mg/Nm³)", 60, y);
    doc.text("CO (mg/Nm³)", 110, y);
    doc.text("Status", 160, y);
    y += 2;
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont(undefined, "normal");
    readings.forEach((r) => {
      const isBreach = r.compliance_status === "breach";
      doc.setTextColor(isBreach ? 200 : 30, isBreach ? 40 : 30, isBreach ? 40 : 30);
      doc.text(r.date, 14, y);
      doc.text(r.pm_mg_nm3.toFixed(1), 60, y);
      doc.text(r.co_mg_nm3.toFixed(1), 110, y);
      doc.text(r.compliance_status.toUpperCase(), 160, y);
      y += 7;
    });

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(8);
    doc.text(
      "This report was generated by WTE Intelligence decision-support software. All flagged events require operator/compliance officer review — this system does not take autonomous corrective action.",
      14,
      y + 10,
      { maxWidth: 180 }
    );

    doc.save(`emissions-compliance-report-${plantId}-${today}.pdf`);
    setGenerated(true);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <TopBar title="Emissions & Compliance" subtitle="PM and CO readings vs. DOE limits" />
      <div className="p-8 flex flex-col gap-6">
        {breach && (
          <div className="bg-status-alert/10 border border-status-alert/40 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2 text-status-alert text-sm font-medium">
                <BellRing size={16} />
                Compliance breach on {breach.date} — PM/CO exceeded DOE limits
              </div>
              {!alertsEnabled && (
                <button
                  onClick={handleEnableAlerts}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-accent-dim text-accent hover:brightness-125"
                >
                  <Bell size={13} />
                  Enable Alerts
                </button>
              )}
            </div>

            <div className="border-t border-status-alert/30 px-5 py-4 flex flex-col gap-3">
              <p className="text-xs font-mono uppercase tracking-wide text-text-tertiary">
                Recommended Actions (AI-generated, advisory only)
              </p>
              {getBreachRecommendations(breach, thresholds).map((rec, i) => (
                <div key={i} className="flex items-start justify-between gap-4 text-sm">
                  <p className="text-text-primary">{rec.text}</p>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-text-secondary">{rec.contact.role}</p>
                    <p className="text-xs font-mono text-accent">
                      {rec.contact.name} · {rec.contact.phone}
                    </p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-text-tertiary italic mt-1">
                These are system-generated recommendations. Final decisions and any operational changes require
                operator/supervisor approval.
              </p>
            </div>
          </div>
        )}

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
          <div className="flex items-center gap-3 p-4 border-b border-base-border">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search date (YYYY-MM-DD)..."
                className="w-full bg-base-panelraised border border-base-hairline rounded-md pl-8 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="flex gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "compliant", label: "Compliant" },
                { id: "breach", label: "Breach" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                    statusFilter === f.id
                      ? "bg-accent-dim text-accent border-accent-dim"
                      : "text-text-secondary border-base-hairline hover:text-text-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-text-tertiary ml-auto">{filteredReadings.length} readings</span>
          </div>
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
              {filteredReadings.map((r) => (
                <tr key={r.date} className="border-b border-base-hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-text-primary">{r.date}</td>
                  <td
                    className={`px-4 py-3 tabular ${
                      r.pm_mg_nm3 > thresholds.pm_limit_mg_nm3 ? "text-status-alert" : "text-text-primary"
                    }`}
                  >
                    {r.pm_mg_nm3.toFixed(1)}
                  </td>
                  <td
                    className={`px-4 py-3 tabular ${
                      r.co_mg_nm3 > thresholds.co_limit_mg_nm3 ? "text-status-alert" : "text-text-primary"
                    }`}
                  >
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
            onClick={handleGenerateReport}
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
        <span className="text-xs font-mono text-text-tertiary">
          Limit: {limit} {unit}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid stroke="#2A2F35" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8B9199", fontSize: 10 }}
            axisLine={{ stroke: "#2A2F35" }}
            tickLine={false}
            tickFormatter={(d) => d.slice(5)}
          />
          <YAxis tick={{ fill: "#8B9199", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#1C2024", border: "1px solid #2A2F35", borderRadius: 6, fontSize: 12 }} />
          <ReferenceLine y={limit} stroke="#E85D4C" strokeDasharray="4 4" strokeWidth={1} />
          <Line type="monotone" dataKey={dataKey} stroke="#4FA3E3" strokeWidth={2} dot={{ r: 3, fill: "#4FA3E3" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}