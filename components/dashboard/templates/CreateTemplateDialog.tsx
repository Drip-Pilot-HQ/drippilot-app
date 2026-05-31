"use client";

import { useState } from "react";
import {
  X,
  Mail,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Tag as TagIcon,
  ShieldAlert,
  Info,
} from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { CharacterCounter } from "@/components/common/CharacterCounter";
import { toast } from "sonner";
import { CreateTemplateDto, Template, TemplateChannel } from "@/types/template";
import {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useFoldersQuery,
} from "@/store/server/template.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";
import {
  ALLOWED_PLACEHOLDERS,
  validateTemplatePlaceholders,
} from "@/lib/utils/template-validator";

interface CreateTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editTemplate?: Template | null;
  defaultFolderId?: string | null;
}

function normalizeOptOut(content: string): string {
  const stripped = content
    .replace(/\n*Reply STOP to unsubscribe/gi, "")
    .trimEnd();
  if (stripped.includes("STOP to Opt Out")) return stripped;
  return stripped ? `${stripped}\n\nSTOP to Opt Out` : "STOP to Opt Out";
}

export function CreateTemplateDialog({
  isOpen,
  onClose,
  editTemplate,
  defaultFolderId,
}: CreateTemplateDialogProps) {
  const { data: folders = [] } = useFoldersQuery();

  const [formData, setFormData] = useState<CreateTemplateDto>(() => {
    if (editTemplate) {
      return {
        name: editTemplate.name,
        subject: editTemplate.subject || "",
        content:
          editTemplate.templateChannel === TemplateChannel.SMS
            ? normalizeOptOut(editTemplate.content)
            : editTemplate.content,
        templateChannel: editTemplate.templateChannel,
        folderId: editTemplate.folderId ?? undefined,
      };
    }
    return {
      name: "",
      subject: "",
      content: "",
      templateChannel: TemplateChannel.EMAIL,
      folderId: defaultFolderId ?? undefined,
    };
  });

  const validation = validateTemplatePlaceholders(formData.content);

  const createMutation = useCreateTemplateMutation();
  const updateMutation = useUpdateTemplateMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;

    if (formData.templateChannel === TemplateChannel.SMS) {
      if (!formData.content.includes("STOP to Opt Out")) {
        toast.error(
          'Compliance Error: SMS templates must include "STOP to Opt Out" for TCPA compliance.',
        );
        return;
      }
    }

    try {
      if (editTemplate) {
        await updateMutation.mutateAsync({
          id: editTemplate.id,
          dto: {
            name: formData.name,
            content: formData.content,
            folderId: formData.folderId ?? null,
            ...(formData.templateChannel === TemplateChannel.EMAIL
              ? { subject: formData.subject }
              : {}),
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          content: formData.content,
          templateChannel: formData.templateChannel,
          ...(formData.folderId ? { folderId: formData.folderId } : {}),
          ...(formData.templateChannel === TemplateChannel.EMAIL
            ? { subject: formData.subject }
            : {}),
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save template", error);
    }
  };

  const insertPlaceholder = (placeholder: string) => {
    const formatted = `{{ ${placeholder} }}`;
    setFormData((prev) => ({ ...prev, content: formatted + prev.content }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-[28px] sm:rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 max-h-[92dvh] sm:max-h-[95vh] flex flex-col">
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-3 sm:pt-8 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {formData.templateChannel === TemplateChannel.EMAIL ? (
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {editTemplate ? "Edit Template" : "New Template"}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                {editTemplate
                  ? "Update your communication block"
                  : "Design a reusable messaging template"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 sm:px-8 py-4 sm:py-5">
          <form
            id="template-form"
            onSubmit={handleSubmit}
            className="space-y-6 pb-4"
          >
            <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
              <button
                type="button"
                disabled={!!editTemplate}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    templateChannel: TemplateChannel.EMAIL,
                  }))
                }
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                  formData.templateChannel === TemplateChannel.EMAIL
                    ? "bg-white text-primary shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700",
                  editTemplate && "cursor-not-allowed opacity-70",
                )}
              >
                <Mail className="w-4 h-4" />
                Email Channel
              </button>
              <button
                type="button"
                disabled={!!editTemplate}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    templateChannel: TemplateChannel.SMS,
                    content: normalizeOptOut(prev.content),
                  }))
                }
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all",
                  formData.templateChannel === TemplateChannel.SMS
                    ? "bg-white text-primary shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-700",
                  editTemplate && "cursor-not-allowed opacity-70",
                )}
              >
                <MessageSquare className="w-4 h-4" />
                SMS Channel
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Template Identity
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Outreach - First Touch"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                />
              </div>

              {folders.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Folder
                  </label>
                  <CustomSelect
                    value={formData.folderId ?? ""}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        folderId: val || undefined,
                      }))
                    }
                    options={[
                      { value: "", label: "No folder" },
                      ...folders.map((f) => ({ value: f.id, label: f.name })),
                    ]}
                    placeholder="No folder"
                  />
                </div>
              )}

              {formData.templateChannel === TemplateChannel.EMAIL && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    Subject Line
                  </label>
                  <input
                    required={
                      formData.templateChannel === TemplateChannel.EMAIL
                    }
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="e.g. Question about your purchase?"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Content Body
                  </label>
                  <div className="flex items-center gap-2">
                    {validation.isValid ? (
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        Validated
                      </span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                          <AlertCircle className="w-3 h-3" />
                          Syntax Error
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <TagIcon className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Available Variables
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALLOWED_PLACEHOLDERS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => insertPlaceholder(p)}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-sm transition-all group/token"
                      >
                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                          {p.split(".")[0]}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 group-hover/token:text-primary transition-colors">
                          {p.split(".")[1]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder={
                      formData.templateChannel === TemplateChannel.EMAIL
                        ? "e.g. Hi {{ lead.firstName }}, reaching out to..."
                        : "Hi {{ lead.firstName }}!"
                    }
                    className={cn(
                      "w-full px-4 py-4 rounded-2xl bg-slate-50 border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 text-sm resize-none",
                      validation.isValid
                        ? "border-slate-200"
                        : "border-rose-200 bg-rose-50/30",
                    )}
                  />

                  <CharacterCounter
                    value={formData.content}
                    isSMS={formData.templateChannel === TemplateChannel.SMS}
                  />

                  {/* Compliance Notices */}
                  {formData.templateChannel === TemplateChannel.SMS ? (
                    <div
                      className={cn(
                        "mt-2 p-3 rounded-xl border flex items-start gap-3 transition-all",
                        formData.content.includes("STOP to Opt Out")
                          ? "bg-emerald-50/50 border-emerald-100 text-emerald-600"
                          : "bg-rose-50 border-rose-100 text-rose-600",
                      )}
                    >
                      {formData.content.includes("STOP to Opt Out") ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                      )}
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-wider leading-none">
                          TCPA Compliance
                        </p>
                        <p className="text-[10px] font-medium leading-relaxed">
                          {formData.content.includes("STOP to Opt Out")
                            ? "Compliance phrase detected. We recommend placing it at the very end of your message."
                            : 'Required: You must include "STOP to Opt Out" at the end of your SMS to comply with messaging regulations.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 rounded-xl border border-blue-100 bg-blue-50/50 text-blue-600 flex items-start gap-3">
                      <Info className="w-4 h-4 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-wider leading-none">
                          Email Formatting
                        </p>
                        <p className="text-[10px] font-medium leading-relaxed">
                          &quot;STOP to Opt Out&quot; is automatically added to
                          email template while sending, so you don&apos;t have
                          to add here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {!validation.isValid && (
                  <div className="space-y-1 mt-3 px-1">
                    {validation.errorMessages.map((msg, i) => (
                      <div
                        key={i}
                        className="text-[10px] text-rose-500 font-bold uppercase tracking-tight italic flex items-center gap-1.5"
                      >
                        <div className="w-1 h-1 rounded-full bg-rose-500" />
                        {msg}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="px-5 sm:px-8 pt-4 pb-5 sm:pb-8 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="template-form"
              disabled={
                isLoading ||
                !formData.name ||
                !validation.isValid ||
                (formData.templateChannel === TemplateChannel.SMS &&
                  !formData.content.includes("STOP to Opt Out"))
              }
              className="flex-2 rounded-xl h-12"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  {editTemplate ? "Update Template" : "Save Template"}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
