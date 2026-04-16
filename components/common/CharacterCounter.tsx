"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  value: string | undefined;
  isSMS?: boolean;
  className?: string;
}

export function CharacterCounter({
  value = "",
  isSMS = false,
  className,
}: CharacterCounterProps) {
  const stats = useMemo(() => {
    const content = value || "";
    const length = content.length;
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    return {
      characters: length,
      words,
      isOver160: length > 160,
    };
  }, [value]);

  if (!value) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "flex flex-row items-center justify-between gap-4 text-xs font-medium px-1",
          "text-slate-600",
        )}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="font-black text-slate-900">
              {stats.characters}
            </span>
            <span className="text-slate-500">
              char{stats.characters !== 1 ? "s" : ""}
            </span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <span className="font-black text-slate-900">{stats.words}</span>
            <span className="text-slate-500">
              word{stats.words !== 1 ? "s" : ""}
            </span>
          </span>
        </div>

        {isSMS && (
          <span
            className={cn(
              "inline items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-[11px] uppercase tracking-wider",
              stats.isOver160
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-slate-50 text-slate-600 border border-slate-200",
            )}
          >
            <span className="font-black">
              {Math.ceil(stats.characters / 160)}
            </span>
            SMS{stats.characters > 160 ? " (extra credits)" : ""}
          </span>
        )}
      </div>

      {isSMS && stats.isOver160 && (
        <div className="text-[10px] text-amber-600">
          ⚠️ Exceeds 160 characters. Each additional 160 characters costs extra
          credits.
        </div>
      )}
    </div>
  );
}
