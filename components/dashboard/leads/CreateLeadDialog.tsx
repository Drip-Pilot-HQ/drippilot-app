"use client";

import { useState } from "react";
import {
  X,
  UserPlus,
  Loader2,
  Tag as TagIcon,
  Mail,
  Phone,
  User,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { CreateLeadDto, Lead, LeadStatus } from "@/types/lead";
import {
  useCreateLeadMutation,
  useUpdateLeadMutation,
} from "@/store/server/lead.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

interface CreateLeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editLead?: Lead | null;
}

export function CreateLeadDialog({
  isOpen,
  onClose,
  editLead,
}: CreateLeadDialogProps) {
  const [formData, setFormData] = useState<CreateLeadDto>(() => {
    if (editLead) {
      const fallbackName = (
        (editLead.firstName || "") +
        " " +
        (editLead.lastName || "")
      ).trim();
      return {
        email: editLead.email || "",
        phone: editLead.phone || "",
        name: editLead.name || fallbackName,
        firstName: editLead.firstName || "",
        lastName: editLead.lastName || "",
        leadStatus: editLead.leadStatus,
        tags: editLead.tags,
      };
    }
    return {
      email: "",
      phone: "",
      name: "",
      firstName: "",
      lastName: "",
      leadStatus: LeadStatus.COLD,
      tags: [],
    };
  });

  const [tagInput, setTagInput] = useState("");
  const [consentAgreed, setConsentAgreed] = useState(false);

  const createMutation = useCreateLeadMutation();
  const updateMutation = useUpdateLeadMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consentAgreed) {
      toast.error(
        "You must agree to the communication consent to save this lead",
      );
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/[\D]/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        toast.error("Please enter a valid phone number with country code");
        return;
      }
    }

    try {
      if (editLead) {
        await updateMutation.mutateAsync({
          id: editLead.id,
          dto: {
            email: formData.email,
            phone: formData.phone,
            name: formData.name,
            firstName: formData.firstName,
            lastName: formData.lastName,
            tags: formData.tags,
          },
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save lead", error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-[28px] sm:rounded-[40px] shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[95vh] animate-in slide-in-from-bottom-4 duration-300">
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header — non-scrolling */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-3 sm:pt-8 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {editLead ? "Edit Lead" : "Add New Lead"}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Configure lead identity and status
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

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-8 py-5 sm:py-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Full Name */}
            <div className="col-span-1 sm:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={formData.name}
                  onChange={(e) => {
                    const fullName = e.target.value;
                    const parts = fullName.trim().split(/\s+/);
                    const firstName = parts[0] || "";
                    const lastName = parts.slice(1).join(" ") || "";
                    setFormData({
                      ...formData,
                      name: fullName,
                      firstName,
                      lastName,
                    });
                  }}
                  placeholder="e.g. John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 234 567 890"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            {/* Initial Status */}
            <div className="col-span-1 sm:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Initial Status
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.values(LeadStatus).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={!!editLead}
                    onClick={() =>
                      setFormData({ ...formData, leadStatus: status })
                    }
                    className={cn(
                      "px-2 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all truncate",
                      formData.leadStatus === status
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="col-span-1 sm:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Tags & Classification
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add specific tags..."
                    className="w-full pl-12 pr-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="rounded-xl h-12 w-12 p-0 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary"
                    >
                      {tag}
                      <X
                        className="w-3 cursor-pointer hover:text-primary-hover"
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Consent */}
            <div className="col-span-1 sm:col-span-2 space-y-3 p-4 sm:p-5 border border-orange-100 rounded-3xl bg-orange-50/30">
              <div className="flex items-start space-x-3">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer mt-0.5 shrink-0"
                  required
                />
                <div className="space-y-1">
                  <label
                    htmlFor="consent"
                    className="text-sm font-black text-slate-800 leading-5 cursor-pointer"
                  >
                    Communication Consent Confirmation
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal">
                    I confirm that this lead has{" "}
                    <strong>explicitly consented</strong> to receive messages
                    related to our services. I understand that Drippilot is not
                    liable for any compliance issues arising from leads added
                    without proper consent. All communications must comply with
                    applicable laws and regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-1 sm:col-span-2 pt-2 flex items-center gap-3">
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
                  isLoading ||
                  !consentAgreed ||
                  (!formData.email && !formData.phone)
                }
                className="flex-2 rounded-xl h-12"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    {editLead ? "Update details" : "Save lead profile"}
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
