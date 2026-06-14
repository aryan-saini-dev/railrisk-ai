import os
from typing import Dict, Any
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

class RiskAssessment(BaseModel):
    criticality_level: str = Field(description="The criticality level: Low, Medium, High, or Critical")
    criticality_score: int = Field(description="Score from 0 to 100 representing how critical the cargo is based on type and destination")
    predicted_impact: str = Field(description="A 1-2 sentence prediction of what will happen downstream if this delay is not mitigated")
    risk_score: float = Field(description="Overall risk score from 0.0 to 100.0, combining criticality and delay time")
    risk_reasoning: str = Field(description="Explainable reasoning why this risk score and criticality were assigned")
    recommended_action: str = Field(description="The immediate recommended action to mitigate the delay")
    recommendation_reason: str = Field(description="Why this specific action was recommended")
    human_status: str = Field(description="Status string, usually 'Awaiting Dispatcher Approval' for high risk, or 'Pending'")

class LLMRiskEvaluator:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMRiskEvaluator, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.parser = PydanticOutputParser(pydantic_object=RiskAssessment)
        self.prompt = PromptTemplate(
            template="You are an expert railway freight logistics AI.\n"
                     "Analyze the following delayed shipment and predict the risk and impact.\n"
                     "Format the output exactly as specified below.\n\n"
                     "Shipment Details:\n"
                     "- ID: {shipment_id}\n"
                     "- Cargo Type: {cargo_type}\n"
                     "- Destination: {destination}\n"
                     "- Delay Time: {delay_time_hours} hours\n"
                     "- Urgency Level: {urgency_level}\n"
                     "- Dependency Type: {dependency_type}\n\n"
                     "{format_instructions}\n",
            input_variables=["shipment_id", "cargo_type", "destination", "delay_time_hours", "urgency_level", "dependency_type"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()},
        )
        self.cache: Dict[str, dict] = {}
        self.chain = None
        
        # Try to initialize LLM if key is present
        if os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"):
            try:
                self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
                self.chain = self.prompt | self.llm | self.parser
            except Exception as e:
                print(f"Warning: Failed to initialize LLM: {e}")

    def evaluate(self, shipment: dict) -> dict:
        shipment_id = shipment.get("id", "Unknown")
        # To avoid calling LLM multiple times per shipment across the agents, we cache it
        if shipment_id in self.cache:
            return self.cache[shipment_id]

        print(f"Evaluating Shipment {shipment_id}...")
        
        if self.chain:
            try:
                result = self.chain.invoke({
                    "shipment_id": shipment_id,
                    "cargo_type": shipment.get("cargo_type", ""),
                    "destination": shipment.get("destination", ""),
                    "delay_time_hours": shipment.get("delay_time_hours", 0),
                    "urgency_level": shipment.get("urgency_level", ""),
                    "dependency_type": shipment.get("dependency_type", "")
                })
                result_dict = result.model_dump()
                self.cache[shipment_id] = result_dict
                return result_dict
            except Exception as e:
                print(f"Error calling LLM: {e}")
        else:
            print("Warning: LLM Chain not initialized. Make sure GEMINI_API_KEY is set. Using fallback.")
            
        # Fallback values
        fallback = {
            "criticality_level": "Medium",
            "criticality_score": 50,
            "predicted_impact": "Unknown downstream impact due to API error.",
            "risk_score": 50.0,
            "risk_reasoning": "Could not determine due to LLM error.",
            "recommended_action": "Log and monitor.",
            "recommendation_reason": "Fallback action.",
            "human_status": "Pending"
        }
        self.cache[shipment_id] = fallback
        return fallback


class BaseAgent:
    def __init__(self):
        self.evaluator = LLMRiskEvaluator()

from ml_model import DelayPredictor

class DelayDetectionAgent(BaseAgent):
    """Detects delays. This remains mostly static as it's just math, but enhanced with ML."""
    def __init__(self):
        super().__init__()
        self.predictor = DelayPredictor()
        
    def process(self, shipment: dict) -> dict:
        delay = shipment.get("delay_time_hours", 0)
        is_delayed = delay > 0
        severity = "None"
        
        if delay >= 24: severity = "Severe"
        elif delay >= 12: severity = "High"
        elif delay >= 6: severity = "Moderate"
        elif delay > 0: severity = "Minor"

        # ML Prediction (Hackathon flex)
        predicted_delay = self.predictor.predict_delay(
            cargo_type=shipment.get("cargo_type", ""),
            destination=shipment.get("destination", ""),
            urgency_level=shipment.get("urgency_level", "Medium")
        )
        
        print(f"[{shipment.get('id')}] Reported Delay: {delay}h | Random Forest Predicted Delay: {predicted_delay}h")

        return {
            "is_delayed": is_delayed,
            "delay_severity": severity,
            "delay_time_hours": delay,
            "ml_predicted_delay_hours": predicted_delay
        }

class CargoCriticalityAgent(BaseAgent):
    """Evaluates the criticality dynamically using Gemini."""
    def process(self, shipment: dict) -> dict:
        analysis = self.evaluator.evaluate(shipment)
        return {
            "criticality_score": analysis.get("criticality_score", 0),
            "criticality_level": analysis.get("criticality_level", "Low")
        }

class ImpactPredictionAgent(BaseAgent):
    """Predicts downstream impact dynamically using Gemini."""
    def process(self, shipment: dict, delay_info: dict, criticality_info: dict) -> dict:
        analysis = self.evaluator.evaluate(shipment)
        return {
            "risk_score": analysis.get("risk_score", 0.0),
            "predicted_impact": analysis.get("predicted_impact", ""),
            "risk_reasoning": analysis.get("risk_reasoning", ""),
            "human_status": analysis.get("human_status", "Pending")
        }

class ActionRecommendationAgent(BaseAgent):
    """Recommends action dynamically using Gemini."""
    def process(self, shipment: dict, risk_info: dict) -> dict:
        analysis = self.evaluator.evaluate(shipment)
        return {
            "recommended_action": analysis.get("recommended_action", "No action"),
            "recommendation_reason": analysis.get("recommendation_reason", "")
        }
