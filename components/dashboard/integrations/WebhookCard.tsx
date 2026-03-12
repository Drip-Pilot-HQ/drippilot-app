"use client";

import { useState } from "react";
import {
  Webhook,
  MoreVertical,
  Calendar,
  Trash2,
  Edit2,
  Copy,
  Check,
  RefreshCw,
  Power,
  PowerOff,
  Loader2,
  Filter,
  Rocket,
  ChevronRight,
} from "lucide-react";
import { LeadSource } from "@/types/lead-source";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  useDeleteLeadSourceMutation,
  useRegenerateSecretMutation,
  useUpdateLeadSourceMutation,
} from "@/store/server/lead-source.queries";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";

interface WebhookCardProps {
  source: LeadSource;
  onEdit: (source: LeadSource) => void;
  onSecretRegenerated: (secret: string, name: string, slug: string) => void;
}

export function WebhookCard({
  source,
  onEdit,
  onSecretRegenerated,
}: WebhookCardProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const deleteMutation = useDeleteLeadSourceMutation();
  const regenerateMutation = useRegenerateSecretMutation();
  const updateMutation = useUpdateLeadSourceMutation();
  const confirm = useConfirm();

  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/sources/${source.slug}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete Webhook",
      description: `Are you sure you want to delete "${source.name}"? All incoming leads from this source will stop.`,
      confirmLabel: "Delete Webhook",
      variant: "danger",
    });
    if (ok) await deleteMutation.mutateAsync(source.id);
  };

  const handleRegenerate = async () => {
    const ok = await confirm({
      title: "Regenerate Secret",
      description:
        "The current secret will be invalidated immediately. All existing integrations using it will break.",
      confirmLabel: "Regenerate",
      variant: "danger",
    });
    if (ok) {
      const result = await regenerateMutation.mutateAsync(source.id);
      onSecretRegenerated(result.secret, source.name, source.slug);
    }
  };

  const handleToggleActive = () => {
    updateMutation.mutate({
      id: source.id,
      dto: { isActive: !source.isActive },
    });
  };

  const rulesCount = source.rules?.length ?? 0;
  const isBusy =
    updateMutation.isPending ||
    deleteMutation.isPending ||
    regenerateMutation.isPending;

  return (
    <div
      className={cn(
        "group relative bg-white border rounded-2xl p-5",
        "shadow-sm hover:shadow-xl hover:-translate-y-[2px]",
        "hover:border-primary/30 transition-all duration-300",
        source.isActive
          ? "border-slate-200/80"
          : "border-slate-200/50 opacity-70",
      )}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-linear-to-br from-primary/3 via-transparent to-primary/4" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
            source.isActive
              ? "bg-primary/10 text-primary group-hover:bg-primary/20"
              : "bg-slate-100 text-slate-400",
          )}
        >
          <Webhook className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
              isBusy
                ? "opacity-50 cursor-wait bg-slate-100 text-slate-400"
                : "",
              !isBusy &&
                (source.isActive
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"),
            )}
          >
            {isBusy && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
            {source.isActive ? "Active" : "Inactive"}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none outline-none">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(source)}>
                <Edit2 className="w-3.5 h-3.5" />
                Edit Webhook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleActive}>
                {source.isActive ? (
                  <>
                    <PowerOff className="w-3.5 h-3.5 text-amber-500" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5 text-emerald-500" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRegenerate}>
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                Regenerate Secret
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} variant="danger">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Name + URL */}
      <div className="relative mb-4">
        <h3 className="text-[15px] font-black text-slate-900 group-hover:text-primary transition-colors truncate mb-2">
          {source.name}
        </h3>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
          <code className="text-[10px] text-slate-500 font-mono flex-1 truncate">
            {webhookUrl}
          </code>
          <button
            onClick={copyUrl}
            className="shrink-0 p-1 rounded-md hover:bg-slate-200 transition-all text-slate-400"
          >
            {copiedUrl ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Rules preview */}
      {rulesCount > 0 && (
        <div className="mb-4 space-y-1.5">
          {source.rules.slice(0, 2).map((rule, i) => {
            const tags = rule.condition.tags || [];
            const status = rule.condition.leadStatus;
            const campaignCount = rule.action.campaignIds.length;

            return (
              <div
                key={i}
                className="flex items-center gap-2 text-[10px] bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
              >
                <Filter className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-slate-500 truncate flex-1">
                  {tags.length > 0 && (
                    <span className="font-bold text-secondary">
                      {tags.join(", ")}
                    </span>
                  )}
                  {tags.length > 0 && status && (
                    <span className="text-slate-400">
                      {" "}
                      {rule.condition.matchMode}{" "}
                    </span>
                  )}
                  {status && (
                    <span className="font-bold text-primary capitalize">
                      {status}
                    </span>
                  )}
                  {!tags.length && !status && (
                    <span className="text-slate-400 italic">No conditions</span>
                  )}
                </span>
                <div className="flex items-center gap-1 text-slate-400 shrink-0">
                  <ChevronRight className="w-3 h-3" />
                  <Rocket className="w-2.5 h-2.5" />
                  <span>{campaignCount}</span>
                </div>
              </div>
            );
          })}
          {rulesCount > 2 && (
            <p className="text-[10px] text-slate-400 font-medium px-1">
              +{rulesCount - 2} more rule{rulesCount - 2 !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="relative pt-4 border-t border-slate-100/80">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDistanceToNow(new Date(source.createdAt), {
              addSuffix: true,
            })}
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3 h-3" />
            {rulesCount} rule{rulesCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
