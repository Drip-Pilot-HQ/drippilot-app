"use client";

import { useState } from "react";
import {
  Mail,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  ShieldCheck,
  Plus,
} from "lucide-react";
import {
  useEmailAliasesQuery,
  useDeleteEmailAliasMutation,
} from "@/store/server/assets.queries";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { AssetListSkeleton } from "./AssetSkeleton";
import { EmailAliasDialog } from "./EmailAliasDialog";
import { EmailAlias } from "@/types/assets";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/branding/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { AssignEmailAliasSubmenu } from "./AssignEmailAliasSubmenu";
import { AssigneeBadge } from "@/components/common/AssigneeBadge";

export function EmailAssets() {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const { data: aliases, isLoading } = useEmailAliasesQuery();
  const deleteMutation = useDeleteEmailAliasMutation();
  const confirm = useConfirm();
  const [editingAlias, setEditingAlias] = useState<EmailAlias | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (alias: EmailAlias) => {
    const isConfirmed = await confirm({
      title: "Remove Alias",
      description: `Are you sure you want to delete "${alias.emailAlias}"? You will no longer be able to send from this address.`,
      confirmLabel: "Delete Alias",
      variant: "danger",
    });

    if (isConfirmed) {
      await deleteMutation.mutateAsync(alias.id);
    }
  };

  const handleEdit = (alias: EmailAlias) => {
    setEditingAlias(alias);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingAlias(null);
  };

  if (isLoading) return <AssetListSkeleton />;

  if (!aliases || aliases.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            No email aliases
          </h2>
          <p className="text-slate-500 max-w-sm mb-8 font-medium">
            Create your first professional sending identity to start running
            email campaigns.
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Email Alias
          </Button>
        </div>

        <EmailAliasDialog
          key={isDialogOpen ? editingAlias?.id || "new" : "closed"}
          isOpen={isDialogOpen}
          onClose={closeDialog}
          editAlias={editingAlias}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center px-4 mb-6">
        <p className="text-sm text-slate-400 font-bold">
          Showing <span className="text-slate-900">{aliases.length}</span>{" "}
          {isOwnerOrAdmin ? "verified aliases" : "your aliases"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {aliases.map((alias: EmailAlias) => (
          <div
            key={alias.id}
            className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest transition-all">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>

                {isOwnerOrAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none outline-none">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleEdit(alias)}>
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Alias
                      </DropdownMenuItem>
                      <AssignEmailAliasSubmenu alias={alias} />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(alias)}
                        variant="danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-base font-black text-slate-900 truncate mb-1">
                {alias.emailAlias}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Custom Sender Identity
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-5 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(alias.createdAt), {
                  addSuffix: true,
                })}
              </div>

              {isOwnerOrAdmin && (
                <AssigneeBadge assignedUserId={alias.assignedUserId} />
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => setIsDialogOpen(true)}
          className="group relative bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all min-h-45"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary">
            Add Email Alias
          </span>
        </button>
      </div>

      <EmailAliasDialog
        key={isDialogOpen ? editingAlias?.id || "new" : "closed"}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        editAlias={editingAlias}
      />
    </>
  );
}
