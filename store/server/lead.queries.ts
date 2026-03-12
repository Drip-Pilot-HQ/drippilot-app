import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import { 
  Lead, 
  CreateLeadDto, 
  UpdateLeadDto, 
  UpdateLeadStatusDto, 
  SearchLeadsDto,
  PaginatedLeadsResponse
} from '@/types/lead'

export const useLeadsQuery = (query: SearchLeadsDto = {}) => {
  return useQuery({
    queryKey: ['leads', query],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedLeadsResponse>('/leads', {
        params: query
      })
      return data
    },
  })
}

export const useLeadQuery = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Lead>(`/leads/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export const useCreateLeadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateLeadDto) => {
      const { data } = await apiClient.post<Lead>('/leads', dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export const useUpdateLeadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateLeadDto }) => {
      const { data } = await apiClient.patch<Lead>(`/leads/${id}`, dto)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', data.id] })
    },
  })
}

export const useUpdateLeadStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UpdateLeadStatusDto }) => {
      const { data } = await apiClient.patch<Lead>(`/leads/${id}/status`, status)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', data.id] })
    },
  })
}

export const useDeleteLeadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/leads/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}
