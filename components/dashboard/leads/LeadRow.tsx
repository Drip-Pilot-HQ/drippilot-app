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
  ChevronDown,
  MapPin,
} from "lucide-react";
import { Lead, LeadStatus } from "@/types/lead";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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
import { AssignLeadSubmenu } from "./AssignLeadSubmenu";
import { CampaignPills } from "./CampaignPills";

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  isOwnerOrAdmin: boolean;
  memberMap?: Map<string, string>;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  [LeadStatus.HOT]: "bg-rose-50 text-rose-600",
  [LeadStatus.WARM]: "bg-orange-50 text-orange-600",
  [LeadStatus.COLD]: "bg-blue-50 text-blue-600",
  [LeadStatus.CONVERTED]: "bg-emerald-50 text-emerald-600",
  [LeadStatus.UNSUBSCRIBED]: "bg-slate-100 text-slate-600",
};

const STATUS_STYLES_INTERACTIVE: Record<LeadStatus, string> = {
  [LeadStatus.HOT]: "bg-rose-50 text-rose-600 hover:bg-rose-100",
  [LeadStatus.WARM]: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  [LeadStatus.COLD]: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  [LeadStatus.CONVERTED]: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  [LeadStatus.UNSUBSCRIBED]: "bg-slate-100 text-slate-600 hover:bg-slate-200",
};

export function LeadRow({
  lead,
  onEdit,
  isSelected,
  onToggleSelect,
  isOwnerOrAdmin,
  memberMap,
}: LeadRowProps) {
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

  const assigneeName = lead.assignedUserId
    ? (memberMap?.get(lead.assignedUserId) ?? null)
    : null;

  const statusStyle =
    STATUS_STYLES[lead.leadStatus] ?? "bg-slate-100 text-slate-600";
  const statusStyleInteractive =
    STATUS_STYLES_INTERACTIVE[lead.leadStatus] ??
    "bg-slate-100 text-slate-600 hover:bg-slate-200";

  return (
    <tr
      className={cn(
        "group border-b border-slate-100 hover:bg-slate-50 transition-[background-color]",
        isSelected && "bg-primary/5",
      )}
    >
      {isOwnerOrAdmin && (
        <td className="pl-3 pr-2 py-3 w-9">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(lead.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-slate-300 text-primary accent-primary cursor-pointer"
          />
        </td>
      )}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 uppercase",
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
              <User className="w-3.5 h-3.5" />
            )}
          </div>
          <p className="font-semibold text-slate-900 text-sm leading-tight truncate max-w-[140px]">
            {lead.name ||
              (lead.firstName || lead.lastName
                ? `${lead.firstName || ""} ${lead.lastName || ""}`.trim()
                : "Unnamed Lead")}
          </p>
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          {lead.email ? (
            <span className="flex items-center gap-1 text-xs text-slate-600 font-semibold truncate max-w-[220px]">
              <Mail className="w-3 h-3 shrink-0 text-slate-400" />
              {lead.email}
            </span>
          ) : (
            <span className="text-xs text-slate-300 italic">No email</span>
          )}
          {lead.phone ? (
            <span className="flex items-center gap-1 text-xs text-slate-600 font-semibold">
              <Phone className="w-3 h-3 shrink-0 text-slate-400" />
              {lead.phone}
            </span>
          ) : (
            <span className="text-xs text-slate-300 italic">No phone</span>
          )}
        </div>
      </td>
      <td className="px-3 py-3">
        {isOwnerOrAdmin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={statusMutation.isPending}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none whitespace-nowrap",
                  statusMutation.isPending
                    ? "opacity-50 cursor-wait bg-slate-100 text-slate-400"
                    : statusStyleInteractive,
                )}
              >
                {statusMutation.isPending ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : null}
                {lead.leadStatus}
                <ChevronDown className="w-2.5 h-2.5 opacity-60 shrink-0" />
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
        ) : (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
              statusStyle,
            )}
          >
            {lead.leadStatus}
          </span>
        )}
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1">
          {lead.tags?.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 whitespace-nowrap"
            >
              <Tag className="w-2 h-2 shrink-0" />
              {tag}
            </span>
          ))}
          {(!lead.tags || lead.tags.length === 0) && (
            <span className="text-[10px] text-slate-300 italic">—</span>
          )}
        </div>
      </td>
      <td className="px-3 py-3">
        <CampaignPills
          campaigns={lead.enrolledCampaigns ?? []}
          leadId={lead.id}
        />
      </td>
      <td className="px-3 py-3">
        {lead.address ? (
          <span className="flex items-center gap-1 text-xs text-slate-600 font-semibold truncate max-w-[160px]">
            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
            {lead.address}
          </span>
        ) : (
          <span className="text-xs text-slate-300 italic">—</span>
        )}
      </td>

      {isOwnerOrAdmin && (
        <td className="px-3 py-3">
          {assigneeName ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">
                {assigneeName[0]?.toUpperCase()}
              </div>
              <span className="truncate max-w-[100px]">{assigneeName}</span>
            </span>
          ) : (
            <span className="text-xs text-slate-300 italic">Unassigned</span>
          )}
        </td>
      )}

      <td className="px-3 py-3">
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {format(new Date(lead.createdAt), "MMM d, yyyy")}
        </span>
      </td>
      <td className="px-3 py-3 text-right">
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

            {isOwnerOrAdmin && <AssignLeadSubmenu lead={lead} />}

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
