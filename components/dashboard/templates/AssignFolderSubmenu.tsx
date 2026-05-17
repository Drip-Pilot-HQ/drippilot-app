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

  const { handleAssign, isAssigning, assigningToId } = useAssignSubmenuState(
    (userId) =>
      assignMutation.mutateAsync({
        folderId: folder.id,
        dto: { assignedUserId: userId },
      }),
    (userId) => (userId ? "Folder assigned" : "Folder unassigned"),
  );

  return (
    <AssignSubmenu
      currentAssignedUserId={folder.assignedUserId}
      isAssigning={isAssigning}
      assigningToId={assigningToId}
      onAssign={handleAssign}
    />
  );
}
