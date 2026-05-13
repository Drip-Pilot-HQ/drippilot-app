"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Rocket,
  Play,
  Pause,
  Settings2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Campaign, CampaignStatus } from "@/types/campaign";
import { useUpdateCampaignStatusMutation } from "@/store/server/campaign.queries";
import { CreateCampaignDialog } from "@/components/dashboard/campaigns/CreateCampaignDialog";
import { Button } from "@/components/branding/Button";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { cn } from "@/lib/utils";

interface CampaignDetailHeaderProps {
  campaign: Campaign;
  stepsCount: number;
}

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; dot: string; badge: string }
> = {
  [CampaignStatus.ACTIVE]: {
    label: "Active",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  [CampaignStatus.PAUSED]: {
    label: "Paused",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  [CampaignStatus.DRAFT]: {
    label: "Draft",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  },
};

function getActionConfig(status: CampaignStatus): {
  label: string;
  icon: React.ReactNode;
  nextStatus: CampaignStatus;
  variant: "primary" | "outline";
} {
  if (status === CampaignStatus.ACTIVE) {
    return {
      label: "Pause",
      icon: <Pause className="w-3.5 h-3.5" />,
      nextStatus: CampaignStatus.PAUSED,
      variant: "outline",
    };
  }
  return {
    label: status === CampaignStatus.PAUSED ? "Resume" : "Activate",
    icon: <Play className="w-3.5 h-3.5" />,
    nextStatus: CampaignStatus.ACTIVE,
    variant: "primary",
  };
}

export function CampaignDetailHeader({
  campaign,
  stepsCount,
}: CampaignDetailHeaderProps) {
  const router = useRouter();
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const statusMutation = useUpdateCampaignStatusMutation();

  const statusConfig = STATUS_CONFIG[campaign.status];
  const actionConfig = getActionConfig(campaign.status);

  const handleStatusChange = async () => {
    if (actionConfig.nextStatus === CampaignStatus.ACTIVE && stepsCount === 0) {
      return;
    }
    await statusMutation.mutateAsync({
      id: campaign.id,
      status: { status: actionConfig.nextStatus },
    });
  };

  const isTransitionDisabled =
    statusMutation.isPending ||
    (actionConfig.nextStatus === CampaignStatus.ACTIVE && stepsCount === 0);

  return (
    <>
      <div className="space-y-4">
        <button
          onClick={() => router.push("/dashboard/campaigns")}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3" />
          Campaigns
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Rocket className="w-5 h-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">
                  {campaign.name}
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    statusConfig.badge,
                  )}
                >
                  <span
                    className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)}
                  />
                  {statusConfig.label}
                </span>
              </div>

              {campaign.description && (
                <p className="text-sm text-slate-500 font-medium mb-2 leading-relaxed">
                  {campaign.description}
                </p>
              )}

              <div className="flex items-center gap-2">
                {campaign.emailBased && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    <Mail className="w-2.5 h-2.5" />
                    Email
                  </span>
                )}
                {campaign.smsBased && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100">
                    <MessageSquare className="w-2.5 h-2.5" />
                    SMS
                  </span>
                )}
              </div>
            </div>
          </div>

          {isOwnerOrAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <div
                title={
                  stepsCount === 0 &&
                  actionConfig.nextStatus === CampaignStatus.ACTIVE
                    ? "Add steps to your workflow before activating"
                    : undefined
                }
                className="w-fit"
              >
                <Button
                  size="sm"
                  variant={actionConfig.variant}
                  onClick={handleStatusChange}
                  disabled={isTransitionDisabled}
                  className="h-9 px-4 text-xs rounded-xl gap-1.5"
                >
                  {statusMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    actionConfig.icon
                  )}
                  {actionConfig.label}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOwnerOrAdmin && (
        <CreateCampaignDialog
          key={isEditOpen ? campaign.id : "closed"}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          editCampaign={campaign}
        />
      )}
    </>
  );
}
