import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import type {
  SubscriptionStatus,
  SubscriptionCheckoutResponse,
  BillingPortalResponse,
  Addon,
  EffectiveLimits,
  CreditBalance,
  OverageStatus,
  CreateSubscriptionDto,
  ChangePlanDto,
  AddAddonDto,
  RemoveAddonDto,
} from '@/types/billings';

export const billingKeys = {
  subscription: ['billing', 'subscription'] as const,
  addons: ['billing', 'addons'] as const,
  limits: ['billing', 'limits'] as const,
  creditBalance: ['billing', 'credits', 'balance'] as const,
  overageStatus: ['billing', 'overage', 'status'] as const,
};

export const useSubscriptionQuery = () => {
  return useQuery({
    queryKey: billingKeys.subscription,
    queryFn: async () => {
      const { data } = await apiClient.get<SubscriptionStatus>('/billing/subscription');
      return data;
    },
  });
};

export const useSubscribeMutation = () => {
  return useMutation({
    mutationFn: async (dto: CreateSubscriptionDto) => {
      const { data } = await apiClient.post<SubscriptionCheckoutResponse>('/billing/subscribe', dto);
      return data;
    },
  });
};

export const useUpgradeSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: ChangePlanDto) => {
      const { data } = await apiClient.patch<{ success: boolean }>('/billing/subscription/upgrade', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscription });
      queryClient.invalidateQueries({ queryKey: billingKeys.limits });
      queryClient.invalidateQueries({ queryKey: billingKeys.creditBalance });
      queryClient.invalidateQueries({ queryKey: ['billing', 'credits', 'history'] });
    },
  });
};

export const useDowngradeSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: ChangePlanDto) => {
      const { data } = await apiClient.patch<{ success: boolean }>('/billing/subscription/downgrade', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscription });
      queryClient.invalidateQueries({ queryKey: billingKeys.limits });
      queryClient.invalidateQueries({ queryKey: billingKeys.creditBalance });
      queryClient.invalidateQueries({ queryKey: ['billing', 'credits', 'history'] });
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ success: boolean }>('/billing/subscription/cancel');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscription });
    },
  });
};

export const useResumeSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ success: boolean }>('/billing/subscription/resume');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.subscription });
      queryClient.invalidateQueries({ queryKey: billingKeys.limits });
      queryClient.invalidateQueries({ queryKey: billingKeys.creditBalance });
    },
  });
};

export const useBillingPortalMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.get<BillingPortalResponse>('/billing/subscription/portal');
      return data;
    },
  });
};

export const useAddonsQuery = () => {
  return useQuery({
    queryKey: billingKeys.addons,
    queryFn: async () => {
      const { data } = await apiClient.get<Addon[]>('/billing/addons');
      return data;
    },
  });
};

export const useEffectiveLimitsQuery = () => {
  return useQuery({
    queryKey: billingKeys.limits,
    queryFn: async () => {
      const { data } = await apiClient.get<EffectiveLimits>('/billing/limits');
      return data;
    },
  });
};

export const useAddAddonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: AddAddonDto) => {
      const { data } = await apiClient.post<{ success: boolean }>('/billing/addons', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.addons });
      queryClient.invalidateQueries({ queryKey: billingKeys.limits });
      queryClient.invalidateQueries({ queryKey: billingKeys.creditBalance });
      queryClient.invalidateQueries({ queryKey: ['billing', 'credits', 'history'] });
    },
  });
};

export const useRemoveAddonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: RemoveAddonDto) => {
      const { data } = await apiClient.delete<{ success: boolean }>('/billing/addons', { data: dto });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.addons });
      queryClient.invalidateQueries({ queryKey: billingKeys.limits });
      queryClient.invalidateQueries({ queryKey: billingKeys.creditBalance });
      queryClient.invalidateQueries({ queryKey: ['billing', 'credits', 'history'] });
    },
  });
};

export const useCreditBalanceQuery = () => {
  return useQuery({
    queryKey: billingKeys.creditBalance,
    queryFn: async () => {
      const { data } = await apiClient.get<CreditBalance>('/billing/credits/balance');
      return data;
    },
  });
};


export const useOverageStatusQuery = () => {
  return useQuery({
    queryKey: billingKeys.overageStatus,
    queryFn: async () => {
      const { data } = await apiClient.get<OverageStatus>('/billing/overage/status');
      return data;
    },
  });
};

export const useEnableOverageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ success: boolean }>('/billing/overage/enable');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.overageStatus });
    },
  });
};

export const useDisableOverageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ success: boolean }>('/billing/overage/disable');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.overageStatus });
    },
  });
};

export const usePayOverageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ success: boolean }>('/billing/overage/pay');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.overageStatus });
      queryClient.invalidateQueries({ queryKey: billingKeys.subscription });
    },
  });
};
