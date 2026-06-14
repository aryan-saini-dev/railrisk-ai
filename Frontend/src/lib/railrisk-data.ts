import { getReports, triggerMockRisk as triggerApiMockRisk, type RiskReport } from "./api-client";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type HumanStatus = "Pending" | "Awaiting Dispatcher Approval" | "Recommended for Human Review";
export type ActionStatus = "Pending" | "Dispatched" | "Resolved" | "Escalated";
export type CargoCategory = "Medical" | "Fuel" | "Food" | "Industrial" | "General";

export interface Wagon {
  id: string;
  trainId: string;
  route: string;
  cargo: string;
  cargoCategory: CargoCategory;
  delayHours: number;
  destination: string;
  receiver: string;
  risk: RiskLevel;
  criticalityScore: number;
  actionStatus: ActionStatus;
  recommendedAction: string;
  reason: string;
  riskReasoning: string;
  recommendationReason: string;
  humanStatus: HumanStatus;
  impact: string;
  backupHours: number;
  escalationStage: number;
}

// ── Mapping helpers ──

const cargoCategoryMap: Record<string, CargoCategory> = {
  "Liquid Oxygen": "Medical",
  "Vaccines and Medicine": "Medical",
  "Ventilator Components": "Medical",
  "Insulin & Vaccine Cold Chain": "Medical",
  "Medical Oxygen Cylinders": "Medical",
  "Jet Fuel": "Fuel",
  "Diesel Fuel": "Fuel",
  "Coal": "Fuel",
  "Perishable Food (Produce)": "Food",
  "Grain and Wheat": "Food",
  "Industrial Chemicals": "Industrial",
  "Raw Steel": "Industrial",
  "Consumer Electronics": "General",
  "Apparel and Clothing": "General",
  "Steel Coils": "Industrial",
  "Textiles": "General",
};

const actionStatusMap: Record<string, ActionStatus> = {
  "Awaiting Dispatcher Approval": "Escalated",
  "Recommended for Human Review": "Pending",
  "Pending": "Pending",
};

const trainIdMap: Record<string, string> = {
  "FRT-1001": "TR-2241",
  "FRT-1002": "TR-1108",
  "FRT-1003": "TR-9920",
  "FRT-1004": "TR-3045",
  "FRT-1005": "TR-7712",
  "FRT-1006": "TR-5563",
  "FRT-1007": "TR-4480",
  "FRT-1008": "TR-6691",
  "FRT-1009": "TR-3320",
  "FRT-1010": "TR-8815",
};

const routeMap: Record<string, string> = {
  "FRT-1001": "Mumbai → Pune",
  "FRT-1002": "Vadodara → Delhi",
  "FRT-1003": "Visakhapatnam → Hyderabad",
  "FRT-1004": "Ludhiana → Jaipur",
  "FRT-1005": "Chennai → Nagpur",
  "FRT-1006": "Kolkata → Bengaluru",
  "FRT-1007": "Surat → Ahmedabad",
  "FRT-1008": "Bhopal → Indore",
  "FRT-1009": "Kanpur → Lucknow",
  "FRT-1010": "Patna → Ranchi",
};

function mapRiskScoreToLevel(score: number): RiskLevel {
  if (score >= 85) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function getBackupHours(cargoType: string, delayHours: number): number {
  const backupMap: Record<string, number> = {
    "Liquid Oxygen": 3,
    "Vaccines and Medicine": 5,
    "Medical Oxygen Cylinders": 3,
    "Insulin & Vaccine Cold Chain": 5,
    "Ventilator Components": 6,
    "Jet Fuel": 8,
    "Diesel Fuel": 8,
    "Coal": 48,
    "Perishable Food (Produce)": 12,
    "Grain and Wheat": 24,
    "Industrial Chemicals": 12,
    "Raw Steel": 36,
    "Consumer Electronics": 48,
    "Apparel and Clothing": 48,
    "Steel Coils": 36,
    "Textiles": 48,
  };
  const base = backupMap[cargoType] || 24;
  return Math.max(1, base - Math.floor(delayHours / 2));
}

function getEscalationStage(riskScore: number): number {
  if (riskScore >= 85) return 4;
  if (riskScore >= 60) return 3;
  if (riskScore >= 35) return 2;
  return 1;
}

function mapRiskReportToWagon(report: RiskReport): Wagon {
  return {
    id: report.shipment_id,
    trainId: trainIdMap[report.shipment_id] || `TR-${report.shipment_id.replace(/\D/g, "")}`,
    route: routeMap[report.shipment_id] || "Route Unknown",
    cargo: report.cargo_type,
    cargoCategory: cargoCategoryMap[report.cargo_type] || "General",
    delayHours: report.delay_hours,
    destination: report.destination,
    receiver: report.destination,
    risk: mapRiskScoreToLevel(report.risk_score),
    criticalityScore: report.criticality_score,
    actionStatus: actionStatusMap[report.human_status] || "Pending",
    recommendedAction: report.recommended_action,
    reason: report.recommendation_reason || report.risk_reasoning,
    riskReasoning: report.risk_reasoning,
    recommendationReason: report.recommendation_reason,
    humanStatus: report.human_status as HumanStatus,
    impact: report.predicted_impact,
    backupHours: getBackupHours(report.cargo_type, report.delay_hours),
    escalationStage: getEscalationStage(report.risk_score),
  };
}

// ── Data fetching ──

let cachedWagons: Wagon[] | null = null;

export async function fetchWagons(): Promise<Wagon[]> {
  if (cachedWagons) return cachedWagons;
  // Don't fetch during SSR — return empty array to prevent hanging
  if (typeof window === "undefined") return [];
  try {
    const reports = await getReports();
    if (reports.length === 0) {
      console.warn("No reports in database");
      return [];
    }
    cachedWagons = reports.map((r) => mapRiskReportToWagon(r));
    return cachedWagons;
  } catch (error) {
    console.error("Failed to fetch from API:", error);
    return [];
  }
}

export function invalidateCache() {
  cachedWagons = null;
}

export async function triggerMockRiskUpdate(): Promise<Wagon> {
  const { report } = await triggerApiMockRisk();
  const newWagon = mapRiskReportToWagon(report);

  if (cachedWagons) {
    const index = cachedWagons.findIndex((w) => w.id === report.shipment_id);
    if (index >= 0) {
      cachedWagons[index] = newWagon;
    } else {
      cachedWagons.push(newWagon);
    }
  }

  // Dispatch event so dashboard & AppShell can refresh
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wagonsUpdated"));
  }

  return newWagon;
}

// Synchronous getter — works with cachedWagons when available
export function getWagon(id: string): Wagon | undefined {
  if (!cachedWagons) return undefined;
  return cachedWagons.find((w) => w.id.toLowerCase() === id.toLowerCase());
}

export const riskColor: Record<RiskLevel, string> = {
  Low: "text-emerald-400",
  Medium: "text-yellow-400",
  High: "text-[#ff6b00]",
  Critical: "text-[#ff1e1e]",
};

export const riskDot: Record<RiskLevel, string> = {
  Low: "bg-emerald-400",
  Medium: "bg-yellow-400",
  High: "bg-[#ff6b00]",
  Critical: "bg-[#ff1e1e]",
};
