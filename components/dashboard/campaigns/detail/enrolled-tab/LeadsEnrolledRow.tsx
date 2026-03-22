"use client";

import { cn } from "@/lib/utils";
import { EnrolledLead, EnrollmentStatus } from "@/types/campaign";

const STATUS_CONFIG: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  [EnrollmentStatus.PENDING]: {
    label: "Enrolled",
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  [EnrollmentStatus.PROCESSING]: {
    label: "Enrolled",
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  [EnrollmentStatus.FAILED]: {
    label: "Failed",
    className: "bg-rose-50 text-rose-600 border-rose-100",
  },
};

interface LeadsEnrolledRowProps {
  lead: EnrolledLead;
  isSelected: boolean;
  onToggle: () => void;
}

export function LeadsEnrolledRow({
  lead,
  isSelected,
  onToggle,
}: LeadsEnrolledRowProps) {
  const initial = (lead.name || lead.email || "?")[0].toUpperCase();
  const statusConfig =
    STATUS_CONFIG[lead.status] ?? STATUS_CONFIG[EnrollmentStatus.PENDING];

  return (
    <tr
      className={cn(
        "transition-colors cursor-pointer",
        isSelected ? "bg-primary/5" : "hover:bg-slate-50/50",
      )}
      onClick={onToggle}
    >
      <td className="px-5 py-3.5 w-12" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="rounded w-4 h-4 accent-primary cursor-pointer border-slate-200 transition-all"
        />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
              {lead.name || "—"}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
              {lead.email || "—"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 hidden sm:table-cell">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium",
            statusConfig.className,
          )}
        >
          {statusConfig.label}
        </span>
      </td>
      <td className="px-5 py-3.5 hidden md:table-cell text-right">
        <span className="text-xs text-slate-500 font-medium">
          {new Date(lead.enrolledAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </td>
    </tr>
  );
}
