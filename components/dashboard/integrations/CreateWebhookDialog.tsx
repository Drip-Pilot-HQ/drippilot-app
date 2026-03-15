"use client";

import { useState } from "react";
import { X, Webhook, Sparkles, Loader2 } from "lucide-react";
import { LeadSource, SourceRule } from "@/types/lead-source";
import {
  useCreateLeadSourceMutation,
  useUpdateLeadSourceMutation,
} from "@/store/server/lead-source.queries";
import { useCampaignsQuery } from "@/store/server/campaign.queries";
import { Button } from "@/components/branding/Button";
import { RulesBuilder } from "./RulesBuilder";

function makeEmptyRule(): SourceRule {
  return {
    condition: { matchMode: "AND", tags: [], leadStatus: undefined },
    action: { campaignIds: [] },
  };
}

interface CreateWebhookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editSource?: LeadSource | null;
  onSecretCreated?: (secret: string, name: string, slug: string) => void;
}

export function CreateWebhookDialog(props: CreateWebhookDialogProps) {
  if (!props.isOpen) return null;
  return <CreateWebhookDialogContent {...props} />;
}

function CreateWebhookDialogContent({
  onClose,
  editSource,
  onSecretCreated,
}: CreateWebhookDialogProps) {
  // State is lazily initialized from props — no useEffect needed
  // (outer guard ensures this component only mounts when isOpen=true)
  const [name, setName] = useState(() => editSource?.name ?? "");
  const [rules, setRules] = useState<SourceRule[]>(() =>
    editSource?.rules?.length ? editSource.rules : [makeEmptyRule()],
  );

  const createMutation = useCreateLeadSourceMutation();
  const updateMutation = useUpdateLeadSourceMutation();
  const { data: campaigns = [], isLoading: isLoadingCampaigns } =
    useCampaignsQuery();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const validRules = (rules: SourceRule[]) =>
    rules.filter(
      (r) => (r.condition.tags?.length ?? 0) > 0 || !!r.condition.leadStatus,
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editSource) {
        await updateMutation.mutateAsync({
          id: editSource.id,
          dto: { name, rules: validRules(rules) },
        });
        onClose();
      } else {
        const result = await createMutation.mutateAsync({
          name,
          rules: validRules(rules),
        });
        onSecretCreated?.(result.secret, result.name, result.slug);
        onClose();
      }
    } catch {
      // handled by axios interceptor toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Fixed header */}
        <div className="p-8 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Webhook className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editSource ? "Edit Webhook" : "New Webhook"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Route leads with smart rules
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-8 overflow-y-auto flex-1 space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Webhook Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Meta Ads Leads"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
              />
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Routing Rules
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Optional
                </span>
              </div>
              <RulesBuilder
                rules={rules}
                onChange={setRules}
                campaigns={campaigns}
                isLoadingCampaigns={isLoadingCampaigns}
              />
            </div>
          </div>

          {/* Fixed footer */}
          <div className="px-8 pb-8 pt-4 shrink-0 flex items-center gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-2 rounded-xl h-12 text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {editSource ? "Update Webhook" : "Create Webhook"}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
