"use client";

import { useState } from "react";
import { Plus, Rocket } from "lucide-react";
import { useCampaignsQuery } from "@/store/server/campaign.queries";
import { CampaignListSkeleton } from "./CampaignSkeleton";
import { CampaignCard } from "./CampaignCard";
import { CreateCampaignDialog } from "./CreateCampaignDialog";
import { CampaignsSearch } from "./CampaignsSearch";
import { CampaignsFilters } from "./CampaignsFilters";
import { Campaign, CampaignStatus } from "@/types/campaign";
import { Button } from "@/components/branding/Button";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function CampaignsClient() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedStatuses, setSelectedStatuses] = useState<CampaignStatus[]>(
    [],
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const { data: campaigns, isLoading } = useCampaignsQuery({
    ...(debouncedSearch ? { search: debouncedSearch } : { search: "" }),
    ...(selectedStatuses.length > 0 ? { status: selectedStatuses } : {}),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const toggleStatusFilter = (status: CampaignStatus) => {
    setSelectedStatuses((prev: CampaignStatus[]) =>
      prev.includes(status)
        ? prev.filter((s: CampaignStatus) => s !== status)
        : [...prev, status],
    );
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsCreateOpen(true);
  };

  const closeDialog = () => {
    setIsCreateOpen(false);
    setEditingCampaign(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Campaigns
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Manage and automate your drip sequences
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl h-10 px-5 shadow-md shadow-primary/10 text-sm w-full md:w-auto flex-none"
        >
          <div className="flex items-center gap-2 justify-center">
            <Plus className="w-4 h-4" />
            <span className="font-bold whitespace-nowrap">New Campaign</span>
          </div>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <CampaignsSearch
          value={searchInput}
          onChange={(val) => setSearchInput(val)}
        />
        <CampaignsFilters
          selectedStatuses={selectedStatuses}
          onToggleStatus={toggleStatusFilter}
          onClearAll={() => setSelectedStatuses([])}
        />
      </div>

      {/* Campaigns Content */}
      <div className="space-y-6">
        {isLoading ? (
          <CampaignListSkeleton />
        ) : campaigns && campaigns.length > 0 ? (
          <>
            <div className="flex items-center px-4">
              <p className="text-sm text-slate-400 font-bold">
                Showing{" "}
                <span className="text-slate-900">{campaigns.length}</span>{" "}
                active campaigns
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {campaigns.map((campaign: Campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
              <Rocket className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              No campaigns found
            </h2>
            <p className="text-slate-500 max-w-sm mb-8 font-medium">
              You haven&apos;t created any campaigns yet. Launch your first one
              to start driving results.
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5 mr-2" />
                First Campaign
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateCampaignDialog
        key={isCreateOpen ? editingCampaign?.id || "new" : "closed"}
        isOpen={isCreateOpen}
        onClose={closeDialog}
        editCampaign={editingCampaign}
      />
    </div>
  );
}
