"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

interface LeadsEnrolledPaginationProps {
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
  leadsOnPage: number;
}

export function LeadsEnrolledPagination({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  leadsOnPage,
}: LeadsEnrolledPaginationProps) {
  if (!pagination || pagination.total === 0) return null;

  const hasPrev = page > 1;
  const hasNext = page < pagination.totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
      <div className="flex items-center gap-4">
        <p className="text-sm text-slate-400 font-bold whitespace-nowrap">
          Showing <span className="text-slate-900">{leadsOnPage}</span> of{" "}
          <span className="text-slate-900">{pagination.total}</span> enrolled
        </p>
        <div className="h-4 w-px bg-slate-200 hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-1">
            Rows:
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
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={!hasPrev}
          onClick={() => onPageChange((p) => p - 1)}
          className="w-8 h-8 p-0 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-black text-xs">
          {page}
        </span>
        <Button
          variant="outline"
          disabled={!hasNext}
          onClick={() => onPageChange((p) => p + 1)}
          className="w-8 h-8 p-0 rounded-lg"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
