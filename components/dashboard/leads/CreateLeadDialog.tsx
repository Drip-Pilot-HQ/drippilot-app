"use client";

import { useState } from "react";
import {
  X,
  UserPlus,
  Sparkles,
  Loader2,
  Tag as TagIcon,
  Mail,
  Phone,
  User,
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
      return {
        email: editLead.email || "",
        phone: editLead.phone || "",
        name: editLead.name || "",
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

  const createMutation = useCreateLeadMutation();
  const updateMutation = useUpdateLeadMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/[\D]/g, "");
      // E.164 phone number rough validation (between 10 and 15 digits)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editLead ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Configure lead identity and status
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

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

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

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Initial Status
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(LeadStatus).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={!!editLead}
                    onClick={() =>
                      setFormData({ ...formData, leadStatus: status })
                    }
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all",
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

            <div className="col-span-2 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Tags & Classification
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <TagIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
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
                  className="rounded-xl h-12 w-12 p-0"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
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
            </div>

            <div className="pt-4 col-span-2 flex items-center gap-3">
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
                disabled={isLoading || (!formData.email && !formData.phone)}
                className="flex-2 rounded-xl h-12"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {editLead ? "Update details" : "Save lead profile"}
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
