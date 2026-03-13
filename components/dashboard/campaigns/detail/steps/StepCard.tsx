"use client";

import {
  Mail,
  MessageSquare,
  Clock,
  Timer,
  Edit2,
  Trash2,
  Loader2,
  Globe,
  Send,
  ExternalLink,
} from "lucide-react";
import {
  CampaignStep,
  CampaignStepType,
  ActionConfig,
  DelayConfig,
  Campaign,
} from "@/types/campaign";
import { TemplateChannel } from "@/types/template";
import { cn } from "@/lib/utils";
import { useTemplateQuery } from "@/store/server/template.queries";
import {
  useUpdateCampaignStepMutation,
  useDeleteCampaignStepMutation,
} from "@/store/server/campaign.queries";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { ActionStepForm } from "./ActionStepForm";
import { DelayStepForm } from "./DelayStepForm";
import { EnrollmentWarningBanner } from "../EnrollmentWarningBanner";

function formatSendAt(sendAt: string): string {
  const [hourStr, minuteStr] = sendAt.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minuteStr} ${period}`;
}

function getAllowedChannels(campaign: Campaign): TemplateChannel[] {
  const channels: TemplateChannel[] = [];
  if (campaign.emailBased) channels.push(TemplateChannel.EMAIL);
  if (campaign.smsBased) channels.push(TemplateChannel.SMS);
  return channels;
}

interface StepCardProps {
  step: CampaignStep;
  campaign: Campaign;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
}

export function StepCard({
  step,
  campaign,
  isEditing,
  onEditStart,
  onEditEnd,
}: StepCardProps) {
  const updateMutation = useUpdateCampaignStepMutation(campaign.id);
  const deleteMutation = useDeleteCampaignStepMutation(campaign.id);
  const confirm = useConfirm();

  const isAction = step.stepType === CampaignStepType.ACTION;
  const actionConfig = isAction ? (step.stepConfig as ActionConfig) : undefined;
  const delayConfig = !isAction ? (step.stepConfig as DelayConfig) : undefined;

  const { data: template } = useTemplateQuery(step.templateId ?? "");

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Step",
      description: `Delete Step ${step.stepNumber}? This cannot be undone and subsequent steps will be renumbered.`,
      confirmLabel: "Delete Step",
      variant: "danger",
    });
    if (confirmed) {
      await deleteMutation.mutateAsync(step.id);
    }
  };

  const handleUpdateAction = async (
    templateId: string,
    config: ActionConfig,
  ) => {
    await updateMutation.mutateAsync({
      stepId: step.id,
      dto: { templateId, stepConfig: config },
    });
    onEditEnd();
  };

  const handleUpdateDelay = async (config: DelayConfig) => {
    await updateMutation.mutateAsync({
      stepId: step.id,
      dto: { stepConfig: config },
    });
    onEditEnd();
  };

  return (
    <div
      className={cn(
        "group relative rounded-[20px] md:rounded-[24px] bg-white border transition-all duration-300",
        isEditing
          ? "border-primary/40 shadow-2xl ring-4 ring-primary/5 z-30 translate-x-0.5"
          : "border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5",
        deleteMutation.isPending && "opacity-50 pointer-events-none",
      )}
    >
      {/* Decorative Step Number Chip */}
      <div
        className={cn(
          "absolute -left-2.5 md:-left-3 -top-2.5 md:-top-3 w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl border-[3px] md:border-4 border-white shadow-md flex items-center justify-center text-[10px] md:text-[11px] font-black z-10 transition-transform group-hover:scale-110",
          isAction ? "bg-blue-500 text-white" : "bg-amber-500 text-white",
        )}
      >
        {step.stepNumber}
      </div>

      <div className="overflow-hidden rounded-[20px] md:rounded-[24px]">
        {/* Header Section */}
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-slate-50 bg-slate-50/10">
          <div className="flex items-center gap-2 md:gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-sm border",
                isAction
                  ? template?.templateChannel === TemplateChannel.SMS
                    ? "bg-purple-50 text-purple-600 border-purple-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                  : "bg-amber-50 text-amber-600 border-amber-100",
              )}
            >
              {isAction ? (
                template?.templateChannel === TemplateChannel.SMS ? (
                  <MessageSquare className="w-2.5 h-2.5 md:w-3 md:h-3" />
                ) : (
                  <Send className="w-2.5 h-2.5 md:w-3 md:h-3" />
                )
              ) : (
                <Timer className="w-2.5 h-2.5 md:w-3 md:h-3" />
              )}
              <span className="truncate max-w-[80px] md:max-w-none">
                {isAction ? "Action Step" : "Wait Step"}
              </span>
            </span>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-0.5 md:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEditStart}
                className="p-1.5 md:p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all outline-none"
                title="Edit step"
              >
                <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="p-1.5 md:p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all outline-none"
                title="Delete step"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="px-4 py-4 md:px-6 md:py-5">
          {isEditing ? (
            <div className="space-y-4">
              <EnrollmentWarningBanner />
              {isAction ? (
                <ActionStepForm
                  campaignId={campaign.id}
                  initialTemplateId={step.templateId}
                  initialConfig={actionConfig}
                  allowedChannels={getAllowedChannels(campaign)}
                  isLoading={updateMutation.isPending}
                  onSave={handleUpdateAction}
                  onCancel={onEditEnd}
                />
              ) : (
                <DelayStepForm
                  initialConfig={delayConfig}
                  isLoading={updateMutation.isPending}
                  onSave={handleUpdateDelay}
                  onCancel={onEditEnd}
                />
              )}
            </div>
          ) : (
            <StepSummary
              step={step}
              template={template}
              actionConfig={actionConfig}
              delayConfig={delayConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface StepSummaryProps {
  step: CampaignStep;
  template?: { name: string; templateChannel: TemplateChannel } | null;
  actionConfig?: ActionConfig;
  delayConfig?: DelayConfig;
}

function StepSummary({
  step,
  template,
  actionConfig,
  delayConfig,
}: StepSummaryProps) {
  const isAction = step.stepType === CampaignStepType.ACTION;

  if (!isAction) {
    return (
      <div className="flex items-center gap-4 md:gap-5">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 shadow-inner">
          <Timer className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
        </div>
        <div className="min-w-0">
          <h4 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-none mb-1 md:mb-1.5 truncate">
            Wait for {delayConfig?.days ?? 1}{" "}
            {(delayConfig?.days ?? 1) === 1 ? "day" : "days"}
          </h4>
          <p className="text-[11px] md:text-sm text-slate-400 font-medium truncate">
            Pause before next step
          </p>
        </div>
      </div>
    );
  }

  const isEmail = template?.templateChannel === TemplateChannel.EMAIL;

  return (
    <div className="flex items-start gap-4 md:gap-5">
      <div
        className={cn(
          "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border flex items-center justify-center shrink-0 shadow-inner transition-colors",
          isEmail
            ? "bg-blue-50 border-blue-100"
            : "bg-purple-50 border-purple-100",
        )}
      >
        {isEmail ? (
          <Mail className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
        ) : (
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {template ? (
          <>
            <div className="flex flex-col gap-1 mb-2">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-none truncate">
                  {template.name}
                </h4>
                <button className="text-[9px] md:text-[10px] text-primary font-black uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0">
                  <span className="hidden xs:inline">View</span>{" "}
                  <ExternalLink className="w-2 h-2" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2">
              {actionConfig?.sendAt && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg border border-slate-100">
                  <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-400" />
                  <span className="text-[10px] md:text-xs text-slate-700 font-black whitespace-nowrap">
                    {formatSendAt(actionConfig.sendAt)}
                  </span>
                </div>
              )}
              {actionConfig?.timezone && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Globe className="w-3 h-3 md:w-3.5 md:h-3.5 transition-colors" />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider truncate max-w-[100px] md:max-w-none">
                    {actionConfig.timezone}
                  </span>
                </div>
              )}
              {!actionConfig?.sendAt && (
                <span className="text-[10px] md:text-xs text-rose-400 font-bold bg-rose-50 px-2 py-0.5 md:py-1 rounded-lg uppercase tracking-tight">
                  No time set
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="py-1">
            <h4 className="text-slate-400 italic font-black text-sm md:text-lg mb-1">
              Configuration required
            </h4>
            <p className="text-[9px] md:text-xs text-rose-500 font-bold bg-rose-50 inline-block px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-widest">
              Select a template
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
