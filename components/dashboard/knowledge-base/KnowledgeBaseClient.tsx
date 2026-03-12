"use client";

import { useState } from "react";
import { Plus, BrainCircuit } from "lucide-react";
import { useKbEntriesQuery } from "@/store/server/knowledge-base.queries";
import { KbEntry } from "@/types/knowledge-base";
import { Button } from "@/components/branding/Button";
import { KnowledgeBaseCard } from "./KnowledgeBaseCard";
import { CreateKbEntryDialog } from "./CreateKbEntryDialog";
import { DripBotChat } from "./DripBotChat";
import { KnowledgeBaseSearch } from "./KnowledgeBaseSearch";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { KnowledgeBaseListSkeleton } from "./KnowledgeBaseSkeleton";

export function KnowledgeBaseClient() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KbEntry | null>(null);

  const { data: entries, isLoading } = useKbEntriesQuery();

  const filteredEntries =
    entries?.filter(
      (entry) =>
        entry.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        entry.content.toLowerCase().includes(debouncedSearch.toLowerCase()),
    ) || [];

  const handleEdit = (entry: KbEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Knowledge Base
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Train and test your bot your know business context
          </p>
        </div>

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

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <KnowledgeBaseSearch
          value={searchInput}
          onChange={(val) => setSearchInput(val)}
        />
      </div>

      {/* Main Content */}
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
              Knowledge is the fuel for AI. Add documentation to help Drip Bot
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

      {/* Floating Chat Component */}
      <DripBotChat />

      <CreateKbEntryDialog
        key={isDialogOpen ? editingEntry?.id || "new" : "closed"}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        editEntry={editingEntry}
      />
    </div>
  );
}
