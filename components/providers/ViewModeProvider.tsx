"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { useAccountStore } from "@/store/client/useAccountStore";

type ViewMode = "team" | "personal";

interface ViewModeContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isPersonal: boolean;
}

const ViewModeContext = createContext<ViewModeContextValue>({
  viewMode: "personal",
  setViewMode: () => {},
  isPersonal: true,
});

const STORAGE_KEY = "drippilot_view_mode";

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const activeWorkspaceId = useAccountStore((s) => s.activeWorkspaceId);

  const [storedState, setStoredState] = useState<{
    workspaceId: string | null | undefined;
    mode: ViewMode;
  }>(() => {
    const mode =
      typeof window !== "undefined" &&
      localStorage.getItem(STORAGE_KEY) === "team"
        ? "team"
        : "personal";
    return { workspaceId: activeWorkspaceId, mode };
  });

  // When workspace changes, default to personal until user explicitly picks a mode
  const viewMode =
    storedState.workspaceId !== activeWorkspaceId
      ? "personal"
      : storedState.mode;

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      if (!isOwnerOrAdmin) return;
      setStoredState({ workspaceId: activeWorkspaceId, mode });
      localStorage.setItem(STORAGE_KEY, mode);
    },
    [isOwnerOrAdmin, activeWorkspaceId],
  );

  const effectiveMode: ViewMode = isOwnerOrAdmin ? viewMode : "personal";

  return (
    <ViewModeContext.Provider
      value={{
        viewMode: effectiveMode,
        setViewMode,
        isPersonal: effectiveMode === "personal",
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
