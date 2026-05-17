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

  const { handleAssign, isAssigning, assigningToId } = useAssignSubmenuState(
    (userId) =>
      assignMutation.mutateAsync({
        id: campaign.id,
        dto: { assignedUserId: userId },
      }),
    (userId) => (userId ? "Campaign assigned" : "Campaign unassigned"),
  );

  return (
    <AssignSubmenu
      currentAssignedUserId={campaign.assignedUserId}
      isAssigning={isAssigning}
      assigningToId={assigningToId}
      onAssign={handleAssign}
    />
  );
}
