import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/axios'
import {
  ReferralCode,
  ReferralSignup,
  ReferralCommission,
  CommissionSummary,
} from '@/types/account'

export const useReferralCodeQuery = () => {
  return useQuery({
    queryKey: ['referral-code'],
    queryFn: async () => {
      const { data } = await apiClient.get<ReferralCode>('/referral/code')
      return data
    },
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404 (not enrolled)
      const axiosError = error as { response?: { status?: number } }
      if (axiosError?.response?.status === 404) return false
      return failureCount < 2
    },
  })
}

export const useEnrollReferralMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<ReferralCode>('/referral/enroll')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-code'] })
    },
  })
}

export const useReferralSignupsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['referral-signups'],
    queryFn: async () => {
      const { data } = await apiClient.get<ReferralSignup[]>('/referral/signups')
      return data
    },
    enabled,
  })
}

export const useReferralCommissionsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['referral-commissions'],
    queryFn: async () => {
      const { data } = await apiClient.get<ReferralCommission[]>('/referral/commissions')
      return data
    },
    enabled,
  })
}

export const useCommissionSummaryQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['referral-commissions-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get<CommissionSummary>('/referral/commissions/summary')
      return data
    },
    enabled,
  })
}
