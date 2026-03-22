"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTemplatesQuery } from "@/store/server/template.queries";
import { Template, TemplateChannel } from "@/types/template";
import { naturalSort } from "@/lib/utils/string";
import { TemplateDrawerItem } from "./template-drawer/TemplateDrawerItem";
import { TemplateDrawerFolderFilter } from "./template-drawer/TemplateDrawerFolderFilter";
import {
  TemplateDrawerSortMenu,
  DrawerSortBy,
  DrawerSortOrder,
} from "./template-drawer/TemplateDrawerSortMenu";

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
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<DrawerSortBy>("natural");
  const [sortOrder, setSortOrder] = useState<DrawerSortOrder>("asc");

  // When only one channel is allowed, pass it to the server so it fetches
  // only that channel. When multiple channels are allowed, omit it to fetch all.
  const channelParam =
    allowedChannels.length === 1 ? allowedChannels[0] : undefined;

  const { data, isLoading } = useTemplatesQuery({
    search: search || undefined,
    channel: channelParam,
    folderId: selectedFolderId ?? undefined,
    limit: 100,
    sortBy: sortBy === "natural" ? "name" : sortBy,
    sortOrder,
  });

  // Always filter client-side too — ensures correct results even if the server
  // returns unexpected channel data (e.g. stale cache or API inconsistency).
  const channelFiltered = (data?.data ?? []).filter((t) =>
    allowedChannels.includes(t.templateChannel),
  );

  const displayed =
    sortBy === "natural"
      ? [...channelFiltered].sort((a, b) =>
          sortOrder === "asc"
            ? naturalSort(a.name, b.name)
            : naturalSort(b.name, a.name),
        )
      : channelFiltered;

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

        <div className="px-4 py-3 border-b border-slate-100 space-y-2">
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

          <div className="flex items-center gap-2">
            <TemplateDrawerFolderFilter
              selectedFolderId={selectedFolderId}
              onSelect={setSelectedFolderId}
            />
            <div className="ml-auto">
              <TemplateDrawerSortMenu
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={setSortBy}
                onSortOrderToggle={() =>
                  setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
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
            <div className="flex flex-col gap-2">
              {displayed.map((template) => (
                <TemplateDrawerItem
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplateId === template.id}
                  onSelect={() => {
                    onSelect(template);
                    handleClose();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
