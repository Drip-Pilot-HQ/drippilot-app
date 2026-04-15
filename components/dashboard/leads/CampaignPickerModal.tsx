"use client";

import { useState } from "react";
import { Search, Loader2, Workflow, X } from "lucide-react";
import { Campaign, CampaignStatus, EnrollmentScope } from "@/types/campaign";
import {
  useCampaignsQuery,
  useEnrollLeadsMutation,
  useRemoveLeadsFromCampaignMutation,
} from "@/store/server/campaign.queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/branding/Button";

const STATUS_DOT: Record<CampaignStatus, string> = {
  [CampaignStatus.ACTIVE]: "bg-emerald-500",
  [CampaignStatus.PAUSED]: "bg-amber-400",
  [CampaignStatus.DRAFT]: "bg-slate-300",
};

interface CampaignPickerModalProps {
  open: boolean;
  onClose: () => void;
  mode: "enroll" | "remove";
  leadIds: string[];
  onSuccess?: () => void;
}

export function CampaignPickerModal({
  open,
  onClose,
  mode,
  leadIds,
  onSuccess,
}: CampaignPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const debouncedSearch = useDebounce(search, 300);

  const { data: campaigns, isLoading } = useCampaignsQuery({
    search: debouncedSearch || undefined,
    status: [CampaignStatus.ACTIVE, CampaignStatus.PAUSED],
  });

  const enrollMutation = useEnrollLeadsMutation();
  const removeMutation = useRemoveLeadsFromCampaignMutation();

  const isPending = enrollMutation.isPending || removeMutation.isPending;

  const handleConfirm = async () => {
    if (!selectedCampaign) return;

    try {
      if (mode === "enroll") {
        await enrollMutation.mutateAsync({
          campaignId: selectedCampaign.id,
          dto: { scope: EnrollmentScope.SELECTION, leadIds },
        });
        toast.success(
          `Enrolling ${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} in ${selectedCampaign.name}`,
        );
      } else {
        await removeMutation.mutateAsync({
          campaignId: selectedCampaign.id,
          leadIds,
        });
        toast.success(
          `Removed ${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} from ${selectedCampaign.name}`,
        );
      }
      onSuccess?.();
      handleClose();
    } catch {
      toast.error(`Failed to ${mode === "enroll" ? "enroll" : "remove"} leads`);
    }
  };

  const handleClose = () => {
    setSearch("");
    setSelectedCampaign(null);
    onClose();
  };

  if (!open) return null;

  const title =
    mode === "enroll"
      ? `Enroll ${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} in...`
      : `Remove ${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} from...`;

  const confirmLabel =
    mode === "enroll"
      ? `Enroll ${leadIds.length} Lead${leadIds.length !== 1 ? "s" : ""}`
      : `Remove ${leadIds.length} Lead${leadIds.length !== 1 ? "s" : ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Campaign list */}
        <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() =>
                  setSelectedCampaign(
                    selectedCampaign?.id === campaign.id ? null : campaign,
                  )
                }
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                  selectedCampaign?.id === campaign.id
                    ? "bg-primary/10 ring-1 ring-primary/20"
                    : "hover:bg-slate-50",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                    selectedCampaign?.id === campaign.id
                      ? "bg-primary/10 border-primary/20"
                      : "bg-white border-slate-200",
                  )}
                >
                  <Workflow
                    className={cn(
                      "w-4 h-4",
                      selectedCampaign?.id === campaign.id
                        ? "text-primary"
                        : "text-slate-400",
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-xs font-bold truncate",
                      selectedCampaign?.id === campaign.id
                        ? "text-primary"
                        : "text-slate-700",
                    )}
                  >
                    {campaign.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {campaign.emailBased ? "Email" : ""}
                    {campaign.emailBased && campaign.smsBased ? " & " : ""}
                    {campaign.smsBased ? "SMS" : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    STATUS_DOT[campaign.status],
                  )}
                />
              </button>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-[11px] font-bold text-slate-400">
                No campaigns found
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
          >
            Cancel
          </button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedCampaign || isPending}
            isLoading={isPending}
            className={cn(
              "h-8 px-4 text-xs rounded-lg",
              mode === "remove" &&
                "bg-rose-500 hover:bg-rose-600 shadow-rose-200",
            )}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
