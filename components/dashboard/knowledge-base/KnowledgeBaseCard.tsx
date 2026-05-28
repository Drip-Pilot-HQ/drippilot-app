"use client";

import {
  FileText,
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  Layers,
} from "lucide-react";
import { KbEntry } from "@/types/knowledge-base";
import { formatDistanceToNow } from "date-fns";
import { useDeleteKbEntryMutation } from "@/store/server/knowledge-base.queries";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";

interface KnowledgeBaseCardProps {
  entry: KbEntry;
  onEdit: (entry: KbEntry) => void;
}

export function KnowledgeBaseCard({ entry, onEdit }: KnowledgeBaseCardProps) {
  const deleteMutation = useDeleteKbEntryMutation();
  const confirm = useConfirm();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Entry",
      description: `Are you sure you want to delete "${entry.title}"?`,
      confirmLabel: "Delete",
      variant: "danger",
    });

    if (isConfirmed) {
      deleteMutation.mutate(entry.id);
    }
  };

  const wordCount = entry.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors border border-slate-100">
          <FileText className="w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {wordCount} Words
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none outline-none">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(entry)}>
                <Edit2 className="w-3.5 h-3.5" />
                Edit Insight
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} variant="danger">
                <Trash2 className="w-3.5 h-3.5" />
                Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-base font-black text-slate-900 group-hover:text-primary transition-colors truncate mb-1">
          {entry.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 min-h-8 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-3">
          &quot;{entry.content}&quot;
        </p>
      </div>

      <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {formatDistanceToNow(new Date(entry.updatedAt), {
            addSuffix: true,
          })}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          Synchronized
        </div>
      </div>
    </div>
  );
}
