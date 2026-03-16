"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/branding/Button";

interface MembersHeaderProps {
  canInvite: boolean;
  onInviteClick: () => void;
}

export function MembersHeader({
  canInvite,
  onInviteClick,
}: MembersHeaderProps) {
  return (
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
          onClick={onInviteClick}
          className="rounded-xl h-10 px-5 shadow-lg shadow-primary/10"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span className="font-bold">Add Member</span>
        </Button>
      )}
    </div>
  );
}
