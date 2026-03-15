"use client";

import { useState } from "react";
import { UserPlus, Users, Upload } from "lucide-react";
import { useLeadsQuery } from "@/store/server/lead.queries";
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
import { useMemo } from "react";
import { ImportLeadsDialog } from "./ImportLeadsDialog";

export function LeadsClient() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedStatuses, setSelectedStatuses] = useState<LeadStatus[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<LeadSortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<LeadSortOrder>("desc");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const { data, isLoading } = useLeadsQuery({
    search: debouncedSearch || undefined,
    status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const sortedLeads = useMemo(() => {
    if (!data?.data) return [];

    const items = [...data.data];

    return items.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortBy === "name") {
        // Standardize name comparison
        const nameA = (a.name || `${a.firstName} ${a.lastName}` || "")
          .trim()
          .toLowerCase();
        const nameB = (b.name || `${b.firstName} ${b.lastName}` || "")
          .trim()
          .toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortBy === "createdAt" || sortBy === "updatedAt") {
        valA = new Date(a[sortBy] || 0).getTime();
        valB = new Date(b[sortBy] || 0).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortBy, sortOrder]);

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
            className="rounded-xl h-10 px-4 hidden sm:flex text-sm flex-1 md:flex-none"
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
            <LeadsTable leads={sortedLeads} onEdit={handleEdit} />

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
    </div>
  );
}
