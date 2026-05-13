"use client";

import { useState } from "react";
import { ChevronDown, Users, User, X } from "lucide-react";
import { WorkspaceMember } from "@/types/account";
import { getMemberDisplayName } from "@/lib/utils/member";
import { cn } from "@/lib/utils";

interface ViewAsMemberSelectorProps {
  members: WorkspaceMember[];
  value: string | undefined;
  onChange: (userId: string | undefined) => void;
}

export function ViewAsMemberSelector({
  members,
  value,
  onChange,
}: ViewAsMemberSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeMembers = members.filter((m) => m.userId !== null);
  const selected = activeMembers.find((m) => m.userId === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-bold transition-all",
          value
            ? "bg-primary/5 border-primary/20 text-primary"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
        )}
      >
        {value ? (
          <User className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Users className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="max-w-[140px] truncate">
          {selected ? getMemberDisplayName(selected) : "Team metrics"}
        </span>
        {value ? (
          <X
            className="w-3.5 h-3.5 ml-0.5 hover:text-rose-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
              setIsOpen(false);
            }}
          />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5">
              View as
            </p>

            <button
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left",
                !value
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-slate-500" />
              </div>
              Team metrics
              {!value && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shrink-0" />
              )}
            </button>

            {activeMembers.length > 0 && (
              <div className="my-1 border-t border-slate-50" />
            )}

            {activeMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  onChange(member.userId ?? undefined);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left",
                  value === member.userId
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[11px] font-black shrink-0">
                  {getMemberDisplayName(member)[0]?.toUpperCase()}
                </div>
                <span className="truncate">{getMemberDisplayName(member)}</span>
                {value === member.userId && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shrink-0" />
                )}
              </button>
            ))}

            {activeMembers.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-3 font-medium">
                No members to preview
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
