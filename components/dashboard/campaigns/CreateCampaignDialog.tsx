"use client";

import { useState } from "react";
import {
  X,
  Rocket,
  Sparkles,
  Loader2,
  Mail,
  MessageSquare,
} from "lucide-react";
import { CreateCampaignDto, Campaign } from "@/types/campaign";
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from "@/store/server/campaign.queries";
import {
  useEmailAliasesQuery,
  usePhoneNumbersQuery,
} from "@/store/server/assets.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";
import { CustomSelect } from "@/components/common/CustomSelect";
import { formatNumber } from "@/lib/utils/format-number";

interface CreateCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editCampaign?: Campaign | null;
}

export function CreateCampaignDialog({
  isOpen,
  onClose,
  editCampaign,
}: CreateCampaignDialogProps) {
  const [formData, setFormData] = useState<CreateCampaignDto>(() => {
    if (editCampaign) {
      return {
        name: editCampaign.name,
        description: editCampaign.description || "",
        emailBased: editCampaign.emailBased,
        smsBased: editCampaign.smsBased,
        emailAliasId: editCampaign.emailAliasId,
        phoneAliasId: editCampaign.phoneAliasId,
      };
    }
    return {
      name: "",
      description: "",
      emailBased: true,
      smsBased: false,
    };
  });

  const createMutation = useCreateCampaignMutation();
  const updateMutation = useUpdateCampaignMutation();
  const { data: emailAliases, isLoading: isLoadingEmailAliases } =
    useEmailAliasesQuery();
  const { data: phoneNumbers, isLoading: isLoadingPhoneNumbers } =
    usePhoneNumbersQuery();
  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    isLoadingEmailAliases ||
    isLoadingPhoneNumbers;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editCampaign) {
        await updateMutation.mutateAsync({
          id: editCampaign.id,
          dto: {
            name: formData.name,
            description: formData.description,
            emailBased: formData.emailBased,
            smsBased: formData.smsBased,
            emailAliasId: formData.emailAliasId,
            phoneAliasId: formData.phoneAliasId,
          },
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save campaign", error);
    }
  };

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
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editCampaign ? "Edit Campaign" : "Launch Campaign"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Define your target and messaging channel
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
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Campaign Title
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Summer Outreach 2024"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Objectives
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What are you trying to achieve?"
                rows={2}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-600 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    emailBased: !formData.emailBased,
                  })
                }
                className={cn(
                  "flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all",
                  formData.emailBased
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-white border-slate-100 grayscale opacity-60 hover:grayscale-0 hover:opacity-100",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                    formData.emailBased
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-black text-slate-900 uppercase">
                    Email
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                    Channel
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, smsBased: !formData.smsBased })
                }
                className={cn(
                  "flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all",
                  formData.smsBased
                    ? "bg-secondary/5 border-secondary shadow-sm"
                    : "bg-white border-slate-100 grayscale opacity-60 hover:grayscale-0 hover:opacity-100",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                    formData.smsBased
                      ? "bg-secondary text-white"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-black text-slate-900 uppercase">
                    SMS
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                    Channel
                  </p>
                </div>
              </button>
            </div>

            {formData.emailBased && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Email Sender Asset
                </label>
                <CustomSelect
                  value={formData.emailAliasId || ""}
                  onChange={(val) =>
                    setFormData({ ...formData, emailAliasId: val })
                  }
                  placeholder="Select an Email Asset"
                  options={
                    emailAliases?.map((alias) => ({
                      value: alias.id,
                      label: alias.emailAlias,
                    })) || []
                  }
                  disabled={isLoadingEmailAliases}
                />
              </div>
            )}

            {formData.smsBased && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  SMS Sender Asset
                </label>
                <CustomSelect
                  value={formData.phoneAliasId || ""}
                  onChange={(val) =>
                    setFormData({ ...formData, phoneAliasId: val })
                  }
                  placeholder="Select a Phone Number"
                  options={
                    phoneNumbers?.map((phone) => ({
                      value: phone.id,
                      label: formatNumber(phone.phoneNumber) || "",
                    })) || []
                  }
                  disabled={isLoadingPhoneNumbers}
                />
              </div>
            )}

            <div className="pt-4 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl h-12 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name}
                className="flex-2 rounded-xl h-12 text-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {editCampaign ? "Update campaign" : "Initialize campaign"}
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
