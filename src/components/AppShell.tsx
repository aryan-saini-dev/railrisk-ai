import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  FileText,
  LayoutDashboard,
  Radio,
  Train,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/wagons", label: "Delayed Wagons", icon: Train },
  { to: "/report", label: "RailRisk Report", icon: FileText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  return (
    <div className="min-h-screen flex text-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/5 px-5 py-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="relative">
            <div className="size-9 rounded-xl glass-ember flex items-center justify-center">
              <Radio className="size-4 text-[#ff6b00]" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight">RailRisk<span className="text-ember"> AI</span></div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              Decision Intelligence
            </div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? "glass-ember text-white ember-glow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="size-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50 mb-2">
            <span className="size-2 rounded-full bg-[#ff1e1e] animate-pulse-ember" />
            Live Risk Stream
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Agents continuously score delays, cargo criticality, and downstream impact.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 lg:px-10 py-4 backdrop-blur-xl bg-black/30 border-b border-white/5">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="size-8 rounded-lg glass-ember flex items-center justify-center">
              <Radio className="size-4 text-[#ff6b00]" />
            </div>
            <span className="font-bold">RailRisk<span className="text-ember"> AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
            <Activity className="size-3.5 text-[#ff6b00]" />
            <span>System status</span>
            <span className="text-emerald-400 font-medium">Operational</span>
            <span className="mx-2 text-white/20">|</span>
            <span>4 Agents online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
              <AlertTriangle className="size-3.5 text-[#ff1e1e]" />
              <span className="text-white/70">3 Critical</span>
            </div>
            <button className="btn-ember text-sm hover:scale-105 transition-transform">
              Acknowledge
            </button>
          </div>
        </header>

        <div className="px-6 lg:px-10 py-8">{children}</div>
      </main>
    </div>
  );
}

export function RiskBadge({ level }: { level: "Low" | "Medium" | "High" | "Critical" }) {
  const map = {
    Low: "border-emerald-400/40 text-emerald-300 bg-emerald-400/5",
    Medium: "border-amber-400/40 text-amber-300 bg-amber-400/5",
    High: "border-orange-400/50 text-orange-300 bg-orange-400/10",
    Critical:
      "border-[#ff1e1e]/60 text-white bg-gradient-to-r from-[#ff1e1e]/30 to-[#ff6b00]/20 ember-glow-sm",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${map[level]}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          level === "Critical"
            ? "bg-[#ff1e1e] animate-pulse-ember"
            : level === "High"
              ? "bg-orange-400"
              : level === "Medium"
                ? "bg-amber-400"
                : "bg-emerald-400"
        }`}
      />
      {level}
    </span>
  );
}
