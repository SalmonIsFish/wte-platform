import json
import random
from datetime import datetime, timedelta

random.seed(42)

today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
start_date = today - timedelta(days=6)

waste_sources = ["Municipal Collection - Zone A", "Municipal Collection - Zone B", "Commercial Pickup", "Industrial Partner", "Municipal Collection - Zone C"]

batches = []
batch_id = 1

# Day index where we plant the contamination incident
CONTAM_DAY = 3
CONTAM_BATCH_INDEX = 4  # which batch of that day is flagged

emissions_readings = []
EMISSIONS_BREACH_DAY = 5

ash_log = []
cumulative_ash = 0
ASH_DISPATCH_THRESHOLD = 25.0  # tons

for day_offset in range(7):
    current_date = start_date + timedelta(days=day_offset)
    num_batches = random.randint(8, 12)

    for i in range(num_batches):
        hour = random.randint(6, 20)
        minute = random.randint(0, 59)
        timestamp = current_date.replace(hour=hour, minute=minute)

        weight = round(random.uniform(1.2, 4.8), 2)
        source = random.choice(waste_sources)

        is_flagged = (day_offset == CONTAM_DAY and i == CONTAM_BATCH_INDEX)

        if is_flagged:
            expected_density = round(random.uniform(0.25, 0.35), 3)
            actual_density = round(expected_density * random.uniform(2.1, 2.6), 3)
            risk_score = round(random.uniform(0.82, 0.95), 2)
            status = "flagged"
            ai_reasoning = (
                f"Density reading {actual_density} t/m³ is {round(actual_density/expected_density,1)}x "
                f"the expected range ({expected_density} t/m³) for organic/municipal waste. "
                f"Pattern consistent with metallic contamination. Recommend manual inspection before feed."
            )
        else:
            expected_density = round(random.uniform(0.25, 0.35), 3)
            actual_density = round(expected_density * random.uniform(0.92, 1.12), 3)
            risk_score = round(random.uniform(0.02, 0.18), 2)
            status = "clear"
            ai_reasoning = "Density within expected range for waste category. No anomaly detected."

        batches.append({
            "batch_id": f"B{batch_id:04d}",
            "timestamp": timestamp.isoformat(),
            "source": source,
            "weight_tons": weight,
            "expected_density": expected_density,
            "actual_density": actual_density,
            "ai_risk_score": risk_score,
            "status": status,  # clear | flagged | reviewed
            "ai_reasoning": ai_reasoning,
            "operator_action": None if status == "clear" else "pending"
        })
        batch_id += 1

        # Track ash production roughly proportional to weight burned (not flagged ones - those get pulled)
        if status != "flagged":
            ash_produced = round(weight * 0.18, 3)  # ~18% ash yield assumption
            cumulative_ash += ash_produced

    # One emissions reading per day
    is_breach_day = (day_offset == EMISSIONS_BREACH_DAY)
    pm_limit = 50.0   # mg/Nm3 particulate matter limit (illustrative)
    co_limit = 100.0  # mg/Nm3 CO limit (illustrative)

    if is_breach_day:
        pm_reading = round(random.uniform(54, 63), 1)
        co_reading = round(random.uniform(70, 90), 1)
        compliance_status = "breach"
    else:
        pm_reading = round(random.uniform(28, 46), 1)
        co_reading = round(random.uniform(40, 85), 1)
        compliance_status = "compliant"

    emissions_readings.append({
        "date": current_date.strftime("%Y-%m-%d"),
        "pm_mg_nm3": pm_reading,
        "pm_limit_mg_nm3": pm_limit,
        "co_mg_nm3": co_reading,
        "co_limit_mg_nm3": co_limit,
        "compliance_status": compliance_status
    })

    # Ash dispatch event when threshold crossed
    if cumulative_ash >= ASH_DISPATCH_THRESHOLD:
        ash_log.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "event": "threshold_reached",
            "ash_accumulated_tons": round(cumulative_ash, 2),
            "matched_buyer": "GreenBlock Aggregates Sdn Bhd",
            "dispatch_status": "pending_approval"
        })
        cumulative_ash = 0  # reset after dispatch

# Manually mark the flagged batch's operator action as resolved for demo richness
for b in batches:
    if b["status"] == "flagged":
        b["operator_action"] = "rejected"
        b["status"] = "reviewed"

# Recent activity feed (derived, for Dashboard screen)
activity_feed = []
for b in batches:
    if b["status"] in ("flagged", "reviewed"):
        activity_feed.append({
            "timestamp": b["timestamp"],
            "message": f"Batch {b['batch_id']} flagged: density anomaly suggests metal content"
        })
        if b["operator_action"] == "rejected":
            activity_feed.append({
                "timestamp": b["timestamp"],
                "message": f"Batch {b['batch_id']} rejected by operator after inspection"
            })

for e in emissions_readings:
    if e["compliance_status"] == "breach":
        activity_feed.append({
            "timestamp": e["date"] + "T00:00:00",
            "message": f"Emissions breach detected: PM {e['pm_mg_nm3']} mg/Nm³ exceeds limit {e['pm_limit_mg_nm3']} mg/Nm³"
        })

for a in ash_log:
    activity_feed.append({
        "timestamp": a["date"] + "T00:00:00",
        "message": f"Ash threshold reached ({a['ash_accumulated_tons']}t) — matched with {a['matched_buyer']}"
    })

activity_feed.sort(key=lambda x: x["timestamp"], reverse=True)

# KPI summary (for Dashboard top cards) - based on most recent day
today_str = today.strftime("%Y-%m-%d")
todays_batches = [b for b in batches if b["timestamp"].startswith(today_str)]
todays_intake = round(sum(b["weight_tons"] for b in todays_batches), 2)
active_alerts = len([b for b in batches if b["status"] == "reviewed" and b["operator_action"] == "pending"])
latest_emissions = emissions_readings[-1]["compliance_status"]
ash_pending = ash_log[-1]["ash_accumulated_tons"] if ash_log else round(cumulative_ash, 2)

dataset = {
    "meta": {
        "generated_at": datetime.now().isoformat(),
        "date_range": {
            "start": start_date.strftime("%Y-%m-%d"),
            "end": today.strftime("%Y-%m-%d")
        },
        "thresholds": {
            "pm_limit_mg_nm3": 50.0,
            "co_limit_mg_nm3": 100.0,
            "ash_dispatch_threshold_tons": ASH_DISPATCH_THRESHOLD,
            "contamination_risk_threshold": 0.7
        }
    },
    "kpi_summary": {
        "todays_intake_tons": todays_intake,
        "active_alerts": active_alerts,
        "emissions_status": latest_emissions,
        "ash_pending_tons": ash_pending
    },
    "waste_batches": batches,
    "emissions_readings": emissions_readings,
    "ash_log": ash_log,
    "activity_feed": activity_feed[:15]
}

with open("/home/claude/wte/demo_dataset.json", "w") as f:
    json.dump(dataset, f, indent=2)

print(f"Total batches: {len(batches)}")
print(f"Flagged/reviewed batches: {len([b for b in batches if b['status']=='reviewed'])}")
print(f"Emissions readings: {len(emissions_readings)}")
print(f"Breach days: {[e['date'] for e in emissions_readings if e['compliance_status']=='breach']}")
print(f"Ash dispatch events: {len(ash_log)}")
print(f"Activity feed items: {len(activity_feed)}")