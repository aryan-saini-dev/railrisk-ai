# RailRisk AI

Indian Railways moves thousands of trains and massive freight volumes every day.

It knows where every wagon is.

But delay dashboards do not always translate cargo details into risk priority.

The gap is not in tracking. The gap is in understanding.

**RailRisk AI makes that connection.**

---

## The Invisible Problem

A delayed train shows up in the system as one word — **"delayed."**

No one asks what was inside.
No one asks who was waiting.
No one asks what happens next.

And that silence has consequences.

During emergency situations like COVID oxygen movement, flood relief, and industrial freight disruptions, even a few hours of delay can create serious downstream risk. Existing systems may track delay, but they do not always translate that delay into cargo criticality and response priority.

The system records: *"freight delayed."*

Every time. For every cargo. Regardless of what is inside.

The problem was never just the delay.
**The problem was that no system knew what the delay actually meant.**

---

## What RailRisk AI Does

RailRisk AI is a disruption risk intelligence system for rail freight.

It does not replace existing railway systems.
It adds one layer that is currently missing —

**cargo awareness.**

```
Delay detected
      ↓
Cargo identified
medicine / oxygen / food / fuel / raw material
      ↓
Criticality scored
how urgent is this cargo, for whom, and how much time is left
      ↓
Downstream impact estimated
which hospital, factory, market, or supply chain is at risk
      ↓
Action recommended
reroute / road transfer / priority alert / notify authority
      ↓
RailRisk Report generated
```

A delayed wagon carrying steel — low priority. Monitor.

A delayed wagon carrying oxygen cylinders for a hospital with 4 hours of backup — **Critical. Act now.**

RailRisk AI knows the difference.

---

## Demo Case

```
Train ID      :  12345
Wagon ID      :  W-08
Route         :  Kanpur → Lucknow
Cargo         :  Oxygen Cylinders
Destination   :  City Hospital
Delay         :  6 hours
Backup Time   :  4 hours
─────────────────────────────────
Criticality   :  Critical
Risk Score    :  94 / 100
Impact        :  Hospital oxygen supply at risk
Action        :  Priority alert + road transfer
Reason        :  Delay exceeds available backup time
```

---

## How It Works — 4 Agents

RailRisk AI runs as a sequential 4-agent pipeline.
Each agent takes the previous output and adds one layer of intelligence.

**Agent 1 — Delay Detection**
Is this wagon delayed? By how much? On which route?

**Agent 2 — Cargo Criticality**
What is inside? How critical is it?

| Cargo | Criticality |
|---|---|
| Oxygen / Medicine / Fuel | Critical |
| Food / Perishables | High |
| Factory Raw Material | Medium-High |
| Normal Goods | Low-Medium |

**Agent 3 — Impact Prediction**
Who is affected? How much time is left before damage begins?

**Agent 4 — Action Recommendation**
What should happen first — reroute, road transfer, priority alert, or authority notification?

One input. Four layers. One clear report.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python + FastAPI |
| Agent Logic | Rule-based Python modules |
| Dataset | JSON — simulated freight data |
| Frontend | React + Tailwind CSS |
| API | FastAPI — single POST endpoint |
| Storage | SQLite / PostgreSQL |

---

## Project Structure

```text
railrisk-ai/
├── config/
│   └── rules.json          # Dynamic rules configuration
├── data/
│   └── freight_dataset.json # Simulated datasets
├── src/
│   ├── agents.py           # 4-layer agent logic
│   └── main.py             # CLI pipeline runner
└── README.md
```

---

## How to Run Locally (CLI Pipeline)

```bash
git clone https://github.com/devang-kumar/railrisk.git
cd railrisk

# Run the agentic pipeline over the mock dataset
python src/main.py
```

---

## API

**POST** `/analyze`

```json
{
  "train_id": "12345",
  "wagon_id": "W-08",
  "cargo_type": "oxygen_cylinders",
  "delay_hours": 6,
  "receiver_type": "hospital",
  "backup_time": 4
}
```

**Response:**
```json
{
  "criticality": "Critical",
  "risk_score": 94,
  "impact": "Hospital oxygen supply at risk",
  "recommended_action": "Priority alert + road transfer",
  "reason": "Delay exceeds available backup time"
}
```

---

## What This System Does Not Claim

RailRisk AI does not claim to predict outcomes with certainty.

It is a **risk intelligence tool** — it estimates criticality, flags high-risk delays, and recommends priority actions for human review.

Final decisions remain with the authority.

---

## Team RootSignal

**Competition:** FAR AWAY 2026 — India's Biggest International Hackathon
**Theme:** Railways · Logistics & Transit · Agentic & Autonomous Systems

| Member | Role |
|---|---|
| Ekta | Strategy, research, problem framing, content, team alignment |
| Devang | Backend, agents, risk logic, dataset, API, GitHub |
| Aryan | Frontend, UI/UX, PPT, demo visuals |
| Piyush | Pitch, storytelling, judge Q&A, final presentation |
| Mannu | Coordination, progress tracking, testing, submission |

---

*A delayed wagon carrying steel is an inconvenience.*
*A delayed wagon carrying oxygen is a decision.*
*RailRisk AI makes sure that decision is never missed.*
