import { useEffect, useState } from "react";
import logo from "@/assets/RRAI-logo.png";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"boot" | "network" | "fade">("boot");
  const [text, setText] = useState("");

  // Typing effect for boot
  useEffect(() => {
    if (phase !== "boot") return;
    const fullText = "> CONNECTING TO RAIL NETWORK...";
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("network"), 100);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [phase]);

  // Phase transitions
  useEffect(() => {
    if (phase === "network") {
      const t = setTimeout(() => setPhase("fade"), 1200); // 1.2s of network animation
      return () => clearTimeout(t);
    }
    if (phase === "fade") {
      const t = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  // Generate deterministic but organic-looking nodes
  const nodes = Array.from({ length: 30 }).map((_, i) => {
    // Seeded math so it doesn't jitter
    const x = 5 + ((Math.sin(i * 12.34) + 1) / 2) * 90;
    const y = 5 + ((Math.cos(i * 43.21) + 1) / 2) * 90;
    const size = (Math.sin(i) + 1) > 1.6 ? 4 : 2;
    return { id: i, x, y, size };
  });

  const lines = nodes.slice(0, 15).map((n, i) => {
    const target = nodes[(i + 7) % nodes.length];
    return { id: i, x1: n.x, y1: n.y, x2: target.x, y2: target.y };
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden transition-opacity duration-500 ${
        phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Inline styles for custom intricate keyframes */}
      <style>{`
        @keyframes draw-line {
          0% { stroke-dashoffset: 200; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* PHASE 1: BOOT TERMINAL */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-[#ff6b00] font-mono text-sm tracking-widest transition-opacity duration-300 ${
          phase === "boot" ? "opacity-100" : "opacity-0"
        }`}
      >
        <img src={logo} alt="RailRisk AI Logo" className="w-20 h-20 mb-8 object-contain drop-shadow-[0_0_20px_rgba(255,107,0,0.4)] animate-pulse-ember" />
        <div className="w-80">
          {text}
          <span className="animate-pulse">_</span>
        </div>
        {/* Boot Progress Bar */}
        <div className="w-80 h-1 bg-white/10 mt-5 rounded-full overflow-hidden">
           <div 
             className="h-full bg-[#ff6b00] transition-all duration-[800ms] ease-out" 
             style={{ width: phase === "boot" ? (text.length > 15 ? '100%' : '30%') : '100%' }} 
           />
        </div>
      </div>

      {/* PHASE 2: NETWORK RADAR */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          phase === "network" ? "opacity-100 scale-100" : phase === "fade" ? "opacity-0 scale-110" : "opacity-0 scale-90"
        }`}
      >
        {/* Radar concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
           <div className="w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] border border-[#ff6b00]/30 rounded-full absolute" />
           <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border border-[#ff6b00]/20 rounded-full absolute" />
           <div className="w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] border border-[#ff6b00]/40 rounded-full absolute border-dashed" />
           
           {/* Sweeping radar cone */}
           <div 
             className="absolute w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full"
             style={{
               background: "conic-gradient(from 0deg, transparent 70%, rgba(255,107,0,0.25) 100%)",
               animation: "radar-spin 2s linear infinite"
             }}
           />
        </div>

        <svg className="absolute inset-0 w-full h-full">
          {lines.map((line, idx) => (
            <line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="url(#line-glow)"
              strokeWidth="2.5"
              strokeDasharray="200"
              strokeDashoffset="200"
              style={{
                 animation: phase !== "boot" ? `draw-line 1.5s ease-out forwards ${(idx * 0.04)}s` : "none"
              }}
            />
          ))}
          {nodes.map((n, idx) => (
            <circle
              key={n.id}
              cx={`${n.x}%`}
              cy={`${n.y}%`}
              r={n.size}
              fill="#fff"
              className="transition-opacity duration-500"
              style={{ 
                opacity: phase !== "boot" ? Math.random() * 0.5 + 0.5 : 0,
                transitionDelay: `${idx * 0.02}s`
              }}
            />
          ))}
          <defs>
            <linearGradient id="line-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff1e1e" />
              <stop offset="50%" stopColor="#ff6b00" />
              <stop offset="100%" stopColor="#ffb03a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Data readout overlay */}
        <div className="absolute top-10 left-10 font-mono text-[10px] sm:text-xs text-[#ff6b00]/80 leading-loose hidden sm:block">
          <div className="mb-2 text-white font-bold tracking-[0.2em] opacity-80">INTELLIGENCE_ROUTING</div>
          <div className="animate-pulse">MAPPING CRITICAL NODES... [OK]</div>
          <div style={{ animationDelay: '0.4s' }}>ESTABLISHING DELAY PROPAGATION... [OK]</div>
          <div style={{ animationDelay: '0.8s' }} className="text-[#ff1e1e]">CALCULATING DOWNSTREAM IMPACT... [ACTIVE]</div>
        </div>
      </div>

      {/* Persistent high-tech scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
    </div>
  );
}
