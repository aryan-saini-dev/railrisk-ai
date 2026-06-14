from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="RailRisk API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Shipment(BaseModel):
    id: str
    cargo_type: str
    destination: str
    delay_time_hours: float
    urgency_level: str
    dependency_type: str
    downstream_impact: Optional[str] = None

import sqlite3

def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), '..', 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/")
def root():
    return {"message": "RailRisk API is running"}

@app.get("/api/shipments")
def get_sample_shipments():
    conn = get_db_connection()
    shipments = conn.execute('SELECT * FROM shipments').fetchall()
    conn.close()
    return [dict(s) for s in shipments]

@app.get("/api/reports")
def get_reports():
    """Return all cached risk reports. This is the PRIMARY data source for the frontend.
    No LLM calls are made here — it reads directly from SQLite."""
    conn = get_db_connection()
    reports = conn.execute('SELECT report_json FROM risk_reports').fetchall()
    conn.close()
    return [json.loads(r['report_json']) for r in reports]

@app.post("/api/mock-risk")
def mock_risk():
    """Simulate a live disruption on FRT-1006 (Raw Steel).
    Bumps delay from 36h to 72h, re-scores to Critical, and returns the updated report.
    NO Gemini API call — instant response."""
    try:
        conn = get_db_connection()
        mock_id = "FRT-1006"

        report_dict = {
            "shipment_id": mock_id,
            "cargo_type": "Raw Steel",
            "destination": "Automotive Manufacturing Plant",
            "delay_hours": 72.0,
            "delay_severity": "Critical",
            "criticality_level": "High",
            "criticality_score": 91,
            "risk_score": 91,
            "predicted_impact": "Assembly line halted. $2M/day loss confirmed. 800+ workers idle. Tier-1 automotive OEM escalation triggered.",
            "risk_reasoning": "Delay jumped from 36h to 72h — well beyond JIT buffer. Manufacturing plant has zero remaining raw steel inventory.",
            "human_status": "Awaiting Dispatcher Approval",
            "recommended_action": "Emergency road freight transfer of critical steel coils. Halt downstream assembly scheduling.",
            "recommendation_reason": "Factory shutdown costs ($2M/day) far exceed emergency logistics premium (~$50K)."
        }

        conn.execute('INSERT OR REPLACE INTO risk_reports (shipment_id, report_json) VALUES (?, ?)',
                     (mock_id, json.dumps(report_dict)))
        conn.execute('UPDATE shipments SET delay_time_hours = 72.0 WHERE id = ?', (mock_id,))
        conn.commit()

        shipment_row = conn.execute('SELECT * FROM shipments WHERE id = ?', (mock_id,)).fetchone()
        conn.close()

        if not shipment_row:
            raise HTTPException(status_code=404, detail="Mock shipment not found")

        return {"shipment": dict(shipment_row), "report": report_dict}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/reset")
def reset_database():
    """Reset the database to the default seed state."""
    try:
        import sys
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        if backend_dir not in sys.path:
            sys.path.append(backend_dir)
        
        # 1. Close any connections and drop tables to start fresh
        conn = get_db_connection()
        conn.execute('DROP TABLE IF EXISTS shipments')
        conn.execute('DROP TABLE IF EXISTS risk_reports')
        conn.commit()
        conn.close()

        # 2. Run database initialization
        from init_db import init_db
        init_db()

        # 3. Seed risk reports
        from seed_reports import seed_reports
        seed_reports()
        
        # 4. Clear the memory of active action status approvals
        action_status_store.clear()
        
        return {"status": "success", "message": "Database and actions reset to original state."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from executor import send_escalation_email

class ActionRequest(BaseModel):
    shipment_id: str
    human_status: str

action_status_store: dict = {}

@app.post("/api/action-status")
async def update_action_status(request: ActionRequest):
    """When user approves an action, send escalation email via Resend."""
    action_status_store[request.shipment_id] = request.human_status

    if request.human_status.lower() == "approved":
        conn = get_db_connection()
        row = conn.execute('SELECT report_json FROM risk_reports WHERE shipment_id = ?', (request.shipment_id,)).fetchone()
        conn.close()

        if row:
            report_dict = json.loads(row['report_json'])
            send_escalation_email(
                shipment_id=report_dict.get("shipment_id", request.shipment_id),
                cargo_type=report_dict.get("cargo_type", "Unknown"),
                destination=report_dict.get("destination", "Unknown"),
                risk_reasoning=report_dict.get("risk_reasoning", "Unknown"),
                recommended_action=report_dict.get("recommended_action", "Unknown")
            )

    return {"shipment_id": request.shipment_id, "human_status": request.human_status}

@app.get("/api/action-status/{shipment_id}")
async def get_action_status(shipment_id: str):
    return {"shipment_id": shipment_id, "human_status": action_status_store.get(shipment_id, "Pending")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
