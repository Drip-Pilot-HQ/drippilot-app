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

  const { handleAssign, isAssigning, assigningToId } = useAssignSubmenuState(
    (userId) =>
      assignMutation.mutateAsync({
        id: template.id,
        dto: { assignedUserId: userId },
      }),
    (userId) => (userId ? "Template assigned" : "Template unassigned"),
  );

  return (
    <AssignSubmenu
      currentAssignedUserId={template.assignedUserId}
      isAssigning={isAssigning}
      assigningToId={assigningToId}
      onAssign={handleAssign}
    />
  );
}
