import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Brain,
  Flame,
  Gauge,
  Layers,
  LogIn,
  Radio,
  Route as RouteIcon,
  ShieldAlert,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import heroTrain from "@/assets/hero-train.jpg";
import networkMap from "@/assets/network-map.jpg";
import cargoWagon from "@/assets/cargo-wagon.jpg";

export const Route = createFileRoute("/")({
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
      <Features />
      <FlowSection />
      <PreviewSection />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl glass-ember flex items-center justify-center">
            <Radio className="size-4 text-[#ff6b00]" />
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight">
              RailRisk<span className="text-ember"> AI</span>
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#flow" className="hover:text-white transition">How it works</a>
          <a href="#preview" className="hover:text-white transition">Platform</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition"
          >
            <LogIn className="size-4" /> Sign in
          </Link>
          <Link to="/login" className="btn-ember text-sm hover:scale-105 transition-transform">
            Launch platform <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Train background — blends into page via masks */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroTrain}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 75% at 50% 60%, #000 35%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 75% at 50% 60%, #000 35%, transparent 85%)",
          }}
        />
        {/* Top fade so nav blends */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505] to-transparent" />
        {/* Bottom fade so next section blends */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        {/* Text legibility scrim */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(5,5,5,0.55),transparent_70%)]" />
        {/* Ambient glows */}
        <div className="absolute top-1/3 right-0 size-[600px] rounded-full bg-[#ff1e1e]/15 blur-[140px]" />
        <div className="absolute -bottom-40 left-0 size-[500px] rounded-full bg-[#ff6b00]/15 blur-[140px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/80 mb-7">
          <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse-ember" />
          Decision Intelligence for Rail Freight
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02]"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}>
          Prioritise the delays
          <br className="hidden sm:block" />
          {" "}that <span className="text-ember">actually matter.</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
          RailRisk AI ranks every disrupted wagon by cargo criticality and
          downstream impact — so your team acts on what counts, not what arrived first.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/login" className="btn-ember hover:scale-105 transition-transform">
            Launch platform <ArrowUpRight className="size-4" />
          </Link>
          <a
            href="#features"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/90 border border-white/20 hover:bg-white/5 transition inline-flex items-center gap-2"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const cards = [
    {
      icon: <ShieldAlert className="size-5" />,
      title: "Cargo Criticality",
      desc: "Medical, fuel, and time-bound cargo are flagged the moment risk crosses threshold.",
      cta: "See scoring",
    },
    {
      icon: <Gauge className="size-5" />,
      title: "Downstream Impact",
      desc: "Model the cascade — installations missed, backup capacity, customer SLAs.",
      cta: "See modeling",
    },
    {
      icon: <Zap className="size-5" />,
      title: "Action Recommendations",
      desc: "Concrete dispatch and reroute moves your controllers can approve in one click.",
      cta: "See actions",
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
            <Sparkles className="size-3 text-[#ff6b00]" /> The platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Three layers of intelligence,
            <br />
            <span className="text-ember">one decisive view.</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl">
            Stop staring at delay tables. Start operating on a live, ranked queue of disruptions
            that already knows what's at stake.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <FeatureCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <div className="group glass rounded-3xl p-6 relative overflow-hidden h-[340px] flex flex-col">
      <div className="absolute inset-x-0 -bottom-32 h-64 bg-gradient-to-t from-[#ff1e1e]/40 via-[#ff6b00]/15 to-transparent blur-3xl pointer-events-none opacity-70 group-hover:opacity-100 transition" />
      <div className="relative flex-1 flex flex-col">
        <div className="size-11 rounded-xl glass-ember flex items-center justify-center text-[#ff6b00] mb-5">
          {icon}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-sm text-white/60 leading-relaxed flex-1">{desc}</p>
        <div className="text-sm font-semibold text-white inline-flex items-center gap-1.5 mt-5">
          {cta} <ArrowUpRight className="size-3.5" />
        </div>
      </div>
    </div>
  );
}

function FlowSection() {
  const steps = [
    {
      icon: <Timer className="size-4" />,
      name: "Delay Detection",
      desc: "Scan 140+ trains in real time across the network.",
    },
    {
      icon: <Layers className="size-4" />,
      name: "Cargo Criticality",
      desc: "Flag medical, fuel, and SLA-bound cargo first.",
      hot: true,
    },
    {
      icon: <TrendingUp className="size-4" />,
      name: "Impact Prediction",
      desc: "Model downstream cascade and backup capacity.",
    },
    {
      icon: <Zap className="size-4" />,
      name: "Action Recommendation",
      desc: "Dispatch the right move — reroute, escalate, or hold.",
    },
  ];

  return (
    <section id="flow" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
            <Brain className="size-3 text-[#ff6b00]" /> Agent stack
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Four decision agents,
            <br />
            <span className="text-ember">always running.</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-md">
            Each agent owns a layer of the decision. Together they turn raw GPS pings and
            cargo manifests into a ranked, justified action list.
          </p>

          <div className="mt-9 flex flex-col gap-3 max-w-md">
            {steps.map((s, i) => (
              <div key={s.name} className="flex flex-col">
                <div
                  className={`glass rounded-2xl p-3.5 flex items-center gap-3 ${
                    s.hot ? "ember-glow-sm border-[#ff1e1e]/30" : ""
                  }`}
                >
                  <div
                    className={`size-9 rounded-lg flex items-center justify-center ${
                      s.hot
                        ? "bg-gradient-to-br from-[#ff1e1e] to-[#ff6b00] text-white"
                        : "glass text-[#ff6b00]"
                    }`}
                  >
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="text-[11px] text-white/50 truncate">{s.desc}</div>
                  </div>
                  <div className="text-[10px] text-white/40 tabular-nums">0{i + 1}</div>
                </div>
                {i < steps.length - 1 && (
                  <svg viewBox="0 0 100 16" className="h-4 w-12 ml-4" preserveAspectRatio="none">
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
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-[#ff1e1e]/15 blur-3xl rounded-full pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden glass-ember">
            <img
              src={networkMap}
              alt="Isometric rail network with glowing cargo wagons and floating data overlays"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050505]/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewSection() {
  return (
    <section id="preview" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 order-2 lg:order-1 relative">
            <div className="absolute -inset-8 bg-[#ff6b00]/15 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-3xl overflow-hidden glass-ember">
              <img
                src={cargoWagon}
                alt="Cargo wagon glowing with internal ember light"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.2em] text-white/70 mb-5">
              <RouteIcon className="size-3 text-[#ff6b00]" /> Live platform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Every wagon, scored.
              <br />
              <span className="text-ember">Every minute.</span>
            </h2>
            <p className="mt-4 text-white/60 max-w-lg">
              Walk into a control room and see a single ranked queue — not 1,400 lines of
              delay data. Drill into any wagon for the why behind its score.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
              <MiniStat label="Wagons monitored" value="1,420" />
              <MiniStat label="Avg time-to-decision" value="38s" hot />
              <MiniStat label="Critical SLAs saved" value="92%" />
              <MiniStat label="False alerts" value="-67%" />
            </div>

            <div className="mt-8">
              <Link to="/login" className="btn-ember hover:scale-105 transition-transform">
                Open the dashboard <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value, hot }: { label: string; value: string; hot?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-4 ${hot ? "ember-glow-sm" : ""}`}>
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">{label}</div>
      <div className={`text-2xl font-bold tabular-nums mt-1 ${hot ? "text-ember" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function CTA() {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
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
              <Link to="/login" className="btn-ember hover:scale-105 transition-transform">
                Launch platform <ArrowUpRight className="size-4" />
              </Link>
              <a
                href="#features"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/5 transition"
              >
                Talk to the team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg glass-ember flex items-center justify-center">
            <Radio className="size-3.5 text-[#ff6b00]" />
          </div>
          <span>RailRisk AI · Decision Intelligence for Rail Freight</span>
        </div>
        <div>© {new Date().getFullYear()} RailRisk AI. All rights reserved.</div>
      </div>
    </footer>
  );
}
