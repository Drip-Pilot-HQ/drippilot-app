"use client";

import { cn } from "@/lib/utils";
import { EnrolledLead, EnrollmentStatus } from "@/types/campaign";

const STATUS_CONFIG: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  [EnrollmentStatus.PENDING]: {
    label: "Scheduled",
    className: "bg-amber-50 text-amber-600 border-amber-100",
  },
  [EnrollmentStatus.PROCESSING]: {
    label: "Sending...",
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
        "transition-all cursor-pointer duration-200",
        isSelected ? "bg-primary/5" : "hover:bg-slate-50/50",
      )}
      onClick={onToggle}
    >
      <td className="px-5 py-4 w-12" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="rounded-lg w-5 h-5 accent-primary cursor-pointer border-slate-200 transition-all"
        />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-sm font-black shrink-0 shadow-sm">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 leading-tight truncate">
              {lead.name || "—"}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {lead.email || "—"}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm",
            statusConfig.className,
          )}
        >
          {lead.status === EnrollmentStatus.PROCESSING && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
          )}
          {statusConfig.label}
        </span>
      </td>
      <td className="px-5 py-4 hidden md:table-cell text-right">
        <span className="text-[11px] text-slate-500 font-black uppercase tracking-tight bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
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
