"use client";

import { Users } from "lucide-react";
import { Lead } from "@/types/lead";
import { EnrollLeadsRow } from "./EnrollLeadsRow";
import { IndeterminateCheckbox } from "../common/IndeterminateCheckbox";

interface EnrollLeadsListProps {
  isLoading: boolean;
  leads: Lead[];
  selectedIds: Set<string>;
  allOnPageSelected: boolean;
  someSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export function EnrollLeadsList({
  isLoading,
  leads,
  selectedIds,
  allOnPageSelected,
  someSelected,
  onToggleSelect,
  onToggleSelectAll,
}: EnrollLeadsListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-4 h-4 rounded bg-slate-100 animate-pulse shrink-0" />
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
                <div className="h-2.5 w-44 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-sm font-black text-slate-900 mb-1">
            No leads found
          </p>
          <p className="text-xs text-slate-400 font-medium">
            Try a different search term
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6">
      <div>
        {/* Select-all row */}
        <div
          className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-slate-50 -mx-6 px-6"
          onClick={onToggleSelectAll}
        >
          <IndeterminateCheckbox
            checked={allOnPageSelected}
            indeterminate={someSelected}
            onChange={onToggleSelectAll}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : "Select all on page"}
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {leads.map((lead) => (
            <EnrollLeadsRow
              key={lead.id}
              lead={lead}
              isSelected={selectedIds.has(lead.id)}
              onToggle={() => onToggleSelect(lead.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
