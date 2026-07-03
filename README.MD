# WTE Plant Intelligence Platform
> AI-powered decision-support dashboard for Waste-to-Energy plant operations.
> Built for PromptQuest Hackathon (Category: Sustainability)

**🔗 Live Demo:** [wte-hackhaton.netlify.app](https://wte-hackhaton.netlify.app/)

## The Problem

Malaysia is building 18 Waste-to-Energy (WTE) plants nationally. Through research, we identified four real operational pain points:

1. **No proper waste segregation** — contaminants (e.g. metal) entering the burner can cause shutdowns; recyclable material gets burned by mistake.
2. **24/7 manual monitoring required** — plants need constant human oversight of burner conditions.
3. **Ash goes to waste, not reuse** — ash produced is sent to landfill, even though it can potentially be repurposed as construction material.
4. **Emissions compliance gaps** — air emissions sometimes fail to meet international/Malaysian DOE standards.

## Our Solution

An AI-powered decision-support dashboard for plant operators — **not** physical automation. The AI flags and alerts; humans make the final call. This keeps the system realistic and avoids overpromising on safety-critical industrial control.

### Core Modules

| Module | What It Does |
|---|---|
| **Waste Intake Intelligence** | Logs incoming waste batches, AI flags density anomalies suggesting contamination before the batch enters the burner |
| **Burner Health Monitoring** | Tracks simulated sensor readings with AI-flagged early warning signs |
| **Emissions Compliance Tracker** | Compares readings against DOE limits, auto-generates real PDF compliance reports, sends browser alerts on breach with AI-generated advisory recommendations |
| **Ash Offtake Matching** | Matches accumulated ash against registered construction-material buyers for human-approved dispatch |

### Required Hackathon Modules Mapping

| Required | Implementation |
|---|---|
| User Management | Login screen (simulated auth, 3 demo accounts), User Profile page showing account + live permissions, and a "Viewing as" role switcher (Plant Operator / Shift Supervisor / Compliance Officer) — each role has different allowed actions, enforced via `ROLE_PERMISSIONS` in `src/context/AppContext.jsx` |
| Core Business | Waste Intake, Emissions, Ash Offtake logic (above) |
| Dashboard | Real-time KPI cards, 7-day intake chart, activity feed |
| Reports | Real PDF export via jsPDF on the Emissions screen (compliance summary + full readings table), plus search/filter on Waste Intake and Emissions tables |
| Settings | Company Profile fields, live threshold sliders (contamination sensitivity, PM/CO limits, ash dispatch threshold) that apply immediately across Intake and Emissions, and a read-only User Permissions matrix |

## What This Is NOT

To keep scope realistic for a hackathon timeframe, this project deliberately does **not** include:

- Robotic/computer-vision physical waste sorting
- Autonomous crane control
- Automated truck dispatch (system recommends, human approves)
- Any claim of physically "fixing" emissions or ash chemistry — we monitor, alert, and report only

## Known Limitations (be upfront about these in Q&A)

- **Authentication is simulated**, not backed by a real auth server — fine for a demo, would need a real identity provider for production
- **No persistence** — all data resets on page refresh (batch approvals, generated reports, threshold changes). This is a client-only demo with no backend/database
- **Contamination detection is rule-based** (a density-threshold check), not a trained ML model. We chose transparent, explainable rules over a black-box model deliberately — a compliance officer or DOE auditor needs to see *why* something was flagged, not just trust a score
- **Ash buyer matching and contact directories are hardcoded** demo data, not a live registry

## Tech Stack

- **React 19 + Vite** — SPA, fast dev loop
- **Tailwind CSS** — utility-first styling
- **React Router (HashRouter)** — client-side routing, works on any static host with no server config
- **Recharts** — intake / emissions charts
- **jsPDF** — real compliance report export
- **lucide-react** — icons

No backend. All data comes from `src/data/demo_dataset.json` (7 days of simulated
plant data) and is transformed client-side in `src/context/AppContext.jsx` based
on live threshold settings — this is what makes the Settings screen actually do
something in the demo instead of being a static form.

## Project Structure
wte-platform/
├── src/
│   ├── data/
│   │   └── demo_dataset.json   # Simulated 7-day plant data (batches, emissions, ash log)
│   ├── context/
│   │   └── AppContext.jsx      # Auth, role permissions, live threshold logic, data derivation
│   ├── components/              # Sidebar, TopBar, KpiCard, StatusPill
│   ├── pages/                   # Login, Dashboard, WasteIntake, Emissions, AshOfftake, Settings, Profile
│   └── App.jsx / main.jsx
├── scripts/
│   └── generate_data.py         # Regenerates demo_dataset.json if needed
└── README.md

## Demo Dataset

`src/data/demo_dataset.json` contains 7 days of simulated plant data:
- `kpi_summary` — top-line dashboard numbers
- `waste_batches` — ~66 batches, including one planted contamination incident
- `emissions_readings` — daily readings, including one planted compliance breach
- `ash_log` — ash accumulation and offtake matching events
- `activity_feed` — chronological event log for the dashboard

To regenerate: `python3 scripts/generate_data.py`

## Demo Accounts

Login is simulated (no real auth server). Password for all accounts: `demo123`

| ID | Role |
|---|---|
| `operator1` | Plant Operator |
| `supervisor1` | Shift Supervisor |
| `compliance1` | Compliance Officer |

## Getting Started

```bash
npm install
npm run dev       # local dev server → http://localhost:5173
npm run build     # production build → dist/
```

## Deploying

Live at **[wte-hackhaton.netlify.app](https://wte-hackhaton.netlify.app/)**, deployed via Netlify's GitHub integration — every push to `main` auto-builds and redeploys.

`dist/` is also a plain static bundle if you want to deploy elsewhere — drag-and-drop onto Netlify manually, or:

```bash
npm i -g vercel
vercel --prod
```

HashRouter is used deliberately so it works on any static host with zero
server-side routing config (important for a same-day hackathon deploy).

## Design Direction

Industrial control-room aesthetic — dark UI, status-light color language
(green/amber/red dots throughout), monospace for batch IDs and data readouts.
Grounded in the actual subject matter (plant operations, DOE compliance)
rather than a generic dashboard template.

## Scope Discipline (do not break this in future iterations)

- No robotic/computer-vision physical sorting
- No autonomous crane control
- No automated truck dispatch — system recommends, human always approves
- No claims of physically "fixing" emissions or ash chemistry — monitor, alert, report only

## Team

- **SalmonIsFish** — Developer
- **CinnamonBum** — Slides & Pitch Delivery

---
Built for PromptQuest Hackathon · #PromptQuest