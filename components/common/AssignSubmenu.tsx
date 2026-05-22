"use client";

import { useState } from "react";
import { Search, Loader2, UserCheck, UserX, Check } from "lucide-react";
import { useMembersQuery } from "@/store/server/workspace.queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { getMemberDisplayName, getMemberInitial } from "@/lib/utils/member";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/common/DropdownMenu";

interface AssignSubmenuProps {
  currentAssignedUserIds: string[];
  isAssigning: boolean;
  assigningUserId: string | null | undefined;
  onAssign: (userIds: string[]) => void;
  label?: string;
}

export function AssignSubmenu({
  currentAssignedUserIds,
  isAssigning,
  assigningUserId,
  onAssign,
  label = "Assign to Member",
}: AssignSubmenuProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: members = [], isLoading } = useMembersQuery();

  const activeMembers = members.filter(
    (m) => m.userId !== null && m.status === "active",
  );

  const filtered = debouncedSearch
    ? activeMembers.filter((m) =>
        getMemberDisplayName(m)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      )
    : activeMembers;

  const handleToggle = (userId: string) => {
    const next = currentAssignedUserIds.includes(userId)
      ? currentAssignedUserIds.filter((id) => id !== userId)
      : [...currentAssignedUserIds, userId];
    onAssign(next);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <UserCheck className="w-4 h-4" />
        {label}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-64 p-0 overflow-hidden">
        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              autoFocus
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
            </div>
          ) : (
            <>
              {currentAssignedUserIds.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssign([]);
                  }}
                  disabled={isAssigning}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-rose-50 group transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border bg-white border-slate-200 group-hover:border-rose-200 group-hover:bg-rose-50 transition-colors">
                    {isAssigning && assigningUserId === null ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                    ) : (
                      <UserX className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-500 group-hover:text-rose-600 transition-colors">
                    Unassign all
                  </p>
                </button>
              )}

              {filtered.length > 0 ? (
                filtered.map((member) => {
                  const isAssigned = currentAssignedUserIds.includes(
                    member.userId!,
                  );
                  const isPending =
                    isAssigning && assigningUserId === member.userId;
                  return (
                    <button
                      key={member.id}
                      disabled={isAssigning}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(member.userId!);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors group",
                        isAssigned ? "bg-primary/5" : "hover:bg-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs font-black transition-colors",
                          isAssigned
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-white border-slate-200 text-slate-500 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary",
                        )}
                      >
                        {isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        ) : (
                          getMemberInitial(member)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-xs font-bold truncate",
                            isAssigned
                              ? "text-primary"
                              : "text-slate-700 group-hover:text-primary",
                          )}
                        >
                          {getMemberDisplayName(member)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium capitalize">
                          {member.role}
                        </p>
                      </div>
                      {isAssigned && (
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 px-4 text-center">
                  <p className="text-[11px] font-bold text-slate-400">
                    No members found
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

interface UseAssignSubmenuReturn {
  handleAssign: (userIds: string[]) => Promise<void>;
  isAssigning: boolean;
  assigningUserId: string | null | undefined;
}

export function useAssignSubmenuState(
  mutateAsync: (userIds: string[]) => Promise<unknown>,
  successMessage: (userIds: string[]) => string,
): UseAssignSubmenuReturn {
  const [assigningUserId, setAssigningUserId] = useState<
    string | null | undefined
  >(undefined);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async (userIds: string[]) => {
    setAssigningUserId(
      userIds.length === 0 ? null : userIds[userIds.length - 1],
    );
    setIsAssigning(true);
    try {
      await mutateAsync(userIds);
      toast.success(successMessage(userIds));
    } catch {
      toast.error("Failed to update assignment");
    } finally {
      setIsAssigning(false);
      setAssigningUserId(undefined);
    }
  };

  return { handleAssign, isAssigning, assigningUserId };
}
