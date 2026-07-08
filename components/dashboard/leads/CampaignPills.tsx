"use client";

import { X, Loader2, History } from "lucide-react";
import { EnrolledCampaignSummary, CampaignHistoryItem } from "@/types/lead";
import { useRemoveLeadsFromCampaignMutation } from "@/store/server/campaign.queries";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CAMPAIGN_STATUS_DOT: Record<string, string> = {
  active: "bg-emerald-500",
  paused: "bg-amber-400",
  draft: "bg-slate-300",
};

const MAX_VISIBLE = 2;

interface CampaignPillsProps {
  campaigns: EnrolledCampaignSummary[];
  history?: CampaignHistoryItem[];
  leadId: string;
}

export function CampaignPills({
  campaigns,
  history,
  leadId,
}: CampaignPillsProps) {
  const removeMutation = useRemoveLeadsFromCampaignMutation();

  const pastHistory = (history ?? []).filter(
    (h) => !campaigns.some((c) => c.id === h.campaignId),
  );

  const allItems = [
    ...campaigns.map((c) => ({ ...c, type: "active" as const })),
    ...pastHistory.map((h) => ({
      ...h,
      type: "history" as const,
      id: h.campaignId,
      name: h.campaignName,
    })),
  ];

  if (allItems.length === 0) {
    return <span className="text-[10px] text-slate-300 italic">None</span>;
  }

  const visible = allItems.slice(0, MAX_VISIBLE);
  const overflow = allItems.length - MAX_VISIBLE;

  const handleRemove = async (campaignId: string, campaignName: string) => {
    try {
      await removeMutation.mutateAsync({
        campaignId,
        leadIds: [leadId],
      });
      toast.success(`Removed from ${campaignName}`);
    } catch {
      toast.error("Failed to remove from campaign");
    }
  };

  const isRemoving = (campaignId: string) =>
    removeMutation.isPending &&
    removeMutation.variables?.campaignId === campaignId;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((item) => {
        if (item.type === "active") {
          return (
            <span
              key={`active-${item.id}`}
              className="group inline-flex items-center gap-1 pl-1.5 pr-1 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 max-w-[120px]"
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  CAMPAIGN_STATUS_DOT[item.campaignStatus] ?? "bg-slate-300",
                )}
              />
              <span className="truncate">{item.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id, item.name);
                }}
                disabled={isRemoving(item.id)}
                className="ml-0.5 text-slate-300 hover:text-rose-500 transition-colors disabled:opacity-50"
                title={`Remove from ${item.name}`}
              >
                {isRemoving(item.id) ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <X className="w-2.5 h-2.5" />
                )}
              </button>
            </span>
          );
        } else {
          return (
            <span
              key={`history-${item.id}`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 max-w-[120px] cursor-help"
              title={`Previously in ${item.name} (Step ${item.lastStepNumber} — ${item.status})`}
            >
              <History className="w-2.5 h-2.5 shrink-0 opacity-60" />
              <span className="truncate">{item.name}</span>
            </span>
          );
        }
      })}
      {overflow > 0 && (
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 cursor-default"
          title={allItems
            .slice(MAX_VISIBLE)
            .map((c) => (c.type === "active" ? c.name : `${c.name} (Past)`))
            .join("\n")}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
