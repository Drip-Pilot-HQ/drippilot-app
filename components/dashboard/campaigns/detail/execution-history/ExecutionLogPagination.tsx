"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { cn } from "@/lib/utils";

interface ExecutionLogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  showingResults: number;
  limit: number;
  onPageChange: (page: number | ((p: number) => number)) => void;
  onLimitChange: (limit: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ExecutionLogPagination({
  currentPage,
  totalResults,
  showingResults,
  limit,
  onPageChange,
  onLimitChange,
  hasPrev,
  hasNext,
}: ExecutionLogPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full sm:w-auto">
        <p className="text-sm text-slate-400 font-medium whitespace-nowrap">
          Showing{" "}
          <span className="text-slate-700 font-semibold">{showingResults}</span>{" "}
          of{" "}
          <span className="text-slate-700 font-semibold">{totalResults}</span>{" "}
          logs
        </p>
        <div className="h-4 w-px bg-slate-200 hidden xs:block" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1">Rows:</span>
          {[100, 500].map((s) => (
            <button
              key={s}
              onClick={() => onLimitChange(s)}
              className={cn(
                "w-8 h-7 rounded-md text-xs font-medium transition-all border",
                limit === s
                  ? "bg-primary text-white border-primary"
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
        <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-xs">
          {currentPage}
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
