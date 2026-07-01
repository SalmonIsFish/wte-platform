# WTE Plant Intelligence Platform

> AI-powered decision-support dashboard for Waste-to-Energy plant operations.
> Built for PromptQuest Hackathon (Category: Sustainability)

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
| **Emissions Compliance Tracker** | Compares readings against DOE limits, auto-generates compliance reports |
| **Ash Offtake Matching** | Matches accumulated ash against registered construction-material buyers for human-approved dispatch |

### Required Hackathon Modules Mapping

| Required | Implementation |
|---|---|
| User Management | Roles: Plant Operator / Shift Supervisor / Compliance Officer |
| Core Business | Intake, burner, emissions, and ash logic above |
| Dashboard | Real-time KPIs across all four areas |
| Reports | Exportable compliance reports |
| Settings | Configurable thresholds (contamination sensitivity, emissions limits) |

## What This Is NOT

To keep scope realistic for a hackathon timeframe, this project deliberately does **not** include:
- Robotic/computer-vision physical waste sorting
- Autonomous crane control
- Automated truck dispatch (system recommends, human approves)
- Any claim of physically "fixing" emissions or ash chemistry — we monitor, alert, and report only

## Project Structure

```
wte-platform/
├── data/
│   └── demo_dataset.json    # Simulated 7-day plant data (batches, emissions, ash log)
├── scripts/
│   └── generate_data.py     # Regenerates demo_dataset.json if needed
├── src/                      # App source code
└── README.md
```

## Demo Dataset

`data/demo_dataset.json` contains 7 days of simulated plant data:
- `kpi_summary` — top-line dashboard numbers
- `waste_batches` — ~66 batches, including one planted contamination incident
- `emissions_readings` — daily readings, including one planted compliance breach
- `ash_log` — ash accumulation and offtake matching events
- `activity_feed` — chronological event log for the dashboard

To regenerate: `python3 scripts/generate_data.py`

## Tech Stack

_TBD — to be filled in once decided_

## Team

_TBD — add team member names/roles_

## Getting Started

_TBD — add setup/run instructions once app scaffold exists_

---
Built for PromptQuest Hackathon · #PromptQuest