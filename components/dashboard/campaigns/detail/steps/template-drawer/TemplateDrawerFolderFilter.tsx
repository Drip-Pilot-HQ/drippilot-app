"use client";

import { useState } from "react";
import { Folder, FolderOpen, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFoldersQuery } from "@/store/server/template.queries";

interface TemplateDrawerFolderFilterProps {
  selectedFolderId: string | null;
  onSelect: (folderId: string | null) => void;
}

export function TemplateDrawerFolderFilter({
  selectedFolderId,
  onSelect,
}: TemplateDrawerFolderFilterProps) {
  const { data: folders = [] } = useFoldersQuery();
  const [isOpen, setIsOpen] = useState(false);

  if (folders.length === 0) return null;

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all",
          selectedFolderId !== null
            ? "bg-primary/5 border-primary text-primary"
            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
        )}
      >
        {selectedFolderId !== null ? (
          <FolderOpen className="w-3.5 h-3.5" />
        ) : (
          <Folder className="w-3.5 h-3.5" />
        )}
        {selectedFolder ? selectedFolder.name : "All Folders"}
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
          <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all",
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

            <div className="h-px bg-slate-100 mx-1 my-1" />

            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => {
                  onSelect(folder.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left",
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
                <span className="truncate flex-1">{folder.name}</span>
                {selectedFolderId === folder.id && (
                  <Check className="w-3 h-3 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
