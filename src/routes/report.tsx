import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Printer, ShieldAlert } from "lucide-react";
import { AppShell, RiskBadge } from "@/components/AppShell";
import { wagons } from "@/lib/railrisk-data";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "RailRisk Report — RailRisk AI" },
      {
        name: "description",
        content: "Generated risk report summarising critical wagons, impact and recommended actions.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const critical = wagons.filter((w) => w.risk === "Critical" || w.risk === "High");

  return (
    <AppShell>
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#ff6b00] mb-2">
            Generated Briefing
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">RailRisk Report</h1>
          <p className="text-white/55 mt-2 max-w-2xl">
            Snapshot of currently elevated wagons with cargo risk, impact and recommended action.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="glass rounded-full px-4 py-2 flex items-center gap-2 text-sm">
            <Printer className="size-4" /> Print
          </button>
          <button className="btn-ember text-sm">
            <Download className="size-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Cover summary */}
      <div className="glass-ember rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[#ff1e1e]/25 blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
          <Cover label="Report ID" value="RR-2026-06-10-A" />
          <Cover label="Generated" value="10 Jun 2026 · 14:32 IST" />
          <Cover label="Elevated Wagons" value={`${critical.length}`} />
          <Cover label="Overall posture" value="Critical" tone="critical" />
        </div>
      </div>

      {/* Per-wagon report cards */}
      <div className="flex flex-col gap-5">
        {critical
          .sort((a, b) => b.criticalityScore - a.criticalityScore)
          .map((w) => (
            <article
              key={w.id}
              className="glass rounded-3xl p-6 relative overflow-hidden"
            >
              {w.risk === "Critical" && (
                <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#ff6b00] to-[#ff1e1e] ember-glow-sm" />
              )}
              <header className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl glass-ember flex items-center justify-center font-bold text-sm">
                    {w.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-lg">{w.cargo}</h2>
                      <RiskBadge level={w.risk} />
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
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportField label="Delay" value={`${w.delayHours} hours`} />
                <ReportField label="Backup window" value={`${w.backupHours} hours`} />
                <ReportField label="Cargo category" value={w.cargoCategory} />
              </div>

              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Block icon={<ShieldAlert className="size-3.5" />} label="Possible Impact">
                  {w.impact}
                </Block>
                <Block icon={<FileText className="size-3.5" />} label="Reasoning">
                  {w.reason}
                </Block>
              </div>

              <div className="mt-5 glass-ember rounded-2xl p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#ff6b00] font-semibold mb-1">
                  Recommended Action
                </div>
                <p className="font-semibold">{w.recommendedAction}</p>
              </div>
            </article>
          ))}
      </div>
    </AppShell>
  );
}

function Cover({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "critical";
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">{label}</div>
      <div
        className={`mt-1 font-bold ${tone === "critical" ? "text-ember text-2xl" : "text-xl"}`}
      >
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
