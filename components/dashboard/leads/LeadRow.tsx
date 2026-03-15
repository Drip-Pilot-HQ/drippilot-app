"use client";

import {
  MoreVertical,
  Mail,
  Phone,
  Tag,
  Trash2,
  Edit2,
  User,
  Loader2,
} from "lucide-react";
import { Lead, LeadStatus } from "@/types/lead";
import { cn } from "@/lib/utils";
import {
  useDeleteLeadMutation,
  useUpdateLeadStatusMutation,
} from "@/store/server/lead.queries";
import { useState } from "react";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { EnrollLeadSubmenu } from "./EnrollLeadSubmenu";

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

export function LeadRow({ lead, onEdit }: LeadRowProps) {
  const deleteMutation = useDeleteLeadMutation();
  const statusMutation = useUpdateLeadStatusMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const confirm = useConfirm();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Lead",
      description: `Are you sure you want to delete "${lead.name || lead.email}"? This action cannot be undone.`,
      confirmLabel: "Delete Lead",
      variant: "danger",
    });

    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(lead.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (nextStatus: LeadStatus) => {
    if (statusMutation.isPending || lead.leadStatus === nextStatus) return;
    await statusMutation.mutateAsync({
      id: lead.id,
      status: { leadStatus: nextStatus },
    });
  };

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold shrink-0 uppercase",
              lead.leadStatus === LeadStatus.HOT
                ? "bg-rose-50 text-rose-500"
                : lead.leadStatus === LeadStatus.WARM
                  ? "bg-orange-50 text-orange-500"
                  : "bg-slate-100 text-slate-500",
            )}
          >
            {lead.name ? (
              lead.name[0]
            ) : lead.firstName ? (
              lead.firstName[0]
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">
              {lead.name ||
                (lead.firstName || lead.lastName
                  ? `${lead.firstName || ""} ${lead.lastName || ""}`.trim()
                  : "Unnamed Lead")}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          {lead.email ? (
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Mail className="w-3 h-3 shrink-0 text-slate-400" />
              {lead.email}
            </span>
          ) : (
            <span className="text-[11px] text-slate-300 italic">No email</span>
          )}
          {lead.phone ? (
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Phone className="w-3 h-3 shrink-0 text-slate-400" />
              {lead.phone}
            </span>
          ) : (
            <span className="text-[11px] text-slate-300 italic">No phone</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="relative group/status flex items-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
              statusMutation.isPending
                ? "opacity-50 cursor-wait bg-slate-100 text-slate-400"
                : "cursor-pointer",
              !statusMutation.isPending &&
                (lead.leadStatus === LeadStatus.HOT
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : lead.leadStatus === LeadStatus.WARM
                    ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                    : lead.leadStatus === LeadStatus.COLD
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : lead.leadStatus === LeadStatus.CONVERTED
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"),
            )}
          >
            {statusMutation.isPending && (
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
            )}
            {lead.leadStatus}
          </span>
          <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 py-1">
            {!statusMutation.isPending &&
              Object.values(LeadStatus).map((status) => (
                <button
                  key={status}
                  disabled={lead.leadStatus === status}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                    lead.leadStatus === status
                      ? "bg-primary/5 text-primary opacity-50 cursor-default"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary",
                  )}
                >
                  {status}
                </button>
              ))}
            {statusMutation.isPending && (
              <div className="px-4 py-3 text-center">
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-primary/50" />
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {lead.tags?.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500"
            >
              <Tag className="w-2 h-2" />
              {tag}
            </span>
          ))}
          {(!lead.tags || lead.tags.length === 0) && (
            <span className="text-[10px] text-slate-300 italic">No tags</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none outline-none">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(lead)}>
              <Edit2 className="w-4 h-4" />
              Edit Lead
            </DropdownMenuItem>

            <EnrollLeadSubmenu leadId={lead.id} />

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              variant="danger"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
