import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Radio } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/RRAI-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — RailRisk AI" },
      { name: "description", content: "Sign in to the RailRisk AI control room." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("controller@railrisk.ai");
  const [password, setPassword] = useState("demo");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("showSplash", "true");
    }
    navigate({ to: "/dashboard" });
  };

  const handleReset = () => {
    sessionStorage.clear();
    alert("Development: Session storage cleared. All wagons reset to idle state.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -right-40 size-[600px] rounded-full bg-[#ff1e1e]/20 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-[#ff6b00]/15 blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center mb-8">
          <img src={logo} alt="RailRisk AI Logo" className="h-10 object-contain drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]" />
        </Link>

        <div className="glass-ember rounded-3xl p-8 relative overflow-hidden animate-scale-in">
          <div className="absolute inset-x-0 -bottom-32 h-64 bg-gradient-to-t from-[#ff1e1e]/30 to-transparent blur-3xl pointer-events-none" />
          <div className="relative">
            <h1 className="text-3xl font-bold">Welcome back.</h1>
            <p className="text-sm text-white/60 mt-2">Sign in to access your control room.</p>

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-[#ff1e1e]/60 focus:shadow-[0_0_12px_rgba(255,30,30,0.2)] transition-all duration-300"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                  Password
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-[#ff1e1e]/60 focus:shadow-[0_0_12px_rgba(255,30,30,0.2)] transition-all duration-300"
                />
              </label>

              <button
                type="submit"
                className="btn-ember justify-center mt-2 hover:btn-ember-hover active:btn-ember-active"
              >
                Enter control room <ArrowUpRight className="size-4" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-white/40 mb-2">
                Demo mode — any credentials open the dashboard.
              </p>
              <button 
                onClick={handleReset}
                type="button"
                className="text-[10px] text-[#ff1e1e]/60 hover:text-[#ff1e1e] uppercase tracking-wider font-semibold transition-colors"
              >
                [Dev: Reset All Wagon Data]
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-white/50">
          <Link to="/" className="hover:text-white transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
