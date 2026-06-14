import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Activity, X, Route as RouteIcon, AlertTriangle, ShieldAlert } from "lucide-react";
import { type Wagon } from "@/lib/railrisk-data";

export function RerouteMap({ destination }: { destination: string }) {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px] border border-white/5">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,107,0,0.3) 0%, transparent 60%)"
      }} />
      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2 flex items-center gap-2 relative z-10">
        <RouteIcon className="size-3" /> Live Reroute Map
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-6">
        <svg viewBox="0 0 300 100" className="w-full h-full max-h-[120px] overflow-visible">
          <defs>
            <style>
              {`
                @keyframes dash {
                  to { stroke-dashoffset: -20; }
                }
                .animate-dash {
                  animation: dash 1s linear infinite;
                }
              `}
            </style>
          </defs>

          {/* Blocked Original Path */}
          <path d="M 30 50 L 150 50" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <path d="M 150 50 L 270 50" stroke="rgba(255,30,30,0.4)" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Glowing Reroute Arc */}
          <path d="M 120 50 Q 195 0 270 50" fill="none" stroke="#ff6b00" strokeWidth="2" strokeDasharray="4 4" className="animate-dash" style={{ filter: "drop-shadow(0 0 4px rgba(255,107,0,0.5))" }} />

          {/* Nodes */}
          <circle cx="30" cy="50" r="4" fill="white" opacity="0.3" />
          {/* Pulsing blockage node */}
          <circle cx="150" cy="50" r="5" fill="#ff1e1e" className="animate-ping" style={{ transformOrigin: "150px 50px" }} />
          <circle cx="150" cy="50" r="5" fill="#ff1e1e" />
          
          <circle cx="270" cy="50" r="5" fill="#ff6b00" style={{ filter: "drop-shadow(0 0 6px rgba(255,107,0,0.8))" }} />
          
          {/* Labels */}
          <text x="30" y="70" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle">Origin</text>
          <text x="150" y="70" fill="#ff1e1e" fontSize="8" textAnchor="middle">Blockage</text>
          <text x="270" y="70" fill="#ff6b00" fontSize="8" textAnchor="middle">{destination.length > 12 ? destination.substring(0, 12) + '...' : destination}</text>
        </svg>
      </div>
    </div>
  );
}

export function ActionModal({ isOpen, onClose, w, onApprove, onDeny }: { isOpen: boolean; onClose: () => void; w: Wagon; onApprove?: () => void; onDeny?: () => void }) {
  const [executing, setExecuting] = useState<"approve" | "deny" | null>(null);
  const [status, setStatus] = useState<"idle" | "approved" | "denied">("idle");
  const [mounted, setMounted] = useState(false);

  // Use effect to only render on client side to avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen) return null;

  const handleAction = (action: "approve" | "deny") => {
    setExecuting(action);
    setTimeout(() => {
      setExecuting(null);
      setStatus(action === "approve" ? "approved" : "denied");
      if (action === "approve" && onApprove) onApprove();
      if (action === "deny" && onDeny) onDeny();
      setTimeout(() => {
        onClose();
        // Reset state after closing
        setTimeout(() => setStatus("idle"), 300);
      }, 1500);
    }, 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 isolate">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={!executing ? onClose : undefined} />
      <div className="relative w-full max-w-lg glass-ember rounded-3xl p-6 shadow-[0_0_80px_rgba(255,30,30,0.2)] animate-modal-pop border border-[#ff1e1e]/20">
        {!executing && status === "idle" && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="size-5 text-white/50" />
          </button>
        )}
        
        <div className="flex items-center gap-4 mb-6">
          <div className="size-12 rounded-full bg-gradient-to-br from-[#ff1e1e] to-[#ff6b00] flex items-center justify-center shadow-[0_0_20px_rgba(255,30,30,0.4)]">
            <Activity className="size-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Agentic Action</h3>
            <div className="text-xs text-[#ff6b00] uppercase tracking-wider font-semibold">RailRisk Decision Engine</div>
          </div>
        </div>
        
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#ff6b00]/30 bg-[#ff6b00]/10 text-xs font-semibold text-[#ff6b00]">
          <AlertTriangle className="size-3.5" />
          Dynamic Risk Alert: {w.risk} Level Detected
        </div>

        <div className="space-y-4 mb-8">
          <div className="glass rounded-xl p-4 bg-black/20">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Target Cargo Context</div>
            <div className="font-semibold text-lg">{w.cargo} <span className="text-white/40 text-sm font-normal">(Wagon {w.id})</span></div>
            <p className="text-sm text-white/50 mt-1">
              Currently {w.delayHours} hours delayed on {w.route}.
            </p>
          </div>
          <div className="glass rounded-xl p-4 bg-black/20 border border-[#ff6b00]/20">
            <div className="text-[10px] uppercase tracking-wider text-[#ff6b00] font-semibold mb-1">Proposed Execution</div>
            <div className="font-bold text-white text-lg">{w.recommendedAction}</div>
            <p className="text-sm text-white/60 mt-2 leading-relaxed">
              The AI will automatically issue a dispatch ticket to the terminal manager at {w.receiver} and arrange logistics to prevent the "{w.impact}" scenario.
            </p>
          </div>
        </div>

        {status === "approved" && (
          <div className="glass rounded-xl p-4 text-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold animate-fade-up">
            Action Approved & Dispatched!
          </div>
        )}
        {status === "denied" && (
          <div className="glass rounded-xl p-4 text-center border border-[#ff1e1e]/30 bg-[#ff1e1e]/10 text-[#ff1e1e] font-bold animate-fade-up">
            Action Denied & Escalated!
          </div>
        )}
        {status === "idle" && (
          <div>
            <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#ff6b00] animate-pulse">
              <ShieldAlert className="size-4" /> Status: Awaiting Human Approval
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleAction("deny")} 
                disabled={executing !== null}
                className="flex-1 glass hover:bg-[#ff1e1e]/20 active:bg-[#ff1e1e]/30 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 text-[#ff1e1e] border border-[#ff1e1e]/30"
              >
                {executing === "deny" ? <Activity className="size-4 animate-spin mx-auto" /> : "Deny Action"}
              </button>
              <button 
                onClick={() => handleAction("approve")}
                disabled={executing !== null}
                className="flex-[2] bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e] hover:brightness-110 active:brightness-90 py-3 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(255,30,30,0.3)] disabled:opacity-50 disabled:animate-pulse flex items-center justify-center gap-2"
              >
                {executing === "approve" ? (
                  <>
                    <Activity className="size-4 animate-spin" /> Approving...
                  </>
                ) : (
                  "Approve Action"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
