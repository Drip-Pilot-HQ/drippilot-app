"use client";

import { PhoneNumber } from "@/types/assets";
import { useAssignPhoneNumberMutation } from "@/store/server/assets.queries";
import {
  AssignSubmenu,
  useAssignSubmenuState,
} from "@/components/common/AssignSubmenu";

interface AssignPhoneNumberSubmenuProps {
  phoneNumber: PhoneNumber;
}

export function AssignPhoneNumberSubmenu({
  phoneNumber,
}: AssignPhoneNumberSubmenuProps) {
  const assignMutation = useAssignPhoneNumberMutation();

  const { handleAssign, isAssigning, assigningUserId } = useAssignSubmenuState(
    (userIds) =>
      assignMutation.mutateAsync({ id: phoneNumber.id, dto: { userIds } }),
    (userIds) =>
      userIds.length > 0 ? "Phone number assigned" : "Phone number unassigned",
  );

  return (
    <AssignSubmenu
      currentAssignedUserIds={phoneNumber.assignedUserIds ?? []}
      isAssigning={isAssigning}
      assigningUserId={assigningUserId}
      onAssign={handleAssign}
    />
  );
}
