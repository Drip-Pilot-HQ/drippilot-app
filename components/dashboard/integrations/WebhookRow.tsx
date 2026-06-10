"use client";

import { useState } from "react";
import {
  Webhook,
  MoreVertical,
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
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { LeadSource, SourceRule } from "@/types/lead-source";
import { Campaign } from "@/types/campaign";
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
import { WebhookForm } from "./WebhookForm";

interface WebhookRowProps {
  source: LeadSource;
  campaigns: Campaign[];
  isLoadingCampaigns: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSecretRegenerated: (secret: string, name: string, slug: string) => void;
  isOwnerOrAdmin: boolean;
}

export function WebhookRow({
  source,
  campaigns,
  isLoadingCampaigns,
  isExpanded,
  onToggleExpand,
  onSecretRegenerated,
  isOwnerOrAdmin,
}: WebhookRowProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const deleteMutation = useDeleteLeadSourceMutation();
  const regenerateMutation = useRegenerateSecretMutation();
  const updateMutation = useUpdateLeadSourceMutation();
  const confirm = useConfirm();

  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/lead-sources/webhook/${source.slug}`;

  const copyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete Webhook",
      description: `Delete "${source.name}"? All incoming leads from this source will stop.`,
      confirmLabel: "Delete Webhook",
      variant: "danger",
    });
    if (ok) await deleteMutation.mutateAsync(source.id);
  };

  const handleRegenerate = async () => {
    const ok = await confirm({
      title: "Regenerate Secret",
      description:
        "The current secret will be invalidated immediately. Existing integrations will stop working until updated.",
      confirmLabel: "Regenerate",
      variant: "danger",
    });
    if (ok) {
      const result = await regenerateMutation.mutateAsync(source.id);
      onSecretRegenerated(result.secret, source.name, source.slug);
    }
  };

  const handleSave = async (
    name: string,
    rules: SourceRule[],
    defaultAssigneeId: string | null,
  ) => {
    await updateMutation.mutateAsync({
      id: source.id,
      dto: { name, rules, defaultAssigneeId },
    });
    onToggleExpand();
  };

  const isBusy =
    deleteMutation.isPending ||
    regenerateMutation.isPending ||
    updateMutation.isPending;
  const rulesCount = source.rules?.length ?? 0;

  return (
    <div
      className={cn(
        "bg-white border-2 rounded-2xl overflow-hidden transition-all duration-200",
        isExpanded
          ? "border-primary/30 shadow-lg"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md",
      )}
    >
      {/* ── Collapsed Row ── */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5",
              source.isActive
                ? "bg-primary/10 text-primary"
                : "bg-slate-100 text-slate-400",
            )}
          >
            <Webhook className="w-5 h-5" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Name + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black text-slate-900 truncate">
                {source.name}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  isBusy
                    ? "bg-slate-100 text-slate-400"
                    : source.isActive
                      ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                      : "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
                )}
              >
                {isBusy && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                {source.isActive ? "Active" : "Inactive"}
              </span>
              {rulesCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-primary/5 text-primary ring-1 ring-primary/20">
                  <Filter className="w-2.5 h-2.5" />
                  {rulesCount} rule{rulesCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Webhook URL */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 max-w-xl">
              <code className="text-xs text-slate-500 font-mono flex-1 truncate">
                {webhookUrl}
              </code>
              <button
                onClick={copyUrl}
                className="shrink-0 p-1 rounded-md hover:bg-slate-200 transition-all text-slate-400"
                title="Copy URL"
              >
                {copiedUrl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Rules summary */}
            {rulesCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {source.rules.slice(0, 3).map((rule, i) => {
                  const tags = rule.condition.tags || [];
                  const status = rule.condition.leadStatus;
                  const count = rule.action.campaignIds.length;
                  if (!tags.length && !status) return null;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                    >
                      <Filter className="w-3 h-3 text-slate-400 shrink-0" />
                      {tags.length > 0 && (
                        <span className="font-bold text-secondary truncate max-w-[120px]">
                          {tags.join(", ")}
                        </span>
                      )}
                      {tags.length > 0 && status && (
                        <span className="text-slate-400 font-bold">
                          {rule.condition.matchMode}
                        </span>
                      )}
                      {status && (
                        <span className="font-bold text-primary capitalize">
                          {status}
                        </span>
                      )}
                      <span className="text-slate-400">→</span>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Rocket className="w-3 h-3" />
                        {count}
                      </span>
                    </div>
                  );
                })}
                {rulesCount > 3 && (
                  <span className="text-xs text-slate-400 font-medium self-center">
                    +{rulesCount - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Footer meta */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Created{" "}
              {formatDistanceToNow(new Date(source.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          {/* Actions — OWNER/ADMIN only */}
          {isOwnerOrAdmin && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onToggleExpand}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                  isExpanded
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isExpanded ? "Editing" : "Edit"}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onClick={() =>
                      updateMutation.mutate({
                        id: source.id,
                        dto: { isActive: !source.isActive },
                      })
                    }
                  >
                    {source.isActive ? (
                      <>
                        <PowerOff className="w-3.5 h-3.5 text-amber-500" />
                        Deactivate Webhook
                      </>
                    ) : (
                      <>
                        <Power className="w-3.5 h-3.5 text-emerald-500" />
                        Activate Webhook
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
                    Delete Webhook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* ── Expanded Edit Form ── */}
      {isExpanded && isOwnerOrAdmin && (
        <div className="border-t-2 border-primary/15 bg-slate-50/50 p-4 sm:p-6">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide">
                Edit Webhook
              </h4>
            </div>
            <WebhookForm
              initialName={source.name}
              initialRules={source.rules}
              initialAssigneeId={source.defaultAssigneeId}
              campaigns={campaigns}
              isLoadingCampaigns={isLoadingCampaigns}
              isSubmitting={updateMutation.isPending}
              submitLabel="Save Changes"
              onCancel={onToggleExpand}
              onSubmit={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
