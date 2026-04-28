"use client";

import { ArrowRight, Briefcase, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Workspace, WorkspaceRole } from "@/types/account";
import { useAccountStore } from "@/store/client/useAccountStore";
import { useDeleteWorkspaceMutation } from "@/store/server/account.queries";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { toast } from "sonner";
import { Button } from "@/components/branding/Button";

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();
  const { activeWorkspace, setActiveWorkspace } = useAccountStore();
  const deleteMutation = useDeleteWorkspaceMutation();
  const confirm = useConfirm();
  const isActive = activeWorkspace?.id === workspace.id;
  const isOwner = workspace.role === WorkspaceRole.OWNER;

  const handleSelect = () => {
    setActiveWorkspace(workspace);
    router.push("/dashboard");
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const isConfirmed = await confirm({
      title: "Delete Workspace",
      description: `Are you sure you want to delete "${workspace.name}"? This action cannot be undone and will permanently remove all associated data.`,
      confirmLabel: "Delete Workspace",
      cancelLabel: "Keep Workspace",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await deleteMutation.mutateAsync(workspace.id);
        toast.success("Workspace deleted", {
          description: `"${workspace.name}" has been successfully removed.`,
        });
      } catch (error) {
        console.error("Failed to delete workspace", error);
        toast.error("Operation Failed", {
          description:
            "Ensure the workspace has no other active members or billing issues before deleting.",
        });
      }
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
        isActive
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-slate-200 bg-white hover:border-primary/40 hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-4 min-w-0 pr-10">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-colors",
            isActive ? "bg-primary text-white" : "bg-primary/10 text-primary",
          )}
        >
          <Briefcase className="w-5 h-5" />
        </div>

        {/* Workspace info */}
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

      <div className="flex items-center gap-3">
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            className="w-10 h-10 p-0 rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shrink-0"
            title="Delete Workspace"
          >
            {!deleteMutation.isPending && <Trash2 className="w-4 h-4" />}
          </Button>
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
  );
}
