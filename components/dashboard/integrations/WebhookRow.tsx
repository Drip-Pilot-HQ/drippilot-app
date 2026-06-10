"use client";

import { useState } from "react";
import {
  MoreVertical,
  Trash2,
  Pencil,
  Copy,
  Check,
  RefreshCw,
  Power,
  PowerOff,
  Loader2,
  Filter,
  UserRound,
  ChevronDown,
  ChevronUp,
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
import { useMembersQuery } from "@/store/server/workspace.queries";
import { getMemberDisplayName } from "@/lib/utils/member";
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
  const { data: members = [] } = useMembersQuery();
  const confirm = useConfirm();

  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/lead-sources/webhook/${source.slug}`;

  const assignee = source.defaultAssigneeId
    ? members.find((m) => m.userId === source.defaultAssigneeId)
    : undefined;

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
    <div className={cn(isExpanded && "bg-slate-50/40")}>
      {/* ── Row ── */}
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Name + status */}
            <div className="flex items-center gap-2.5">
              {isBusy ? (
                <Loader2 className="w-2.5 h-2.5 shrink-0 animate-spin text-slate-400" />
              ) : (
                <span
                  title={source.isActive ? "Active" : "Inactive"}
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    source.isActive ? "bg-emerald-500" : "bg-slate-300",
                  )}
                />
              )}
              <h3 className="text-sm font-semibold text-slate-900 truncate">
                {source.name}
              </h3>
              {!source.isActive && (
                <span className="text-xs text-slate-400 shrink-0">
                  Inactive
                </span>
              )}
            </div>

            {/* URL */}
            <div className="flex items-center gap-1.5 min-w-0 max-w-xl">
              <code
                className="text-xs text-slate-400 font-mono truncate"
                title={webhookUrl}
              >
                {webhookUrl}
              </code>
              <button
                onClick={copyUrl}
                className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors"
                title="Copy URL"
              >
                {copiedUrl ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              {rulesCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  {rulesCount} rule{rulesCount !== 1 ? "s" : ""}
                </span>
              )}
              {assignee && (
                <span
                  className="inline-flex items-center gap-1 max-w-[55vw] sm:max-w-none truncate"
                  title="New leads are assigned to this member"
                >
                  <UserRound className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {getMemberDisplayName(assignee)}
                  </span>
                </span>
              )}
              <span className="hidden sm:inline">
                Created{" "}
                {formatDistanceToNow(new Date(source.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Actions — OWNER/ADMIN only */}
          {isOwnerOrAdmin && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onToggleExpand}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isExpanded
                    ? "bg-slate-900 text-white hover:bg-slate-700"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                )}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none">
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
        <div className="border-t border-slate-100 px-4 py-5 sm:px-6 sm:py-6">
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
      )}
    </div>
  );
}
