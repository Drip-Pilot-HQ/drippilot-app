import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Workspace } from "@/types/account";

interface WorkspaceDropdownProps {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  onSwitch: (workspace: Workspace) => void;
  onManage: () => void;
  align?: "left" | "top";
}

export function WorkspaceDropdown({
  workspaces,
  activeWorkspaceId,
  onSwitch,
  onManage,
  align = "top",
}: WorkspaceDropdownProps) {
  return (
    <div
      className={cn(
        "absolute bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in duration-200",
        align === "top"
          ? "top-full left-0 w-full mt-2 slide-in-from-top-2"
          : "left-full ml-2 top-0 w-64 slide-in-from-left-2",
      )}
    >
      <div className="px-4 py-2 border-b border-white/5 mb-2">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          Switch Workspace
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {workspaces.map((ws) => (
          <button
            key={ws.id}
            onClick={() => onSwitch(ws)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                {ws.name[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-zinc-200 truncate">
                {ws.name}
              </span>
            </div>
            {activeWorkspaceId === ws.id && (
              <Check className="w-4 h-4 text-primary shrink-0" />
            )}
          </button>
        ))}
      </div>

      <div className="h-px bg-white/5 my-2" />

      <button
        onClick={onManage}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left text-primary"
      >
        <span className="text-sm font-bold">Manage Workspaces</span>
      </button>
    </div>
  );
}
