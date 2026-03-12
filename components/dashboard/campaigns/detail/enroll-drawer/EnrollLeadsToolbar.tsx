"use client";

import { Search, Filter, ArrowUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadStatus } from "@/types/lead";

interface EnrollLeadsToolbarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  isSortOpen: boolean;
  onToggleSort: () => void;
  onCloseSort: () => void;
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: "createdAt" | "name", order: "asc" | "desc") => void;
  selectedStatuses: LeadStatus[];
  selectedTags: string[];
  enrolableStatusesCount: number;
}

const SORT_OPTIONS = [
  { label: "Newest Created", field: "createdAt", order: "desc" },
  { label: "Oldest Created", field: "createdAt", order: "asc" },
  { label: "Name (A-Z)", field: "name", order: "asc" },
  { label: "Name (Z-A)", field: "name", order: "desc" },
] as const;

export function EnrollLeadsToolbar({
  searchInput,
  onSearchChange,
  isFilterOpen,
  onToggleFilter,
  isSortOpen,
  onToggleSort,
  onCloseSort,
  sortBy,
  sortOrder,
  onSortChange,
  selectedStatuses,
  selectedTags,
  enrolableStatusesCount,
}: EnrollLeadsToolbarProps) {
  return (
    <div className="px-6 py-4 shrink-0 space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
          />
        </div>
        <button
          onClick={onToggleFilter}
          className={cn(
            "w-11 h-11 rounded-xl border flex items-center justify-center transition-all shrink-0",
            isFilterOpen ||
              (selectedStatuses.length > 0 &&
                selectedStatuses.length !== enrolableStatusesCount) ||
              selectedTags.length > 0
              ? "bg-primary/5 border-primary text-primary"
              : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50",
          )}
        >
          <Filter className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={onToggleSort}
            className={cn(
              "w-11 h-11 rounded-xl border flex items-center justify-center transition-all",
              isSortOpen || sortBy !== "createdAt"
                ? "bg-primary/5 border-primary text-primary"
                : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50",
            )}
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>

          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onCloseSort} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Sort by
                  </p>
                </div>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      onSortChange(
                        opt.field as "createdAt" | "name",
                        opt.order as "asc" | "desc",
                      );
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                      sortBy === opt.field && sortOrder === opt.order
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {opt.label}
                    {sortBy === opt.field && sortOrder === opt.order && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
