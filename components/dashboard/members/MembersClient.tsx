"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  useMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useTransferOwnershipMutation,
} from "@/store/server/workspace.queries";
import { useAccountStore } from "@/store/client/useAccountStore";
import { useAuthStore } from "@/store/client/useAuthStore";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { AccessRestricted } from "@/components/branding/AccessRestricted";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { WorkspaceMember, WorkspaceRole } from "@/types/account";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { toast } from "sonner";
import { MembersHeader } from "./MembersHeader";
import { MembersFilter } from "./MembersFilter";
import { MemberCard } from "./MemberCard";
import { MembersSkeleton } from "./MembersSkeleton";

export function MembersClient() {
  const { isOwnerOrAdmin, role: userRole } = useWorkspaceRole();
  const { data: members, isLoading } = useMembersQuery(isOwnerOrAdmin);
  const removeMutation = useRemoveMemberMutation();
  const updateRoleMutation = useUpdateMemberRoleMutation();
  const transferOwnershipMutation = useTransferOwnershipMutation();

  const workspaceName = useAccountStore(
    (s) => s.workspaces.find((w) => w.id === s.activeWorkspaceId)?.name,
  );
  const currentUser = useAuthStore((state) => state.user);
  const confirm = useConfirm();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOwnerOrAdmin) return <AccessRestricted />;

  const canInvite =
    userRole === WorkspaceRole.OWNER || userRole === WorkspaceRole.ADMIN;

  const handleAction = async (member: WorkspaceMember) => {
    const isSelf = member.userId === currentUser?.id;

    if (isSelf) {
      if (member.role === WorkspaceRole.OWNER) {
        toast.error(
          "Owners cannot leave. Transfer ownership first via settings.",
        );
        return;
      }

      const isConfirmed = await confirm({
        title: "Leave Workspace",
        description: `Are you sure you want to leave "${workspaceName}"? You will lose all access to campaigns and assets.`,
        confirmLabel: "Leave Workspace",
        variant: "danger",
      });

      if (isConfirmed) {
        await removeMutation.mutateAsync(member.id);
        window.location.assign("/dashboard");
      }
    } else {
      const isConfirmed = await confirm({
        title: "Remove Member",
        description: `Are you sure you want to remove ${member.memberName || member.inviteEmail}? Their access will be immediately revoked.`,
        confirmLabel: "Remove Member",
        variant: "danger",
      });

      if (isConfirmed) {
        await removeMutation.mutateAsync(member.id);
      }
    }
  };

  const promoteToAdmin = async (member: WorkspaceMember) => {
    if (userRole !== WorkspaceRole.OWNER) return;
    const isConfirmed = await confirm({
      title: "Promote to Admin",
      description: `Make ${member.memberName || member.inviteEmail} an administrator? They will have full control over the workspace.`,
      confirmLabel: "Promote",
      variant: "primary",
    });
    if (isConfirmed) {
      await updateRoleMutation.mutateAsync({
        membershipId: member.id,
        dto: { role: WorkspaceRole.ADMIN },
      });
    }
  };

  const demoteToMember = async (member: WorkspaceMember) => {
    if (userRole !== WorkspaceRole.OWNER) return;
    const isConfirmed = await confirm({
      title: "Demote to Member",
      description: `Remove admin privileges from ${member.memberName || member.inviteEmail}? They will lose admin access immediately.`,
      confirmLabel: "Demote",
      variant: "primary",
    });
    if (isConfirmed) {
      await updateRoleMutation.mutateAsync({
        membershipId: member.id,
        dto: { role: WorkspaceRole.MEMBER },
      });
    }
  };

  const transferOwnership = async (member: WorkspaceMember) => {
    if (userRole !== WorkspaceRole.OWNER) return;
    const isConfirmed = await confirm({
      title: "Transfer Ownership",
      description: `Transfer ownership to ${member.memberName || member.inviteEmail}? You will become an admin and lose owner privileges. This cannot be undone.`,
      confirmLabel: "Transfer Ownership",
      variant: "danger",
    });
    if (isConfirmed) {
      await transferOwnershipMutation.mutateAsync(member.id);
    }
  };

  const filteredMembers = members?.filter(
    (m) =>
      m.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.inviteEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <MembersHeader
        canInvite={canInvite}
        onInviteClick={() => setIsInviteOpen(true)}
      />

      <MembersFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <MembersSkeleton />
      ) : (
        <div className="space-y-6 md:space-y-0 md:bg-white md:border md:border-slate-200 md:rounded-[32px] md:overflow-hidden md:shadow-sm md:divide-y md:divide-slate-100">
          {filteredMembers?.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[32px] py-20 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                No teammates found matching your criteria
              </p>
            </div>
          ) : (
            filteredMembers?.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isSelf={member.userId === currentUser?.id}
                userRole={userRole}
                onAction={handleAction}
                onPromote={promoteToAdmin}
                onDemote={demoteToMember}
                onTransferOwnership={transferOwnership}
              />
            ))
          )}
        </div>
      )}

      <InviteMemberDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
