"use client";

import { useState } from "react";
import { Plus, Mail, Timer, X, Send, Sparkles } from "lucide-react";
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
          "rounded-[20px] md:rounded-[24px] border-2 border-dashed p-4 md:p-6 shadow-xl animate-in zoom-in-95 duration-300 ring-4 ring-slate-50",
          isAction ? "border-blue-200 bg-white" : "border-amber-200 bg-white",
        )}
      >
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div
              className={cn(
                "w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm",
                isAction ? "bg-blue-500 text-white" : "bg-amber-500 text-white",
              )}
            >
              {isAction ? (
                <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
              ) : (
                <Timer className="w-3.5 h-3.5 md:w-4 md:h-4" />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-xs md:text-sm font-black text-slate-900 block leading-none truncate">
                Add {isAction ? "Action" : "Delay"} Step
              </span>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Configure logic
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedType(null)}
            className="p-1.5 md:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all font-bold text-[10px] md:text-xs"
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
        className="flex items-center justify-center gap-2 md:gap-3 w-full py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs md:text-sm font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md"
      >
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
          <Plus className="w-3 md:w-3.5 h-3 md:h-3.5" />
        </div>
        Add Sequence Step
      </button>
    );
  }

  return (
    <div className="rounded-[24px] md:rounded-[32px] border border-slate-200 bg-white shadow-2xl p-4 md:p-8 animate-in slide-in-from-bottom-2 duration-400 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5">
        <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-primary" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900 leading-none">
              What&apos;s next?
            </h3>
            <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Select an automation type
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 md:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all outline-none"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <StepTypeOption
            icon={
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              </div>
            }
            title="Action Step"
            description="Send email or SMS messages to your leads."
            accentClass="hover:border-blue-400 hover:ring-4 hover:ring-blue-50/50 shadow-sm"
            onClick={() => onSelect(CampaignStepType.ACTION)}
          />
          <StepTypeOption
            icon={
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
                <Timer className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
              </div>
            }
            title="Wait Step"
            description="Pause the sequence for a custom duration."
            accentClass="hover:border-amber-400 hover:ring-4 hover:ring-amber-50/50 shadow-sm"
            onClick={() => onSelect(CampaignStepType.DELAY)}
          />
        </div>
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
        "flex flex-row sm:flex-col items-center sm:items-start gap-4 p-4 md:p-5 rounded-[20px] md:rounded-[24px] border border-slate-200 bg-white text-left transition-all duration-300 outline-none",
        accentClass,
      )}
    >
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm md:text-base font-black text-slate-900 leading-none mb-1 md:mb-1.5 truncate">
          {title}
        </p>
        <p className="text-[10px] md:text-[11px] text-slate-500 font-medium leading-tight md:leading-relaxed line-clamp-2 sm:line-clamp-none">
          {description}
        </p>
      </div>
    </button>
  );
}
