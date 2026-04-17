"use client";

import { X, Loader2 } from "lucide-react";
import { EnrolledCampaignSummary } from "@/types/lead";
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
  leadId: string;
}

export function CampaignPills({ campaigns, leadId }: CampaignPillsProps) {
  const removeMutation = useRemoveLeadsFromCampaignMutation();

  if (!campaigns || campaigns.length === 0) {
    return <span className="text-[10px] text-slate-300 italic">None</span>;
  }

  const visible = campaigns.slice(0, MAX_VISIBLE);
  const overflow = campaigns.length - MAX_VISIBLE;

  const handleRemove = async (campaign: EnrolledCampaignSummary) => {
    try {
      await removeMutation.mutateAsync({
        campaignId: campaign.id,
        leadIds: [leadId],
      });
      toast.success(`Removed from ${campaign.name}`);
    } catch {
      toast.error("Failed to remove from campaign");
    }
  };

  const isRemoving = (campaignId: string) =>
    removeMutation.isPending &&
    removeMutation.variables?.campaignId === campaignId;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((c) => (
        <span
          key={c.id}
          className="group inline-flex items-center gap-1 pl-1.5 pr-1 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 max-w-[120px]"
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              CAMPAIGN_STATUS_DOT[c.campaignStatus] ?? "bg-slate-300",
            )}
          />
          <span className="truncate">{c.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(c);
            }}
            disabled={isRemoving(c.id)}
            className="ml-0.5 text-slate-300 hover:text-rose-500 transition-colors disabled:opacity-50"
            title={`Remove from ${c.name}`}
          >
            {isRemoving(c.id) ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            ) : (
              <X className="w-2.5 h-2.5" />
            )}
          </button>
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 cursor-default"
          title={campaigns
            .slice(MAX_VISIBLE)
            .map((c) => c.name)
            .join("\n")}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
