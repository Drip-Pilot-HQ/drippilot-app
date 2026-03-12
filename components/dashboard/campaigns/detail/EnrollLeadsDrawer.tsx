"use client";

import { useState, useMemo } from "react";
import { Campaign, EnrollmentScope } from "@/types/campaign";
import { LeadStatus } from "@/types/lead";
import { useLeadsQuery } from "@/store/server/lead.queries";
import { useEnrollLeadsMutation } from "@/store/server/campaign.queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { toast } from "sonner";

import { EnrollLeadsHeader } from "./enroll-drawer/EnrollLeadsHeader";
import { EnrollLeadsToolbar } from "./enroll-drawer/EnrollLeadsToolbar";
import { EnrollLeadsFilters } from "./enroll-drawer/EnrollLeadsFilters";
import { EnrollLeadsList } from "./enroll-drawer/EnrollLeadsList";
import { EnrollLeadsPagination } from "./enroll-drawer/EnrollLeadsPagination";
import { EnrollLeadsFooter } from "./enroll-drawer/EnrollLeadsFooter";

// All statuses except UNSUBSCRIBED
const ENROLLABLE_STATUSES = [
  LeadStatus.HOT,
  LeadStatus.WARM,
  LeadStatus.COLD,
  LeadStatus.CONVERTED,
];

interface EnrollLeadsDrawerProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollLeadsDrawer({
  campaign,
  isOpen,
  onClose,
}: EnrollLeadsDrawerProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedStatuses, setSelectedStatuses] =
    useState<LeadStatus[]>(ENROLLABLE_STATUSES);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const { data, isLoading } = useLeadsQuery({
    search: debouncedSearch || undefined,
    status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const enrollMutation = useEnrollLeadsMutation();

  const rawLeads = (data?.data ?? []).filter(Boolean);

  const leads = useMemo(() => {
    if (!rawLeads.length) return [];

    return [...rawLeads].sort((a, b) => {
      if (sortBy === "name") {
        const nameA = (
          a.name || `${a.firstName || ""} ${a.lastName || ""}`.trim()
        ).toLowerCase();
        const nameB = (
          b.name || `${b.firstName || ""} ${b.lastName || ""}`.trim()
        ).toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }

      const valA = new Date(a.createdAt).getTime();
      const valB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [rawLeads, sortBy, sortOrder]);

  const pagination = data?.pagination;

  const allOnPageSelected =
    leads.length > 0 && leads.every((l) => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0 && !allOnPageSelected;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const pageIds = leads.map((l) => l.id).filter((id) => !!id);

      if (allOnPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleEnrollSelected = async () => {
    if (selectedIds.size === 0) return;
    try {
      await enrollMutation.mutateAsync({
        campaignId: campaign.id,
        dto: {
          leadIds: Array.from(selectedIds),
          scope: EnrollmentScope.SELECTION,
        },
      });
      toast.success(
        `${selectedIds.size} lead${selectedIds.size > 1 ? "s" : ""} enrolled in campaign`,
      );
      setSelectedIds(new Set());
      onClose();
    } catch {
      toast.error("Failed to enroll leads");
    }
  };

  const handleEnrollAll = async () => {
    try {
      await enrollMutation.mutateAsync({
        campaignId: campaign.id,
        dto: { scope: EnrollmentScope.ALL },
      });
      toast.success("All eligible leads enrolled in campaign");
      onClose();
    } catch {
      toast.error("Failed to enroll leads");
    }
  };

  const handleClose = () => {
    setSearchInput("");
    setPage(1);
    setSelectedIds(new Set());
    setSelectedStatuses(ENROLLABLE_STATUSES);
    setSelectedTags([]);
    setSortBy("createdAt");
    setSortOrder("desc");
    setIsFilterOpen(false);
    setIsSortOpen(false);
    onClose();
  };

  const toggleStatus = (status: LeadStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
    setPage(1);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
      setTagInput("");
      setPage(1);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setPage(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <EnrollLeadsHeader onClose={handleClose} />

        <EnrollLeadsToolbar
          searchInput={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            setPage(1);
          }}
          isFilterOpen={isFilterOpen}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          isSortOpen={isSortOpen}
          onToggleSort={() => setIsSortOpen(!isSortOpen)}
          onCloseSort={() => setIsSortOpen(false)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
            setIsSortOpen(false);
            setPage(1);
          }}
          selectedStatuses={selectedStatuses}
          selectedTags={selectedTags}
          enrolableStatusesCount={ENROLLABLE_STATUSES.length}
        />

        <EnrollLeadsFilters
          isFilterOpen={isFilterOpen}
          selectedStatuses={selectedStatuses}
          onToggleStatus={toggleStatus}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          selectedTags={selectedTags}
          onRemoveTag={removeTag}
          enrolableStatuses={ENROLLABLE_STATUSES}
        />

        <EnrollLeadsList
          isLoading={isLoading}
          leads={leads}
          selectedIds={selectedIds}
          allOnPageSelected={allOnPageSelected}
          someSelected={someSelected}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
        />

        <EnrollLeadsPagination
          pagination={pagination!}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />

        <EnrollLeadsFooter
          selectedIdsCount={selectedIds.size}
          isMutating={enrollMutation.isPending}
          onEnrollSelected={handleEnrollSelected}
          onEnrollAll={handleEnrollAll}
        />
      </div>
    </div>
  );
}
