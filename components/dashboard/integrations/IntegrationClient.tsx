"use client";

import { useState } from "react";
import { Plus, Webhook, X } from "lucide-react";
import { Button } from "@/components/branding/Button";
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

interface SecretRevealState {
  secret: string;
  name: string;
  slug: string;
}

export function IntegrationClient() {
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

  const handleCreate = async (name: string, rules: SourceRule[]) => {
    const result = await createMutation.mutateAsync({ name, rules });
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
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Integrations
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Connect your CRM and route incoming leads into campaigns with smart
            webhook rules
          </p>
        </div>
        {!isCreating && (
          <Button
            onClick={handleStartCreate}
            className="rounded-xl h-10 px-5 shadow-md shadow-primary/10 text-sm w-full md:w-auto flex-none"
          >
            <div className="flex items-center gap-2 justify-center">
              <Plus className="w-4 h-4" />
              <span className="font-bold whitespace-nowrap">New Webhook</span>
            </div>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* ── Inline Create Form ── */}
        {isCreating && (
          <div className="bg-white border-2 border-primary/30 rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-primary/5 border-b-2 border-primary/15">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Webhook className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">
                    New Webhook
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Set up a new lead source with routing rules
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 sm:p-8">
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
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
              <Webhook className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              No webhooks yet
            </h2>
            <p className="text-slate-500 max-w-sm mb-8 font-medium">
              Create your first webhook to start routing CRM leads into
              campaigns automatically.
            </p>
            <Button
              onClick={handleStartCreate}
              className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Webhook
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
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
              />
            ))}
          </div>
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
