"use client";

import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Check,
  Trash2,
  Pencil,
  MoreVertical,
  Loader2,
  X,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Workspace, WorkspaceRole } from "@/types/account";
import { useAccountStore } from "@/store/client/useAccountStore";
import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/store/server/account.queries";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";

interface WorkspaceCardProps {
  workspace: Workspace;
}

function RenameDialog({
  workspace,
  onClose,
}: {
  workspace: Workspace;
  onClose: () => void;
}) {
  const [name, setName] = useState(workspace.name);
  const updateMutation = useUpdateWorkspaceMutation();

  const isValid = name.trim().length >= 3;
  const isDirty = name.trim() !== workspace.name;

  const handleSave = async () => {
    if (!isValid || !isDirty) return;
    try {
      await updateMutation.mutateAsync({
        id: workspace.id,
        dto: { name: name.trim() },
      });
      toast.success("Workspace renamed");
      onClose();
    } catch {
      toast.error("Failed to rename workspace");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 pt-6 pb-4 border-b border-slate-50 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Rename Workspace
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Enter a new name for your workspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Workspace Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="e.g. Acme Corp"
              minLength={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
            />
            {name.trim().length > 0 && name.trim().length < 3 && (
              <p className="text-[11px] text-rose-500 font-bold">
                Minimum 3 characters
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid || !isDirty || updateMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();
  const { setActiveWorkspace } = useAccountStore();
  const activeWorkspaceId = useAccountStore((s) => s.activeWorkspaceId);
  const deleteMutation = useDeleteWorkspaceMutation();
  const confirm = useConfirm();
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const isActive = activeWorkspaceId === workspace.id;
  const isOwner = workspace.role === WorkspaceRole.OWNER;
  const isOwnerOrAdmin =
    workspace.role === WorkspaceRole.OWNER ||
    workspace.role === WorkspaceRole.ADMIN;

  const handleSelect = () => {
    setActiveWorkspace(workspace);
    router.push("/dashboard");
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const isConfirmed = await confirm({
      title: "Delete Workspace",
      description: `Are you sure you want to delete "${workspace.name}"? This cannot be undone and will permanently remove all associated data.`,
      confirmLabel: "Delete Workspace",
      cancelLabel: "Keep Workspace",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await deleteMutation.mutateAsync(workspace.id);
        toast.success("Workspace deleted");
      } catch {
        toast.error("Failed to delete workspace", {
          description:
            "Ensure no other active members or billing issues exist.",
        });
      }
    }
  };

  return (
    <>
      <div
        onClick={handleSelect}
        className={cn(
          "group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
          isActive
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-slate-200 bg-white hover:border-primary/40 hover:shadow-md",
        )}
      >
        <div className="flex items-center gap-4 min-w-0 pr-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-colors",
              isActive ? "bg-primary text-white" : "bg-primary/10 text-primary",
            )}
          >
            <Briefcase className="w-5 h-5" />
          </div>

          <div className="flex flex-col min-w-0">
            <h3
              className={cn(
                "font-heading font-semibold truncate transition-colors",
                isActive
                  ? "text-primary"
                  : "text-slate-900 group-hover:text-primary",
              )}
            >
              {workspace.name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider h-5"
              >
                {workspace.role}
              </Badge>
              {isActive && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOwnerOrAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none outline-none"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenameOpen(true);
                  }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Rename
                </DropdownMenuItem>
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      variant="danger"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ArrowRight
            className={cn(
              "w-5 h-5 transition-all text-slate-300",
              isActive
                ? "text-primary translate-x-1"
                : "group-hover:text-primary group-hover:translate-x-1",
            )}
          />
        </div>
      </div>

      {isRenameOpen && (
        <RenameDialog
          workspace={workspace}
          onClose={() => setIsRenameOpen(false)}
        />
      )}
    </>
  );
}
