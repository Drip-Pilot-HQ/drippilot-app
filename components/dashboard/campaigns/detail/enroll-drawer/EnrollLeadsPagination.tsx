"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

interface EnrollLeadsPaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  page: number;
  limit: number;
  onPageChange: (p: number | ((prev: number) => number)) => void;
  onLimitChange: (l: number) => void;
}

export function EnrollLeadsPagination({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: EnrollLeadsPaginationProps) {
  if (!pagination || pagination.total === 0) return null;

  const hasPrev = page > 1;
  const hasNext = page < pagination.totalPages;

  return (
    <div className="px-5 py-3 border-t border-slate-100 shrink-0 space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-1">
            Limit:
          </span>
          {[20, 50, 100, 500].map((s) => (
            <button
              key={s}
              onClick={() => onLimitChange(s)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-black transition-all border",
                limit === s
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-slate-400 border-slate-100 hover:border-slate-200",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-[11px] font-bold text-slate-400">
          Page {page} of {pagination.totalPages}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={!hasPrev}
          onClick={() => onPageChange((p) => p - 1)}
          className="flex-1 h-9 rounded-xl gap-2 font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!hasNext}
          onClick={() => onPageChange((p) => p + 1)}
          className="flex-1 h-9 rounded-xl gap-2 font-bold"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
