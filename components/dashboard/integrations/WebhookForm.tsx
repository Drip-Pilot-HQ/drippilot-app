"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SourceRule } from "@/types/lead-source";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/branding/Button";
import { CustomSelect } from "@/components/common/CustomSelect";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { getMemberDisplayName } from "@/lib/utils/member";
import { RulesBuilder } from "./RulesBuilder";

const TEAM_WIDE = "__team__";

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
  const assigneeOptions = [
    { value: TEAM_WIDE, label: "Team-wide (unassigned)" },
    ...members
      .filter((m) => m.userId !== null && m.status === "active")
      .map((m) => ({
        value: m.userId as string,
        label: getMemberDisplayName(m),
      })),
  ];

  const validRules = rules.filter(
    (r) => (r.condition.tags?.length ?? 0) > 0 || !!r.condition.leadStatus,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name, validRules, assigneeId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name + Assignee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Meta Ads, HubSpot, Zapier…"
            className="w-full h-12 px-4 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Assign incoming leads to
          </label>
          <CustomSelect
            value={assigneeId ?? TEAM_WIDE}
            onChange={(value) =>
              setAssigneeId(value === TEAM_WIDE ? null : value)
            }
            options={assigneeOptions}
          />
          <p className="text-xs text-slate-400 leading-relaxed">
            Assigned leads show up in that member&apos;s personal view.
            Team-wide leads are visible to everyone.
          </p>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Routing rules
            <span className="ml-2 text-xs font-normal text-slate-400">
              Optional
            </span>
          </label>
          <p className="text-xs text-slate-400 leading-relaxed mt-1">
            Auto-enroll leads into campaigns based on their tags or status.
            Leads that don&apos;t match any rule are still saved.
          </p>
        </div>
        <RulesBuilder
          rules={rules}
          onChange={setRules}
          campaigns={campaigns}
          isLoadingCampaigns={isLoadingCampaigns}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto rounded-xl h-11 sm:h-10 px-5 text-sm"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="w-full sm:w-auto rounded-xl h-11 sm:h-10 px-5 text-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
