export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface Wagon {
  id: string;
  trainId: string;
  route: string;
  cargo: string;
  cargoCategory: "Medical" | "Fuel" | "Food" | "Industrial" | "General";
  delayHours: number;
  destination: string;
  receiver: string;
  risk: RiskLevel;
  criticalityScore: number; // 0-100
  actionStatus: "Pending" | "Dispatched" | "Resolved" | "Escalated";
  recommendedAction: string;
  reason: string;
  impact: string;
  backupHours: number;
  escalationStage: number; // 1-4
}

export const wagons: Wagon[] = [
  {
    id: "W-08",
    trainId: "TR-2241",
    route: "Mumbai → Pune",
    cargo: "Medical Oxygen Cylinders",
    cargoCategory: "Medical",
    delayHours: 6,
    destination: "Pune Central",
    receiver: "City Hospital",
    risk: "Critical",
    criticalityScore: 94,
    actionStatus: "Escalated",
    recommendedAction: "Priority alert + immediate road transfer",
    reason:
      "Hospital backup oxygen lasts ~3 hours. Delay exceeds backup window — patient risk imminent.",
    impact: "Emergency oxygen supply to 240-bed hospital may fail within 90 minutes.",
    backupHours: 3,
    escalationStage: 4,
  },
  {
    id: "W-12",
    trainId: "TR-1108",
    route: "Vadodara → Delhi",
    cargo: "Insulin & Vaccine Cold Chain",
    cargoCategory: "Medical",
    delayHours: 4,
    destination: "Delhi NCR",
    receiver: "AIIMS Logistics",
    risk: "High",
    criticalityScore: 81,
    actionStatus: "Dispatched",
    recommendedAction: "Reroute via refrigerated truck",
    reason: "Cold-chain payload — temperature integrity drops after 5 hours of stoppage.",
    impact: "Vaccine batch worth ₹1.2Cr at risk of spoilage.",
    backupHours: 5,
    escalationStage: 3,
  },
  {
    id: "W-03",
    trainId: "TR-9920",
    route: "Visakhapatnam → Hyderabad",
    cargo: "Diesel Fuel",
    cargoCategory: "Fuel",
    delayHours: 5,
    destination: "Hyderabad Depot",
    receiver: "State Power Grid",
    risk: "High",
    criticalityScore: 76,
    actionStatus: "Pending",
    recommendedAction: "Notify backup depot, prepare tanker convoy",
    reason: "Power grid reserves cover 8 hours; further delay triggers brownout risk.",
    impact: "Possible 2-hour power disruption to industrial sector.",
    backupHours: 8,
    escalationStage: 2,
  },
  {
    id: "W-21",
    trainId: "TR-3045",
    route: "Ludhiana → Jaipur",
    cargo: "Perishable Produce",
    cargoCategory: "Food",
    delayHours: 3,
    destination: "Jaipur Wholesale",
    receiver: "Regional Distributor",
    risk: "Medium",
    criticalityScore: 52,
    actionStatus: "Pending",
    recommendedAction: "Monitor — alert vendor of revised ETA",
    reason: "Produce shelf-life acceptable up to 12 hours additional.",
    impact: "Minor market disruption; alternative supply available.",
    backupHours: 12,
    escalationStage: 2,
  },
  {
    id: "W-17",
    trainId: "TR-7712",
    route: "Chennai → Bengaluru",
    cargo: "Steel Coils",
    cargoCategory: "Industrial",
    delayHours: 2,
    destination: "Bengaluru Yard",
    receiver: "Automotive Plant",
    risk: "Low",
    criticalityScore: 24,
    actionStatus: "Pending",
    recommendedAction: "Standard monitoring",
    reason: "Buffer inventory at plant exceeds 36 hours.",
    impact: "No operational impact expected.",
    backupHours: 36,
    escalationStage: 1,
  },
  {
    id: "W-29",
    trainId: "TR-5563",
    route: "Kolkata → Patna",
    cargo: "Ventilator Components",
    cargoCategory: "Medical",
    delayHours: 5,
    destination: "Patna Med Hub",
    receiver: "District Hospital Network",
    risk: "High",
    criticalityScore: 78,
    actionStatus: "Dispatched",
    recommendedAction: "Air freight critical SKUs",
    reason: "Scheduled ICU installation tomorrow at 3 facilities.",
    impact: "ICU capacity expansion delayed for 60 patients.",
    backupHours: 6,
    escalationStage: 3,
  },
  {
    id: "W-34",
    trainId: "TR-4480",
    route: "Surat → Ahmedabad",
    cargo: "Textiles",
    cargoCategory: "General",
    delayHours: 1,
    destination: "Ahmedabad",
    receiver: "Export Warehouse",
    risk: "Low",
    criticalityScore: 12,
    actionStatus: "Pending",
    recommendedAction: "No action required",
    reason: "Within tolerance.",
    impact: "None.",
    backupHours: 48,
    escalationStage: 1,
  },
];

export function getWagon(id: string) {
  return wagons.find((w) => w.id.toLowerCase() === id.toLowerCase());
}

export const riskColor: Record<RiskLevel, string> = {
  Low: "text-emerald-400",
  Medium: "text-amber-400",
  High: "text-orange-400",
  Critical: "text-[#ff1e1e]",
};

export const riskDot: Record<RiskLevel, string> = {
  Low: "bg-emerald-400",
  Medium: "bg-amber-400",
  High: "bg-orange-400",
  Critical: "bg-[#ff1e1e]",
};
