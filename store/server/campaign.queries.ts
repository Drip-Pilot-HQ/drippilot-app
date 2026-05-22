import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import {
  Campaign,
  CampaignStep,
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateCampaignStatusDto,
  AssignCampaignDto,
  SearchCampaignsDto,
  CreateCampaignStepDto,
  UpdateCampaignStepDto,
  EnrolledLead,
  EnrollLeadsDto,
  DeEnrollLeadsDto,
  GetEnrolledLeadsDto,
  PaginatedEnrolledLeadsResponse,
  GetExecutionLogsDto,
  PaginatedExecutionLogsResponse,
} from '@/types/campaign'
import { useViewMode } from '@/lib/hooks/use-view-mode'

export const useCampaignsQuery = (query: SearchCampaignsDto = {}) => {
  const { viewMode } = useViewMode()
  const params = { ...query, viewMode }
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => {
      const { data } = await apiClient.get<Campaign[]>('/campaigns', {
        params
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

export const useCampaignStepsQuery = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-steps', campaignId],
    queryFn: async () => {
      const { data } = await apiClient.get<CampaignStep[]>(`/campaigns/${campaignId}/steps`)
      return data
    },
    enabled: !!campaignId,
  })
}

export const useCreateCampaignStepMutation = (campaignId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateCampaignStepDto) => {
      const { data } = await apiClient.post<CampaignStep>(`/campaigns/${campaignId}/steps`, dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-steps', campaignId] })
    },
  })
}

export const useUpdateCampaignStepMutation = (campaignId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ stepId, dto }: { stepId: string; dto: UpdateCampaignStepDto }) => {
      const { data } = await apiClient.patch<CampaignStep>(
        `/campaigns/${campaignId}/steps/${stepId}`,
        dto,
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-steps', campaignId] })
    },
  })
}

export const useDeleteCampaignStepMutation = (campaignId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (stepId: string) => {
      await apiClient.delete(`/campaigns/${campaignId}/steps/${stepId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-steps', campaignId] })
    },
  })
}

export const useEnrolledLeadsQuery = (campaignId: string, query: GetEnrolledLeadsDto = {}, enabled = true) => {
  return useQuery({
    queryKey: ['enrolled-leads', campaignId, query],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedEnrolledLeadsResponse>(
        `/campaigns/${campaignId}/enrolled-leads`,
        { params: query },
      )
      return data
    },
    enabled: !!campaignId && enabled,
  })
}

export const useEnrollLeadsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ campaignId, dto }: { campaignId: string; dto: EnrollLeadsDto }) => {
      const { data } = await apiClient.post<EnrolledLead[]>(
        `/campaigns/${campaignId}/enroll`,
        dto,
      )
      return data
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-leads', campaignId] })
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

export const useRemoveEnrolledLeadsMutation = (campaignId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: DeEnrollLeadsDto) => {
      await apiClient.delete(`/campaigns/${campaignId}/enrolled-leads`, { data: dto })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-leads', campaignId] })
    },
  })
}

export const useRemoveLeadsFromCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ campaignId, leadIds }: { campaignId: string; leadIds: string[] }) => {
      await apiClient.delete(`/campaigns/${campaignId}/enrolled-leads`, { data: { leadIds } })
    },
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['enrolled-leads', campaignId] })
    },
  })
}

export const useAssignCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: AssignCampaignDto }) => {
      const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}/assign`, dto)
      return data
    },
    onSuccess: (data) => {
      queryClient.setQueriesData<Campaign[]>(
        { queryKey: ['campaigns'], exact: false },
        (old) => old?.map((c) => c.id === data.id ? { ...c, assignedUserIds: data.assignedUserIds } : c),
      )
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] })
    },
  })
}

export const useExecutionLogsQuery = (campaignId: string, query: GetExecutionLogsDto = {}, enabled = true) => {
  return useQuery({
    queryKey: ['execution-logs', campaignId, query],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedExecutionLogsResponse>(
        `/campaigns/${campaignId}/execution-logs`,
        { params: query },
      )
      return data
    },
    enabled: !!campaignId && enabled,
  })
}
