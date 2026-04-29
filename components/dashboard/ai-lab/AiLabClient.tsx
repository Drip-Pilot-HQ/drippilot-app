"use client";

import { useState } from "react";
import { Sparkles, History } from "lucide-react";
import { AiGenerator } from "./AiGenerator";
import { AiJobsHistory } from "./AiJobsHistory";
import { cn } from "@/lib/utils";

export function AiLabClient() {
  const [activeTab, setActiveTab] = useState<"generator" | "history">(
    "generator",
  );
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const handleJobStarted = (jobId: string) => {
    setActiveJobId(jobId);
    setActiveTab("history");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header section matches Campaigns page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              AI Campaign Lab
              <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                BETA
              </span>
            </h1>
          </div>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            Describe your objective and let the magic happen
          </p>
        </div>

        <div className="flex w-full md:w-auto bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("generator")}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === "generator"
                ? "bg-white text-orange-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Sparkles className="w-4 h-4" />
            Generator
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === "history"
                ? "bg-white text-orange-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <History className="w-4 h-4" />
            Jobs & History
          </button>
        </div>
      </div>

      <div>
        {activeTab === "generator" ? (
          <AiGenerator onJobStarted={handleJobStarted} />
        ) : (
          <AiJobsHistory activeJobId={activeJobId} />
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
          This AI campaign generation feature is in beta mode so enjoy freely
          using this feature for the ongoing moment, but Drip Pilot reserves the
          right to change the feature to paid or apply usage limits in the
          future.
        </p>
      </div>
    </div>
  );
}
