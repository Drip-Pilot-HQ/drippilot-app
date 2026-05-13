import { useAccountStore } from "@/store/client/useAccountStore";
import { WorkspaceRole } from "@/types/account";

export function useWorkspaceRole() {
  const role = useAccountStore(
    (s) =>
      s.workspaces.find((w) => w.id === s.activeWorkspaceId)?.role ??
      WorkspaceRole.MEMBER,
  );
  return {
    role,
    isOwner: role === WorkspaceRole.OWNER,
    isAdmin: role === WorkspaceRole.ADMIN,
    isMember: role === WorkspaceRole.MEMBER,
    isOwnerOrAdmin:
      role === WorkspaceRole.OWNER || role === WorkspaceRole.ADMIN,
  };
}
