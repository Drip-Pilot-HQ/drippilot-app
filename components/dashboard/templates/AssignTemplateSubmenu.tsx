"use client";

import { Template } from "@/types/template";
import { useAssignTemplateMutation } from "@/store/server/template.queries";
import {
  AssignSubmenu,
  useAssignSubmenuState,
} from "@/components/common/AssignSubmenu";

interface AssignTemplateSubmenuProps {
  template: Template;
}

export function AssignTemplateSubmenu({
  template,
}: AssignTemplateSubmenuProps) {
  const assignMutation = useAssignTemplateMutation();

  const { handleAssign, isAssigning, assigningUserId } = useAssignSubmenuState(
    (userIds) =>
      assignMutation.mutateAsync({ id: template.id, dto: { userIds } }),
    (userIds) =>
      userIds.length > 0 ? "Template assigned" : "Template unassigned",
  );

  return (
    <AssignSubmenu
      currentAssignedUserIds={template.assignedUserIds ?? []}
      isAssigning={isAssigning}
      assigningUserId={assigningUserId}
      onAssign={handleAssign}
    />
  );
}
