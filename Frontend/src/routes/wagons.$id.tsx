import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Brain,
  Clock,
  FileText,
  Hospital,
  Layers,
  Radio,
  Route as RouteIcon,
  Timer,
  TrendingUp,
  Zap,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";
import { AppShell, RiskBadge } from "@/components/AppShell";
import { getWagon, type Wagon, fetchWagons } from "@/lib/railrisk-data";
import { ActionModal, RerouteMap } from "@/components/AgenticAction";
import { updateActionStatus, getActionStatus } from "@/lib/api-client";

export const Route = createFileRoute("/wagons/$id")({
  loader: async ({ params }) => {
    await fetchWagons();
    const w = getWagon(params.id);
    if (!w) throw notFound();
    return { wagon: w };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.wagon.id} · Risk Detail — RailRisk AI` : "RailRisk AI",
      },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.wagon.cargo} — Risk ${loaderData.wagon.risk}, ${loaderData.wagon.delayHours}h delay.`
          : "Risk detail",
      },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <p className="text-white/60">Wagon not found.</p>
      <Link to="/wagons" className="text-[#ff6b00] underline">
        Back to list
      </Link>
    </AppShell>
  ),
  component: WagonDetail,
});

function WagonDetail() {
  const loaderData = Route.useLoaderData();
  const [wagon, setWagon] = useState<Wagon>(loaderData.wagon);

  useEffect(() => {
    setWagon(loaderData.wagon);
  }, [loaderData.wagon]);

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getWagon(loaderData.wagon.id);
      if (updated) {
        setWagon(updated);
      }
    };
    window.addEventListener("wagonsUpdated", handleUpdate);
    return () => window.removeEventListener("wagonsUpdated", handleUpdate);
  }, [loaderData.wagon.id]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionStatus, setActionStatus] = useState<"approved" | "denied" | null>(null);

  useEffect(() => {
    const updateStatus = async () => {
      const stored = sessionStorage.getItem(`action_${wagon.id}`);
      if (stored) {
        setActionStatus(stored as any);
      } else {
        const remoteStatus = await getActionStatus(wagon.id);
        if (remoteStatus !== "Pending") {
          sessionStorage.setItem(`action_${wagon.id}`, remoteStatus);
          setActionStatus(remoteStatus as any);
        }
      }
    };
    updateStatus();
    window.addEventListener("storage", updateStatus);
    return () => window.removeEventListener("storage", updateStatus);
  }, [wagon.id]);

  const handleApprove = async () => {
    sessionStorage.setItem(`action_${wagon.id}`, "approved");
    setActionStatus("approved");
    await updateActionStatus(wagon.id, "approved");
  };

  const handleDeny = async () => {
    sessionStorage.setItem(`action_${wagon.id}`, "denied");
    setActionStatus("denied");
    await updateActionStatus(wagon.id, "denied");
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    // Simulate brief analysis delay for UX
    await new Promise(r => setTimeout(r, 1200));
    
    const riskAdj = wagon.risk === "Critical" ? "critically endangered" : wagon.risk === "High" ? "at serious risk" : wagon.risk === "Medium" ? "under moderate stress" : "within acceptable parameters";
    const summary = `Shipment ${wagon.id} carrying ${wagon.cargo} (${wagon.cargoCategory} category) to ${wagon.destination} is currently ${riskAdj} with a criticality score of ${wagon.criticalityScore}/100. The ${wagon.delayHours}-hour delay has triggered this assessment because ${wagon.riskReasoning.toLowerCase()} The recommended course of action is to ${wagon.recommendedAction.toLowerCase()}, as ${wagon.recommendationReason.toLowerCase()}`;
    
    setAiSummary(summary);
    setIsGenerating(false);
  };
  return (
    <AppShell>
      <Link
        to="/wagons"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors duration-300 mb-6 group"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back to wagons
      </Link>

      <div className="glass-ember rounded-3xl p-8 mb-6 relative overflow-hidden animate-fade-up">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-[#ff1e1e]/25 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-16 rounded-2xl glass flex items-center justify-center text-xl font-bold ember-glow-sm">
              {wagon.id}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <RiskBadge level={wagon.risk} />
                <span className="text-[11px] uppercase tracking-wider text-white/50">
                  Train {wagon.trainId}
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight">{wagon.cargo}</h1>
              <div className="text-white/55 text-sm mt-1 flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <RouteIcon className="size-3.5" /> {wagon.route}
                </span>
                <span>→ {wagon.receiver}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              Criticality Score
            </div>
            <div className="text-6xl font-bold text-ember tabular-nums">
              {wagon.criticalityScore}
            </div>
            <div className="text-[11px] text-white/50">/100 · live</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText className="size-4 text-[#ff6b00]" /> Situation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Fact icon={<Timer className="size-3.5" />} label="Delay" value={`${wagon.delayHours} hours`} />
              <Fact icon={<Clock className="size-3.5" />} label="Backup window" value={`${wagon.backupHours} hours`} />
              <Fact icon={<Boxes className="size-3.5" />} label="Cargo type" value={wagon.cargoCategory} />
              <Fact icon={<Hospital className="size-3.5" />} label="Receiver" value={wagon.receiver} />
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border-l-[4px] border-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b00]/10 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-7 rounded-lg glass-ember flex items-center justify-center">
                  <FileText className="size-4 text-[#ff6b00]" />
                </div>
                <h3 className="font-bold text-[#ff6b00] uppercase tracking-wider text-xs">Explainable Recommendation</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                This shipment is <strong className={wagon.risk === "Critical" ? "text-[#ff1e1e]" : "text-white"}>{wagon.risk}</strong> because {wagon.reason} The downstream impact is {wagon.impact}
              </p>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border border-indigo-500/30 relative overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.05)]">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">GenAI Summary</h3>
                    <p className="text-[10px] uppercase tracking-wider text-indigo-300">Powered by Gemini</p>
                  </div>
                </div>
                {!aiSummary && (
                  <button onClick={generateSummary} disabled={isGenerating} className="btn-ember py-2 px-5 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    {isGenerating ? "Analyzing..." : "Generate Summary"}
                  </button>
                )}
              </div>
              {aiSummary && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 text-sm text-white/90 leading-relaxed animate-fade-up">
                  {aiSummary}
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="size-4 text-[#ff6b00]" /> Downstream Impact
            </h3>
            <div className="glass-ember rounded-2xl p-5">
              <p className="text-white/90 leading-relaxed">{wagon.impact}</p>
            </div>
          </div>
        </div>

        <div className="glass-ember rounded-3xl p-6 relative overflow-hidden h-fit flex flex-col gap-5">
          <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-[#ff1e1e]/30 blur-3xl pointer-events-none" />
          <RerouteMap destination={wagon.receiver} />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#ff6b00] mb-2">
              <Zap className="size-4" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                Recommended Action
              </span>
            </div>
            <p className="text-xl font-bold leading-snug">{wagon.recommendedAction}</p>
            <div className="mt-5 flex flex-col gap-2">
              {actionStatus === "approved" ? (
                <div className="flex gap-2">
                  <button disabled className="flex-[2] py-2.5 rounded-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2">
                    <CheckCircle2 className="size-4" /> Approved
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="flex-1 rounded-xl font-semibold text-white/70 border border-white/20 hover:bg-white/10 transition-all">
                    Edit
                  </button>
                </div>
              ) : actionStatus === "denied" ? (
                <div className="flex gap-2">
                  <button disabled className="flex-[2] py-2.5 rounded-xl font-bold text-[#ff1e1e] bg-[#ff1e1e]/10 border border-[#ff1e1e]/30 flex items-center justify-center gap-2">
                    <X className="size-4" /> Denied
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="flex-1 rounded-xl font-semibold text-white/70 border border-white/20 hover:bg-white/10 transition-all">
                    Edit
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsModalOpen(true)} className="btn-ember justify-center hover:btn-ember-hover active:btn-ember-active">Review</button>
              )}
              {!actionStatus && (
                <button className="px-4 py-2.5 rounded-full text-sm font-semibold text-[#ff1e1e] border border-[#ff1e1e]/40 hover:bg-[#ff1e1e]/10 hover:border-[#ff1e1e]/60 transition-all duration-300 active:scale-[0.97]">
                  Override
                </button>
              )}
            </div>
            <div className="mt-5 pt-5 border-t border-white/10 text-xs text-white/60 flex items-start gap-2">
              <AlertTriangle className="size-3.5 text-[#ff6b00] mt-0.5 shrink-0" />
              <span>
                Auto-escalates if no human ack within 5 minutes for Critical-level cargo.
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} w={wagon} onApprove={handleApprove} onDeny={handleDeny} />

      <div className="glass rounded-3xl p-6 mb-6 animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-[#ff6b00]" />
              <h2 className="font-bold">Live Escalation</h2>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Risk evolves with delay, cargo criticality, and backup time.
            </p>
          </div>
          <div className="text-xs text-white/50">Stage {wagon.escalationStage} of 4</div>
        </div>
        <EscalationBar stage={wagon.escalationStage} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 text-center">
          {["Monitor", "Notice", "Alert", "Critical"].map((label, i) => (
            <div
              key={label}
              className={`rounded-2xl p-3 ${
                i + 1 <= wagon.escalationStage
                  ? "glass-ember ember-glow-sm"
                  : "glass opacity-60"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-white/50">
                Stage {i + 1}
              </div>
              <div className="font-semibold text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="size-4 text-[#ff6b00]" />
          <h3 className="font-bold">Agent Reasoning Chain</h3>
        </div>
        <ReasoningChain wagon={wagon} />
      </div>
    </AppShell>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-xl p-4 glass-lift hover:glass-lift-hover">
      <div className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1.5 mb-1">
        {icon} {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function EscalationBar({ stage }: { stage: number }) {
  const pct = (stage / 4) * 100;
  return (
    <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e]"
        style={{ width: `${pct}%`, boxShadow: "0 0 14px rgba(255,30,30,0.7)" }}
      />
    </div>
  );
}

function ReasoningChain({ wagon }: { wagon: Wagon }) {
  const steps = [
    {
      icon: <Timer className="size-4" />,
      agent: "Delay Detection",
      out: `Detected ${wagon.delayHours}h delay on ${wagon.trainId} (${wagon.route}).`,
    },
    {
      icon: <Layers className="size-4" />,
      agent: "Cargo Criticality",
      out: `Cargo "${wagon.cargo}" classified ${wagon.cargoCategory}. Sensitivity weight applied.`,
    },
    {
      icon: <TrendingUp className="size-4" />,
      agent: "Impact Prediction",
      out: wagon.riskReasoning,
    },
    {
      icon: <Zap className="size-4" />,
      agent: "Action Recommendation",
      out: `${wagon.recommendedAction} (Reason: ${wagon.recommendationReason})`,
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <div key={s.agent} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="size-8 rounded-lg glass-ember flex items-center justify-center text-[#ff6b00]">
              {s.icon}
            </div>
            {i < steps.length - 1 && (
              <svg viewBox="0 0 2 30" className="w-[2px] h-8">
                <line x1="1" y1="0" x2="1" y2="30" stroke="#ff1e1e" strokeWidth="2" className="flow-line" />
              </svg>
            )}
          </div>
          <div className="glass rounded-xl p-3 flex-1 mb-2">
            <div className="text-[10px] uppercase tracking-wider text-[#ff6b00] font-semibold">
              {s.agent}
            </div>
            <div className="text-sm text-white/85 mt-0.5">{s.out}</div>
          </div>
        </div>
      ))}
    </div>
  );
}