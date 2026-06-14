"""
One-time script to seed the risk_reports table with realistic AI-generated data.
Uses the actual FRT-* shipment IDs from freight_dataset.json.
No LLM call needed — this is the "pre-analyzed" data.
"""
import json
import sqlite3
import os

# Database connection and execution is wrapped in a function below to allow safe imports.


reports = [
    {
        "shipment_id": "FRT-1001",
        "cargo_type": "Liquid Oxygen",
        "destination": "City Hospital Complex",
        "delay_hours": 4.5,
        "delay_severity": "Moderate",
        "criticality_level": "High",
        "criticality_score": 92,
        "risk_score": 92,
        "predicted_impact": "ICU life-support oxygen reserve drops below 2 hours. 240-bed hospital at immediate risk.",
        "risk_reasoning": "Liquid oxygen is a life-critical medical gas. A 4.5h delay on a Critical-urgency Healthcare shipment directly threatens patient survival in ICU wards.",
        "human_status": "Awaiting Dispatcher Approval",
        "recommended_action": "Activate emergency road tanker from nearest industrial gas depot. Alert hospital to switch to cylinder backup.",
        "recommendation_reason": "Patient safety is at imminent risk; road transfer can deliver within 90 minutes."
    },
    {
        "shipment_id": "FRT-1002",
        "cargo_type": "Vaccines and Medicine",
        "destination": "Regional Distribution Hub",
        "delay_hours": 12.0,
        "delay_severity": "Severe",
        "criticality_level": "High",
        "criticality_score": 88,
        "risk_score": 88,
        "predicted_impact": "Cold-chain integrity compromised after 8h. ₹2.4Cr vaccine batch at spoilage risk. 15 district clinics affected.",
        "risk_reasoning": "Vaccines require strict temperature control. A 12h delay on Critical Healthcare cargo exceeds the cold-chain buffer window, risking total batch loss.",
        "human_status": "Awaiting Dispatcher Approval",
        "recommended_action": "Reroute via refrigerated truck immediately. Notify district health officer of revised ETA.",
        "recommendation_reason": "Cold-chain breach is irreversible; alternative refrigerated transport is the only viable option."
    },
    {
        "shipment_id": "FRT-1003",
        "cargo_type": "Jet Fuel",
        "destination": "International Airport",
        "delay_hours": 6.0,
        "delay_severity": "Moderate",
        "criticality_level": "High",
        "criticality_score": 78,
        "risk_score": 78,
        "predicted_impact": "Airport fuel reserves drop to 4h buffer. 12 flights at risk of delay or cancellation.",
        "risk_reasoning": "Jet fuel is essential for aviation operations. A 6h delay on High-urgency Transportation cargo threatens flight schedules and passenger safety.",
        "human_status": "Recommended for Human Review",
        "recommended_action": "Alert airport fuel operations. Coordinate with backup pipeline supplier.",
        "recommendation_reason": "Flight cancellations have massive cascading economic and reputational impact."
    },
    {
        "shipment_id": "FRT-1004",
        "cargo_type": "Perishable Food (Produce)",
        "destination": "Metro Supermarket Chain",
        "delay_hours": 18.0,
        "delay_severity": "Severe",
        "criticality_level": "Medium",
        "criticality_score": 62,
        "risk_score": 62,
        "predicted_impact": "30% of fresh produce batch will spoil. Retail stockout for 48h in metro area.",
        "risk_reasoning": "Perishable produce has a strict shelf-life window. An 18h delay on Medium-urgency Food cargo causes significant spoilage and supply gaps.",
        "human_status": "Recommended for Human Review",
        "recommended_action": "Divert to nearest cold storage facility. Notify retail chain to source from local suppliers.",
        "recommendation_reason": "Partial recovery possible if cold storage is arranged within 6 hours."
    },
    {
        "shipment_id": "FRT-1005",
        "cargo_type": "Coal",
        "destination": "Thermal Power Plant Alpha",
        "delay_hours": 24.0,
        "delay_severity": "Severe",
        "criticality_level": "Medium",
        "criticality_score": 65,
        "risk_score": 65,
        "predicted_impact": "Plant coal stockpile drops below 48h reserve threshold. Grid instability risk for region.",
        "risk_reasoning": "Coal is critical for thermal power generation. A 24h delay on High-urgency Power Grid cargo threatens regional electricity stability.",
        "human_status": "Recommended for Human Review",
        "recommended_action": "Contact backup coal depot. Alert grid operator of potential load-shedding scenario.",
        "recommendation_reason": "Grid stability requires 72h minimum coal buffer; current trajectory breaches this."
    },
    {
        "shipment_id": "FRT-1006",
        "cargo_type": "Raw Steel",
        "destination": "Automotive Manufacturing Plant",
        "delay_hours": 36.0,
        "delay_severity": "Severe",
        "criticality_level": "Medium",
        "criticality_score": 55,
        "risk_score": 55,
        "predicted_impact": "Assembly line halt within 12h. Estimated loss: $2M/day. 800 workers idle.",
        "risk_reasoning": "Raw steel is a primary manufacturing input. A 36h delay depletes the just-in-time inventory buffer, forcing production shutdown.",
        "human_status": "Pending",
        "recommended_action": "Source emergency steel coils from regional stockist. Negotiate priority rail slot.",
        "recommendation_reason": "Production shutdown costs exceed logistics premium for emergency sourcing."
    },
    {
        "shipment_id": "FRT-1007",
        "cargo_type": "Consumer Electronics",
        "destination": "National E-commerce Warehouse",
        "delay_hours": 48.0,
        "delay_severity": "Moderate",
        "criticality_level": "Low",
        "criticality_score": 28,
        "risk_score": 28,
        "predicted_impact": "Customer delivery delays of 2-3 days. No critical infrastructure impact.",
        "risk_reasoning": "Consumer electronics are non-perishable and non-critical. Despite a 48h delay, warehouse buffer inventory covers demand.",
        "human_status": "Pending",
        "recommended_action": "Update tracking ETAs. Monitor for further delays.",
        "recommendation_reason": "Low urgency; standard monitoring sufficient."
    },
    {
        "shipment_id": "FRT-1008",
        "cargo_type": "Industrial Chemicals",
        "destination": "Water Treatment Facility",
        "delay_hours": 8.0,
        "delay_severity": "Moderate",
        "criticality_level": "High",
        "criticality_score": 76,
        "risk_score": 76,
        "predicted_impact": "Municipal water purification capacity reduced by 40% within 24h. Public health risk.",
        "risk_reasoning": "Industrial chemicals for water treatment are public-safety critical. An 8h delay on High-urgency Public Utilities cargo threatens clean water supply.",
        "human_status": "Recommended for Human Review",
        "recommended_action": "Activate emergency chemical reserves. Alert municipal water authority.",
        "recommendation_reason": "Public health risk requires immediate contingency activation."
    },
    {
        "shipment_id": "FRT-1009",
        "cargo_type": "Grain and Wheat",
        "destination": "Food Processing Plant",
        "delay_hours": 14.0,
        "delay_severity": "Moderate",
        "criticality_level": "Low",
        "criticality_score": 38,
        "risk_score": 38,
        "predicted_impact": "Production schedule shift of 1 day. Minor supply chain disruption.",
        "risk_reasoning": "Grain is non-perishable with adequate buffer stock. A 14h delay on Medium-urgency Food cargo causes manageable production adjustments.",
        "human_status": "Pending",
        "recommended_action": "Adjust production schedule. Notify downstream distributors of revised timeline.",
        "recommendation_reason": "Buffer stock covers the gap; schedule adjustment is routine."
    },
    {
        "shipment_id": "FRT-1010",
        "cargo_type": "Apparel and Clothing",
        "destination": "Downtown Retail Stores",
        "delay_hours": 72.0,
        "delay_severity": "Minor",
        "criticality_level": "Low",
        "criticality_score": 15,
        "risk_score": 15,
        "predicted_impact": "Seasonal stock arrives 3 days late. Minimal business impact.",
        "risk_reasoning": "Apparel is non-perishable and non-critical. A 72h delay on Low-urgency Retail cargo has negligible operational impact.",
        "human_status": "Pending",
        "recommended_action": "No action required. Standard monitoring.",
        "recommendation_reason": "Retail buffer stock sufficient; delay within acceptable range."
    }
]

def seed_reports():
    db_path = os.path.join(os.path.dirname(__file__), 'database.db')
    conn = sqlite3.connect(db_path)

    # Wipe old reports
    conn.execute('DELETE FROM risk_reports')
    conn.commit()

    for report in reports:
        conn.execute(
            'INSERT OR REPLACE INTO risk_reports (shipment_id, report_json) VALUES (?, ?)',
            (report["shipment_id"], json.dumps(report))
        )
    conn.commit()
    conn.close()
    print(f"Successfully seeded {len(reports)} risk reports for FRT-1001 through FRT-1010.")

if __name__ == '__main__':
    seed_reports()

