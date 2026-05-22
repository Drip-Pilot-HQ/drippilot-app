"use client";

import { User } from "lucide-react";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { getMemberDisplayName, getMemberInitial } from "@/lib/utils/member";
import { cn } from "@/lib/utils";

const MAX_VISIBLE = 2;

interface AssigneeBadgeProps {
  assignedUserIds?: string[];
  className?: string;
  size?: "sm" | "xs";
}

export function AssigneeBadge({
  assignedUserIds,
  className,
  size = "xs",
}: AssigneeBadgeProps) {
  const { data: members = [] } = useMembersQuery();

  if (!assignedUserIds || assignedUserIds.length === 0) return null;

  const assignedMembers = assignedUserIds
    .map((id) => members.find((m) => m.userId === id))
    .filter(Boolean) as NonNullable<(typeof members)[number]>[];

  if (assignedMembers.length === 0) return null;

  const visible = assignedMembers.slice(0, MAX_VISIBLE);
  const overflow = assignedMembers.length - MAX_VISIBLE;

  const avatarSize =
    size === "xs" ? "w-4 h-4 text-[8px]" : "w-5 h-5 text-[9px]";
  const title = assignedMembers.map((m) => getMemberDisplayName(m)).join(", ");

  if (visible.length === 1) {
    const member = visible[0];
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-bold text-slate-500",
          size === "xs" ? "text-[10px]" : "text-xs",
          className,
        )}
        title={`Assigned to ${title}`}
      >
        <div
          className={cn(
            "rounded-full bg-primary/10 text-primary flex items-center justify-center font-black shrink-0",
            avatarSize,
          )}
        >
          {getMemberInitial(member)}
        </div>
        <span className="truncate max-w-[80px]">
          {getMemberDisplayName(member)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("inline-flex items-center", className)}
      title={`Assigned to ${title}`}
    >
      <div className="flex -space-x-1">
        {visible.map((member) => (
          <div
            key={member.id}
            className={cn(
              "rounded-full bg-primary/10 text-primary flex items-center justify-center font-black shrink-0 ring-1 ring-white",
              avatarSize,
            )}
          >
            {getMemberInitial(member)}
          </div>
        ))}
        {overflow > 0 && (
          <div
            className={cn(
              "rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-black shrink-0 ring-1 ring-white",
              avatarSize,
            )}
          >
            +{overflow}
          </div>
        )}
      </div>
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
