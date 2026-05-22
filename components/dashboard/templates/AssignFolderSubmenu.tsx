"use client";

import { TemplateFolder } from "@/types/template";
import { useAssignFolderMutation } from "@/store/server/template.queries";
import {
  AssignSubmenu,
  useAssignSubmenuState,
} from "@/components/common/AssignSubmenu";

interface AssignFolderSubmenuProps {
  folder: TemplateFolder;
}

export function AssignFolderSubmenu({ folder }: AssignFolderSubmenuProps) {
  const assignMutation = useAssignFolderMutation();

  const { handleAssign, isAssigning, assigningUserId } = useAssignSubmenuState(
    (userIds) =>
      assignMutation.mutateAsync({ folderId: folder.id, dto: { userIds } }),
    (userIds) => (userIds.length > 0 ? "Folder assigned" : "Folder unassigned"),
  );

  return (
    <AssignSubmenu
      currentAssignedUserIds={folder.assignedUserIds ?? []}
      isAssigning={isAssigning}
      assigningUserId={assigningUserId}
      onAssign={handleAssign}
    />
  );
}
