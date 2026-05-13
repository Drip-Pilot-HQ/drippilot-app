import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import {
  OutreachThread,
  OutreachMessage,
  LostThread,
  SendReplyDto,
  ToggleAiResponseDto,
} from '@/types/outreach'

export const useOutreachThreadsQuery = () => {
  return useQuery({
    queryKey: ['outreach-threads'],
    queryFn: async () => {
      const { data } = await apiClient.get<OutreachThread[]>('/outreach/threads')
      return data
    },
  })
}

export const useLostThreadsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['outreach-threads-lost'],
    queryFn: async () => {
      const { data } = await apiClient.get<LostThread[]>('/outreach/threads/lost')
      return data
    },
    enabled,
  })
}

export const useOutreachMessagesQuery = (outreachId: string) => {
  return useQuery({
    queryKey: ['outreach-messages', outreachId],
    queryFn: async () => {
      const { data } = await apiClient.get<OutreachMessage[]>(
        `/outreach/threads/${outreachId}/messages`,
      )
      return data
    },
    enabled: !!outreachId,
    refetchInterval: 60_000, // poll every 1 minute for new messages
  })
}

export const useSendReplyMutation = (outreachId: string) => {
  const queryClient = useQueryClient()
  const queryKey = ['outreach-messages', outreachId]

  return useMutation({
    mutationFn: async (dto: SendReplyDto) => {
      const { data } = await apiClient.post(
        `/outreach/threads/${outreachId}/messages`,
        dto,
      )
      return data
    },
    onMutate: async (dto: SendReplyDto) => {
      // Cancel any in-flight refetch so it doesn't overwrite our optimistic entry
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<OutreachMessage[]>(queryKey)

      const optimistic: OutreachMessage = {
        id: `optimistic-${Date.now()}`,
        outreachId,
        subject: null,
        body: dto.body,
        channel: dto.channel,
        senderType: 'user',
        direction: 'outbound',
        providerMessageId: null,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData<OutreachMessage[]>(queryKey, (old) =>
        old ? [...old, optimistic] : [optimistic],
      )

      return { previous }
    },
    onError: (_err, _dto, context) => {
      // Roll back if the request failed
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSuccess: () => {
      // Delay the refetch so the backend has time to persist the queued message
      // before we replace the optimistic entry with real data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey })
      }, 3000)
    },
  })
}

export const useToggleAiResponseMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      outreachId,
      dto,
    }: {
      outreachId: string
      dto: ToggleAiResponseDto
    }) => {
      const { data } = await apiClient.patch(
        `/outreach/threads/${outreachId}/ai-toggle`,
        dto,
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach-threads'] })
      queryClient.invalidateQueries({ queryKey: ['outreach-threads-lost'] })
    },
  })
}

export const useDeleteThreadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (outreachId: string) => {
      await apiClient.delete(`/outreach/threads/${outreachId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach-threads'] })
      queryClient.invalidateQueries({ queryKey: ['outreach-threads-lost'] })
    },
  })
}
