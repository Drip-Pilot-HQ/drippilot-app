"use client";

import { useState } from "react";
import { X, UserPlus, Loader2, Mail } from "lucide-react";
import { AddMemberDto, WorkspaceRole } from "@/types/account";
import { useInviteMemberMutation } from "@/store/server/workspace.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberDialog({
  isOpen,
  onClose,
}: InviteMemberDialogProps) {
  const [formData, setFormData] = useState<AddMemberDto>({
    email: "",
    role: WorkspaceRole.MEMBER,
  });

  const inviteMutation = useInviteMemberMutation();
  const isLoading = inviteMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteMutation.mutateAsync(formData);
      onClose();
      setFormData({ email: "", role: WorkspaceRole.MEMBER });
    } catch (error) {
      console.error("Failed to send invitation", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Add Coworker
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Extend access to your workspace
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
                Colleague&apos;s Email
              </label>
              <div className="relative group/input">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Assignment Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: WorkspaceRole.MEMBER })
                  }
                  className={cn(
                    "flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all text-left",
                    formData.role === WorkspaceRole.MEMBER
                      ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                      : "bg-white border-slate-100 hover:border-slate-300",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-wider",
                      formData.role === WorkspaceRole.MEMBER
                        ? "text-primary"
                        : "text-slate-900",
                    )}
                  >
                    Member
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Standard access to assets
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: WorkspaceRole.ADMIN })
                  }
                  className={cn(
                    "flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all text-left",
                    formData.role === WorkspaceRole.ADMIN
                      ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
                      : "bg-white border-slate-100 hover:border-slate-300",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-wider",
                      formData.role === WorkspaceRole.ADMIN
                        ? "text-primary"
                        : "text-slate-900",
                    )}
                  >
                    Admin
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Full control of infrastructure
                  </span>
                </button>
              </div>
            </div>

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
                disabled={isLoading || !formData.email}
                className="flex-2 rounded-xl h-12 text-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">Send Invitation</div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
