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
import { fetchWagons, type Wagon, type RiskLevel } from "@/lib/railrisk-data";
import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";

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

const riskStyles: Record<RiskLevel, { bg: string; border: string; stripe: string; glow: string; text: string }> = {
  Critical: { bg: "bg-[#ff1e1e]/[0.08]", border: "border-[#ff1e1e]/30", stripe: "bg-gradient-to-b from-[#ff6b00] to-[#ff1e1e]", glow: "shadow-[0_0_12px_rgba(255,30,30,0.3)]", text: "text-[#ff1e1e]" },
  High: { bg: "bg-[#ff6b00]/[0.06]", border: "border-[#ff6b00]/25", stripe: "bg-[#ff6b00]", glow: "shadow-[0_0_10px_rgba(255,107,0,0.2)]", text: "text-[#ff6b00]" },
  Medium: { bg: "bg-[#fbbf24]/[0.04]", border: "border-[#fbbf24]/20", stripe: "bg-[#fbbf24]", glow: "", text: "text-[#fbbf24]" },
  Low: { bg: "bg-emerald-400/[0.03]", border: "border-emerald-400/15", stripe: "bg-emerald-400", glow: "", text: "text-emerald-400" },
};

function Overview() {
  const [showSplash, setShowSplash] = useState(false);
  const [wagons, setWagons] = useState<Wagon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shouldShow = sessionStorage.getItem("showSplash") === "true";
      if (shouldShow) {
        setShowSplash(true);
        sessionStorage.removeItem("showSplash");
      }
    }
    fetchWagons().then(data => {
      setWagons(data);
      setLoading(false);
    }).catch(() => setLoading(false));

    const handleUpdate = () => {
      fetchWagons().then(data => setWagons([...data]));
    };
    window.addEventListener("wagonsUpdated", handleUpdate);
    return () => window.removeEventListener("wagonsUpdated", handleUpdate);
  }, []);

  const critical = wagons.filter((w) => w.risk === "Critical").length;
  const high = wagons.filter((w) => w.risk === "High").length;
  const totalDelayed = wagons.length;
  const pendingActions = wagons.filter((w) => w.actionStatus === "Pending").length;
  const sortedWagons = [...wagons].sort((a, b) => b.criticalityScore - a.criticalityScore);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading risk data from API...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <AppShell>
        <section className="glass-ember rounded-3xl p-8 lg:p-10 mb-8 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-32 -right-32 size-96 rounded-full bg-[#ff1e1e]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#ff6b00]/20 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
                <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse-ember" />
                Live Risk Intelligence
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-[1.05]">
                Situation: <span className="text-ember">{critical} critical disruptions</span> require
                immediate action.
              </h1>
              <p className="mt-4 text-white/60 max-w-xl">
                RailRisk AI is reprioritising delays in real time based on cargo criticality,
                downstream impact, and backup capacity.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/wagons" className="btn-ember text-sm hover:btn-ember-hover active:btn-ember-active">
                View priority queue <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/report"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#ff1e1e] border border-[#ff1e1e]/40 hover:bg-[#ff1e1e]/10 hover:border-[#ff1e1e]/60 transition-all duration-300 active:scale-[0.97]"
              >
                Live Summary Report
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up stagger-1">
          <StatCard icon={<Boxes className="size-5" />} label="Delayed Wagons" value={totalDelayed} trend="Live data" tone="neutral" />
          <StatCard icon={<AlertOctagon className="size-5" />} label="Critical Alerts" value={critical} trend="Escalated" tone="critical" />
          <StatCard icon={<Flame className="size-5" />} label="High-Risk Cargo" value={high + critical} trend="Medical · Fuel" tone="high" />
          <StatCard icon={<Timer className="size-5" />} label="Pending Actions" value={pendingActions} trend="Awaiting dispatch" tone="warn" />
        </section>

        <section className="glass rounded-2xl p-4 mb-8 animate-fade-up stagger-2">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="size-4 text-[#ff6b00]" />
            <h2 className="text-sm font-bold">Agent Pipeline</h2>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">All systems online</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <AgentChip icon={<Timer className="size-3.5" />} name="Delay Detection" status={`${wagons.length} trains`} baseLoad={72} />
            <AgentChip icon={<Layers className="size-3.5" />} name="Cargo Criticality" status={`${critical + high} flagged`} baseLoad={88} hot />
            <AgentChip icon={<TrendingUp className="size-3.5" />} name="Impact Prediction" status={`${critical} cascading impacts`} baseLoad={61} />
            <AgentChip icon={<Zap className="size-3.5" />} name="Action Engine" status={`${pendingActions} pending`} baseLoad={49} />
          </div>
        </section>

        <section className="glass rounded-3xl p-6 mb-8 animate-fade-up stagger-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold">Priority Risk Queue</h2>
              <p className="text-xs text-white/50 mt-1">All delayed wagons, ranked live by criticality — not arrival time.</p>
            </div>
            <Link to="/wagons" className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 transition-colors duration-300">
              All wagons <ChevronRight className="size-3.5" />
            </Link>
          </div>
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-white/30 border-b border-white/5 mb-2">
            <div className="col-span-1">Wagon</div>
            <div className="col-span-3">Cargo</div>
            <div className="col-span-2">Route</div>
            <div className="col-span-1 text-center">Delay</div>
            <div className="col-span-2">Risk</div>
            <div className="col-span-2">Criticality</div>
            <div className="col-span-1"></div>
          </div>
          <div className="flex flex-col gap-2">
            {sortedWagons.map((w) => {
              const s = riskStyles[w.risk];
              return (
                <Link
                  key={w.id}
                  to="/wagons/$id"
                  params={{ id: w.id }}
                  className={`group rounded-2xl p-4 flex md:grid md:grid-cols-12 md:gap-3 items-center relative overflow-hidden row-hover hover:row-hover-active active:press-active border ${s.bg} ${s.border} ${s.glow}`}
                >
                  <span className={`absolute inset-y-0 left-0 w-[3px] ${s.stripe} rounded-l-full`}
                    style={w.risk === "Critical" || w.risk === "High" ? { boxShadow: `0 0 8px ${w.risk === "Critical" ? "rgba(255,30,30,0.5)" : "rgba(255,107,0,0.4)"}` } : undefined}
                  />
                  <div className="col-span-1 shrink-0">
                    <div className={`size-10 rounded-xl flex items-center justify-center text-xs font-bold border ${
                      w.risk === "Critical" ? "glass-ember" : w.risk === "High" ? "bg-[#ff6b00]/10 border-[#ff6b00]/25" : "glass"
                    }`}>
                      {w.id}
                    </div>
                  </div>
                  <div className="col-span-3 min-w-0 flex-1 md:flex-none ml-3 md:ml-0">
                    <div className="font-semibold text-sm truncate">{w.cargo}</div>
                    <div className="text-[11px] text-white/40">→ {w.receiver}</div>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center gap-1 text-sm text-white/60">
                    <RouteIcon className="size-3" /> {w.route}
                  </div>
                  <div className="hidden md:flex col-span-1 justify-center">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${
                      w.delayHours >= 5 ? "text-[#ff1e1e]" : w.delayHours >= 3 ? "text-[#ff6b00]" : "text-white/70"
                    }`}>
                      <Timer className="size-3 opacity-50" />
                      {w.delayHours}h
                    </span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center gap-2">
                    <RiskBadge level={w.risk} />
                  </div>
                  <div className="hidden md:flex col-span-2 flex-col items-stretch gap-1">
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          w.criticalityScore >= 80 ? "bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e]" :
                          w.criticalityScore >= 50 ? "bg-gradient-to-r from-[#fbbf24] to-[#ff6b00]" :
                          "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        }`}
                        style={{
                          width: `${w.criticalityScore}%`,
                          boxShadow: w.criticalityScore >= 70
                            ? `0 0 10px ${w.criticalityScore >= 80 ? "rgba(255,30,30,0.5)" : "rgba(255,107,0,0.4)"}`
                            : undefined,
                        }}
                      />
                    </div>
                    <div className={`text-xs font-bold tabular-nums text-right ${s.text}`}>{w.criticalityScore}</div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <ChevronRight className="size-4 text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up stagger-4">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="size-4 text-[#ff6b00]" />
              <h3 className="font-bold">Risk Distribution</h3>
            </div>
            <RiskDistribution counts={{ Critical: critical, High: high, Medium: wagons.filter(w => w.risk === "Medium").length, Low: wagons.filter(w => w.risk === "Low").length }} />
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="size-4 text-[#ff1e1e]" />
              <h3 className="font-bold">Live Escalation Feed</h3>
            </div>
            <ul className="flex flex-col gap-3 text-sm">
              {sortedWagons.slice(0, 4).map((w, i) => (
                <FeedItem key={w.id} tone={w.risk === "Critical" ? "critical" : w.risk === "High" ? "high" : w.risk === "Medium" ? "warn" : "ok"} time={`${i * 10} min ago`} text={`${w.id} ${w.risk} risk: ${w.cargo} to ${w.receiver}.`} />
              ))}
            </ul>
          </div>
        </section>
      </AppShell>
    </>
  );
}

function StatCard({ icon, label, value, trend, tone }: { icon: React.ReactNode; label: string; value: number; trend: string; tone: "neutral" | "warn" | "high" | "critical"; }) {
  const toneRing = tone === "critical" ? "from-[#ff1e1e]/40 to-[#ff6b00]/20" : tone === "high" ? "from-orange-500/30 to-[#ff1e1e]/10" : tone === "warn" ? "from-amber-400/20 to-transparent" : "from-white/10 to-transparent";
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden glass-lift hover:glass-lift-hover">
      <div className={`absolute inset-x-0 -bottom-12 h-24 bg-gradient-to-t ${toneRing} blur-2xl pointer-events-none`} />
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

function AgentChip({ icon, name, status, baseLoad, hot }: { icon: React.ReactNode; name: string; status: string; baseLoad: number; hot?: boolean; }) {
  const [load, setLoad] = useState(baseLoad);
  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(Math.min(100, Math.max(0, baseLoad + Math.floor(Math.random() * 14) - 7)));
    }, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [baseLoad]);

  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${hot ? "bg-[#ff1e1e]/10 border border-[#ff1e1e]/20" : "bg-white/[0.03] border border-white/5"}`}>
      <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${hot ? "bg-gradient-to-br from-[#ff1e1e] to-[#ff6b00] text-white" : "glass text-[#ff6b00]"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold truncate">{name}</div>
        <div className="text-[10px] text-white/40 truncate">{status}</div>
      </div>
      <div className="text-[10px] tabular-nums text-white/30 font-mono shrink-0">{load}%</div>
    </div>
  );
}

function RiskDistribution({ counts }: { counts: { Critical: number; High: number; Medium: number; Low: number; } }) {
  const total = counts.Critical + counts.High + counts.Medium + counts.Low || 1;
  const buckets = [
    { label: "Critical", count: counts.Critical, color: "#ff1e1e", pct: Math.round((counts.Critical / total) * 100) },
    { label: "High", count: counts.High, color: "#ff6b00", pct: Math.round((counts.High / total) * 100) },
    { label: "Medium", count: counts.Medium, color: "#fbbf24", pct: Math.round((counts.Medium / total) * 100) },
    { label: "Low", count: counts.Low, color: "#34d399", pct: Math.round((counts.Low / total) * 100) },
  ];
  return (
    <div className="space-y-4">
      <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
        {buckets.map((b) => (
          <div key={b.label} style={{ width: `${b.pct}%`, background: b.color, boxShadow: b.label === "Critical" || b.label === "High" ? `0 0 12px ${b.color}aa` : undefined }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center justify-between glass rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: b.color, boxShadow: `0 0 8px ${b.color}` }} />
              <span className="text-sm text-white/80">{b.label}</span>
            </div>
            <span className="text-sm font-bold tabular-nums">{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedItem({ tone, time, text }: { tone: "critical" | "high" | "warn" | "ok"; time: string; text: string; }) {
  const dot = tone === "critical" ? "bg-[#ff1e1e] animate-pulse-ember" : tone === "high" ? "bg-[#ff6b00]" : tone === "warn" ? "bg-[#fbbf24]" : "bg-emerald-400";
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