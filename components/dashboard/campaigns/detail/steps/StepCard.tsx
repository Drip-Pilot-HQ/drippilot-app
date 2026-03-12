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
        "relative rounded-2xl bg-white border transition-all duration-200",
        isEditing
          ? "border-primary/30 shadow-lg ring-2 ring-primary/10 z-30"
          : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 overflow-hidden",
        deleteMutation.isPending && "opacity-50 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
          isAction
            ? template?.templateChannel === TemplateChannel.SMS
              ? "bg-purple-400"
              : "bg-blue-400"
            : "bg-amber-400",
        )}
      />

      <div className="pl-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                isAction
                  ? template?.templateChannel === TemplateChannel.SMS
                    ? "bg-purple-50 text-purple-600"
                    : "bg-blue-50 text-blue-600"
                  : "bg-amber-50 text-amber-600",
              )}
            >
              {step.stepNumber}
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                isAction
                  ? template?.templateChannel === TemplateChannel.SMS
                    ? "text-purple-500"
                    : "text-blue-500"
                  : "text-amber-500",
              )}
            >
              {isAction ? (
                template?.templateChannel === TemplateChannel.SMS ? (
                  <MessageSquare className="w-3 h-3" />
                ) : (
                  <Send className="w-3 h-3" />
                )
              ) : (
                <Timer className="w-3 h-3" />
              )}
              {isAction ? "Action" : "Delay"}
            </span>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={onEditStart}
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                title="Edit step"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
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

        <div className="px-4 py-4">
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
      <div className="flex items-center gap-3 py-0.5">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <Timer className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">
            Wait {delayConfig?.days ?? 1}{" "}
            {(delayConfig?.days ?? 1) === 1 ? "day" : "days"}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            before the next step
          </p>
        </div>
      </div>
    );
  }

  const isEmail = template?.templateChannel === TemplateChannel.EMAIL;

  return (
    <div className="flex items-start gap-3 py-0.5">
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        {isEmail ? (
          <Mail className="w-4 h-4 text-blue-500" />
        ) : (
          <MessageSquare className="w-4 h-4 text-purple-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {template ? (
          <>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-sm font-black text-slate-900 truncate">
                {template.name}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0",
                  isEmail
                    ? "bg-blue-50 text-blue-500"
                    : "bg-purple-50 text-purple-500",
                )}
              >
                {template.templateChannel}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {actionConfig?.sendAt && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                  <Clock className="w-3 h-3" />
                  {formatSendAt(actionConfig.sendAt)}
                </span>
              )}
              {actionConfig?.timezone && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Globe className="w-3 h-3" />
                  {actionConfig.timezone}
                </span>
              )}
              {!actionConfig?.sendAt && (
                <span className="text-[11px] text-slate-400 italic">
                  No send time configured
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-400 italic font-medium">
              No template selected
            </p>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
              Required
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
