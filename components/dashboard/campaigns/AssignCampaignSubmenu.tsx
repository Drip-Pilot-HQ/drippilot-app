"use client";

import { Campaign } from "@/types/campaign";
import { useAssignCampaignMutation } from "@/store/server/campaign.queries";
import {
  AssignSubmenu,
  useAssignSubmenuState,
} from "@/components/common/AssignSubmenu";

interface AssignCampaignSubmenuProps {
  campaign: Campaign;
}

export function AssignCampaignSubmenu({
  campaign,
}: AssignCampaignSubmenuProps) {
  const assignMutation = useAssignCampaignMutation();

  const { handleAssign, isAssigning, assigningUserId } = useAssignSubmenuState(
    (userIds) =>
      assignMutation.mutateAsync({ id: campaign.id, dto: { userIds } }),
    (userIds) =>
      userIds.length > 0 ? "Campaign assigned" : "Campaign unassigned",
  );

  return (
    <AssignSubmenu
      currentAssignedUserIds={campaign.assignedUserIds ?? []}
      isAssigning={isAssigning}
      assigningUserId={assigningUserId}
      onAssign={handleAssign}
    />
  );
}
