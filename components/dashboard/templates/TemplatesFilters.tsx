"use client";

import { useState } from "react";
import { Filter, Mail, MessageSquare } from "lucide-react";
import { TemplateChannel } from "@/types/template";
import { cn } from "@/lib/utils";

interface TemplatesFiltersProps {
  selectedChannel: TemplateChannel | "all";
  onChannelChange: (channel: TemplateChannel | "all") => void;
}

export function TemplatesFilters({
  selectedChannel,
  onChannelChange,
}: TemplatesFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm w-full sm:w-auto justify-center",
          selectedChannel !== "all" || isOpen
            ? "bg-primary/5 border-primary text-primary"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
        )}
      >
        <Filter className="w-4 h-4" />
        Channel{" "}
        {selectedChannel !== "all" && `(${selectedChannel.toUpperCase()})`}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-2 border-b border-slate-50 mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Filter by Channel
              </p>
            </div>

            <button
              onClick={() => {
                onChannelChange("all");
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                selectedChannel === "all"
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span>All Channels</span>
              {selectedChannel === "all" && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>

            <button
              onClick={() => {
                onChannelChange(TemplateChannel.EMAIL);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                selectedChannel === TemplateChannel.EMAIL
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Templates</span>
              </div>
              {selectedChannel === TemplateChannel.EMAIL && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>

            <button
              onClick={() => {
                onChannelChange(TemplateChannel.SMS);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                selectedChannel === TemplateChannel.SMS
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SMS Templates</span>
              </div>
              {selectedChannel === TemplateChannel.SMS && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
