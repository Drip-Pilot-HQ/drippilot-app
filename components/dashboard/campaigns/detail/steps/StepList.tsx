"use client";

import { useState } from "react";
import { Workflow } from "lucide-react";
import { CampaignStep } from "@/types/campaign";
import { TemplateChannel } from "@/types/template";
import { Campaign } from "@/types/campaign";
import { StepCard } from "./StepCard";
import { AddStepButton } from "./AddStepButton";
import { StepCardSkeleton } from "../CampaignDetailSkeleton";

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
      <div className="flex flex-col w-full max-w-2xl mx-auto px-4">
        {[1, 2, 3].map((i, idx) => (
          <div key={i} className="flex flex-col items-center">
            <StepCardSkeleton />
            {idx < 2 && <StepConnector />}
          </div>
        ))}
      </div>
    );
  }

  const sorted = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pb-20">
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl mb-8 px-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
            <Workflow className="w-7 h-7 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1.5">
            Build your sequence
          </h3>
          <p className="text-sm text-slate-400 font-medium max-w-[300px] leading-relaxed">
            Your sequence is empty. Start adding steps to automate your
            outreach.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {sorted.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className="w-full">
                <StepCard
                  step={step}
                  campaign={campaign}
                  isEditing={editingStepId === step.id}
                  onEditStart={() => setEditingStepId(step.id)}
                  onEditEnd={() => setEditingStepId(null)}
                />
              </div>
              {index < sorted.length - 1 && <StepConnector />}
            </div>
          ))}
          <StepConnector />
        </div>
      )}

      <div className="w-full">
        <AddStepButton campaign={campaign} allowedChannels={allowedChannels} />
      </div>
    </div>
  );
}

function StepConnector() {
  return (
    <div className="flex flex-col items-center py-2 select-none pointer-events-none">
      <div className="w-px h-5 bg-slate-200" />
      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 my-0.5" />
      <div className="w-px h-5 bg-slate-200" />
    </div>
  );
}
