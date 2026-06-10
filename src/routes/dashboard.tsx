import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertOctagon,
  ArrowUpRight,
  Boxes,
  Brain,
  ChevronRight,
  Flame,
  Gauge,
  Layers,
  Route as RouteIcon,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppShell, RiskBadge } from "@/components/AppShell";
import { wagons } from "@/lib/railrisk-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "RailRisk AI — Decision Intelligence Dashboard" },
      {
        name: "description",
        content:
          "Live risk intelligence for rail freight. Prioritize dangerous delays, not just track them.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const critical = wagons.filter((w) => w.risk === "Critical").length;
  const high = wagons.filter((w) => w.risk === "High").length;
  const totalDelayed = wagons.length;
  const pendingActions = wagons.filter((w) => w.actionStatus === "Pending").length;
  const topRisks = [...wagons].sort((a, b) => b.criticalityScore - a.criticalityScore).slice(0, 4);

  return (
    <AppShell>
      {/* Hero / situation banner */}
      <section className="glass-ember rounded-3xl p-8 lg:p-10 mb-8 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-[#ff1e1e]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#ff6b00]/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
              <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse-ember" />
              Live Risk Intelligence
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.05]">
              Situation: <span className="text-ember">3 critical disruptions</span> require
              immediate action.
            </h1>
            <p className="mt-4 text-white/60 max-w-xl">
              RailRisk AI is reprioritising delays in real time based on cargo criticality,
              downstream impact, and backup capacity.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/wagons" className="btn-ember text-sm">
              View priority queue <ArrowUpRight className="size-4" />
            </Link>
            <Link
              to="/report"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#ff1e1e] border border-[#ff1e1e]/40 hover:bg-[#ff1e1e]/10 transition"
            >
              Generate report
            </Link>
          </div>
        </div>
      </section>

      {/* Stat grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Boxes className="size-5" />}
          label="Delayed Wagons"
          value={totalDelayed}
          trend="+2 vs last hour"
          tone="neutral"
        />
        <StatCard
          icon={<AlertOctagon className="size-5" />}
          label="Critical Alerts"
          value={critical}
          trend="Escalated"
          tone="critical"
        />
        <StatCard
          icon={<Flame className="size-5" />}
          label="High-Risk Cargo"
          value={high + critical}
          trend="Medical · Fuel"
          tone="high"
        />
        <StatCard
          icon={<Timer className="size-5" />}
          label="Pending Actions"
          value={pendingActions}
          trend="Awaiting dispatch"
          tone="warn"
        />
      </section>

      {/* Two-column: priority queue + agents */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div className="xl:col-span-2 glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold">Priority Risk Queue</h2>
              <p className="text-xs text-white/50 mt-1">
                Reordered live by criticality score, not arrival time.
              </p>
            </div>
            <Link
              to="/wagons"
              className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1"
            >
              All wagons <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {topRisks.map((w) => (
              <Link
                key={w.id}
                to="/wagons/$id"
                params={{ id: w.id }}
                className="group glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition relative overflow-hidden"
              >
                {w.risk === "Critical" && (
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#ff6b00] to-[#ff1e1e] ember-glow-sm" />
                )}
                <div className="shrink-0 size-12 rounded-xl glass-ember flex items-center justify-center text-sm font-bold">
                  {w.id}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{w.cargo}</span>
                    <RiskBadge level={w.risk} />
                  </div>
                  <div className="text-xs text-white/50 mt-1 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <RouteIcon className="size-3" /> {w.route}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Timer className="size-3" /> {w.delayHours}h delay
                    </span>
                    <span>→ {w.receiver}</span>
                  </div>
                </div>
                <CriticalityMeter score={w.criticalityScore} />
                <ChevronRight className="size-4 text-white/40 group-hover:text-white transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* Agent stack */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="size-4 text-[#ff6b00]" />
            <h2 className="text-lg font-bold">Agent Stack</h2>
          </div>
          <p className="text-xs text-white/50 mb-5">Four decision layers running in parallel.</p>

          <div className="flex flex-col gap-3 relative">
            <AgentNode
              icon={<Timer className="size-4" />}
              name="Delay Detection"
              status="Scanning 142 trains"
              load={72}
            />
            <FlowConnector />
            <AgentNode
              icon={<Layers className="size-4" />}
              name="Cargo Criticality"
              status="3 medical, 1 fuel flagged"
              load={88}
              hot
            />
            <FlowConnector />
            <AgentNode
              icon={<TrendingUp className="size-4" />}
              name="Impact Prediction"
              status="Modeling downstream"
              load={61}
            />
            <FlowConnector />
            <AgentNode
              icon={<Zap className="size-4" />}
              name="Action Recommendation"
              status="2 actions dispatched"
              load={49}
            />
          </div>
        </div>
      </section>

      {/* Risk distribution / escalation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="size-4 text-[#ff6b00]" />
            <h3 className="font-bold">Risk Distribution</h3>
          </div>
          <RiskDistribution />
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="size-4 text-[#ff1e1e]" />
            <h3 className="font-bold">Live Escalation Feed</h3>
          </div>
          <ul className="flex flex-col gap-3 text-sm">
            <FeedItem
              tone="critical"
              time="2 min ago"
              text="W-08 escalated Medium → Critical. Oxygen backup window breached."
            />
            <FeedItem
              tone="high"
              time="11 min ago"
              text="W-29 risk increased to High. ICU install scheduled in 18h."
            />
            <FeedItem
              tone="warn"
              time="24 min ago"
              text="W-12 cold-chain temperature trending toward threshold."
            />
            <FeedItem
              tone="ok"
              time="38 min ago"
              text="W-17 confirmed within tolerance. No action required."
            />
          </ul>
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend: string;
  tone: "neutral" | "warn" | "high" | "critical";
}) {
  const toneRing =
    tone === "critical"
      ? "from-[#ff1e1e]/40 to-[#ff6b00]/20"
      : tone === "high"
        ? "from-orange-500/30 to-[#ff1e1e]/10"
        : tone === "warn"
          ? "from-amber-400/20 to-transparent"
          : "from-white/10 to-transparent";
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div
        className={`absolute inset-x-0 -bottom-12 h-24 bg-gradient-to-t ${toneRing} blur-2xl pointer-events-none`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3 text-white/60">
          <span className="text-[11px] uppercase tracking-wider">{label}</span>
          <span className="text-[#ff6b00]">{icon}</span>
        </div>
        <div className="text-4xl font-bold tabular-nums">
          {tone === "critical" ? <span className="text-ember">{value}</span> : value}
        </div>
        <div className="text-[11px] text-white/40 mt-2 uppercase tracking-wider">{trend}</div>
      </div>
    </div>
  );
}

function CriticalityMeter({ score }: { score: number }) {
  return (
    <div className="hidden sm:flex flex-col items-end gap-1 w-32 shrink-0">
      <div className="text-[10px] uppercase tracking-wider text-white/40">Criticality</div>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e]"
          style={{ width: `${score}%`, boxShadow: "0 0 12px rgba(255,30,30,0.6)" }}
        />
      </div>
      <div className="text-xs font-semibold tabular-nums text-white/80">{score}</div>
    </div>
  );
}

function AgentNode({
  icon,
  name,
  status,
  load,
  hot,
}: {
  icon: React.ReactNode;
  name: string;
  status: string;
  load: number;
  hot?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl p-3.5 flex items-center gap-3 ${hot ? "ember-glow-sm border-[#ff1e1e]/30" : ""}`}
    >
      <div
        className={`size-9 rounded-lg flex items-center justify-center ${hot ? "bg-gradient-to-br from-[#ff1e1e] to-[#ff6b00] text-white" : "glass text-[#ff6b00]"}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-[11px] text-white/50 truncate">{status}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-white/40 uppercase tracking-wider">Load</div>
        <div className="text-xs font-bold tabular-nums">{load}%</div>
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <svg viewBox="0 0 100 16" className="h-4 w-full overflow-visible" preserveAspectRatio="none">
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="16"
        stroke="#ff1e1e"
        strokeWidth="2"
        className="flow-line"
      />
    </svg>
  );
}

function RiskDistribution() {
  const buckets = [
    { label: "Critical", count: 1, color: "#ff1e1e", pct: 14 },
    { label: "High", count: 3, color: "#ff6b00", pct: 43 },
    { label: "Medium", count: 1, color: "#f59e0b", pct: 14 },
    { label: "Low", count: 2, color: "#10b981", pct: 29 },
  ];
  return (
    <div className="space-y-4">
      <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
        {buckets.map((b) => (
          <div
            key={b.label}
            style={{
              width: `${b.pct}%`,
              background: b.color,
              boxShadow:
                b.label === "Critical" || b.label === "High"
                  ? `0 0 12px ${b.color}aa`
                  : undefined,
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center justify-between glass rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ background: b.color, boxShadow: `0 0 8px ${b.color}` }}
              />
              <span className="text-sm text-white/80">{b.label}</span>
            </div>
            <span className="text-sm font-bold tabular-nums">{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedItem({
  tone,
  time,
  text,
}: {
  tone: "critical" | "high" | "warn" | "ok";
  time: string;
  text: string;
}) {
  const dot =
    tone === "critical"
      ? "bg-[#ff1e1e] animate-pulse-ember"
      : tone === "high"
        ? "bg-orange-400"
        : tone === "warn"
          ? "bg-amber-400"
          : "bg-emerald-400";
  return (
    <li className="flex gap-3">
      <span className={`mt-1.5 size-2 rounded-full shrink-0 ${dot}`} />
      <div className="flex-1">
        <p className="text-white/85 leading-snug">{text}</p>
        <p className="text-[11px] text-white/40 mt-0.5">{time}</p>
      </div>
    </li>
  );
}
