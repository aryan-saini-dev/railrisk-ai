import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { fetchWagons, type Wagon } from "@/lib/railrisk-data";
import { updateActionStatus } from "@/lib/api-client";
import ReactMarkdown from "react-markdown";

export function DataChatDrawer({ 
  isOpen, 
  onClose, 
  urgentWagonId, 
  urgentTriggerToken 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  urgentWagonId?: string; 
  urgentTriggerToken?: string; 
}) {
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Hello! I am your RailRisk Data Assistant. Ask me anything about the currently tracked delays, criticality scores, or recommended actions." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [wagonData, setWagonData] = useState<Wagon[]>([]);
  const lastProcessedTokenRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      fetchWagons().then(setWagonData);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && urgentWagonId && urgentTriggerToken && urgentTriggerToken !== lastProcessedTokenRef.current) {
      lastProcessedTokenRef.current = urgentTriggerToken;
      const urgentMessage = `Urgent Alert: Shipment ${urgentWagonId}'s delay has increased drastically. I have analyzed the cascade risk and it is now Critical. Recommended Action: Reroute via priority freight or alert backup facilities immediately. Do you approve this plan? [DECISION_PROMPT: ${urgentWagonId}]`;
      
      setMessages(prev => [...prev, { role: "model", text: urgentMessage }]);
    }
  }, [isOpen, urgentWagonId, urgentTriggerToken]);

  const SYSTEM_PROMPT = `You are an AI assistant for the RailRisk platform. You help controllers query live data. Here is the JSON dataset of delayed shipments: ${JSON.stringify(wagonData)}. Answer queries based only on this data. Be concise and helpful. CRITICAL INSTRUCTION: If the user asks whether they should approve, deny, or take action on a specific shipment (e.g., FRT-1001), provide your reasoning and append exactly "[DECISION_PROMPT: FRT-XXXX]" (where FRT-XXXX is the shipment ID) at the very end of your response to allow them to take action from the chat.`;

  async function callOpenRouter(userMessage: string): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("No OpenRouter key");

    const chatHistory = messages.slice(1).map(m => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.text,
    }));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "RailRisk AI",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...chatHistory,
          { role: "user", content: userMessage },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "OpenRouter request failed");
    return data.choices?.[0]?.message?.content || "No response generated.";
  }

  async function callGemini(userMessage: string): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("No Gemini key");

    const history = messages.slice(1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [...history, { role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.2 },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Gemini request failed");
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // Try OpenRouter first (free tier, higher limits), fall back to Gemini
      let modelText: string;
      try {
        modelText = await callOpenRouter(userMessage);
      } catch {
        modelText = await callGemini(userMessage);
      }
      setMessages(prev => [...prev, { role: "model", text: modelText }]);
    } catch (err: any) {
      setError(err.message);
      setMessages(prev => [...prev, { role: "model", text: "Sorry, I encountered an error. Both APIs are temporarily unavailable. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#050505]/95 border-l border-white/10 shadow-[0_0_40px_rgba(255,30,30,0.15)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-br from-[#ff6b00] to-[#ff1e1e] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,30,30,0.4)]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="font-bold text-white leading-tight">Data Assistant</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Gemini 2.0 Flash via OpenRouter</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-full">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#ff1e1e]/10 border border-[#ff1e1e]/30 text-[#ff1e1e] text-xs">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {messages.map((m, i) => {
            const decisionMatch = m.text.match(/\[DECISION_PROMPT:\s*(FRT-\d+)\]/i);
            const textWithoutPrompt = m.text.replace(/\[DECISION_PROMPT:\s*(FRT-\d+)\]/i, "").trim();

            return (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-8 rounded-full shrink-0 flex items-center justify-center mt-1 ${m.role === "user" ? "bg-white/10" : "bg-[#ff1e1e]/20 text-[#ff1e1e]"}`}>
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${m.role === "user" ? "bg-[#ff1e1e]/20 text-white rounded-tr-none border border-[#ff1e1e]/30" : "bg-white/[0.05] border border-white/5 rounded-tl-none text-white/85"}`}>
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 last:mb-0 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 last:mb-0 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                    }}
                  >
                    {textWithoutPrompt}
                  </ReactMarkdown>
                  
                  {decisionMatch && m.role === "model" && (
                    <ChatDecisionButtons 
                      wagonId={decisionMatch[1].toUpperCase()} 
                      onActionTaken={(msg) => setMessages(prev => [...prev, { role: "user", text: msg }])}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3">
              <div className="size-8 rounded-full shrink-0 bg-[#ff1e1e]/20 text-[#ff1e1e] flex items-center justify-center mt-1">
                <Bot className="size-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/5 rounded-tl-none flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse" />
                <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="size-1.5 rounded-full bg-[#ff1e1e] animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about delayed wagons..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff1e1e]/50 focus:shadow-[0_0_15px_rgba(255,30,30,0.2)] transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff1e1e] to-[#ff6b00] text-white hover:brightness-110 disabled:opacity-50 transition-all"
            >
              <Send className="size-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function ChatDecisionButtons({ wagonId, onActionTaken }: { wagonId: string; onActionTaken?: (msg: string) => void }) {
  const [status, setStatus] = useState<"idle" | "approved" | "denied">("idle");

  useEffect(() => {
    setStatus((sessionStorage.getItem(`action_${wagonId}`) as any) || "idle");
    
    // Listen for storage changes from other components (e.g. the main page modal)
    const handleStorageChange = () => {
      setStatus((sessionStorage.getItem(`action_${wagonId}`) as any) || "idle");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [wagonId]);

  const handleAction = async (action: "approve" | "deny") => {
    const newStatus = action === "approve" ? "approved" : "denied";
    sessionStorage.setItem(`action_${wagonId}`, newStatus);
    setStatus(newStatus);
    // Dispatch a custom event because same-window storage events are not always triggered
    window.dispatchEvent(new Event("storage"));
    
    try {
      await updateActionStatus(wagonId, newStatus);
    } catch (err) {
      console.error("Failed to update action status on backend:", err);
    }

    if (onActionTaken) onActionTaken(action === "approve" ? `I have approved the action for ${wagonId}.` : `I have denied the action for ${wagonId}.`);
  };

  const handleEdit = async () => {
    sessionStorage.removeItem(`action_${wagonId}`);
    setStatus("idle");
    window.dispatchEvent(new Event("storage"));
    
    try {
      await updateActionStatus(wagonId, "Pending");
    } catch (err) {
      console.error("Failed to reset action status on backend:", err);
    }

    if (onActionTaken) onActionTaken(`I am rethinking my decision for ${wagonId}. The action is pending again.`);
  };

  if (status === "approved") {
    return (
      <div className="mt-4 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-between gap-1.5 animate-fade-up">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-4" /> Action Approved for {wagonId}
        </div>
        <button onClick={handleEdit} className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors">Edit</button>
      </div>
    );
  }
  
  if (status === "denied") {
    return (
      <div className="mt-4 p-2.5 rounded-lg border border-[#ff1e1e]/30 bg-[#ff1e1e]/10 text-[#ff1e1e] text-xs font-bold flex items-center justify-between gap-1.5 animate-fade-up">
        <div className="flex items-center gap-1.5">
          <X className="size-4" /> Action Denied for {wagonId}
        </div>
        <button onClick={handleEdit} className="px-2 py-1 rounded bg-[#ff1e1e]/20 hover:bg-[#ff1e1e]/30 transition-colors">Edit</button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-3 rounded-xl bg-black/20 border border-white/5 shadow-inner">
      <div className="text-[10px] uppercase tracking-wider text-white/50 mb-2 font-semibold text-center">
        Decision Required: {wagonId}
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => handleAction("deny")} 
          className="flex-1 py-2 rounded-lg bg-[#ff1e1e]/10 text-[#ff1e1e] hover:bg-[#ff1e1e]/20 border border-[#ff1e1e]/30 text-xs font-bold transition-all"
        >
          Deny
        </button>
        <button 
          onClick={() => handleAction("approve")} 
          className="flex-[2] py-2 rounded-lg bg-gradient-to-r from-[#ff6b00] to-[#ff1e1e] text-white hover:brightness-110 shadow-[0_0_15px_rgba(255,30,30,0.3)] text-xs font-bold transition-all"
        >
          Approve Action
        </button>
      </div>
    </div>
  );
}
