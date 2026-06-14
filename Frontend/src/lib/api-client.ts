const API_BASE_URL = "http://localhost:8000";

export interface Shipment {
  id: string;
  cargo_type: string;
  destination: string;
  delay_time_hours: number;
  urgency_level: string;
  dependency_type: string;
  downstream_impact?: string;
}

export interface RiskReport {
  shipment_id: string;
  cargo_type: string;
  destination: string;
  delay_hours: number;
  delay_severity: string;
  criticality_level: string;
  criticality_score: number;
  risk_score: number;
  predicted_impact: string;
  risk_reasoning: string;
  human_status: string;
  recommended_action: string;
  recommendation_reason: string;
}

export async function getSampleShipments(): Promise<Shipment[]> {
  const response = await fetch(`${API_BASE_URL}/api/shipments`);
  if (!response.ok) {
    throw new Error("Failed to fetch shipments");
  }
  return response.json();
}

export async function predictRisk(shipment: Shipment): Promise<RiskReport> {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shipment),
  });
  if (!response.ok) {
    throw new Error("Failed to predict risk");
  }
  return response.json();
}

export async function predictBatch(shipments: Shipment[]): Promise<RiskReport[]> {
  const response = await fetch(`${API_BASE_URL}/api/predict-batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shipments),
  });
  if (!response.ok) {
    throw new Error("Failed to predict batch risks");
  }
  return response.json();
}

export async function getReports(): Promise<RiskReport[]> {
  const response = await fetch(`${API_BASE_URL}/api/reports`);
  if (!response.ok) throw new Error("Failed to fetch reports");
  return response.json();
}

export async function updateActionStatus(shipmentId: string, humanStatus: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/action-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shipment_id: shipmentId, human_status: humanStatus }),
  });
}

export async function getActionStatus(shipmentId: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/action-status/${shipmentId}`);
  const data = await response.json();
  return data.human_status;
}

export async function triggerMockRisk(): Promise<{ shipment: Shipment; report: RiskReport }> {
  const response = await fetch(`${API_BASE_URL}/api/mock-risk`, {
    method: "POST"
  });
  if (!response.ok) {
    throw new Error("Failed to trigger mock risk");
  }
  return response.json();
}