"use client";

import { useState, useMemo, useCallback } from "react";
import {
  UserPlus,
  Users,
  Upload,
  Trash2,
  X,
  Workflow,
  UserMinus,
} from "lucide-react";
import {
  useLeadsQuery,
  useDeleteLeadsMutation,
} from "@/store/server/lead.queries";
import { LeadListSkeleton } from "./LeadSkeleton";
import { LeadsTable } from "./LeadsTable";
import { LeadsFilters } from "./LeadsFilters";
import { LeadsSearch } from "./LeadsSearch";
import { LeadsPagination } from "./LeadsPagination";
import { CreateLeadDialog } from "./CreateLeadDialog";
import { LeadsSort, LeadSortField, LeadSortOrder } from "./LeadsSort";
import { Lead, LeadStatus } from "@/types/lead";
import { Button } from "@/components/branding/Button";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { ImportLeadsDialog } from "./ImportLeadsDialog";
import { CampaignPickerModal } from "./CampaignPickerModal";
import { useConfirm } from "@/components/branding/ConfirmProvider";

export function LeadsClient() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [selectedStatuses, setSelectedStatuses] = useState<LeadStatus[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Server-side sort (sent to API via LeadsSort dropdown)
  const [sortBy, setSortBy] = useState<LeadSortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<LeadSortOrder>("desc");
  // Client-side sort (table header clicks, applied in-memory on fetched page)
  const [tableSortBy, setTableSortBy] = useState<LeadSortField | null>(null);
  const [tableSortOrder, setTableSortOrder] = useState<LeadSortOrder>("asc");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"enroll" | "remove">("enroll");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(
    new Set(),
  );

  const deleteLeadsMutation = useDeleteLeadsMutation();
  const confirm = useConfirm();

  const { data, isLoading } = useLeadsQuery({
    search: debouncedSearch || undefined,
    status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    page,
    limit,
    sortBy: sortBy as "name" | "createdAt" | "updatedAt",
    sortOrder,
  });

  const sortedLeads = useMemo(() => {
    if (!data?.data) return [];
    if (!tableSortBy) return data.data;

    const items = [...data.data];

    return items.sort((a, b) => {
      if (tableSortBy === "name") {
        const nameA = (a.name || `${a.firstName} ${a.lastName}` || "")
          .trim()
          .toLowerCase();
        const nameB = (b.name || `${b.firstName} ${b.lastName}` || "")
          .trim()
          .toLowerCase();
        return tableSortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      if (tableSortBy === "email") {
        const emailA = (a.email || "").toLowerCase();
        const emailB = (b.email || "").toLowerCase();
        return tableSortOrder === "asc"
          ? emailA.localeCompare(emailB)
          : emailB.localeCompare(emailA);
      }
      if (tableSortBy === "status") {
        const sA = (a.leadStatus || "").toLowerCase();
        const sB = (b.leadStatus || "").toLowerCase();
        return tableSortOrder === "asc"
          ? sA.localeCompare(sB)
          : sB.localeCompare(sA);
      }
      if (tableSortBy === "tags") {
        const lenA = a.tags?.length ?? 0;
        const lenB = b.tags?.length ?? 0;
        return tableSortOrder === "asc" ? lenA - lenB : lenB - lenA;
      }
      return 0;
    });
  }, [data, tableSortBy, tableSortOrder]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback((ids: string[]) => {
    setSelectedLeadIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }, []);

  const handleBulkDelete = async () => {
    const count = selectedLeadIds.size;
    const confirmed = await confirm({
      title: "Delete Leads",
      description: `Are you sure you want to delete ${count} lead${count !== 1 ? "s" : ""}? This action cannot be undone.`,
      confirmLabel: `Delete ${count} Lead${count !== 1 ? "s" : ""}`,
      variant: "danger",
    });
    if (!confirmed) return;
    await deleteLeadsMutation.mutateAsync(Array.from(selectedLeadIds));
    setSelectedLeadIds(new Set());
  };

  const toggleStatusFilter = (status: LeadStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
    setPage(1);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsCreateOpen(true);
  };

  const closeDialog = () => {
    setIsCreateOpen(false);
    setEditingLead(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Leads
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Manage and nurture your leads in CRM
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            className="rounded-xl h-10 px-5 text-sm flex-1 md:flex-none"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl h-10 px-5 shadow-md shadow-primary/10 text-sm flex-1 md:flex-none"
          >
            <div className="flex items-center gap-2 justify-center">
              <UserPlus className="w-4 h-4" />
              <span className="font-bold whitespace-nowrap">Add Lead</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <LeadsSearch
          value={searchInput}
          onChange={(val) => {
            setSearchInput(val);
            setPage(1);
          }}
        />
        <LeadsFilters
          selectedStatuses={selectedStatuses}
          onToggleStatus={toggleStatusFilter}
          selectedTags={selectedTags}
          onAddTag={(tag) => {
            setSelectedTags((prev) => [...prev, tag]);
            setPage(1);
          }}
          onRemoveTag={(tag) => {
            setSelectedTags((prev) => prev.filter((t) => t !== tag));
            setPage(1);
          }}
          onClearAll={() => {
            setSelectedStatuses([]);
            setSelectedTags([]);
            setPage(1);
          }}
        />
        <LeadsSort
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
            setPage(1);
          }}
        />
      </div>

      {/* Leads Content */}
      <div className="space-y-6">
        {isLoading ? (
          <LeadListSkeleton />
        ) : data?.data && data.data.length > 0 ? (
          <>
            {selectedLeadIds.size > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-2xl">
                <span className="text-sm font-bold text-primary">
                  {selectedLeadIds.size} lead
                  {selectedLeadIds.size !== 1 ? "s" : ""} selected
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedLeadIds(new Set())}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPickerMode("enroll");
                      setIsPickerOpen(true);
                    }}
                    className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg"
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    Enroll
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPickerMode("remove");
                      setIsPickerOpen(true);
                    }}
                    className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    Remove
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBulkDelete}
                    disabled={deleteLeadsMutation.isPending}
                    className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete {selectedLeadIds.size}
                  </Button>
                </div>
              </div>
            )}

            <LeadsTable
              leads={sortedLeads}
              onEdit={handleEdit}
              sortBy={tableSortBy}
              sortOrder={tableSortOrder}
              onSortChange={(field, order) => {
                setTableSortBy(field);
                setTableSortOrder(order);
              }}
              selectedLeadIds={selectedLeadIds}
              onToggleSelect={handleToggleSelect}
              onToggleAll={handleToggleAll}
            />

            <LeadsPagination
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
              <Users className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Build your audience
            </h2>
            <p className="text-slate-500 max-w-sm mb-8 font-medium">
              Start by adding leads manually or importing them from a CSV file
              to begin your outreach.
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="rounded-2xl px-8 h-12 shadow-lg shadow-primary/20"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                First Lead
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsImportOpen(true)}
                className="rounded-2xl px-8 h-12 border-2"
              >
                <Upload className="w-5 h-5 mr-2" />
                Import CSV
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateLeadDialog
        key={isCreateOpen ? editingLead?.id || "new" : "closed"}
        isOpen={isCreateOpen}
        onClose={closeDialog}
        editLead={editingLead}
      />

      <ImportLeadsDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <CampaignPickerModal
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        mode={pickerMode}
        leadIds={Array.from(selectedLeadIds)}
        onSuccess={() => setSelectedLeadIds(new Set())}
      />
    </div>
  );
}
