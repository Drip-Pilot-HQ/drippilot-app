"use client";

import {
  FileText,
  MoreVertical,
  Trash2,
  Edit2,
  Calendar,
  User,
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

interface KnowledgeBaseRowProps {
  entry: KbEntry;
  onEdit: (entry: KbEntry) => void;
  ownerName?: string | null;
}

export function KnowledgeBaseRow({
  entry,
  onEdit,
  ownerName,
}: KnowledgeBaseRowProps) {
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
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-primary/20 transition-all duration-300 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors border border-slate-100 shrink-0">
          <FileText className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors truncate">
              {entry.title}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-widest shrink-0">
              {wordCount}w
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate italic">
            &quot;
            {entry.content.length > 120
              ? `${entry.content.substring(0, 120)}...`
              : entry.content}
            &quot;
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {ownerName && (
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-[10px] font-black text-primary">
            <User className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[80px]">{ownerName}</span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}
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
  );
}
