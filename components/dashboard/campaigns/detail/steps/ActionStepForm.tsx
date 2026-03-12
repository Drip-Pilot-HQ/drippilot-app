"use client";

import { useState } from "react";
import { Mail, MessageSquare, ChevronRight, X } from "lucide-react";
import { Template, TemplateChannel } from "@/types/template";
import { ActionConfig } from "@/types/campaign";
import { Button } from "@/components/branding/Button";
import { TimeSelector } from "./TimeSelector";
import { TimezoneSelector, getBrowserTimezone } from "./TimezoneSelector";
import { TemplateDrawer } from "./TemplateDrawer";
import { useTemplateQuery } from "@/store/server/template.queries";
import { cn } from "@/lib/utils";

interface ActionStepFormProps {
  campaignId: string;
  initialTemplateId?: string;
  initialConfig?: ActionConfig;
  allowedChannels: TemplateChannel[];
  isLoading: boolean;
  onSave: (templateId: string, config: ActionConfig) => void;
  onCancel: () => void;
  saveLabel?: string;
}

export function ActionStepForm({
  initialTemplateId,
  initialConfig,
  allowedChannels,
  isLoading,
  onSave,
  onCancel,
  saveLabel = "Save Step",
}: ActionStepFormProps) {
  const [templateId, setTemplateId] = useState(initialTemplateId ?? "");
  const [sendAt, setSendAt] = useState(initialConfig?.sendAt ?? "");
  const [timezone, setTimezone] = useState(
    initialConfig?.timezone ?? getBrowserTimezone(),
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: selectedTemplate } = useTemplateQuery(templateId);

  const handleSave = () => {
    if (!templateId) return;
    const config: ActionConfig = {};
    if (sendAt) config.sendAt = sendAt;
    if (timezone) config.timezone = timezone;
    onSave(templateId, config);
  };

  const handleTemplateSelect = (template: Template) => {
    setTemplateId(template.id);
  };

  const isEmailTemplate =
    selectedTemplate?.templateChannel === TemplateChannel.EMAIL;

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
          Template <span className="text-rose-500">*</span>
        </label>

        {selectedTemplate ? (
          <div
            className={cn(
              "flex items-center gap-2 p-3 rounded-xl border transition-all",
              isEmailTemplate
                ? "border-blue-100 bg-blue-50/30"
                : "border-purple-100 bg-purple-50/30",
            )}
          >
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0",
                isEmailTemplate
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700",
              )}
            >
              {isEmailTemplate ? (
                <Mail className="w-2.5 h-2.5" />
              ) : (
                <MessageSquare className="w-2.5 h-2.5" />
              )}
              {selectedTemplate.templateChannel}
            </span>
            <span className="text-sm font-bold text-slate-900 flex-1 truncate">
              {selectedTemplate.name}
            </span>
            <button
              type="button"
              onClick={() => setTemplateId("")}
              className={cn(
                "p-1 rounded-md transition-all",
                isEmailTemplate
                  ? "text-blue-400 hover:text-blue-700 hover:bg-blue-100"
                  : "text-purple-400 hover:text-purple-700 hover:bg-purple-100",
              )}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-between w-full h-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-500 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
          >
            Select a template
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {selectedTemplate && (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={cn(
              "text-xs font-bold hover:underline inline-flex items-center gap-1",
              isEmailTemplate ? "text-blue-600" : "text-purple-600",
            )}
          >
            Change template
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
            Send Time
          </label>
          <TimeSelector value={sendAt} onChange={setSendAt} />
          <p className="text-[10px] text-slate-400 font-medium">
            Leave empty to send any time
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
            Timezone
          </label>
          <TimezoneSelector value={timezone} onChange={setTimezone} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!templateId || isLoading}
          isLoading={isLoading}
          className={cn(
            "transition-all",
            !isEmailTemplate &&
              "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
          )}
        >
          {saveLabel}
        </Button>
      </div>

      <TemplateDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelect={handleTemplateSelect}
        selectedTemplateId={templateId}
        allowedChannels={allowedChannels}
      />
    </div>
  );
}
