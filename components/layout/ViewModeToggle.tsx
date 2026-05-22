"use client";

import { Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViewMode } from "@/lib/hooks/use-view-mode";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";

interface ViewModeToggleProps {
  collapsed?: boolean;
}

export function ViewModeToggle({ collapsed = false }: ViewModeToggleProps) {
  const { viewMode, setViewMode } = useViewMode();
  const { isOwnerOrAdmin } = useWorkspaceRole();

  if (!isOwnerOrAdmin) return null;

  if (collapsed) {
    return (
      <div className="px-2 py-1">
        <button
          onClick={() => setViewMode(viewMode === "team" ? "personal" : "team")}
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
            viewMode === "personal"
              ? "bg-primary/10 text-primary"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200",
          )}
          title={
            viewMode === "team"
              ? "Switch to Personal View"
              : "Switch to Team View"
          }
        >
          {viewMode === "personal" ? (
            <User className="w-4 h-4" />
          ) : (
            <Users className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
        <button
          onClick={() => setViewMode("team")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            viewMode === "team"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          Team
        </button>
        <button
          onClick={() => setViewMode("personal")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all",
            viewMode === "personal"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          Personal
        </button>
      </div>
    </div>
  );
}
