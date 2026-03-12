"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { CampaignStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";

interface CampaignsFiltersProps {
  selectedStatuses: CampaignStatus[];
  onToggleStatus: (status: CampaignStatus) => void;
  onClearAll: () => void;
}

export function CampaignsFilters({
  selectedStatuses,
  onToggleStatus,
  onClearAll,
}: CampaignsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm w-full sm:w-auto justify-center",
          selectedStatuses.length > 0 || isOpen
            ? "bg-primary/5 border-primary text-primary"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
        )}
      >
        <Filter className="w-4 h-4" />
        Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-2 border-b border-slate-50 mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Filter by Status
              </p>
            </div>
            {Object.values(CampaignStatus).map((status) => (
              <button
                key={status}
                onClick={() => onToggleStatus(status)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                  selectedStatuses.includes(status)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <span className="capitalize">{status}</span>
                {selectedStatuses.includes(status) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
            {selectedStatuses.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-50">
                <button
                  onClick={() => {
                    onClearAll();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 rounded-lg transition-all"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
