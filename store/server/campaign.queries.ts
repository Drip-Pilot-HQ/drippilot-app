import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import { 
  Campaign, 
  CreateCampaignDto, 
  UpdateCampaignDto, 
  UpdateCampaignStatusDto, 
  SearchCampaignsDto 
} from '@/types/campaign'

export const useCampaignsQuery = (query: SearchCampaignsDto = {}) => {
  return useQuery({
    queryKey: ['campaigns', query],
    queryFn: async () => {
      const { data } = await apiClient.get<Campaign[]>('/campaigns', {
        params: query
      })
      return data
    },
  })
}

export const useCampaignQuery = (id: string) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Campaign>(`/campaigns/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateCampaignDto) => {
      const { data } = await apiClient.post<Campaign>('/campaigns', dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export const useUpdateCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateCampaignDto }) => {
      const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}`, dto)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] })
    },
  })
}

export const useUpdateCampaignStatusMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UpdateCampaignStatusDto }) => {
      const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}/status`, status)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] })
    },
  })
}

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/campaigns/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
