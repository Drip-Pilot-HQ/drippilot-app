"use client";

import {
  Search,
  ArrowUpDown,
  ChevronDown,
  Check,
  Trash2,
  Loader2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

type SortField = "enrolledAt" | "name";
type SortOrder = "asc" | "desc";

const SORT_OPTIONS = [
  {
    label: "Newest Enrolled",
    field: "enrolledAt" as SortField,
    order: "desc" as SortOrder,
  },
  {
    label: "Oldest Enrolled",
    field: "enrolledAt" as SortField,
    order: "asc" as SortOrder,
  },
  {
    label: "Name (A-Z)",
    field: "name" as SortField,
    order: "asc" as SortOrder,
  },
  {
    label: "Name (Z-A)",
    field: "name" as SortField,
    order: "desc" as SortOrder,
  },
] as const;

interface LeadsEnrolledToolbarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  isSortOpen: boolean;
  onToggleSort: () => void;
  onCloseSort: () => void;
  selectedIdsCount: number;
  isActive: boolean;
  isRemoving: boolean;
  onRemoveSelected: () => void;
  onOpenDrawer: () => void;
}

export function LeadsEnrolledToolbar({
  searchInput,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  isSortOpen,
  onToggleSort,
  onCloseSort,
  selectedIdsCount,
  isActive,
  isRemoving,
  onRemoveSelected,
  onOpenDrawer,
}: LeadsEnrolledToolbarProps) {
  const currentSort =
    SORT_OPTIONS.find((o) => o.field === sortBy && o.order === sortOrder) ??
    SORT_OPTIONS[0];

  return (
    <div className="flex flex-col md:flex-row sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search enrolled leads..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
        />
      </div>

      {/* Sort */}
      <div className="relative">
        <button
          onClick={onToggleSort}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-black transition-all shadow-sm min-w-[200px] justify-between uppercase tracking-tight",
            isSortOpen
              ? "bg-primary/5 border-primary text-primary"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            <span>{currentSort.label}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isSortOpen && "rotate-180",
            )}
          />
        </button>

        {isSortOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={onCloseSort} />
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-3xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-slate-50 mb-1 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Sort Result By
                </p>
              </div>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    onSortChange(opt.field, opt.order);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tight transition-all",
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

      {/* Action button */}
      {selectedIdsCount > 0 ? (
        <Button
          variant="outline"
          disabled={!isActive || isRemoving}
          onClick={onRemoveSelected}
          className="rounded-2xl h-11 px-6 text-rose-600 border-rose-200 hover:bg-rose-50 shrink-0 font-black uppercase text-xs tracking-widest shadow-sm"
        >
          {isRemoving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove {selectedIdsCount}
            </>
          )}
        </Button>
      ) : (
        <Button
          disabled={!isActive}
          onClick={onOpenDrawer}
          className="rounded-2xl h-11 px-6 shrink-0 shadow-lg shadow-primary/20 font-black uppercase text-xs tracking-widest"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Leads
        </Button>
      )}
    </div>
  );
}
