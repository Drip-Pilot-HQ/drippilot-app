"use client";

import { useState } from "react";
import { BookOpen, MessageCircle, BookMarked, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQSection } from "./faq/FAQSection";
import { CrispChatPanel } from "./chat/CrispChatPanel";

type Tab = "faq" | "chat";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "faq", label: "Browse Help", icon: BookOpen },
  { id: "chat", label: "Live Chat", icon: MessageCircle },
];

export function SupportPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>("faq");

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Help &amp; Support
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Find answers instantly or chat with our team
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            <BookMarked className="w-3 h-3 text-primary" />
            14 Articles
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            <Clock className="w-3 h-3 text-secondary" />
            Avg. 2h Reply
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            <Zap className="w-3 h-3 text-accent" />
            Free Support
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200",
              activeTab === id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div>
        {activeTab === "faq" && <FAQSection />}
        {activeTab === "chat" && <CrispChatPanel />}
      </div>
    </div>
  );
}
