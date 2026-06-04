"use client";

import { useState } from "react";
import { X, Mail, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EmailAlias } from "@/types/assets";
import {
  useCreateEmailAliasMutation,
  useUpdateEmailAliasMutation,
} from "@/store/server/assets.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";

interface EmailAliasDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editAlias?: EmailAlias | null;
}

export function EmailAliasDialog({
  isOpen,
  onClose,
  editAlias,
}: EmailAliasDialogProps) {
  const [aliasInput, setAliasInput] = useState(() =>
    editAlias ? editAlias.emailAlias.split("@")[0] : "",
  );
  const [senderNameInput, setSenderNameInput] = useState(
    () => editAlias?.senderName ?? "",
  );

  const createMutation = useCreateEmailAliasMutation();
  const updateMutation = useUpdateEmailAliasMutation();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const isFormValid =
    aliasInput.trim().length > 0 && senderNameInput.trim().length > 0;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAlias = aliasInput.trim();
    if (finalAlias.includes("@")) {
      if (!finalAlias.endsWith("@drippilot.com")) {
        toast.error("Email alias must use the @drippilot.com domain");
        return;
      }
    }

    const senderName = senderNameInput.trim() || null;

    try {
      if (editAlias) {
        await updateMutation.mutateAsync({
          id: editAlias.id,
          dto: { emailAlias: finalAlias, senderName },
        });
      } else {
        await createMutation.mutateAsync({
          emailAlias: finalAlias,
          senderName,
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to save email alias", error);
    }
  };

  const hasDomain = aliasInput.includes("@");

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
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {editAlias ? "Update Alias" : "Create New Alias"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Add a custom sending identity
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sender Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Display Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <input
                  required
                  value={senderNameInput}
                  onChange={(e) => setSenderNameInput(e.target.value)}
                  placeholder="e.g. Support Team"
                  maxLength={50}
                  className="w-full pl-10 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-base placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium px-1">
                Shown in email From header:{" "}
                <span className="font-bold text-slate-600">
                  &ldquo;
                  {senderNameInput.trim() ||
                    aliasInput.split("@")[0] ||
                    "hello"}
                  &rdquo; &lt;{aliasInput.split("@")[0] || "hello"}
                  @drippilot.com&gt;
                </span>
              </p>
            </div>

            {/* Email Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Email Username
              </label>
              <div className="relative group/input">
                <input
                  required
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value)}
                  placeholder="e.g. hello"
                  className={cn(
                    "w-full pl-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-base",
                    !hasDomain && "pr-40",
                  )}
                />
                {!hasDomain && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-slate-400 font-bold text-sm">
                      @drippilot.com
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium px-1">
                Sender address for all campaigns using this alias.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
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
                disabled={isLoading || !isFormValid}
                className="flex-2 rounded-xl h-12 text-sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    {editAlias ? "Update alias" : "Create alias"}
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
