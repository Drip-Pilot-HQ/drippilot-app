import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import {
  WorkspaceMember,
  AddMemberDto,
  UpdateMemberRoleDto
} from "@/types/account";
import { toast } from "sonner";

// Member Management
export const useMembersQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["workspace-members"],
    queryFn: async () => {
      const { data } = await apiClient.get<WorkspaceMember[]>("/workspace/members");
      return data;
    },
    enabled,
  });
};

export const useInviteMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: AddMemberDto) => {
      const { data } = await apiClient.post<WorkspaceMember>("/workspace/members", dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] });
      toast.success("Invitation sent successfully");
    },
  });
};

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ membershipId, dto }: { membershipId: string; dto: UpdateMemberRoleDto }) => {
      const { data } = await apiClient.put<WorkspaceMember>(`/workspace/members/${membershipId}/role`, dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] });
      toast.success("Member role updated");
    },
  });
};

export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (membershipId: string) => {
      await apiClient.delete(`/workspace/members/${membershipId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] });
      toast.success("Member removed from workspace");
    },
  });
};

export const useTransferOwnershipMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (membershipId: string) => {
      await apiClient.patch("/workspace/transfer-ownership", { membershipId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
