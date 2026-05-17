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

  const { handleAssign, isAssigning, assigningToId } = useAssignSubmenuState(
    (userId) =>
      assignMutation.mutateAsync({
        id: alias.id,
        dto: { assignedUserId: userId },
      }),
    (userId) => (userId ? "Email alias assigned" : "Email alias unassigned"),
  );

  return (
    <AssignSubmenu
      currentAssignedUserId={alias.assignedUserId}
      isAssigning={isAssigning}
      assigningToId={assigningToId}
      onAssign={handleAssign}
    />
  );
}
