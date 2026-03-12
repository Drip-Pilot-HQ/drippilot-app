"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Mail, MessageSquare, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTemplatesQuery } from "@/store/server/template.queries";
import { Template, TemplateChannel } from "@/types/template";

interface TemplateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
  selectedTemplateId?: string;
  allowedChannels: TemplateChannel[];
}

export function TemplateDrawer({
  isOpen,
  onClose,
  onSelect,
  selectedTemplateId,
  allowedChannels,
}: TemplateDrawerProps) {
  const [search, setSearch] = useState("");

  const channelFilter =
    allowedChannels.length === 1 ? allowedChannels[0] : undefined;

  const { data, isLoading } = useTemplatesQuery({
    search: search || undefined,
    channel: channelFilter,
    limit: 50,
    sortBy: "name",
    sortOrder: "asc",
  });

  const templates = data?.data ?? [];

  const displayed =
    allowedChannels.length > 1
      ? templates.filter((t) => allowedChannels.includes(t.templateChannel))
      : templates;

  const handleClose = useCallback(() => {
    setSearch("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClose}
      />

      <div
        className={cn(
          "relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Select Template
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {allowedChannels.length > 1
                ? "Email and SMS templates available"
                : allowedChannels[0] === TemplateChannel.EMAIL
                  ? "Email templates only"
                  : "SMS templates only"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-semibold text-slate-500">
                No templates found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try a different search or create a new template
              </p>
            </div>
          ) : (
            displayed.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                onSelect={() => {
                  onSelect(template);
                  handleClose();
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const isEmail = template.templateChannel === TemplateChannel.EMAIL;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all",
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
