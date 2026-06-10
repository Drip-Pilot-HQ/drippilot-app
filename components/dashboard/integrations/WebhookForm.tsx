"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { SourceRule } from "@/types/lead-source";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/branding/Button";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { getMemberDisplayName } from "@/lib/utils/member";
import { RulesBuilder } from "./RulesBuilder";

function makeEmptyRule(): SourceRule {
  return {
    condition: { matchMode: "AND", tags: [], leadStatus: undefined },
    action: { campaignIds: [] },
  };
}

interface WebhookFormProps {
  initialName?: string;
  initialRules?: SourceRule[];
  initialAssigneeId?: string | null;
  campaigns: Campaign[];
  isLoadingCampaigns: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (
    name: string,
    rules: SourceRule[],
    defaultAssigneeId: string | null,
  ) => Promise<void>;
}

export function WebhookForm({
  initialName = "",
  initialRules,
  initialAssigneeId = null,
  campaigns,
  isLoadingCampaigns,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
}: WebhookFormProps) {
  const [name, setName] = useState(initialName);
  const [rules, setRules] = useState<SourceRule[]>(
    initialRules?.length ? initialRules : [makeEmptyRule()],
  );
  const [assigneeId, setAssigneeId] = useState<string | null>(
    initialAssigneeId,
  );

  const { data: members = [] } = useMembersQuery();
  const activeMembers = members.filter(
    (m) => m.userId !== null && m.status === "active",
  );

  const validRules = rules.filter(
    (r) => (r.condition.tags?.length ?? 0) > 0 || !!r.condition.leadStatus,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name, validRules, assigneeId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Webhook Name <span className="text-rose-500">*</span>
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Meta Ads Leads, Google Ads, HubSpot CRM…"
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Assignee */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Assign incoming leads to
          </label>
          <span className="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
            Optional
          </span>
        </div>
        <select
          value={assigneeId ?? ""}
          onChange={(e) => setAssigneeId(e.target.value || null)}
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900"
        >
          <option value="">Team-wide (unassigned)</option>
          {activeMembers.map((m) => (
            <option key={m.id} value={m.userId as string}>
              {getMemberDisplayName(m)}
            </option>
          ))}
        </select>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          New leads from this webhook are assigned to this member so they appear
          in their personal view. Leave team-wide to keep them visible to
          everyone.
        </p>
      </div>

      {/* Rules */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Routing Rules
          </label>
          <span className="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
            Optional
          </span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          Rules let you auto-enroll leads into specific campaigns based on their
          tags or status. If no rules match, the lead is still saved but not
          enrolled.
        </p>
        <RulesBuilder
          rules={rules}
          onChange={setRules}
          campaigns={campaigns}
          isLoadingCampaigns={isLoadingCampaigns}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 rounded-xl h-12 text-sm"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="flex-2 rounded-xl h-12 text-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{submitLabel}</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
