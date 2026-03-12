"use client";

import { cn } from "@/lib/utils";
import { EnrolledLead, EnrollmentStatus } from "@/types/campaign";

const STATUS_CONFIG: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  [EnrollmentStatus.PENDING]: {
    label: "Pending",
    className: "bg-amber-50 text-amber-600 border-amber-100",
  },
  [EnrollmentStatus.PROCESSING]: {
    label: "Processing",
    className: "bg-blue-50 text-blue-600 border-blue-100",
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
        isSelected ? "bg-primary/5" : "hover:bg-slate-50",
      )}
      onClick={onToggle}
    >
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="rounded w-4 h-4 accent-primary cursor-pointer"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none mb-0.5">
              {lead.name || "—"}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              {lead.email || "—"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span
          className={cn(
            "inline-flex items-center px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider",
            statusConfig.className,
          )}
        >
          {statusConfig.label}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
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
