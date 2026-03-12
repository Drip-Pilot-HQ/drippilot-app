"use client";

import { useState } from "react";
import { Plus, Mail, Timer, X, Send } from "lucide-react";
import {
  CampaignStepType,
  ActionConfig,
  DelayConfig,
  Campaign,
} from "@/types/campaign";
import { TemplateChannel } from "@/types/template";
import { cn } from "@/lib/utils";
import { useCreateCampaignStepMutation } from "@/store/server/campaign.queries";
import { ActionStepForm } from "./ActionStepForm";
import { DelayStepForm } from "./DelayStepForm";

interface AddStepButtonProps {
  campaign: Campaign;
  allowedChannels: TemplateChannel[];
}

export function AddStepButton({
  campaign,
  allowedChannels,
}: AddStepButtonProps) {
  const [selectedType, setSelectedType] = useState<CampaignStepType | null>(
    null,
  );
  const createMutation = useCreateCampaignStepMutation(campaign.id);

  const handleCreateAction = async (
    templateId: string,
    config: ActionConfig,
  ) => {
    await createMutation.mutateAsync({
      stepType: CampaignStepType.ACTION,
      templateId,
      stepConfig: config,
    });
    setSelectedType(null);
  };

  const handleCreateDelay = async (config: DelayConfig) => {
    await createMutation.mutateAsync({
      stepType: CampaignStepType.DELAY,
      stepConfig: config,
    });
    setSelectedType(null);
  };

  if (selectedType) {
    const isAction = selectedType === CampaignStepType.ACTION;
    return (
      <div
        className={cn(
          "rounded-2xl border-2 border-dashed p-5",
          isAction
            ? "border-blue-200 bg-blue-50/40"
            : "border-amber-200 bg-amber-50/40",
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center",
                isAction ? "bg-blue-100" : "bg-amber-100",
              )}
            >
              {isAction ? (
                <Send className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Timer className="w-3.5 h-3.5 text-amber-600" />
              )}
            </div>
            <span className="text-sm font-black text-slate-800">
              New {isAction ? "Action" : "Delay"} Step
            </span>
          </div>
          <button
            onClick={() => setSelectedType(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/70 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isAction ? (
          <ActionStepForm
            campaignId={campaign.id}
            allowedChannels={allowedChannels}
            isLoading={createMutation.isPending}
            onSave={handleCreateAction}
            onCancel={() => setSelectedType(null)}
            saveLabel="Add Step"
          />
        ) : (
          <DelayStepForm
            isLoading={createMutation.isPending}
            onSave={handleCreateDelay}
            onCancel={() => setSelectedType(null)}
            saveLabel="Add Step"
          />
        )}
      </div>
    );
  }

  return <StepTypeSelector onSelect={setSelectedType} />;
}

interface StepTypeSelectorProps {
  onSelect: (type: CampaignStepType) => void;
}

function StepTypeSelector({ onSelect }: StepTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 text-sm font-bold hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group"
      >
        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-primary/10 transition-all">
          <Plus className="w-3 h-3" />
        </div>
        Add Step
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
        What type of step?
      </p>
      <div className="grid grid-cols-2 gap-3">
        <StepTypeOption
          icon={
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
          }
          title="Action"
          description="Send a message using a template at a scheduled time"
          accentClass="hover:border-blue-300 hover:bg-blue-50/50"
          onClick={() => onSelect(CampaignStepType.ACTION)}
        />
        <StepTypeOption
          icon={
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Timer className="w-5 h-5 text-amber-500" />
            </div>
          }
          title="Delay"
          description="Wait a number of days before running the next step"
          accentClass="hover:border-amber-300 hover:bg-amber-50/50"
          onClick={() => onSelect(CampaignStepType.DELAY)}
        />
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

interface StepTypeOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentClass: string;
  onClick: () => void;
}

function StepTypeOption({
  icon,
  title,
  description,
  accentClass,
  onClick,
}: StepTypeOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white text-left transition-all",
        accentClass,
      )}
    >
      {icon}
      <div>
        <p className="text-sm font-black text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
          {description}
        </p>
      </div>
    </button>
  );
}
