import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import {
  LeadSource,
  CreateLeadSourceDto,
  UpdateLeadSourceDto,
  LeadSourceCreatedResponse,
  RegenerateSecretResponse,
} from '@/types/lead-source'

export const useLeadSourcesQuery = () => {
  return useQuery({
    queryKey: ['lead-sources'],
    queryFn: async () => {
      const { data } = await apiClient.get<LeadSource[]>('/lead-sources')
      return data
    },
  })
}

export const useLeadSourceQuery = (id: string) => {
  return useQuery({
    queryKey: ['lead-source', id],
    queryFn: async () => {
      const { data } = await apiClient.get<LeadSource>(`/lead-sources/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export const useCreateLeadSourceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateLeadSourceDto) => {
      const { data } = await apiClient.post<LeadSourceCreatedResponse>('/lead-sources', dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] })
    },
  })
}

export const useUpdateLeadSourceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateLeadSourceDto }) => {
      const { data } = await apiClient.patch<LeadSource>(`/lead-sources/${id}`, dto)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] })
      queryClient.invalidateQueries({ queryKey: ['lead-source', data.id] })
    },
  })
}

export const useRegenerateSecretMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post<RegenerateSecretResponse>(`/lead-sources/${id}/regenerate-secret`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] })
    },
  })
}

export const useDeleteLeadSourceMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/lead-sources/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] })
    },
  })
}
