"use client";

import { useState } from "react";
import { Plus, Webhook, X } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import {
  useLeadSourcesQuery,
  useCreateLeadSourceMutation,
} from "@/store/server/lead-source.queries";
import { useCampaignsQuery } from "@/store/server/campaign.queries";
import { SourceRule } from "@/types/lead-source";
import { WebhookRow } from "./WebhookRow";
import { WebhookListSkeleton } from "./WebhookSkeleton";
import { WebhookForm } from "./WebhookForm";
import { SecretRevealModal } from "./SecretRevealModal";
import { WebhookDocs } from "./WebhookDocs";
import { IntegrationPlatforms } from "./IntegrationPlatforms";

interface SecretRevealState {
  secret: string;
  name: string;
  slug: string;
}

export function IntegrationClient() {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [secretReveal, setSecretReveal] = useState<SecretRevealState | null>(
    null,
  );

  const { data: sources = [], isLoading: isLoadingSources } =
    useLeadSourcesQuery();
  const { data: campaigns = [], isLoading: isLoadingCampaigns } =
    useCampaignsQuery();
  const createMutation = useCreateLeadSourceMutation();

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setIsCreating(false);
  };

  const handleCreate = async (
    name: string,
    rules: SourceRule[],
    defaultAssigneeId: string | null,
  ) => {
    const result = await createMutation.mutateAsync({
      name,
      rules,
      defaultAssigneeId,
    });
    setSecretReveal({
      secret: result.secret,
      name: result.name,
      slug: result.slug,
    });
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setExpandedId(null);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Integrations
          </h1>
          <p className="text-slate-500 mt-1">
            Receive leads from any platform and route them into campaigns
          </p>
        </div>
        {isOwnerOrAdmin && !isCreating && (
          <Button
            onClick={handleStartCreate}
            className="rounded-xl h-10 px-4 text-sm w-full md:w-auto flex-none"
          >
            <div className="flex items-center gap-2 justify-center">
              <Plus className="w-4 h-4" />
              <span className="font-semibold whitespace-nowrap">
                New Webhook
              </span>
            </div>
          </Button>
        )}
      </div>

      {/* ── Platforms ── */}
      <IntegrationPlatforms />

      <div className="space-y-4">
        {/* ── Inline Create Form ── */}
        {isOwnerOrAdmin && isCreating && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-100">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  New webhook
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  You&apos;ll get a unique URL and secret to send leads to
                </p>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <WebhookForm
                campaigns={campaigns}
                isLoadingCampaigns={isLoadingCampaigns}
                isSubmitting={createMutation.isPending}
                submitLabel="Create Webhook"
                onCancel={() => setIsCreating(false)}
                onSubmit={handleCreate}
              />
            </div>
          </div>
        )}

        {/* ── Webhook List ── */}
        {isLoadingSources ? (
          <WebhookListSkeleton />
        ) : sources.length === 0 && !isCreating ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white border border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
              <Webhook className="w-6 h-6" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              No webhooks yet
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Create a webhook to start receiving leads from your CRM, forms, or
              automation tools.
            </p>
            {isOwnerOrAdmin && (
              <Button
                onClick={handleStartCreate}
                className="rounded-xl px-5 h-10 text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Webhook
              </Button>
            )}
          </div>
        ) : (
          sources.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
              {sources.map((source) => (
                <WebhookRow
                  key={source.id}
                  source={source}
                  campaigns={campaigns}
                  isLoadingCampaigns={isLoadingCampaigns}
                  isExpanded={expandedId === source.id}
                  onToggleExpand={() => handleToggleExpand(source.id)}
                  onSecretRegenerated={(secret, name, slug) =>
                    setSecretReveal({ secret, name, slug })
                  }
                  isOwnerOrAdmin={isOwnerOrAdmin}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* ── Integration Docs ── */}
      <WebhookDocs />

      {/* ── Secret Reveal Modal ── */}
      {secretReveal && (
        <SecretRevealModal
          isOpen={true}
          onClose={() => setSecretReveal(null)}
          secret={secretReveal.secret}
          webhookName={secretReveal.name}
          webhookUrl={`${apiUrl}/sources/${secretReveal.slug}`}
        />
      )}
    </div>
  );
}
