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

const STATUS_STYLES: Record<LeadStatus, string> = {
  [LeadStatus.HOT]: "bg-rose-50 text-rose-600 hover:bg-rose-100",
  [LeadStatus.WARM]: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  [LeadStatus.COLD]: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  [LeadStatus.CONVERTED]: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  [LeadStatus.UNSUBSCRIBED]: "bg-slate-100 text-slate-600 hover:bg-slate-200",
};

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

  const statusStyle =
    STATUS_STYLES[lead.leadStatus] ??
    "bg-slate-100 text-slate-600 hover:bg-slate-200";

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
          <p className="font-semibold text-slate-900 text-sm leading-tight">
            {lead.name ||
              (lead.firstName || lead.lastName
                ? `${lead.firstName || ""} ${lead.lastName || ""}`.trim()
                : "Unnamed Lead")}
          </p>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              disabled={statusMutation.isPending}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all focus:outline-none",
                statusMutation.isPending
                  ? "opacity-50 cursor-wait bg-slate-100 text-slate-400"
                  : statusStyle,
              )}
            >
              {statusMutation.isPending && (
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
              )}
              {lead.leadStatus}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {Object.values(LeadStatus).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={
                  lead.leadStatus === status || statusMutation.isPending
                }
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  lead.leadStatus === status && "text-primary",
                )}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
