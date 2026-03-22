"use client";

import { ArrowUpAZ, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawerSortBy = "createdAt" | "updatedAt" | "name" | "natural";
export type DrawerSortOrder = "asc" | "desc";

const SORT_OPTIONS: { label: string; value: DrawerSortBy }[] = [
  { label: "Natural Sort", value: "natural" },
  { label: "Most Recent", value: "updatedAt" },
  { label: "Creation Date", value: "createdAt" },
  { label: "Alphabetic", value: "name" },
];

const SORT_LABELS: Record<DrawerSortBy, string> = {
  natural: "Natural",
  updatedAt: "Recent",
  createdAt: "Date",
  name: "Alpha",
};

interface TemplateDrawerSortMenuProps {
  sortBy: DrawerSortBy;
  sortOrder: DrawerSortOrder;
  onSortByChange: (v: DrawerSortBy) => void;
  onSortOrderToggle: () => void;
}

export function TemplateDrawerSortMenu({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderToggle,
}: TemplateDrawerSortMenuProps) {
  return (
    <div className="relative group/sort inline-block">
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:border-primary/30 transition-all text-xs font-bold shadow-sm"
      >
        <ArrowUpAZ className="w-3.5 h-3.5 text-slate-400 group-hover/sort:text-primary transition-colors" />
        {SORT_LABELS[sortBy]}
        <ChevronDown className="w-3 h-3 text-slate-400 transition-transform group-hover/sort:rotate-180 duration-300" />
      </button>

      <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSortByChange(opt.value)}
            className={cn(
              "w-full text-left px-4 py-2 text-xs font-bold transition-all",
              sortBy === opt.value
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            {opt.label}
          </button>
        ))}
        <div className="h-px bg-slate-100 my-1 mx-2" />
        <button
          type="button"
          onClick={onSortOrderToggle}
          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
        >
          Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
    </div>
  );
}
