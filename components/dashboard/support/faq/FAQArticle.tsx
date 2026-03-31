"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQArticle as FAQArticleType } from "@/types/support";

interface FAQArticleProps {
  article: FAQArticleType;
}

export function FAQArticle({ article }: FAQArticleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "bg-white border rounded-[20px] overflow-hidden transition-all duration-200 shadow-sm",
        open ? "border-primary/20" : "border-slate-100 hover:border-slate-200",
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex-1 min-w-0 space-y-1">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              open ? "text-primary" : "text-slate-400",
            )}
          >
            {article.category}
          </span>
          <p className="text-sm font-bold text-slate-800 leading-snug">
            {article.question}
          </p>
        </div>
        <div
          className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1 transition-all duration-200",
            open ? "bg-primary/10" : "bg-slate-100",
          )}
        >
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200",
              open ? "rotate-180 text-primary" : "text-slate-400",
            )}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <p className="pt-4 text-sm text-slate-500 font-medium leading-relaxed">
            {article.answer}
          </p>
        </div>
      )}
    </div>
  );
}
