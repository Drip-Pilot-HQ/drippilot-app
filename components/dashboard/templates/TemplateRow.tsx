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

interface TemplateRowProps {
  template: Template;
  onEdit: (template: Template) => void;
  isOwnerOrAdmin: boolean;
}

export function TemplateRow({
  template,
  onEdit,
  isOwnerOrAdmin,
}: TemplateRowProps) {
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
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-primary/20 transition-all duration-300 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0",
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

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors truncate">
              {template.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border shrink-0",
                template.templateChannel === TemplateChannel.EMAIL
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : "bg-green-50 text-green-600 border-green-100",
              )}
            >
              {template.templateChannel}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate italic">
            {template.content.length > 100
              ? `${template.content.substring(0, 100)}...`
              : template.content}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {formatDistanceToNow(new Date(template.updatedAt), {
            addSuffix: true,
          })}
        </div>

        {isOwnerOrAdmin && (
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
        )}
      </div>
    </div>
  );
}
