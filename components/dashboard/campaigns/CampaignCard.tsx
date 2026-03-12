"use client";

import {
  Rocket,
  MoreVertical,
  Calendar,
  Trash2,
  Edit2,
  Play,
  Pause,
  Loader2,
} from "lucide-react";
import { Campaign, CampaignStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  useDeleteCampaignMutation,
  useUpdateCampaignStatusMutation,
} from "@/store/server/campaign.queries";
import { useState } from "react";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onEdit }: CampaignCardProps) {
  const deleteMutation = useDeleteCampaignMutation();
  const statusMutation = useUpdateCampaignStatusMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const confirm = useConfirm();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Campaign",
      description: `Are you sure you want to delete "${campaign.name}"? This will stop all active sequences for this campaign.`,
      confirmLabel: "Delete Campaign",
      variant: "danger",
    });

    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(campaign.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleStatus = async () => {
    const nextStatus =
      campaign.status === CampaignStatus.ACTIVE
        ? CampaignStatus.PAUSED
        : CampaignStatus.ACTIVE;

    await statusMutation.mutateAsync({
      id: campaign.id,
      status: { status: nextStatus },
    });
  };

  return (
    <div
      className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 
    shadow-sm hover:shadow-xl hover:-translate-y-[2px] 
    hover:border-primary/30 transition-all duration-300"
    >
      {/* subtle gradient glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none
      bg-linear-to-br from-primary/3 via-transparent to-primary/4"
      />

      <div className="relative flex items-start justify-between mb-5">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
            campaign.status === CampaignStatus.ACTIVE
              ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
              : "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
          )}
        >
          <Rocket className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-sm",
              statusMutation.isPending
                ? "opacity-50 cursor-wait bg-slate-100 text-slate-400"
                : "",
              !statusMutation.isPending &&
                (campaign.status === CampaignStatus.ACTIVE
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                  : campaign.status === CampaignStatus.PAUSED
                    ? "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
                    : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"),
            )}
          >
            {statusMutation.isPending && (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            )}
            {campaign.status}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1.5 rounded-md text-slate-400 
              hover:text-slate-700 hover:bg-slate-100 
              transition-all focus:outline-none outline-none"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(campaign)}>
                <Edit2 className="w-3.5 h-3.5" />
                Edit Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={toggleStatus}>
                {campaign.status === CampaignStatus.ACTIVE ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-rose-500" />
                    Pause Campaign
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-500" />
                    Start Campaign
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                variant="danger"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative mb-5">
        <h3
          className="text-[15px] font-black text-slate-900 
        group-hover:text-primary transition-colors truncate mb-1"
        >
          {campaign.name}
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[32px]">
          {campaign.description || "No description provided"}
        </p>
      </div>

      <div className="relative pt-5 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          Created{" "}
          {formatDistanceToNow(new Date(campaign.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
}
