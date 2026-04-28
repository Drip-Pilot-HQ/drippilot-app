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
        "group relative rounded-2xl bg-white border transition-all duration-200",
        isEditing
          ? "border-primary/30 shadow-lg ring-2 ring-primary/5 z-30"
          : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300",
        deleteMutation.isPending && "opacity-50 pointer-events-none",
      )}
    >
      <div className={cn("rounded-2xl", !isEditing && "overflow-hidden")}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-bold",
                isAction
                  ? template?.templateChannel === TemplateChannel.SMS
                    ? "bg-purple-50 text-purple-600"
                    : "bg-blue-50 text-blue-600"
                  : "bg-amber-50 text-amber-600",
              )}
            >
              {step.stepNumber}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold",
                isAction
                  ? template?.templateChannel === TemplateChannel.SMS
                    ? "text-purple-600"
                    : "text-blue-600"
                  : "text-amber-600",
              )}
            >
              {isAction ? (
                template?.templateChannel === TemplateChannel.SMS ? (
                  <MessageSquare className="w-3.5 h-3.5" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )
              ) : (
                <Timer className="w-3.5 h-3.5" />
              )}
              {isAction ? "Action Step" : "Wait Step"}
            </span>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEditStart}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors outline-none"
                title="Edit step"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors outline-none"
                title="Delete step"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4">
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
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <Timer className="w-5 h-5 text-amber-500" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 leading-tight mb-0.5">
            Wait for {delayConfig?.days ?? 1}{" "}
            {(delayConfig?.days ?? 1) === 1 ? "day" : "days"}
          </h4>
          <p className="text-xs text-slate-400 font-medium">
            Pause before next step
          </p>
        </div>
      </div>
    );
  }

  const isEmail = template?.templateChannel === TemplateChannel.EMAIL;

  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          isEmail ? "bg-blue-50" : "bg-purple-50",
        )}
      >
        {isEmail ? (
          <Mail className="w-5 h-5 text-blue-500" />
        ) : (
          <MessageSquare className="w-5 h-5 text-purple-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {template ? (
          <>
            <div className="mb-2.5">
              <h4 className="text-sm font-semibold text-slate-900 leading-tight truncate">
                {template.name}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {actionConfig?.sendAt && (
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                    {formatSendAt(actionConfig.sendAt)}
                  </span>
                </div>
              )}
              {actionConfig?.timezone && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Globe className="w-3 h-3" />
                  <span className="text-[10px] font-medium truncate max-w-[120px]">
                    {actionConfig.timezone}
                  </span>
                </div>
              )}
              {!actionConfig?.sendAt && (
                <span className="text-xs text-rose-500 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
                  No time set
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="py-0.5">
            <h4 className="text-slate-400 italic font-semibold text-sm mb-1">
              Configuration required
            </h4>
            <span className="text-xs text-rose-500 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
              Select a template
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
