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
          "rounded-2xl border-2 border-dashed p-5 shadow-md animate-in zoom-in-95 duration-300",
          isAction ? "border-blue-200 bg-white" : "border-amber-200 bg-white",
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isAction ? "bg-blue-500 text-white" : "bg-amber-500 text-white",
              )}
            >
              {isAction ? (
                <Send className="w-3.5 h-3.5" />
              ) : (
                <Timer className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-slate-900 block leading-tight">
                Add {isAction ? "Action" : "Delay"} Step
              </span>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Configure step details
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedType(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-xs font-medium"
          >
            Cancel
          </button>
        </div>

        {isAction ? (
          <ActionStepForm
            campaignId={campaign.id}
            allowedChannels={allowedChannels}
            isLoading={createMutation.isPending}
            onSave={handleCreateAction}
            onCancel={() => setSelectedType(null)}
            saveLabel="Create Action"
          />
        ) : (
          <DelayStepForm
            isLoading={createMutation.isPending}
            onSave={handleCreateDelay}
            onCancel={() => setSelectedType(null)}
            saveLabel="Create Delay"
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
        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all group"
      >
        <div className="w-5 h-5 rounded-full border-[1.5px] border-current flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
          <Plus className="w-3 h-3" />
        </div>
        Add Step
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-5 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            What&apos;s next?
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Select an automation type
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StepTypeOption
          icon={
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
          }
          title="Action Step"
          description="Send email or SMS messages to your leads."
          accentClass="hover:border-blue-300 hover:bg-blue-50/30"
          onClick={() => onSelect(CampaignStepType.ACTION)}
        />
        <StepTypeOption
          icon={
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Timer className="w-5 h-5 text-amber-500" />
            </div>
          }
          title="Wait Step"
          description="Pause the sequence for a custom duration."
          accentClass="hover:border-amber-300 hover:bg-amber-50/30"
          onClick={() => onSelect(CampaignStepType.DELAY)}
        />
      </div>
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
        "flex flex-row sm:flex-col items-center sm:items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-white text-left transition-all duration-200 outline-none",
        accentClass,
      )}
    >
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 leading-tight mb-1">
          {title}
        </p>
        <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
          {description}
        </p>
      </div>
    </button>
  );
}
