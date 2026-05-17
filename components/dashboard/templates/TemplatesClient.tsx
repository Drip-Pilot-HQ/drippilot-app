"use client";

import { useState } from "react";
import { Plus, Code, ArrowUpAZ, ChevronDown } from "lucide-react";
import { useTemplatesQuery } from "@/store/server/template.queries";
import { Template, TemplateChannel } from "@/types/template";
import { Button } from "@/components/branding/Button";
import { cn } from "@/lib/utils";
import { TemplateListSkeleton } from "./TemplateSkeleton";
import { TemplateCard } from "./TemplateCard";
import { CreateTemplateDialog } from "./CreateTemplateDialog";
import { TemplatesSearch } from "./TemplatesSearch";
import { TemplatesFilters } from "./TemplatesFilters";
import { TemplatesPagination } from "./TemplatesPagination";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { naturalSort } from "@/lib/utils/string";
import { LayoutGrid, List } from "lucide-react";
import { TemplateRow } from "./TemplateRow";
import { FolderSelector } from "./FolderSelector";

export function TemplatesClient() {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [selectedChannel, setSelectedChannel] = useState<
    TemplateChannel | "all"
  >("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    setPage(1);
  };
  const [sortBy, setSortBy] = useState<
    "createdAt" | "updatedAt" | "name" | "natural"
  >("natural");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data, isLoading } = useTemplatesQuery({
    search: debouncedSearch,
    channel: selectedChannel === "all" ? undefined : selectedChannel,
    folderId: selectedFolderId ?? undefined,
    page,
    limit,
    sortBy: sortBy === "natural" ? "name" : sortBy,
    sortOrder,
  });

  const templates =
    data?.data && sortBy === "natural"
      ? [...data.data].sort((a, b) => {
          return sortOrder === "asc"
            ? naturalSort(a.name, b.name)
            : naturalSort(b.name, a.name);
        })
      : data?.data || [];

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsCreateOpen(true);
  };

  const closeDialog = () => {
    setIsCreateOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Templates
            </h1>
          </div>
          <p className="text-slate-500 font-medium tracking-tight">
            Manage your high-performance outreach templates
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl h-10 px-5 shadow-md shadow-primary/10 text-sm w-full md:w-auto"
        >
          <div className="flex items-center gap-2 justify-center">
            <Plus className="w-4 h-4" />
            <span className="font-bold whitespace-nowrap">Create Template</span>
          </div>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <TemplatesSearch
          value={searchInput}
          onChange={(val) => {
            setSearchInput(val);
            setPage(1);
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <FolderSelector
            selectedFolderId={selectedFolderId}
            onSelectFolder={handleSelectFolder}
          />
          <TemplatesFilters
            selectedChannel={selectedChannel}
            onChannelChange={(channel) => {
              setSelectedChannel(channel);
              setPage(1);
            }}
          />

          <div className="relative group/sort inline-block">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-primary hover:border-primary/30 transition-all font-bold text-sm shadow-sm group-hover/sort:shadow-md h-[42px] sm:h-auto">
              <ArrowUpAZ className="w-4 h-4 text-slate-400 group-hover/sort:text-primary transition-colors" />
              <span className="text-slate-600 group-hover/sort:text-primary">
                Sort:{" "}
                {sortBy === "updatedAt"
                  ? "Recent"
                  : sortBy === "natural"
                    ? "Natural"
                    : sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 transition-transform group-hover/sort:rotate-180 duration-500" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              {[
                { label: "Natural Sort", value: "natural" },
                { label: "Most Recent", value: "updatedAt" },
                { label: "Creation Date", value: "createdAt" },
                { label: "Alphabetic", value: "name" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setSortBy(
                      opt.value as
                        | "createdAt"
                        | "updatedAt"
                        | "name"
                        | "natural",
                    )
                  }
                  className={cn(
                    "w-full text-left px-5 py-2.5 text-xs font-bold transition-all",
                    sortBy === opt.value
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {opt.label}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-1 mx-2" />
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="w-full text-left px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-primary hover:bg-slate-50 transition-all"
              >
                Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                viewMode === "list"
                  ? "bg-white text-primary shadow-sm border border-slate-200"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                viewMode === "grid"
                  ? "bg-white text-primary shadow-sm border border-slate-200"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Template list */}
      <div className="space-y-8">
        {isLoading ? (
          <TemplateListSkeleton viewMode={viewMode} />
        ) : data?.data && data.data.length > 0 ? (
          <>
            <div className="flex items-center px-4">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Showing{" "}
                <span className="text-slate-900">{data.data.length}</span>{" "}
                active Templates
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    isOwnerOrAdmin={isOwnerOrAdmin}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {templates.map((template) => (
                  <TemplateRow
                    key={template.id}
                    template={template}
                    onEdit={handleEdit}
                    isOwnerOrAdmin={isOwnerOrAdmin}
                  />
                ))}
              </div>
            )}

            <TemplatesPagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              totalResults={data.pagination.total}
              showingResults={data.data.length}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
              hasPrev={data.pagination.hasPrev}
              hasNext={data.pagination.hasNext}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
              <Code className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 font-heading">
              {selectedFolderId
                ? "No templates in this folder"
                : "No templates designed"}
            </h2>
            <p className="text-slate-500 max-w-sm mb-8 font-medium italic">
              {selectedFolderId
                ? "Create a template and assign it to this folder, or move an existing template here."
                : "Create reusable message templates to maintain consistent brand messaging across all automated campaigns."}
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl px-10 h-12 shadow-lg shadow-primary/20"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="font-bold">
                  {selectedFolderId
                    ? "Create Template Here"
                    : "Design First Template"}
                </span>
              </div>
            </Button>
          </div>
        )}
      </div>

      <CreateTemplateDialog
        key={isCreateOpen ? editingTemplate?.id || "new" : "closed"}
        isOpen={isCreateOpen}
        onClose={closeDialog}
        editTemplate={editingTemplate}
        defaultFolderId={selectedFolderId}
      />
    </div>
  );
}
