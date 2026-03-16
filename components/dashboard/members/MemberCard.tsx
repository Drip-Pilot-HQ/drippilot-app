"use client";

import {
  User,
  ShieldCheck,
  Clock,
  MoreVertical,
  Trash2,
  LogOut,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  WorkspaceMember,
  WorkspaceRole,
  WorkspaceStatus,
} from "@/types/account";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";

interface MemberCardProps {
  member: WorkspaceMember;
  isSelf: boolean;
  userRole: WorkspaceRole;
  onAction: (member: WorkspaceMember) => void;
  onPromote: (member: WorkspaceMember) => void;
}

export function MemberCard({
  member,
  isSelf,
  userRole,
  onAction,
  onPromote,
}: MemberCardProps) {
  const showAction =
    isSelf ||
    (userRole === WorkspaceRole.OWNER && member.role !== WorkspaceRole.OWNER) ||
    (userRole === WorkspaceRole.ADMIN && member.role === WorkspaceRole.MEMBER);

  const displayDate = member.joinedAt || member.createdAt;

  return (
    <div className="group flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-5 md:px-8 md:py-6 hover:bg-slate-50/50 transition-all border border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-md md:hover:shadow-none md:border-x-0 md:border-t-0 md:border-b md:last:border-b-0 md:rounded-none md:shadow-none md:bg-transparent">
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
              <DropdownMenuContent align="end" className="w-56 p-2">
                {isSelf ? (
                  <DropdownMenuItem
                    onClick={() => onAction(member)}
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
                          onClick={() => onPromote(member)}
                          className="font-bold py-2 text-slate-700 hover:text-primary"
                        >
                          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary mr-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          Promote to Admin
                        </DropdownMenuItem>
                      )}
                    <DropdownMenuItem
                      onClick={() => onAction(member)}
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
}
