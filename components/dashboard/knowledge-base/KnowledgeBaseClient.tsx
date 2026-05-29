"use client";

import { useState, useMemo } from "react";
import { Plus, BrainCircuit } from "lucide-react";
import {
  useKbEntriesQuery,
  type KbScope,
} from "@/store/server/knowledge-base.queries";
import { KbEntry } from "@/types/knowledge-base";
import { Button } from "@/components/branding/Button";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
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

  const filteredEntries =
    entries?.filter(
      (entry) =>
        entry.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        entry.content.toLowerCase().includes(debouncedSearch.toLowerCase()),
    ) ?? [];

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
            Train and test your bot with business context
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
      </div>

      {/* Content */}
      <div className="space-y-6">
        {isLoading ? (
          <KnowledgeBaseListSkeleton />
        ) : filteredEntries.length > 0 ? (
          <>
            <div className="flex items-center px-4">
              <p className="text-sm text-slate-400 font-bold">
                Showing{" "}
                <span className="text-slate-900">{filteredEntries.length}</span>{" "}
                trained insights
              </p>
            </div>
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
