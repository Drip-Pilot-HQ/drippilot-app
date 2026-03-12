import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import { 
  Workspace, 
  WorkspaceInvitation, 
  CreateWorkspaceDto, 
  UpdateWorkspaceDto, 
  ApiKey, 
  ApiKeyCreatedResponse, 
  CreateApiKeyDto 
} from '@/types/account'
import { useAccountStore } from '../client/useAccountStore'

export const useWorkspacesQuery = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data } = await apiClient.get<Workspace[]>('/workspace')
      useAccountStore.getState().setWorkspaces(data)
      return data
    },
  })
}

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateWorkspaceDto) => {
      const { data } = await apiClient.post<Workspace>('/workspace', dto)
      return data
    },
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      if (!useAccountStore.getState().activeWorkspace) {
        useAccountStore.getState().setActiveWorkspace(newWorkspace)
      }
    },
  })
}

export const useUpdateWorkspaceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateWorkspaceDto }) => {
      const { data } = await apiClient.put<Workspace>('/workspace', dto, {
        headers: {
          'x-workspace-id': id,
        },
      })
      return data
    },
    onSuccess: (updatedWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      const currentActive = useAccountStore.getState().activeWorkspace
      if (currentActive?.id === updatedWorkspace.id) {
        useAccountStore.getState().setActiveWorkspace(updatedWorkspace)
      }
    },
  })
}

export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete('/workspace', {
        headers: {
          'x-workspace-id': id,
        },
      })
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      const currentActive = useAccountStore.getState().activeWorkspace
      if (currentActive?.id === deletedId) {
        const remainingWorkspaces = useAccountStore.getState().workspaces.filter(w => w.id !== deletedId)
        useAccountStore.getState().setActiveWorkspace(remainingWorkspaces[0] || null)
      }
    },
  })
}

export const useWorkspaceInvitesQuery = () => {
  return useQuery({
    queryKey: ['workspace-invites'],
    queryFn: async () => {
      const { data } = await apiClient.get<WorkspaceInvitation[]>('/workspace/invites')
      return data
    },
  })
}

export const useAcceptInviteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inviteId: string) => {
      const { data } = await apiClient.post(`/workspace/invites/${inviteId}/accept`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-invites'] })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}

export const useRejectInviteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inviteId: string) => {
      await apiClient.delete(`/workspace/invites/${inviteId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-invites'] })
    },
  })
}

export const useApiKeysQuery = () => {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiKey[]>('/api-keys')
      return data
    },
  })
}

export const useCreateApiKeyMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateApiKeyDto) => {
      const { data } = await apiClient.post<ApiKeyCreatedResponse>('/api-keys', dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export const useRevokeApiKeyMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api-keys/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}
