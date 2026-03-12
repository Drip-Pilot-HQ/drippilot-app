"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { SourceRule } from "@/types/lead-source";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/branding/Button";
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
  campaigns: Campaign[];
  isLoadingCampaigns: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (name: string, rules: SourceRule[]) => Promise<void>;
}

export function WebhookForm({
  initialName = "",
  initialRules,
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

  const validRules = rules.filter(
    (r) => (r.condition.tags?.length ?? 0) > 0 || !!r.condition.leadStatus,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name, validRules);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Webhook Name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Meta Ads Leads, Google Ads, HubSpot CRM…"
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-slate-900 text-sm placeholder:font-normal placeholder:text-slate-400"
        />
      </div>

      {/* Rules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
            Routing Rules
          </label>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
            Optional
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
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
