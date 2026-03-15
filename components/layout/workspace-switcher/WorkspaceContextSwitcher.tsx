import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAccountStore } from "@/store/client/useAccountStore";
import { useWorkspacesQuery } from "@/store/server/account.queries";
import { cn } from "@/lib/utils";
import { WorkspaceSwitcherSkeleton } from "./WorkspaceSwitcherSkeleton";
import { WorkspaceDropdown } from "./WorkspaceDropdown";

interface WorkspaceContextSwitcherProps {
  collapsed?: boolean;
}

export function WorkspaceContextSwitcher({
  collapsed = false,
}: WorkspaceContextSwitcherProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { activeWorkspace, workspaces, setActiveWorkspace } = useAccountStore();
  const { data: workspacesData, isLoading } = useWorkspacesQuery();

  const name = activeWorkspace?.name || "Select Workspace";

  useEffect(() => {
    if (!activeWorkspace && workspacesData?.length) {
      const cookies = document.cookie.split("; ");
      const cookieId = cookies
        .find((row) => row.startsWith("x-workspace-id="))
        ?.split("=")[1];
      const target = cookieId
        ? workspacesData.find((w) => w.id === cookieId) || workspacesData[0]
        : workspacesData[0];
      if (target) setActiveWorkspace(target);
    }
  }, [activeWorkspace, workspacesData, setActiveWorkspace]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSwitch = (workspace: (typeof workspaces)[0]) => {
    setActiveWorkspace(workspace);
    setIsOpen(false);
    queryClient.clear();
    router.push("/dashboard");
  };

  if (isLoading && !activeWorkspace) {
    return <WorkspaceSwitcherSkeleton collapsed={collapsed} />;
  }

  return (
    <div className={cn("relative", !collapsed && "w-full")} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center border transition-all group",
          collapsed
            ? "w-10 h-10 rounded-xl justify-center"
            : "w-full px-3 py-2.5 rounded-xl justify-between",
          isOpen
            ? "bg-white/10 border-primary shadow-sm"
            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2.5 min-w-0",
            collapsed && "justify-center",
          )}
        >
          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-[10px] font-black text-white shrink-0 uppercase">
            {name[0]}
          </div>
          {!collapsed && (
            <span className="font-bold text-sm text-white truncate">
              {name}
            </span>
          )}
        </div>
        {!collapsed && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-zinc-500 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        )}
      </button>

      {isOpen && (
        <WorkspaceDropdown
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspace?.id}
          onSwitch={handleSwitch}
          onManage={() => router.push("/account/workspaces")}
          align={collapsed ? "left" : "top"}
        />
      )}
    </div>
  );
}
