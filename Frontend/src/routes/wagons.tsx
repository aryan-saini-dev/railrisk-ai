import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Filter, Search, Timer } from "lucide-react";
import { AppShell, RiskBadge } from "@/components/AppShell";
import { type Wagon, fetchWagons } from "@/lib/railrisk-data";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/wagons")({
  head: () => ({
    meta: [
      { title: "Delayed Wagons — RailRisk AI" },
      { name: "description", content: "Live list of delayed wagons with risk-prioritised action status.", },
    ],
  }),
  component: WagonsLayout,
});

function WagonsLayout() {
  const { location } = useRouterState();
  const [wagons, setWagons] = useState<Wagon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (location.pathname !== "/wagons" && location.pathname.startsWith("/wagons/")) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading wagon data...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#ff6b00] mb-2">Priority Queue</div>
          <h1 className="text-3xl lg:text-4xl font-bold">Delayed Wagons</h1>
          <p className="text-white/55 mt-2 max-w-2xl">Sorted by live criticality score. Wagons re-rank as delay and cargo conditions change.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm text-white/70 cursor-pointer hover:bg-white/[0.06] hover:border-white/12 transition-all duration-300">
            <Search className="size-4" /> Search ID, cargo, route
          </div>
          <button className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/[0.06] hover:border-white/12 transition-all duration-300 active:scale-[0.97]">
            <Filter className="size-4" /> Filter
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/40 border-b border-white/5">
          <div className="col-span-2">Wagon · Train</div>
          <div className="col-span-3">Cargo</div>
          <div className="col-span-2">Route</div>
          <div className="col-span-1 text-center">Delay</div>
          <div className="col-span-2">Risk</div>
          <div className="col-span-2">Action</div>
        </div>

        {[...wagons].sort((a, b) => b.criticalityScore - a.criticalityScore).map((w) => (
          <Link
            key={w.id}
            to="/wagons/$id"
            params={{ id: w.id }}
            className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-white/5 last:border-0 row-hover hover:row-hover-active relative group active:press-active"
          >
            {w.risk === "Critical" && (
              <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#ff6b00] to-[#ff1e1e] ember-glow-sm" />
            )}
            <div className="col-span-2">
              <div className="font-bold text-sm">{w.id}</div>
              <div className="text-[11px] text-white/40">{w.trainId}</div>
            </div>
            <div className="col-span-3">
              <div className="text-sm font-medium truncate">{w.cargo}</div>
              <div className="text-[11px] text-white/50">→ {w.receiver}</div>
            </div>
            <div className="col-span-2 text-sm text-white/70">{w.route}</div>
            <div className="col-span-1 text-center">
              <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
                <Timer className="size-3 text-white/40" />
                {w.delayHours}h
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <RiskBadge level={w.risk} />
              <span className="text-[11px] text-white/50 tabular-nums">· {w.criticalityScore}</span>
            </div>
            <div className="col-span-2 flex items-center justify-between gap-2">
              <ActionPill status={w.actionStatus} />
              <ChevronRight className="size-4 text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function ActionPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "border-amber-400/40 text-amber-300 bg-amber-400/5",
    Dispatched: "border-sky-400/40 text-sky-300 bg-sky-400/5",
    Resolved: "border-emerald-400/40 text-emerald-300 bg-emerald-400/5",
    Escalated: "border-[#ff1e1e]/60 text-white bg-[#ff1e1e]/20 ember-glow-sm",
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}