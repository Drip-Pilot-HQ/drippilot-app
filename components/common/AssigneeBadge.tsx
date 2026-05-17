"use client";

import { User } from "lucide-react";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { getMemberDisplayName, getMemberInitial } from "@/lib/utils/member";
import { cn } from "@/lib/utils";

interface AssigneeBadgeProps {
  assignedUserId: string | null | undefined;
  className?: string;
  size?: "sm" | "xs";
}

export function AssigneeBadge({
  assignedUserId,
  className,
  size = "xs",
}: AssigneeBadgeProps) {
  const { data: members = [] } = useMembersQuery();

  if (!assignedUserId) return null;

  const member = members.find((m) => m.userId === assignedUserId);
  if (!member) return null;

  const initial = getMemberInitial(member);
  const name = getMemberDisplayName(member);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold text-slate-500",
        size === "xs" ? "text-[10px] gap-1" : "text-xs gap-1.5",
        className,
      )}
      title={`Assigned to ${name}`}
    >
      <div
        className={cn(
          "rounded-full bg-primary/10 text-primary flex items-center justify-center font-black shrink-0",
          size === "xs" ? "w-4 h-4 text-[8px]" : "w-5 h-5 text-[9px]",
        )}
      >
        {initial}
      </div>
      <span className="truncate max-w-[80px]">{name}</span>
    </div>
  );
}

interface UnassignedBadgeProps {
  className?: string;
}

export function UnassignedBadge({ className }: UnassignedBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-bold text-slate-300",
        className,
      )}
    >
      <User className="w-3 h-3" />
      <span>Unassigned</span>
    </div>
  );
}
