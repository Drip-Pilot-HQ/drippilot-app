"use client";

import { cn } from "@/lib/utils";
import { Lead } from "@/types/lead";

interface EnrollLeadsRowProps {
  lead: Lead;
  isSelected: boolean;
  onToggle: () => void;
}

export function EnrollLeadsRow({
  lead,
  isSelected,
  onToggle,
}: EnrollLeadsRowProps) {
  const initial = (lead.name ||
    lead.firstName ||
    lead.email ||
    "?")[0].toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 cursor-pointer -mx-6 px-6 hover:bg-slate-50 transition-colors",
        isSelected && "bg-primary/5",
      )}
      onClick={onToggle}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="rounded w-4 h-4 accent-primary cursor-pointer shrink-0"
      />
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate leading-none mb-0.5">
          {lead.name ||
            `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
            "—"}
        </p>
        <p className="text-xs text-slate-400 font-medium truncate">
          {lead.email || lead.phone || "—"}
        </p>
      </div>
    </div>
  );
}
