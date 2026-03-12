"use client";

import { useState } from "react";
import { ChevronDown, GitBranch } from "lucide-react";
import { CampaignStep } from "@/types/campaign";
import { TemplateChannel } from "@/types/template";
import { Campaign } from "@/types/campaign";
import { StepCard } from "./StepCard";
import { AddStepButton } from "./AddStepButton";
import {
  StepCardSkeleton,
  StepConnectorSkeleton,
} from "../CampaignDetailSkeleton";

interface StepListProps {
  steps: CampaignStep[];
  campaign: Campaign;
  isLoading: boolean;
  allowedChannels: TemplateChannel[];
}

export function StepList({
  steps,
  campaign,
  isLoading,
  allowedChannels,
}: StepListProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-0 w-full">
        {[1, 2, 3].map((i, idx) => (
          <div key={i}>
            <StepCardSkeleton />
            {idx < 2 && <StepConnectorSkeleton />}
          </div>
        ))}
      </div>
    );
  }

  const sorted = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="flex flex-col">
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-slate-200 rounded-2xl mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <GitBranch className="w-6 h-6 text-slate-300" />
          </div>
          <h3 className="text-sm font-black text-slate-900 mb-1">
            No steps yet
          </h3>
          <p className="text-xs text-slate-400 font-medium max-w-[220px] leading-relaxed">
            Build your drip sequence by adding action and delay steps below.
          </p>
        </div>
      ) : (
        sorted.map((step, index) => (
          <div key={step.id} className="flex flex-col">
            <StepCard
              step={step}
              campaign={campaign}
              isEditing={editingStepId === step.id}
              onEditStart={() => setEditingStepId(step.id)}
              onEditEnd={() => setEditingStepId(null)}
            />
            {index < sorted.length - 1 && <StepConnector />}
          </div>
        ))
      )}

      {sorted.length > 0 && <StepConnector />}

      <AddStepButton campaign={campaign} allowedChannels={allowedChannels} />
    </div>
  );
}

function StepConnector() {
  return (
    <div className="flex flex-col items-center py-0.5 select-none pointer-events-none">
      <div className="w-px h-3 bg-slate-400" />
      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      <div className="w-px h-3 bg-slate-400" />
    </div>
  );
}
