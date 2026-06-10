import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
} from "lucide-react";
import { AppShell, RiskBadge } from "@/components/AppShell";
import { getWagon, type Wagon } from "@/lib/railrisk-data";

export const Route = createFileRoute("/wagons/$id")({
  loader: ({ params }) => {
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
  const { wagon } = Route.useLoaderData();
  return (
    <AppShell>
      <Link
        to="/wagons"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6"
      >
        <ArrowLeft className="size-4" /> Back to wagons
      </Link>

      {/* Header card */}
      <div className="glass-ember rounded-3xl p-8 mb-6 relative overflow-hidden">
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

      {/* Living system: escalation timeline */}
      <div className="glass rounded-3xl p-6 mb-6">
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

      {/* Grid: facts + recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText className="size-4 text-[#ff6b00]" /> Situation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Fact icon={<Timer className="size-3.5" />} label="Delay" value={`${wagon.delayHours} hours`} />
              <Fact
                icon={<Clock className="size-3.5" />}
                label="Backup window"
                value={`${wagon.backupHours} hours`}
              />
              <Fact icon={<Boxes className="size-3.5" />} label="Cargo type" value={wagon.cargoCategory} />
              <Fact icon={<Hospital className="size-3.5" />} label="Receiver" value={wagon.receiver} />
            </div>
            <div className="mt-5 pt-5 border-t border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
                Why this is critical
              </div>
              <p className="text-white/80 leading-relaxed">{wagon.reason}</p>
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

        {/* Recommendation panel */}
        <div className="glass-ember rounded-3xl p-6 relative overflow-hidden h-fit">
          <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-[#ff1e1e]/30 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#ff6b00] mb-2">
              <Zap className="size-4" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                Recommended Action
              </span>
            </div>
            <p className="text-xl font-bold leading-snug">{wagon.recommendedAction}</p>
            <div className="mt-5 flex flex-col gap-2">
              <button className="btn-ember justify-center">Dispatch action</button>
              <button className="px-4 py-2.5 rounded-full text-sm font-semibold text-[#ff1e1e] border border-[#ff1e1e]/40 hover:bg-[#ff1e1e]/10 transition">
                Override
              </button>
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

      {/* Agent reasoning chain */}
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
    <div className="glass rounded-xl p-4">
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
      out: wagon.impact,
    },
    {
      icon: <Zap className="size-4" />,
      agent: "Action Recommendation",
      out: wagon.recommendedAction,
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
