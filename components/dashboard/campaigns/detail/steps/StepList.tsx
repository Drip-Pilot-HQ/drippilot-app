"use client";

import { useState } from "react";
import { ChevronDown, Workflow } from "lucide-react";
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
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-slate-200 rounded-[32px] md:rounded-[40px] mb-8 relative px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-[30px] md:rounded-[36px] bg-slate-50 flex items-center justify-center mb-6">
            <Workflow className="w-10 h-10 md:w-12 md:h-12 text-slate-200" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
            Build your sequence
          </h3>
          <p className="text-sm text-slate-500 font-medium max-w-[320px] leading-relaxed">
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
              {/* Connector between steps */}
              {index < sorted.length - 1 && <StepConnector />}
            </div>
          ))}
          {/* Connector before Add Step button */}
          <StepConnector />
        </div>
      )}

      {/* "Add Step" section */}
      <div className="w-full">
        <AddStepButton campaign={campaign} allowedChannels={allowedChannels} />
      </div>
    </div>
  );
}

function StepConnector() {
  return (
    <div className="flex flex-col items-center py-4 select-none pointer-events-none">
      <div className="w-1 h-6 bg-slate-200 rounded-full" />
      <ChevronDown className="w-5 h-5 text-slate-300 -mt-1" />
      <div className="w-1 h-2 bg-slate-100 rounded-full opacity-50 mt-1" />
    </div>
  );
}
