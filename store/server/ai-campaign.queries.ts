import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import {
  AiCampaignGenerateDto,
  AiCampaignJobResponseDto,
  AiCampaignJobStatus,
} from '@/types/ai-campaign'

export const useAiCampaignsJobsQuery = (limit: number = 30): UseQueryResult<AiCampaignJobResponseDto[], Error> => {
  return useQuery({
    queryKey: ['ai-campaign-jobs', limit],
    queryFn: async () => {
      const { data } = await apiClient.get<AiCampaignJobResponseDto[]>('/ai-campaign/jobs', {
        params: { limit }
      })
      return data
    }
  })
}

export const useAiCampaignJobStatusQuery = (jobId: string | null) => {
  return useQuery<AiCampaignJobResponseDto | null>({
    queryKey: ['ai-campaign-job', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const { data } = await apiClient.get<AiCampaignJobResponseDto>(`/ai-campaign/jobs/${jobId}`)
      return data
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === AiCampaignJobStatus.PENDING || status === AiCampaignJobStatus.PROCESSING) {
        return 2000;
      }
      return false;
    }
  })
}

export const useGenerateAiCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (dto: AiCampaignGenerateDto) => {
      const { data } = await apiClient.post<AiCampaignJobResponseDto>('/ai-campaign/generate', dto)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-campaign-jobs'] })
    },
  })
}
