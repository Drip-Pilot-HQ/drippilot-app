"use client";

import { useState } from "react";
import { Filter, Tag as TagIcon, X, Plus } from "lucide-react";
import { LeadStatus } from "@/types/lead";
import { cn } from "@/lib/utils";

interface LeadsFiltersProps {
  selectedStatuses: LeadStatus[];
  onToggleStatus: (status: LeadStatus) => void;
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onClearAll: () => void;
}

export function LeadsFilters({
  selectedStatuses,
  onToggleStatus,
  selectedTags,
  onAddTag,
  onRemoveTag,
  onClearAll,
}: LeadsFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim()) {
      onAddTag(tagInput.trim());
      setTagInput("");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm w-full sm:w-auto justify-center",
          selectedStatuses.length > 0 || selectedTags.length > 0 || isOpen
            ? "bg-primary/5 border-primary text-primary"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
        )}
      >
        <Filter className="w-4 h-4" />
        Filter{" "}
        {(selectedStatuses.length > 0 || selectedTags.length > 0) &&
          `(${selectedStatuses.length + selectedTags.length})`}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
            {Object.values(LeadStatus).map((status) => {
              if (status === LeadStatus.UNSUBSCRIBED) return null;
              return (
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
              );
            })}

            <div className="px-3 py-2 border-y border-slate-50 my-1 mt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Filter by Tags
              </p>
            </div>

            <div className="p-2 space-y-2">
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <TagIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Add tag..."
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100 focus:outline-none focus:border-primary text-xs font-medium"
                  />
                </div>
                <button
                  onClick={handleAddTag}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600"
                    >
                      {tag}
                      <X
                        className="w-2.5 h-2.5 cursor-pointer hover:text-rose-500"
                        onClick={() => onRemoveTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {(selectedStatuses.length > 0 || selectedTags.length > 0) && (
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
