"use client";

import { useState } from "react";
import {
  Folder,
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateFolder } from "@/types/template";
import {
  useFoldersQuery,
  useCreateFolderMutation,
  useRenameFolderMutation,
  useDeleteFolderMutation,
} from "@/store/server/template.queries";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { FolderNameDialog } from "./FolderNameDialog";

interface FolderSelectorProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export function FolderSelector({
  selectedFolderId,
  onSelectFolder,
}: FolderSelectorProps) {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const { data: folders = [] } = useFoldersQuery();
  const createMutation = useCreateFolderMutation();
  const renameMutation = useRenameFolderMutation();
  const deleteMutation = useDeleteFolderMutation();
  const confirm = useConfirm();

  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [renameTarget, setRenameTarget] = useState<TemplateFolder | null>(null);

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) ?? null;
  const isActive = selectedFolderId !== null;

  const handleCreate = async (name: string) => {
    const folder = await createMutation.mutateAsync(name);
    onSelectFolder(folder.id);
    setShowCreateDialog(false);
  };

  const handleRename = async (name: string) => {
    if (!renameTarget) return;
    await renameMutation.mutateAsync({ folderId: renameTarget.id, name });
    setRenameTarget(null);
  };

  const handleDelete = async (folder: TemplateFolder) => {
    setIsOpen(false);
    const isConfirmed = await confirm({
      title: "Delete Folder",
      description: `Delete "${folder.name}"? Templates inside will become unfiled.`,
      confirmLabel: "Delete Folder",
      variant: "danger",
    });
    if (isConfirmed) {
      if (selectedFolderId === folder.id) onSelectFolder(null);
      deleteMutation.mutate(folder.id);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm w-full sm:w-auto justify-center",
            isActive || isOpen
              ? "bg-primary/5 border-primary text-primary"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          {isActive ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )}
          Folder{isActive && ` (${selectedFolder?.name})`}
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-2 border-b border-slate-50 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Filter by Folder
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectFolder(null);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                  selectedFolderId === null
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5" />
                  All Templates
                </div>
                {selectedFolderId === null && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>

              {folders.length > 0 && (
                <>
                  <div className="h-px bg-slate-100 mx-1 my-1.5" />
                  <div className="px-3 pb-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Your Folders
                    </p>
                  </div>
                  {folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="group/item flex items-center gap-1"
                    >
                      <button
                        onClick={() => {
                          onSelectFolder(folder.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all min-w-0 text-left",
                          selectedFolderId === folder.id
                            ? "bg-primary/10 text-primary"
                            : "text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {selectedFolderId === folder.id ? (
                          <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        )}
                        <span className="truncate">{folder.name}</span>
                        {selectedFolderId === folder.id && (
                          <Check className="w-3 h-3 ml-auto shrink-0" />
                        )}
                      </button>

                      {isOwnerOrAdmin && (
                        <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => {
                              setRenameTarget(folder);
                              setIsOpen(false);
                            }}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            title="Rename"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(folder)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {isOwnerOrAdmin && (
                <>
                  <div className="h-px bg-slate-100 mx-1 my-1.5" />
                  <button
                    onClick={() => {
                      setShowCreateDialog(true);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Folder
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {isOwnerOrAdmin && showCreateDialog && (
        <FolderNameDialog
          title="New Folder"
          defaultValue=""
          placeholder="e.g. Cold Outreach, Follow-ups..."
          confirmLabel="Create Folder"
          isLoading={createMutation.isPending}
          onConfirm={handleCreate}
          onCancel={() => setShowCreateDialog(false)}
        />
      )}

      {isOwnerOrAdmin && renameTarget && (
        <FolderNameDialog
          title="Rename Folder"
          defaultValue={renameTarget.name}
          placeholder="Folder name..."
          confirmLabel="Rename"
          isLoading={renameMutation.isPending}
          onConfirm={handleRename}
          onCancel={() => setRenameTarget(null)}
        />
      )}
    </>
  );
}
