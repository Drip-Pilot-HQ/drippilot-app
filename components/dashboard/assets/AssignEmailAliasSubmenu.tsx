"use client";

import { EmailAlias } from "@/types/assets";
import { useAssignEmailAliasMutation } from "@/store/server/assets.queries";
import {
  AssignSubmenu,
  useAssignSubmenuState,
} from "@/components/common/AssignSubmenu";

interface AssignEmailAliasSubmenuProps {
  alias: EmailAlias;
}

export function AssignEmailAliasSubmenu({
  alias,
}: AssignEmailAliasSubmenuProps) {
  const assignMutation = useAssignEmailAliasMutation();

  const { handleAssign, isAssigning, assigningUserId } = useAssignSubmenuState(
    (userIds) => assignMutation.mutateAsync({ id: alias.id, dto: { userIds } }),
    (userIds) =>
      userIds.length > 0 ? "Email alias assigned" : "Email alias unassigned",
  );

  return (
    <AssignSubmenu
      currentAssignedUserIds={alias.assignedUserIds ?? []}
      isAssigning={isAssigning}
      assigningUserId={assigningUserId}
      onAssign={handleAssign}
    />
  );
}
