"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  BrainCircuit,
  ArrowUpAZ,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";
import {
  useKbEntriesQuery,
  type KbScope,
} from "@/store/server/knowledge-base.queries";
import { KbEntry } from "@/types/knowledge-base";
import { Button } from "@/components/branding/Button";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { KnowledgeBaseRow } from "./KnowledgeBaseRow";
import { CreateKbEntryDialog } from "./CreateKbEntryDialog";
import { DripBotChat } from "./DripBotChat";
import { KnowledgeBaseSearch } from "./KnowledgeBaseSearch";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { KnowledgeBaseListSkeleton } from "./KnowledgeBaseSkeleton";
import { KnowledgeBaseExampleDrawer } from "./KnowledgeBaseExampleDrawer";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { useViewMode } from "@/lib/hooks/use-view-mode";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { ViewAsMemberSelector } from "@/components/dashboard/overview/ViewAsMemberSelector";
import { useAuthStore } from "@/store/client/useAuthStore";
import { naturalSort } from "@/lib/utils/string";
import { cn } from "@/lib/utils";

export function KnowledgeBaseClient() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KbEntry | null>(null);
  const [prefillTemplate, setPrefillTemplate] = useState<
    { title: string; content: string } | undefined
  >();
  const [isExampleDrawerOpen, setIsExampleDrawerOpen] = useState(false);
  const [viewAsMemberId, setViewAsMemberId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<
    "natural" | "name" | "createdAt" | "updatedAt"
  >("natural");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [displayMode, setDisplayMode] = useState<"list" | "grid">("list");

  const { isOwnerOrAdmin, isMember } = useWorkspaceRole();
  const { viewMode } = useViewMode();
  const currentUser = useAuthStore((s) => s.user);

  const { data: membersData } = useMembersQuery(isOwnerOrAdmin);
  const members = useMemo(() => membersData ?? [], [membersData]);

  const memberMap = useMemo(
    () =>
      new Map(
        members
          .filter((m) => m.userId !== null)
          .map((m) => [
            m.userId as string,
            m.memberName || m.inviteEmail || "Unknown",
          ]),
      ),
    [members],
  );

  // Owner/Admin: scope from sidebar viewMode. Member: always personal.
  const scope: KbScope = isOwnerOrAdmin
    ? viewMode === "personal"
      ? "personal"
      : "team"
    : "personal";

  // viewAs only applies when admin is in team mode
  const explicitViewAs =
    isOwnerOrAdmin && scope === "team" ? viewAsMemberId : undefined;

  const selfEntry =
    isMember && currentUser
      ? {
          userId: currentUser.id,
          name:
            (currentUser.user_metadata?.full_name as string | undefined) ||
            (currentUser.user_metadata?.name as string | undefined) ||
            currentUser.email ||
            "Me",
        }
      : undefined;

  // suppress unused warning — selfEntry reserved for future member selector
  void selfEntry;

  const { data: entries, isLoading } = useKbEntriesQuery(scope, explicitViewAs);

  const filteredEntries = useMemo(() => {
    const base =
      entries?.filter(
        (entry) =>
          entry.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          entry.content.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ) ?? [];

    return [...base].sort((a, b) => {
      if (sortBy === "natural" || sortBy === "name") {
        return sortOrder === "asc"
          ? naturalSort(a.title, b.title)
          : naturalSort(b.title, a.title);
      }
      const field = sortBy === "createdAt" ? "createdAt" : "updatedAt";
      const aVal = new Date(a[field]).getTime();
      const bVal = new Date(b[field]).getTime();
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [entries, debouncedSearch, sortBy, sortOrder]);

  const handleEdit = (entry: KbEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
    setPrefillTemplate(undefined);
  };

  const handleUseTemplate = (template: { title: string; content: string }) => {
    setPrefillTemplate(template);
    setEditingEntry(null);
    setIsDialogOpen(true);
  };

  const scopeLabel = (() => {
    if (isOwnerOrAdmin && scope === "team" && viewAsMemberId) {
      const name = memberMap.get(viewAsMemberId);
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
          {name ? `${name}'s entries` : "Member entries"}
        </span>
      );
    }
    return null;
  })();

  const viewAsSelectorSlot =
    isOwnerOrAdmin && scope === "team" ? (
      <ViewAsMemberSelector
        members={members}
        value={viewAsMemberId}
        onChange={setViewAsMemberId}
      />
    ) : undefined;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Knowledge Base
            </h1>
            {scopeLabel}
          </div>
          <p className="text-slate-500 font-medium">
            Train your AI with your business knowledge and workflows
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {viewAsSelectorSlot}
          <button
            onClick={() => setIsExampleDrawerOpen(true)}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 text-sm font-bold transition-all whitespace-nowrap"
          >
            View Examples
          </button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-xl h-10 px-5 shadow-md shadow-primary/10 text-sm w-full md:w-auto"
          >
            <div className="flex items-center gap-2 justify-center">
              <Plus className="w-4 h-4" />
              <span className="font-bold whitespace-nowrap">New Entry</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <KnowledgeBaseSearch
          value={searchInput}
          onChange={(val) => setSearchInput(val)}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group/sort inline-block">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-primary hover:border-primary/30 transition-all font-bold text-sm shadow-sm group-hover/sort:shadow-md h-[42px] sm:h-auto">
              <ArrowUpAZ className="w-4 h-4 text-slate-400 group-hover/sort:text-primary transition-colors" />
              <span className="text-slate-600 group-hover/sort:text-primary">
                Sort:{" "}
                {sortBy === "updatedAt"
                  ? "Recent"
                  : sortBy === "natural"
                    ? "Natural"
                    : sortBy === "createdAt"
                      ? "Date"
                      : "Alpha"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 transition-transform group-hover/sort:rotate-180 duration-500" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              {(
                [
                  { label: "Natural Sort", value: "natural" },
                  { label: "Most Recent", value: "updatedAt" },
                  { label: "Creation Date", value: "createdAt" },
                  { label: "Alphabetic", value: "name" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
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
              onClick={() => setDisplayMode("list")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                displayMode === "list"
                  ? "bg-white text-primary shadow-sm border border-slate-200"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDisplayMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                displayMode === "grid"
                  ? "bg-white text-primary shadow-sm border border-slate-200"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {isLoading ? (
          <KnowledgeBaseListSkeleton viewMode={displayMode} />
        ) : filteredEntries.length > 0 ? (
          <>
            <div className="flex items-center px-4">
              <p className="text-sm text-slate-400 font-bold">
                Showing{" "}
                <span className="text-slate-900">{filteredEntries.length}</span>{" "}
                trained insights
              </p>
            </div>
            {displayMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEntries.map((entry) => (
                  <KnowledgeBaseCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    ownerName={
                      isOwnerOrAdmin && scope === "team" && entry.ownerUserId
                        ? (memberMap.get(entry.ownerUserId) ?? null)
                        : null
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <KnowledgeBaseRow
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    ownerName={
                      isOwnerOrAdmin && scope === "team" && entry.ownerUserId
                        ? (memberMap.get(entry.ownerUserId) ?? null)
                        : null
                    }
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
              <BrainCircuit className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              A Knowledgeable Mind Awaits
            </h2>
            <p className="text-slate-500 max-w-sm mb-8 font-medium">
              Knowledge is the fuel for AI. Add documentation to help Drip Pilot
              represent your brand accurately.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="rounded-xl px-10 h-12 shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Insight
            </Button>
          </div>
        )}
      </div>

      <DripBotChat />

      <KnowledgeBaseExampleDrawer
        isOpen={isExampleDrawerOpen}
        onClose={() => setIsExampleDrawerOpen(false)}
        onUseTemplate={handleUseTemplate}
      />

      <CreateKbEntryDialog
        key={
          isDialogOpen
            ? editingEntry?.id || prefillTemplate?.title || "new"
            : "closed"
        }
        isOpen={isDialogOpen}
        onClose={closeDialog}
        editEntry={editingEntry}
        prefill={prefillTemplate}
      />
    </div>
  );
}
