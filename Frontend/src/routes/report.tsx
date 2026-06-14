import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Download, FileText, Printer, ShieldAlert } from "lucide-react";
import { AppShell, RiskBadge } from "@/components/AppShell";
import { fetchWagons, type Wagon } from "@/lib/railrisk-data";
import { ActionModal, RerouteMap } from "@/components/AgenticAction";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "RailRisk Report — RailRisk AI" },
      {
        name: "description",
        content:
          "Generated risk report summarising critical wagons, impact and recommended actions.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
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

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-white/60">Loading report data...</div>
        </div>
      </AppShell>
    );
  }


  const critical = wagons.filter((w) => w.risk === "Critical" || w.risk === "High");

  return (
    <AppShell>
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#ff6b00] mb-2">
            Generated Briefing
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">Live RailRisk Summary Report</h1>
          <p className="text-white/55 mt-2 max-w-2xl">
            Snapshot of currently elevated wagons with cargo risk, impact and recommended action.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.97]">
            <Printer className="size-4" /> Print
          </button>
          <button className="btn-ember text-sm hover:btn-ember-hover active:btn-ember-active">
            <Download className="size-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="glass-ember rounded-3xl p-8 mb-6 relative overflow-hidden animate-fade-up">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[#ff1e1e]/25 blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
          <Cover label="Report ID" value="RR-LIVE" />
          <Cover label="Generated" value={`${new Date().toLocaleDateString()} · Live`} />
          <Cover label="Elevated Wagons" value={`${critical.length}`} />
          <Cover label="Overall posture" value={critical.length > 0 ? "Critical" : "Normal"} tone="critical" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {critical
          .sort((a, b) => b.criticalityScore - a.criticalityScore)
          .map((w) => (
            <ReportCard key={w.id} w={w} />
          ))}
      </div>
    </AppShell>
  );
}

function ReportCard({ w }: { w: Wagon }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <article className="glass rounded-3xl p-6 relative overflow-hidden glass-lift hover:glass-lift-hover animate-fade-up">
      {w.risk === "Critical" && (
        <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#ff6b00] to-[#ff1e1e] shadow-[0_0_12px_rgba(255,30,30,0.8)]" />
      )}
      <header className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl glass-ember flex items-center justify-center font-bold text-sm">
            {w.id}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-lg">{w.cargo}</h2>
              <RiskBadge level={w.risk as "Critical" | "High"} />
            </div>
            <div className="text-xs text-white/55 mt-0.5">
              Train {w.trainId} · {w.route} · → {w.receiver}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            Risk Score
          </div>
          <div className="text-3xl font-bold text-ember tabular-nums">
            {w.criticalityScore}
          </div>
          <div className="text-xs text-white/40 mt-1">
            Status: <span className="text-white">{w.humanStatus}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportField label="Delay" value={`${w.delayHours} hours`} />
        <ReportField label="Backup window" value={`${w.backupHours} hours`} />
        <ReportField label="Cargo category" value={w.cargoCategory} />
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Block icon={<FileText className="size-3.5" />} label="Risk Reasoning">
          {w.riskReasoning}
        </Block>
        <Block icon={<FileText className="size-3.5" />} label="Recommendation Reason">
          {w.recommendationReason}
        </Block>
      </div>

      <div className="mt-5">
        <Block icon={<FileText className="size-3.5" />} label="Explainable Recommendation">
          This shipment is <strong className={w.risk === "Critical" ? "text-[#ff1e1e]" : "text-white"}>{w.risk}</strong> because {w.reason} The downstream impact is {w.impact}
        </Block>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RerouteMap destination={w.receiver} />
        <div className="glass-ember rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#ff6b00] font-semibold mb-2">
              AI Recommended Action
            </div>
            <p className="font-semibold text-lg">{w.recommendedAction}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 btn-ember hover:btn-ember-hover active:btn-ember-active self-start text-sm py-2 px-5"
          >
            Approve Action
          </button>
        </div>
      </div>

      <ActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} w={w} />
    </article>
  );
}

function Cover({ label, value, tone }: { label: string; value: string; tone?: "critical" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">{label}</div>
      <div className={`mt-1 font-bold ${tone === "critical" ? "text-ember text-2xl" : "text-xl"}`}>
        {value}
      </div>
    </div>
  );
}

function ReportField({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function Block({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-white/40 flex items-center gap-1.5 mb-2">
        {icon} {label}
      </div>
      <p className="text-sm text-white/85 leading-relaxed">{children}</p>
    </div>
  );
}