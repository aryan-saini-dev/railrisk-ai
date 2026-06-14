import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Brain,
  ChevronRight,
  Clock,
  Gauge,
  Layers,
  LogIn,
  Radio,
  Route as RouteIcon,
  ShieldAlert,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import heroTrain from "@/assets/hero-train.jpg";
import logo from "@/assets/RRAI-logo.png";
import React, { useEffect, useRef, useState, ReactNode } from "react";

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={`animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "RailRisk AI — Prioritise the delays that actually matter" },
      {
        name: "description",
        content:
          "Decision intelligence for rail freight. RailRisk AI ranks disruptions by cargo criticality and downstream impact — not by arrival time.",
      },
      { property: "og:title", content: "RailRisk AI" },
      {
        property: "og:description",
        content: "Prioritise dangerous rail freight delays in real time.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen text-white overflow-x-clip">
      <Nav />
      <Hero />
      <BentoFeatures />
      <AgentFlowDiagram />
      <LiveDashboardPreview />
      <CTA />
      <Footer />
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/5 animate-fade-up">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="RailRisk AI Logo" className="h-9 object-contain drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#features" className="relative hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#ff6b00] after:to-[#ff1e1e] after:transition-all after:duration-300 hover:after:w-full after:rounded-full">Features</a>
          <a href="#flow" className="relative hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#ff6b00] after:to-[#ff1e1e] after:transition-all after:duration-300 hover:after:w-full after:rounded-full">How it works</a>
          <a href="#preview" className="relative hover:text-white transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#ff6b00] after:to-[#ff1e1e] after:transition-all after:duration-300 hover:after:w-full after:rounded-full">Platform</a>
        </nav>
        <div className="flex items-center gap-3">

          <Link to="/login" className="btn-ember text-sm hover:btn-ember-hover active:btn-ember-active">
            Launch platform <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Train background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroTrain}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 70%" }}
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_42%,rgba(5,5,5,0.85),transparent_75%)]" />
        <div className="absolute top-1/4 -right-20 size-[500px] rounded-full bg-[#ff1e1e]/20 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-20 -left-20 size-[400px] rounded-full bg-[#ff6b00]/15 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/80 mb-7 animate-fade-up">
          <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse-ember" />
          Decision Intelligence for Rail Freight
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] animate-fade-up stagger-1"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}>
          Prioritise the delays
          <br className="hidden sm:block" />
          {" "}that <span className="text-ember">actually matter.</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed animate-fade-up stagger-2">
          RailRisk AI ranks every disrupted wagon by cargo criticality and
          downstream impact — so your team acts on what counts, not what arrived first.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3 animate-fade-up stagger-3">
          <Link to="/login" className="btn-ember hover:btn-ember-hover active:btn-ember-active">
            Launch platform <ArrowUpRight className="size-4" />
          </Link>
          <a
            href="#features"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/90 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 inline-flex items-center gap-2 active:scale-[0.97]"
          >
            See how it works
          </a>
        </div>

        {/* Floating live ticker — unique element */}
        <div className="mt-14 animate-fade-up stagger-4">
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-[#050505]/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#ff1e1e] animate-pulse-ember" />
              <span className="text-white/50">Live now:</span>
              <span className="font-semibold tabular-nums">142</span>
              <span className="text-white/50">trains monitored</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[#ff1e1e] font-bold tabular-nums">3</span>
              <span className="text-white/50">critical</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[#ff6b00] font-bold tabular-nums">7</span>
              <span className="text-white/50">actions pending</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── BENTO FEATURES ─── */
function BentoFeatures() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
              <Gauge className="size-3 text-[#ff6b00]" /> Why it's different
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Not another <span className="text-ember">delay tracker.</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-xl">
              Other systems tell you <em>something is late</em>. RailRisk tells you <em>why it matters</em>,
              who's affected, and what to do — before the call comes in.
            </p>
          </div>
        </FadeIn>

        {/* Bento grid with unique visuals per cell */}
        <FadeIn delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Big card: Before/After comparison */}
          <div className="md:col-span-4 glass rounded-3xl p-6 relative overflow-hidden glass-lift hover:glass-lift-hover active:press-active cursor-default group">
            <div className="absolute inset-x-0 -bottom-32 h-64 bg-gradient-to-t from-[#ff1e1e]/20 to-transparent blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#ff6b00] font-semibold mb-3">Before vs. After RailRisk AI</div>
              <div className="grid grid-cols-2 gap-4">
                {/* Before */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-3">
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-wider">Without RailRisk</div>
                  <div className="space-y-2">
                    <QueueRow rank="1" label="Textiles → Export Warehouse" delay="1h" risk="Low" color="#34d399" dimmed />
                    <QueueRow rank="2" label="Perishable Produce → Jaipur" delay="3h" risk="Med" color="#fbbf24" dimmed />
                    <QueueRow rank="3" label="Steel Coils → Bengaluru" delay="2h" risk="Low" color="#34d399" dimmed />
                    <QueueRow rank="4" label="Med. Oxygen → City Hospital" delay="6h" risk="???" color="#a1a1aa" dimmed />
                  </div>
                  <div className="text-[10px] text-white/30 italic">↑ Sorted by arrival time. Oxygen buried at #4.</div>
                </div>
                {/* After */}
                <div className="rounded-2xl bg-[#ff1e1e]/[0.04] border border-[#ff1e1e]/20 p-4 space-y-3">
                  <div className="text-xs font-semibold text-[#ff6b00] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="size-3" /> With RailRisk
                  </div>
                  <div className="space-y-2">
                    <QueueRow rank="1" label="Med. Oxygen → City Hospital" delay="6h" risk="CRIT" color="#ff1e1e" hot />
                    <QueueRow rank="2" label="Insulin Cold Chain → AIIMS" delay="4h" risk="High" color="#ff6b00" />
                    <QueueRow rank="3" label="Diesel Fuel → Power Grid" delay="5h" risk="High" color="#ff6b00" />
                    <QueueRow rank="4" label="Perishable Produce → Jaipur" delay="3h" risk="Med" color="#fbbf24" />
                  </div>
                  <div className="text-[10px] text-emerald-400/70">↑ Ranked by criticality. Life-saving cargo first.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tall card: Live risk meter */}
          <div className="md:col-span-2 glass rounded-3xl p-6 relative overflow-hidden glass-lift hover:glass-lift-hover active:press-active cursor-default group flex flex-col">
            <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-[#ff1e1e]/20 blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex-1 flex flex-col">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#ff6b00] font-semibold mb-3">Live Risk Score</div>
              <div className="flex-1 flex flex-col items-center justify-center">
                {/* Circular gauge */}
                <div className="relative size-36">
                  <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke="url(#emberGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${0.94 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                      style={{ filter: "drop-shadow(0 0 8px rgba(255,30,30,0.6))" }}
                    />
                    <defs>
                      <linearGradient id="emberGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ff6b00" />
                        <stop offset="100%" stopColor="#ff1e1e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-ember tabular-nums">94</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">/ 100</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm font-semibold">W-08 · Med. Oxygen</div>
                  <div className="text-[11px] text-white/40 mt-0.5">Mumbai → Pune · 6h delay</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#ff1e1e]/50 text-[10px] font-semibold uppercase tracking-wider text-white bg-[#ff1e1e]/20">
                    <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse-ember" />
                    Critical
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: 3 small bento cells */}
          <div className="md:col-span-2 glass rounded-3xl p-5 relative overflow-hidden glass-lift hover:glass-lift-hover active:press-active cursor-default group">
            <div className="absolute inset-x-0 -bottom-20 h-40 bg-gradient-to-t from-[#ff6b00]/15 to-transparent blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <ShieldAlert className="size-5 text-[#ff6b00] mb-3" />
              <h3 className="text-lg font-bold mb-1">Cargo Sensitivity</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                Medical oxygen isn't the same as steel coils. The system knows.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Medical", "Fuel", "Cold-chain", "SLA-bound"].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 glass rounded-3xl p-5 relative overflow-hidden glass-lift hover:glass-lift-hover active:press-active cursor-default group">
            <div className="absolute inset-x-0 -bottom-20 h-40 bg-gradient-to-t from-[#ff1e1e]/15 to-transparent blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <TrendingUp className="size-5 text-[#ff6b00] mb-3" />
              <h3 className="text-lg font-bold mb-1">Cascade Modeling</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                A 6h delay doesn't mean 6h impact. We model the domino effect.
              </p>
              {/* Mini cascade viz */}
              <div className="flex items-center gap-1.5">
                <div className="size-8 rounded-lg bg-[#ff1e1e]/20 border border-[#ff1e1e]/40 flex items-center justify-center text-[10px] font-bold" style={{ boxShadow: "0 0 10px rgba(255,30,30,0.3)" }}>6h</div>
                <ArrowRight className="size-3 text-white/30" />
                <div className="size-8 rounded-lg bg-[#ff6b00]/20 border border-[#ff6b00]/30 flex items-center justify-center text-[10px] font-bold">12h</div>
                <ArrowRight className="size-3 text-white/30" />
                <div className="size-8 rounded-lg bg-[#fbbf24]/15 border border-[#fbbf24]/25 flex items-center justify-center text-[10px] font-bold">24h</div>
                <ArrowRight className="size-3 text-white/30" />
                <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/10 px-2 py-1 text-[10px] text-white/50">240 patients affected</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 glass rounded-3xl p-5 relative overflow-hidden glass-lift hover:glass-lift-hover active:press-active cursor-default group">
            <div className="absolute inset-x-0 -bottom-20 h-40 bg-gradient-to-t from-emerald-500/10 to-transparent blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <Clock className="size-5 text-[#ff6b00] mb-3" />
              <h3 className="text-lg font-bold mb-1">38s to Decision</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-3">
                Average time from delay detection to actionable recommendation.
              </p>
              {/* Timeline bar */}
              <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  style={{ width: "12%", boxShadow: "0 0 12px rgba(52,211,153,0.5)" }}
                />
                <div
                  className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e] opacity-20"
                  style={{ left: "12%", width: "88%" }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-white/40 tabular-nums">
                <span className="text-emerald-400 font-semibold">38s · RailRisk</span>
                <span>~5 min · Manual triage</span>
              </div>
            </div>
          </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function QueueRow({ rank, label, delay, risk, color, hot, dimmed }: {
  rank: string; label: string; delay: string; risk: string; color: string; hot?: boolean; dimmed?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${dimmed ? "bg-white/[0.02]" : hot ? "bg-[#ff1e1e]/10 border border-[#ff1e1e]/30" : "bg-white/[0.03]"}`}
         style={hot ? { boxShadow: "0 0 12px rgba(255,30,30,0.2)" } : undefined}>
      <span className={`tabular-nums font-bold ${dimmed ? "text-white/25" : "text-white/60"}`}>{rank}</span>
      <span className={`flex-1 truncate ${dimmed ? "text-white/35" : "text-white/80"}`}>{label}</span>
      <span className="text-white/30 tabular-nums">{delay}</span>
      <span className="font-bold text-[10px] tabular-nums" style={{ color }}>{risk}</span>
    </div>
  );
}

/* ─── AGENT FLOW DIAGRAM (Reference-inspired) ─── */
function AgentFlowDiagram() {
  return (
    <section id="flow" className="py-24 relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-[#ff1e1e]/[0.06] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
              <Brain className="size-3 text-[#ff6b00]" /> Agent Pipeline
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Your <span className="text-ember">decision agents,</span>
              <br />always running.
            </h2>
            <p className="mt-4 text-white/60 max-w-xl mx-auto">
              Four specialized agents chain together in real time. Each owns one layer
              of the decision — from detection to dispatch.
            </p>
          </div>
        </FadeIn>

        {/* SVG flow diagram — styled like reference image */}
        <FadeIn delay={200}>
          <div className="relative max-w-5xl mx-auto">
          {/* The SVG connection lines */}
          <svg
            viewBox="0 0 1000 480"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,30,30,0.4))" }}
          >
            {/* Line: Delay → Criticality */}
            <path
              d="M 250 70 C 320 70, 310 174, 380 174"
              fill="none" stroke="#ff1e1e" strokeWidth="2" className="flow-line"
            />
            {/* Line: Criticality → Impact */}
            <path
              d="M 600 174 C 680 174, 680 328, 760 328"
              fill="none" stroke="#ff1e1e" strokeWidth="2" className="flow-line"
            />
            {/* Line: Delay → Impact (secondary/faded) */}
            <path
              d="M 250 70 C 500 70, 500 328, 760 328"
              fill="none" stroke="#ff6b00" strokeWidth="1.5" opacity="0.2" className="flow-line"
              strokeDasharray="4 8"
            />
            {/* Line: Impact → Action */}
            <path
              d="M 760 328 C 600 328, 400 385, 270 385"
              fill="none" stroke="#ff1e1e" strokeWidth="2" className="flow-line"
            />
          </svg>

          {/* Node: Delay Detection — top left */}
          <div className="absolute" style={{ left: "3%", top: "2%" }}>
            <FlowNode
              icon={<Timer className="size-5" />}
              title="Delay Detection"
              detail="Scanning 142 trains"
              step="01"
            />
          </div>

          {/* Node: Cargo Criticality — center, slightly above midpoint */}
          <div className="absolute" style={{ left: "38%", top: "28%" }}>
            <FlowNode
              icon={<Layers className="size-5" />}
              title="Cargo Criticality"
              detail="3 medical flagged"
              step="02"
              hot
            />
          </div>

          {/* Node: Impact Prediction — far right, lower */}
          <div className="absolute" style={{ right: "2%", top: "60%" }}>
            <FlowNode
              icon={<TrendingUp className="size-5" />}
              title="Impact Prediction"
              detail="Modeling cascade"
              step="03"
            />
          </div>

          {/* Node: Action — bottom left */}
          <div className="absolute" style={{ left: "5%", top: "72%" }}>
            <FlowNode
              icon={<Zap className="size-5" />}
              title="Action Dispatch"
              detail="2 actions sent"
              step="04"
              action
            />
          </div>

          {/* Central context card — right of center to avoid collision */}
          <div className="absolute hidden lg:block" style={{ right: "18%", top: "10%" }}>
            <div className="glass-ember rounded-2xl p-4 w-52 text-center" style={{ boxShadow: "0 0 30px rgba(255,30,30,0.2), 0 0 60px rgba(255,30,30,0.1)" }}>
              <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Current Decision</div>
              <div className="font-bold text-sm">W-08 · Medical Oxygen</div>
              <div className="text-[11px] text-white/50 mt-0.5">Score: 94/100</div>
              <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e] animate-breathe" style={{ width: "94%", boxShadow: "0 0 8px rgba(255,30,30,0.6)" }} />
              </div>
            </div>
          </div>

          {/* Spacer for the SVG area */}
          <div className="h-[480px]" />
        </div>
        </FadeIn>
      </div>
    </section>
  );
}

function FlowNode({ icon, title, detail, step, hot, action }: {
  icon: React.ReactNode; title: string; detail: string; step: string; hot?: boolean; action?: boolean;
}) {
  const borderColor = hot
    ? "border-[#ff1e1e]/50"
    : action
      ? "border-[#ff6b00]/40"
      : "border-white/10";

  const bgGlow = hot
    ? "shadow-[0_0_20px_rgba(255,30,30,0.3),0_0_40px_rgba(255,30,30,0.1)]"
    : action
      ? "shadow-[0_0_20px_rgba(255,107,0,0.25),0_0_40px_rgba(255,107,0,0.08)]"
      : "shadow-[0_0_15px_rgba(255,255,255,0.03)]";

  return (
    <div className={`glass rounded-2xl p-4 pr-5 flex items-center gap-3 border ${borderColor} ${bgGlow} glass-lift hover:glass-lift-hover group cursor-default`}
         style={{ minWidth: 200 }}>
      <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
        hot ? "bg-gradient-to-br from-[#ff1e1e] to-[#ff6b00] text-white" :
        action ? "bg-gradient-to-br from-[#ff6b00] to-[#ff1e1e] text-white" :
        "glass text-[#ff6b00]"
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[11px] text-white/50 truncate">{detail}</div>
      </div>
      <div className="text-[10px] text-white/20 tabular-nums font-mono">{step}</div>
    </div>
  );
}

/* ─── LIVE DASHBOARD PREVIEW ─── */
function LiveDashboardPreview() {
  return (
    <section id="preview" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
              <RouteIcon className="size-3 text-[#ff6b00]" /> Live Platform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              One screen. <span className="text-ember">Zero guesswork.</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-xl mx-auto">
              Walk into a control room and see a ranked queue of what matters — not 1,400 rows
              of delay data.
            </p>
          </div>
        </FadeIn>

        {/* Mock dashboard — built in HTML/CSS, not a screenshot */}
        <FadeIn delay={200}>
          <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-8 bg-[#ff1e1e]/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative glass-ember rounded-3xl overflow-hidden border border-[#ff1e1e]/20" style={{ boxShadow: "0 0 60px rgba(255,30,30,0.15), 0 40px 80px -20px rgba(0,0,0,0.5)" }}>
            {/* Mock title bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-black/30">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="text-[11px] text-white/30 px-3 py-0.5 rounded bg-white/[0.03] border border-white/5">
                  railrisk.ai/dashboard
                </div>
              </div>
            </div>

            <div className="flex">
              {/* Mini sidebar */}
              <div className="hidden md:block w-48 border-r border-white/5 p-4 shrink-0">
                <div className="flex items-center mb-6">
                  <img src={logo} alt="RailRisk AI Logo" className="h-6 object-contain drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#ff1e1e]/10 border border-[#ff1e1e]/20 text-xs">
                    <Boxes className="size-3" /> Overview
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/40">
                    <RouteIcon className="size-3" /> Wagons
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/40">
                    <AlertTriangle className="size-3" /> Reports
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-5 space-y-4">
                {/* Stat row */}
                <div className="grid grid-cols-4 gap-3">
                  <DashStat label="Delayed" value="7" />
                  <DashStat label="Critical" value="3" hot />
                  <DashStat label="High Risk" value="4" warm />
                  <DashStat label="Pending" value="5" />
                </div>

                {/* Priority queue */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold">Priority Risk Queue</div>
                    <div className="text-[10px] text-white/30">Ranked by criticality</div>
                  </div>
                  <div className="space-y-2">
                    <DashRow id="W-08" cargo="Medical Oxygen Cylinders" route="Mumbai → Pune" delay="6h" score={94} risk="critical" />
                    <DashRow id="W-12" cargo="Insulin Cold Chain" route="Vadodara → Delhi" delay="4h" score={81} risk="high" />
                    <DashRow id="W-29" cargo="Ventilator Components" route="Kolkata → Patna" delay="5h" score={78} risk="high" />
                    <DashRow id="W-03" cargo="Diesel Fuel" route="Visakhapatnam → HYD" delay="5h" score={76} risk="high" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/login" className="btn-ember hover:btn-ember-hover active:btn-ember-active">
            Try it live <ArrowUpRight className="size-4" />
          </Link>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}

function DashStat({ label, value, hot, warm }: { label: string; value: string; hot?: boolean; warm?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${hot ? "bg-[#ff1e1e]/10 border border-[#ff1e1e]/20" : warm ? "bg-[#ff6b00]/10 border border-[#ff6b00]/15" : "bg-white/[0.03] border border-white/5"}`}>
      <div className="text-[9px] uppercase tracking-wider text-white/40">{label}</div>
      <div className={`text-xl font-bold tabular-nums ${hot ? "text-[#ff1e1e]" : warm ? "text-[#ff6b00]" : ""}`}>{value}</div>
    </div>
  );
}

function DashRow({ id, cargo, route, delay, score, risk }: {
  id: string; cargo: string; route: string; delay: string; score: number; risk: "critical" | "high";
}) {
  const isCrit = risk === "critical";
  return (
    <div className={`flex items-center gap-3 rounded-xl px-3 py-2 ${isCrit ? "bg-[#ff1e1e]/[0.06] border border-[#ff1e1e]/15" : "bg-white/[0.02]"}`}>
      {isCrit && <span className="w-[2px] self-stretch rounded-full bg-gradient-to-b from-[#ff6b00] to-[#ff1e1e]" style={{ boxShadow: "0 0 6px rgba(255,30,30,0.5)" }} />}
      <div className="size-8 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center text-[10px] font-bold">{id}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium truncate">{cargo}</div>
        <div className="text-[9px] text-white/30">{route} · {delay}</div>
      </div>
      <div className="hidden sm:block">
        <div className="h-1 w-16 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e]" style={{ width: `${score}%`, boxShadow: `0 0 8px rgba(255,30,30,0.4)` }} />
        </div>
        <div className="text-[9px] text-white/30 text-right tabular-nums mt-0.5">{score}</div>
      </div>
      <ChevronRight className="size-3 text-white/20" />
    </div>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <div className="glass-ember rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-32 -right-32 size-96 rounded-full bg-[#ff1e1e]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#ff6b00]/25 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto">
              Stop tracking delays.
              <br />
              <span className="text-ember">Start ranking them.</span>
            </h2>
            <p className="mt-5 text-white/70 max-w-xl mx-auto">
              Spin up RailRisk AI on your network in days, not quarters. No rip-and-replace,
              no schema gymnastics.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="btn-ember hover:btn-ember-hover active:btn-ember-active">
                Launch platform <ArrowUpRight className="size-4" />
              </Link>
              <a
                href="#features"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 active:scale-[0.97]"
              >
                Talk to the team
              </a>
            </div>
          </div>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
        <div className="flex items-center gap-3">
          <img src={logo} alt="RailRisk AI Logo" className="h-7 object-contain drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]" />
          <span>Decision Intelligence for Rail Freight</span>
        </div>
        <div>© {new Date().getFullYear()} RailRisk AI. All rights reserved.</div>
      </div>
    </footer>
  );
}
