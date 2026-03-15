import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Workspace } from '@/types/account'

interface AccountState {
  activeWorkspace: Workspace | null
  workspaces: Workspace[]
  setActiveWorkspace: (workspace: Workspace | null) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  clearAccountState: () => void
}

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
      activeWorkspace: null,
      workspaces: [],
      setActiveWorkspace: (workspace) => {
        set({ activeWorkspace: workspace });
        setWorkspaceCookie(workspace?.id || null);
      },
      setWorkspaces: (workspaces) => set({ workspaces }),
      clearAccountState: () => {
        set({ activeWorkspace: null, workspaces: [] });
        setWorkspaceCookie(null);
      },
    }),
    {
      name: 'account-storage',
    },
  ),
)
