"use client";

import { useState } from "react";
import { X, UserX, Loader2, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { WorkspaceMember } from "@/types/account";
import { useBulkAssignLeadsMutation } from "@/store/server/lead.queries";
import { getMemberDisplayName, getMemberInitial } from "@/lib/utils/member";
import { cn } from "@/lib/utils";

interface BulkAssignDialogProps {
  leadIds: string[];
  members: WorkspaceMember[];
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkAssignDialog({
  leadIds,
  members,
  onClose,
  onSuccess,
}: BulkAssignDialogProps) {
  const [search, setSearch] = useState("");
  const bulkAssignMutation = useBulkAssignLeadsMutation();

  const activeMembers = members.filter((m) => m.userId !== null);
  const filtered = activeMembers.filter((m) =>
    getMemberDisplayName(m).toLowerCase().includes(search.toLowerCase()),
  );

  const handleAssign = async (userId: string | null) => {
    try {
      await bulkAssignMutation.mutateAsync({
        leadIds,
        assignedUserId: userId,
      });
      toast.success(
        userId
          ? `${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} assigned`
          : `${leadIds.length} lead${leadIds.length !== 1 ? "s" : ""} unassigned`,
      );
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to update assignments");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 pt-6 pb-4 border-b border-slate-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Bulk Assign</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-xs text-slate-500 font-medium">
                  {leadIds.length} lead{leadIds.length !== 1 ? "s" : ""}{" "}
                  selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-primary text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="px-4 pb-2 max-h-60 overflow-y-auto space-y-0.5">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6 font-medium">
              No members found
            </p>
          ) : (
            filtered.map((member) => (
              <button
                key={member.id}
                onClick={() => handleAssign(member.userId)}
                disabled={bulkAssignMutation.isPending}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-all",
                  bulkAssignMutation.isPending &&
                    "opacity-50 cursor-not-allowed",
                )}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-black shrink-0">
                  {bulkAssignMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    getMemberInitial(member)
                  )}
                </div>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {getMemberDisplayName(member)}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="px-4 pb-4 pt-2 border-t border-slate-50">
          <button
            onClick={() => handleAssign(null)}
            disabled={bulkAssignMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <UserX className="w-3.5 h-3.5" />
            Unassign All
          </button>
        </div>
      </div>
    </div>
  );
}
