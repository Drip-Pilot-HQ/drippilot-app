"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import { Campaign, CampaignStatus } from "@/types/campaign";
import {
  useEnrolledLeadsQuery,
  useRemoveEnrolledLeadsMutation,
} from "@/store/server/campaign.queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { toast } from "sonner";
import { EnrollLeadsDrawer } from "./EnrollLeadsDrawer";

import { LeadsEnrolledWarning } from "./enrolled-tab/LeadsEnrolledWarning";
import { LeadsEnrolledToolbar } from "./enrolled-tab/LeadsEnrolledToolbar";
import { LeadsEnrolledTable } from "./enrolled-tab/LeadsEnrolledTable";
import { LeadsEnrolledPagination } from "./enrolled-tab/LeadsEnrolledPagination";

interface LeadsEnrolledTabProps {
  campaign: Campaign;
}

type SortField = "enrolledAt" | "name";
type SortOrder = "asc" | "desc";

export function LeadsEnrolledTab({ campaign }: LeadsEnrolledTabProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [sortBy, setSortBy] = useState<SortField>("enrolledAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = campaign.status === CampaignStatus.ACTIVE;

  const { data, isLoading } = useEnrolledLeadsQuery(campaign.id, {
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const removeMutation = useRemoveEnrolledLeadsMutation(campaign.id);

  const sortedLeads = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort((a, b) => {
      if (sortBy === "name") {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      const valA = new Date(a.enrolledAt).getTime();
      const valB = new Date(b.enrolledAt).getTime();
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [data, sortBy, sortOrder]);

  const pagination = data?.pagination;

  const allOnPageSelected =
    sortedLeads.length > 0 &&
    sortedLeads.every((l) => selectedIds.has(l.leadId));
  const someSelected = selectedIds.size > 0 && !allOnPageSelected;

  const toggleSelect = (leadId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        sortedLeads.forEach((l) => next.delete(l.leadId));
      } else {
        sortedLeads.forEach((l) => next.add(l.leadId));
      }
      return next;
    });
  };

  const handleRemoveSelected = async () => {
    if (selectedIds.size === 0) return;
    try {
      await removeMutation.mutateAsync({ leadIds: Array.from(selectedIds) });
      setSelectedIds(new Set());
      toast.success(
        `${selectedIds.size} lead${selectedIds.size > 1 ? "s" : ""} removed from campaign`,
      );
    } catch {
      toast.error("Failed to remove leads from campaign");
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-700">
      <LeadsEnrolledWarning isActive={isActive} />

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="px-5 py-4 md:px-6 md:py-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-lg font-semibold text-slate-800">
                Enrolled Leads
              </h1>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Manage all leads currently active in your campaign sequence.
            </p>
          </div>

          <LeadsEnrolledToolbar
            searchInput={searchInput}
            onSearchChange={(val) => {
              setSearchInput(val);
              setPage(1);
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
              setIsSortOpen(false);
              setPage(1);
            }}
            isSortOpen={isSortOpen}
            onToggleSort={() => setIsSortOpen(!isSortOpen)}
            onCloseSort={() => setIsSortOpen(false)}
            selectedIdsCount={selectedIds.size}
            isActive={isActive}
            isRemoving={removeMutation.isPending}
            onRemoveSelected={handleRemoveSelected}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
        </div>

        {/* Table Section */}
        <div className="flex-1 min-h-[400px]">
          <LeadsEnrolledTable
            isLoading={isLoading}
            leads={sortedLeads}
            selectedIds={selectedIds}
            allOnPageSelected={allOnPageSelected}
            someSelected={someSelected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            isSearching={!!debouncedSearch}
          />
        </div>

        {/* Pagination Section */}
        {pagination && pagination.totalPages > 0 && (
          <div className="px-5 py-4 md:px-6 md:py-5 border-t border-slate-100">
            <LeadsEnrolledPagination
              pagination={pagination}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
              leadsOnPage={sortedLeads.length}
            />
          </div>
        )}
      </div>

      <EnrollLeadsDrawer
        campaign={campaign}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
