import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Workspace } from '@/types/account'

interface AccountState {
  activeWorkspaceId: string | null
  workspaces: Workspace[]
  setActiveWorkspace: (workspace: Workspace) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  clearAccountState: () => void
}

export const selectActiveWorkspace = (state: AccountState): Workspace | null =>
  state.workspaces.find(w => w.id === state.activeWorkspaceId) ?? null

const setWorkspaceCookie = (id: string | null) => {
  if (typeof document === 'undefined') return;
  if (id) {
    document.cookie = `x-workspace-id=${id}; path=/; max-age=31536000; SameSite=Lax`;
  } else {
    document.cookie = `x-workspace-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      workspaces: [],
      setActiveWorkspace: (workspace) => {
        set((state) => ({
          activeWorkspaceId: workspace.id,
          workspaces: state.workspaces.some(w => w.id === workspace.id)
            ? state.workspaces.map(w => w.id === workspace.id ? workspace : w)
            : [...state.workspaces, workspace],
        }));
        setWorkspaceCookie(workspace.id);
      },
      setWorkspaces: (workspaces) => set({ workspaces }),
      clearAccountState: () => {
        set({ activeWorkspaceId: null, workspaces: [] });
        setWorkspaceCookie(null);
      },
    }),
    {
      name: 'account-storage',
      partialize: (state) => ({ activeWorkspaceId: state.activeWorkspaceId, workspaces: state.workspaces }),
    },
  ),
)
