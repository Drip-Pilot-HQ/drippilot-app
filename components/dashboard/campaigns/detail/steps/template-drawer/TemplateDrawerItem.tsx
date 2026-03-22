"use client";

import { Check, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Template, TemplateChannel } from "@/types/template";

interface TemplateDrawerItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}

export function TemplateDrawerItem({
  template,
  isSelected,
  onSelect,
}: TemplateDrawerItemProps) {
  const isEmail = template.templateChannel === TemplateChannel.EMAIL;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-colors",
        isSelected
          ? isEmail
            ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-500/10"
            : "border-purple-400 bg-purple-50/50 ring-2 ring-purple-500/10"
          : isEmail
            ? "border-slate-200 hover:border-blue-400 hover:bg-blue-50/10"
            : "border-slate-200 hover:border-purple-400 hover:bg-purple-50/10",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0",
              isEmail
                ? "bg-blue-50 text-blue-600"
                : "bg-purple-50 text-purple-600",
            )}
          >
            {isEmail ? (
              <Mail className="w-2.5 h-2.5" />
            ) : (
              <MessageSquare className="w-2.5 h-2.5" />
            )}
            {template.templateChannel}
          </span>
          <span className="text-sm font-bold text-slate-900 truncate">
            {template.name}
          </span>
        </div>
        {isSelected && (
          <Check
            className={cn(
              "w-4 h-4 shrink-0 mt-0.5",
              isEmail ? "text-blue-500" : "text-purple-500",
            )}
          />
        )}
      </div>
      {template.subject && (
        <p className="text-xs text-slate-500 mt-2 font-medium">
          Subject: {template.subject}
        </p>
      )}
      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
        {template.content}
      </p>
    </button>
  );
}
