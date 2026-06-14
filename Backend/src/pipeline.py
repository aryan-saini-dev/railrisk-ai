import json
from agents import (
    DelayDetectionAgent,
    CargoCriticalityAgent,
    ImpactPredictionAgent,
    ActionRecommendationAgent
)


class RailRiskReport:
    def __init__(self, shipment: dict, delay_info: dict,
                 criticality_info: dict, risk_info: dict,
                 action_info: dict):
        self.shipment_id = shipment.get("id", "N/A")
        self.cargo_type = shipment.get("cargo_type", "N/A")
        self.destination = shipment.get("destination", "N/A")
        self.delay_hours = delay_info.get("delay_time_hours", 0)
        self.delay_severity = delay_info.get("delay_severity", "None")
        self.criticality_level = criticality_info.get("criticality_level", "Low")
        self.criticality_score = criticality_info.get("criticality_score", 0)
        self.risk_score = risk_info.get("risk_score", 0)
        self.predicted_impact = risk_info.get("predicted_impact", "Unknown")
        self.risk_reasoning = risk_info.get("risk_reasoning", "")
        self.human_status = risk_info.get("human_status", "Pending")
        self.recommended_action = action_info.get("recommended_action", "No action")
        self.recommendation_reason = action_info.get("recommendation_reason", "")

    def format_report(self) -> str:
        sep = "-" * 60
        return (
            f"{sep}\n"
            f"  RAILRISK REPORT - {self.shipment_id}\n"
            f"{sep}\n"
            f"  Cargo       : {self.cargo_type}\n"
            f"  Destination : {self.destination}\n"
            f"  Delay       : {self.delay_hours} h ({self.delay_severity} severity)\n"
            f"{sep}\n"
            f"  Criticality : {self.criticality_level} (Score: {self.criticality_score})\n"
            f"  Risk Score  : {self.risk_score} / 100\n"
            f"  Impact      : {self.predicted_impact}\n"
            f"  Reasoning   : {self.risk_reasoning}\n"
            f"  Human Status: {self.human_status}\n"
            f"{sep}\n"
            f"  Action      : {self.recommended_action}\n"
            f"  Action Reason: {self.recommendation_reason}\n"
            f"{sep}\n"
        )

    def to_dict(self) -> dict:
        return {
            "shipment_id": self.shipment_id,
            "cargo_type": self.cargo_type,
            "destination": self.destination,
            "delay_hours": self.delay_hours,
            "delay_severity": self.delay_severity,
            "criticality_level": self.criticality_level,
            "criticality_score": self.criticality_score,
            "risk_score": self.risk_score,
            "predicted_impact": self.predicted_impact,
            "risk_reasoning": self.risk_reasoning,
            "human_status": self.human_status,
            "recommended_action": self.recommended_action,
            "recommendation_reason": self.recommendation_reason,
        }


class RailRiskPipeline:
    def __init__(self):
        self.delay_agent = DelayDetectionAgent()
        self.criticality_agent = CargoCriticalityAgent()
        self.impact_agent = ImpactPredictionAgent()
        self.action_agent = ActionRecommendationAgent()

    def run(self, shipment: dict) -> RailRiskReport:
        delay_info = self.delay_agent.process(shipment)
        criticality_info = self.criticality_agent.process(shipment)
        risk_info = self.impact_agent.process(shipment, delay_info, criticality_info)
        action_info = self.action_agent.process(shipment, risk_info)
        return RailRiskReport(shipment, delay_info, criticality_info, risk_info, action_info)

    def run_batch(self, shipments: list[dict]) -> list[RailRiskReport]:
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            reports = list(executor.map(self.run, shipments))
        return reports
