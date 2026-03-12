"use client";

import { Tag as TagIcon, X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeadStatus } from "@/types/lead";
import { Button } from "@/components/branding/Button";

interface EnrollLeadsFiltersProps {
  isFilterOpen: boolean;
  selectedStatuses: LeadStatus[];
  onToggleStatus: (status: LeadStatus) => void;
  tagInput: string;
  onTagInputChange: (val: string) => void;
  onAddTag: () => void;
  selectedTags: string[];
  onRemoveTag: (tag: string) => void;
  enrolableStatuses: LeadStatus[];
}

export function EnrollLeadsFilters({
  isFilterOpen,
  selectedStatuses,
  onToggleStatus,
  tagInput,
  onTagInputChange,
  onAddTag,
  selectedTags,
  onRemoveTag,
  enrolableStatuses,
}: EnrollLeadsFiltersProps) {
  if (!isFilterOpen) return null;

  return (
    <div className="px-6 py-0 shrink-0 mb-4">
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Lead Status
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {enrolableStatuses.map((status) => (
              <button
                key={status}
                onClick={() => onToggleStatus(status)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg border text-[10px] font-black uppercase transition-all",
                  selectedStatuses.includes(status)
                    ? "bg-white border-primary text-primary shadow-sm"
                    : "bg-slate-100/50 border-slate-200 text-slate-400 hover:bg-white",
                )}
              >
                {status}
                {selectedStatuses.includes(status) && (
                  <div className="w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Tags filter
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => onTagInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAddTag()}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-[11px]"
              />
            </div>
            <Button
              onClick={onAddTag}
              variant="outline"
              className="w-9 h-9 p-0 rounded-xl shrink-0"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold"
                >
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => onRemoveTag(tag)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
