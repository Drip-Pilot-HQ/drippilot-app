"use client";

import { useState } from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LeadSortField = "createdAt" | "updatedAt" | "name" | "tags";
export type LeadSortOrder = "asc" | "desc";

interface LeadsSortProps {
  sortBy: LeadSortField;
  sortOrder: LeadSortOrder;
  onSortChange: (field: LeadSortField, order: LeadSortOrder) => void;
}

export function LeadsSort({ sortBy, sortOrder, onSortChange }: LeadsSortProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "Newest Created", field: "createdAt", order: "desc" },
    { label: "Oldest Created", field: "createdAt", order: "asc" },
    { label: "Name (A-Z)", field: "name", order: "asc" },
    { label: "Name (Z-A)", field: "name", order: "desc" },
    { label: "Tags (A-Z)", field: "tags", order: "asc" },
    { label: "Tags (Z-A)", field: "tags", order: "desc" },
  ] as const;

  const currentOption =
    options.find((opt) => opt.field === sortBy && opt.order === sortOrder) ||
    options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm w-full sm:w-auto justify-between sm:justify-center min-w-[180px]",
          isOpen
            ? "bg-primary/5 border-primary text-primary"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
        )}
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4" />
          <span>Sort by: {currentOption.label}</span>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
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
                Sort Options
              </p>
            </div>
            {options.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  onSortChange(option.field, option.order as LeadSortOrder);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                  sortBy === option.field && sortOrder === option.order
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <span>{option.label}</span>
                {sortBy === option.field && sortOrder === option.order && (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
