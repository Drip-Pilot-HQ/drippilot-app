"use client";

import { Info } from "lucide-react";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <span className="relative inline-flex items-center group">
      <Info className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors cursor-default flex-shrink-0" />
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white leading-relaxed text-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg z-50">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </span>
  );
}
