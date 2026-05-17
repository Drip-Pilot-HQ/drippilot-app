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

  const { handleAssign, isAssigning, assigningToId } = useAssignSubmenuState(
    (userId) =>
      assignMutation.mutateAsync({
        id: phoneNumber.id,
        dto: { assignedUserId: userId },
      }),
    (userId) => (userId ? "Phone number assigned" : "Phone number unassigned"),
  );

  return (
    <AssignSubmenu
      currentAssignedUserId={phoneNumber.assignedUserId}
      isAssigning={isAssigning}
      assigningToId={assigningToId}
      onAssign={handleAssign}
    />
  );
}
