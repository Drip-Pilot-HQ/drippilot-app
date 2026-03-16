"use client";

import { useState } from "react";
import {
  UserPlus,
  User,
  ShieldCheck,
  Search,
  Clock,
  MoreVertical,
  Trash2,
  LogOut,
} from "lucide-react";
import {
  useMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/store/server/workspace.queries";
import { useAccountStore } from "@/store/client/useAccountStore";
import { useAuthStore } from "@/store/client/useAuthStore";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import {
  WorkspaceMember,
  WorkspaceRole,
  WorkspaceStatus,
} from "@/types/account";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";

export function MembersClient() {
  const { data: members, isLoading } = useMembersQuery();
  const removeMutation = useRemoveMemberMutation();
  const updateRoleMutation = useUpdateMemberRoleMutation();

  const activeWorkspace = useAccountStore((state) => state.activeWorkspace);
  const currentUser = useAuthStore((state) => state.user);
  const confirm = useConfirm();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userRole = activeWorkspace?.role || WorkspaceRole.MEMBER;
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
        description: `Are you sure you want to leave "${activeWorkspace?.name}"? You will lose all access to campaigns and assets.`,
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

  const filteredMembers = members?.filter(
    (m) =>
      m.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.inviteEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Team Members
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Manage your organization and member permissions
          </p>
        </div>

        {canInvite && (
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="rounded-xl h-10 px-5 shadow-lg shadow-primary/10"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="font-bold">Add Member</span>
          </Button>
        )}
      </div>

      {/* Global Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Find teammate by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
          />
        </div>
      </div>

      {/* Members List */}
      {isLoading ? (
        <MembersSkeleton />
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 px-6 py-4 md:px-0 md:py-0">
            {filteredMembers?.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search className="w-8 h-8" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                  No teammates found matching your criteria
                </p>
              </div>
            ) : (
              filteredMembers?.map((member) => {
                const isSelf = member.userId === currentUser?.id;
                const showAction =
                  isSelf ||
                  (userRole === WorkspaceRole.OWNER &&
                    member.role !== WorkspaceRole.OWNER) ||
                  (userRole === WorkspaceRole.ADMIN &&
                    member.role === WorkspaceRole.MEMBER);
                const displayDate = member.joinedAt || member.createdAt;

                return (
                  <div
                    key={member.id}
                    className="group flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-5 md:px-8 md:py-5 hover:bg-slate-50/80 transition-all border border-slate-200/50 md:border-x-0 md:border-t-0 md:border-b md:border-slate-100 rounded-3xl md:rounded-none bg-white md:bg-transparent shadow-sm md:shadow-none mb-4 md:mb-0"
                  >
                    {/* Member Info */}
                    <div className="col-span-5 flex flex-wrap items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black group-hover:bg-primary/10 group-hover:text-primary transition-all relative overflow-hidden shrink-0 shadow-sm">
                        {member.memberName ? (
                          member.memberName[0].toUpperCase()
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                        {member.status === WorkspaceStatus.PENDING && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-base font-black text-slate-900 truncate">
                            {member.memberName || "Invited User"}
                          </h3>
                          {isSelf && (
                            <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate">
                          {member.inviteEmail || "No email available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:contents">
                      {/* Role */}
                      <div className="col-span-2">
                        <div className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          Account Role
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                            member.role === WorkspaceRole.OWNER
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : member.role === WorkspaceRole.ADMIN
                                ? "bg-primary/5 text-primary border border-primary/10"
                                : "bg-slate-50 text-slate-500 border border-slate-100",
                          )}
                        >
                          {member.role === WorkspaceRole.OWNER ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : null}
                          {member.role}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <div className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          Live Status
                        </div>
                        {member.status === WorkspaceStatus.PENDING ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <Clock className="w-3 h-3" />
                            Awaiting
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <ShieldCheck className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>

                      {/* Joined Date */}
                      <div className="col-span-2 md:text-center">
                        <div className="md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          Member Since
                        </div>
                        <div className="flex flex-col md:items-center">
                          <span className="text-xs font-black text-slate-700">
                            {displayDate
                              ? formatDistanceToNow(new Date(displayDate), {
                                  addSuffix: true,
                                })
                              : "N/A"}
                          </span>
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                            {member.joinedAt ? "Verified" : "Invited"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex justify-end ml-auto md:ml-0">
                        {showAction && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2.5 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-slate-100 hover:border-slate-200 shadow-sm md:shadow-none focus:outline-none outline-none bg-slate-50/50">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 p-2"
                            >
                              {isSelf ? (
                                <DropdownMenuItem
                                  onClick={() => handleAction(member)}
                                  variant="danger"
                                  className="font-bold py-2"
                                >
                                  <div className="w-7 h-7 rounded-md bg-rose-100/50 flex items-center justify-center mr-1 text-rose-600">
                                    <LogOut className="w-3.5 h-3.5" />
                                  </div>
                                  Leave Workspace
                                </DropdownMenuItem>
                              ) : (
                                <>
                                  <div className="px-2 py-1.5 mb-1 border-b border-slate-50">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                      Settings
                                    </p>
                                  </div>
                                  {userRole === WorkspaceRole.OWNER &&
                                    member.role === WorkspaceRole.MEMBER && (
                                      <DropdownMenuItem
                                        onClick={() => promoteToAdmin(member)}
                                        className="font-bold py-2 text-slate-700 hover:text-primary"
                                      >
                                        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-1">
                                          <ShieldCheck className="w-3.5 h-3.5" />
                                        </div>
                                        Promote to Admin
                                      </DropdownMenuItem>
                                    )}
                                  <DropdownMenuItem
                                    onClick={() => handleAction(member)}
                                    variant="danger"
                                    className="font-bold py-2"
                                  >
                                    <div className="w-7 h-7 rounded-md bg-rose-100/50 flex items-center justify-center mr-1 text-rose-600">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </div>
                                    Remove from team
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <InviteMemberDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}

function MembersSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden animate-pulse">
      <div className="h-14 bg-slate-50 border-b border-slate-100" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="px-8 py-6 border-b border-slate-50 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-100" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-100 rounded" />
              <div className="h-3 w-48 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4 px-4">
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
