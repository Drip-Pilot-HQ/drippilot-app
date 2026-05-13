import { WorkspaceMember } from "@/types/account";

export function getMemberDisplayName(member: WorkspaceMember): string {
  return member.memberName || member.inviteEmail || "Unknown";
}

export function getMemberInitial(member: WorkspaceMember): string {
  return getMemberDisplayName(member)[0]?.toUpperCase() ?? "?";
}
