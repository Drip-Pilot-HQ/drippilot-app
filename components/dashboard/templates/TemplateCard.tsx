"use client";

import {
  Mail,
  MessageSquare,
  MoreVertical,
  Calendar,
  Trash2,
  Edit2,
} from "lucide-react";
import { Template, TemplateChannel } from "@/types/template";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useDeleteTemplateMutation } from "@/store/server/template.queries";
import { useState } from "react";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { AssignTemplateSubmenu } from "./AssignTemplateSubmenu";
import { AssigneeBadge } from "@/components/common/AssigneeBadge";

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  isOwnerOrAdmin: boolean;
}

export function TemplateCard({
  template,
  onEdit,
  isOwnerOrAdmin,
}: TemplateCardProps) {
  const deleteMutation = useDeleteTemplateMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const confirm = useConfirm();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Template",
      description: `Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
      confirmLabel: "Delete Template",
      variant: "danger",
    });

    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(template.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
            template.templateChannel === TemplateChannel.EMAIL
              ? "bg-blue-50 text-blue-500 border border-blue-100"
              : "bg-green-50 text-green-600 border border-green-100",
          )}
        >
          {template.templateChannel === TemplateChannel.EMAIL ? (
            <Mail className="w-5 h-5" />
          ) : (
            <MessageSquare className="w-5 h-5" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
              template.templateChannel === TemplateChannel.EMAIL
                ? "bg-blue-50 text-blue-600 border-blue-100"
                : "bg-green-50 text-green-600 border-green-100",
            )}
          >
            {template.templateChannel}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none outline-none">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit2 className="w-3.5 h-3.5" />
                Edit Template
              </DropdownMenuItem>

              {isOwnerOrAdmin && <AssignTemplateSubmenu template={template} />}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                variant="danger"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-base font-black text-slate-900 group-hover:text-primary transition-colors truncate mb-1">
          {template.name}
        </h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mb-2 truncate">
          {template.subject || "No Subject (SMS)"}
        </p>
        <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] italic bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
          &quot;{template.content}&quot;
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          Updated{" "}
          {formatDistanceToNow(new Date(template.updatedAt), {
            addSuffix: true,
          })}
        </div>

        {isOwnerOrAdmin && (
          <AssigneeBadge assignedUserId={template.assignedUserId} />
        )}
      </div>
    </div>
  );
}
