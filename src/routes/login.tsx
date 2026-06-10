import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Radio } from "lucide-react";
import { useState } from "react";

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
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -right-40 size-[600px] rounded-full bg-[#ff1e1e]/20 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-[#ff6b00]/15 blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
          <div className="size-9 rounded-xl glass-ember flex items-center justify-center">
            <Radio className="size-4 text-[#ff6b00]" />
          </div>
          <div className="font-bold tracking-tight">
            RailRisk<span className="text-ember"> AI</span>
          </div>
        </Link>

        <div className="glass-ember rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 -bottom-32 h-64 bg-gradient-to-t from-[#ff1e1e]/30 to-transparent blur-3xl pointer-events-none" />
          <div className="relative">
            <h1 className="text-3xl font-bold">Welcome back.</h1>
            <p className="text-sm text-white/60 mt-2">
              Sign in to access your control room.
            </p>

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-[#ff1e1e]/60 transition"
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
                  className="glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-[#ff1e1e]/60 transition"
                />
              </label>

              <button
                type="submit"
                className="btn-ember justify-center mt-2 hover:scale-[1.02] transition-transform"
              >
                Enter control room <ArrowUpRight className="size-4" />
              </button>
            </form>

            <p className="mt-6 text-xs text-white/40 text-center">
              Demo mode — any credentials open the dashboard.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-white/50">
          <Link to="/" className="hover:text-white transition">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
