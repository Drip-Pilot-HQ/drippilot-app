"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  X,
  MessageCircle,
  Minimize2,
  Maximize2,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAccountStore } from "@/store/client/useAccountStore";

interface Message {
  role: "user" | "bot";
  content: string;
}

export function DripBotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    let botMessage = "";
    setMessages((prev) => [...prev, { role: "bot", content: "" }]);

    try {
      const { activeWorkspaceId } = useAccountStore.getState();
      if (!activeWorkspaceId) {
        toast.error("No workspace selected");
        setIsTyping(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const url = new URL(`${baseUrl}/ai/chat`);
      url.searchParams.append("message", userMessage);
      url.searchParams.append("channel", "email");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "x-workspace-id": activeWorkspaceId,
          Accept: "text/event-stream",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to connect to Drip Pilot");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);
              if (data.chunk) {
                botMessage += data.chunk;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  return [
                    ...prev.slice(0, -1),
                    { ...last, content: botMessage },
                  ];
                });
              }
              if (data.error) toast.error("AI: " + data.error);
            } catch {
              // Partial JSON or heartbeat
            }
          }
        }
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Chat error", error);
      setIsTyping(false);
      toast.error("Drip Pilot is busy - try again shortly");
    }
  };

  if (!isOpen) {
    return (
      <button
        data-onboarding="dripbot-chat-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-zinc-950 text-white shadow-xl hover:scale-105 hover:bg-zinc-900 transition-all z-50 flex items-center justify-center group border border-white/10"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 overflow-hidden",
        isMinimized ? "h-14" : "h-[500px] max-h-[80vh]",
      )}
    >
      {/* Header */}
      <div className="p-3 bg-zinc-950 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white leading-none mb-1">
              Drip Pilot
            </h3>
            <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Training
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-zinc-500 hover:text-white transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-zinc-500 hover:text-rose-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="px-3 py-1.5 bg-zinc-900 text-[8px] font-black uppercase text-zinc-500 tracking-wider text-center border-b border-white/5">
            Testing Mode • Ephemeral Session
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-30 select-none">
                <BrainCircuit className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-xs font-bold text-slate-900 mb-1 uppercase tracking-widest">
                  Awaiting Input
                </p>
                <p className="text-[11px] font-medium leading-relaxed">
                  Test my training by asking about your docs...
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col group animate-in slide-in-from-bottom-1 duration-200",
                    msg.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-xl text-sm leading-relaxed border shadow-sm",
                      msg.role === "user"
                        ? "bg-zinc-950 text-white border-zinc-950 rounded-tr-none"
                        : "bg-white text-slate-700 border-slate-200 rounded-tl-none",
                    )}
                  >
                    {msg.content || (
                      <div className="flex gap-1 py-1">
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Drip Pilot..."
                className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center hover:bg-primary transition-all disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
