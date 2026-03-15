"use client";

import { useState } from "react";
import {
  X,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  Tag as TagIcon,
  HelpCircle,
} from "lucide-react";
import { CreateKbEntryDto, KbEntry } from "@/types/knowledge-base";
import {
  useCreateKbEntryMutation,
  useUpdateKbEntryMutation,
} from "@/store/server/knowledge-base.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

interface CreateKbEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editEntry?: KbEntry | null;
}

export function CreateKbEntryDialog({
  isOpen,
  onClose,
  editEntry,
}: CreateKbEntryDialogProps) {
  const [formData, setFormData] = useState<CreateKbEntryDto>(() => {
    if (editEntry) {
      return {
        title: editEntry.title,
        content: editEntry.content,
      };
    }
    return {
      title: "",
      content: "",
    };
  });

  const createMutation = useCreateKbEntryMutation();
  const updateMutation = useUpdateKbEntryMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      if (editEntry) {
        await updateMutation.mutateAsync({ id: editEntry.id, dto: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save KB entry", error);
    }
  };

  const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
  const isTooLong = wordCount > 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editEntry ? "Update Insight" : "Add Knowledge"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {editEntry
                    ? "Refine existing information"
                    : "Feed Drip Bot new facts"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Topic Title
                </label>
                <div className="relative group">
                  <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g. Pricing Plans"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Information Content
                  </label>
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                      isTooLong
                        ? "bg-rose-50 text-rose-500 border-rose-100"
                        : "bg-slate-50 text-slate-400 border-slate-100",
                    )}
                  >
                    {wordCount}/500 Words
                  </span>
                </div>

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
                  placeholder="Paste documentation or facts here..."
                  className={cn(
                    "w-full px-4 py-4 rounded-2xl bg-slate-50 border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 text-sm resize-none leading-relaxed",
                    isTooLong
                      ? "border-rose-200 focus:ring-rose-200/20 focus:border-rose-300"
                      : "border-slate-200 focus:ring-primary/20 focus:border-primary",
                  )}
                />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
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
                disabled={
                  isLoading || !formData.title || !formData.content || isTooLong
                }
                className="flex-2 rounded-xl h-12 shadow-md shadow-primary/10"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{editEntry ? "Update Insight" : "Save Insight"}</span>
                  </div>
                )}
              </Button>
            </div>

            {isTooLong && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <p className="text-[10px] text-rose-600 font-bold uppercase tracking-tight">
                  Entry too long. Please condense to under 500 words.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <p className="text-[10px] text-blue-600 font-medium">
                Tip: Use bullet points for clear, factual statements.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
