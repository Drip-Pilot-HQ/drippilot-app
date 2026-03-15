import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import {
  AppNotification,
  NotificationListResult,
  NotificationPreference,
  UpdateNotificationPreferencesDto,
  RegisterPushSubscriptionDto,
} from '@/types/notification';

export const useNotificationsQuery = (page = 1) =>
  useQuery({
    queryKey: ['notifications', page],
    queryFn: async () => {
      const { data } = await apiClient.get<NotificationListResult>('/notifications', { params: { page } });
      return data;
    },
  });

export const useMarkReadMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<AppNotification>(`/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useDeleteNotificationMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/notifications/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useDeleteAllNotificationsMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => { await apiClient.delete('/notifications'); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useNotificationPreferencesQuery = () =>
  useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const { data } = await apiClient.get<NotificationPreference | null>('/notifications/preferences');
      return data;
    },
  });

export const useUpdateNotificationPreferencesMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateNotificationPreferencesDto) => {
      const { data } = await apiClient.put<NotificationPreference>('/notifications/preferences', dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification-preferences'] }),
  });
};

export const useVapidPublicKeyQuery = () =>
  useQuery({
    queryKey: ['vapid-public-key'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ publicKey: string }>('/notifications/vapid-public-key');
      return data.publicKey;
    },
    staleTime: Infinity,
  });

export const useRegisterPushMutation = () =>
  useMutation({
    mutationFn: async (dto: RegisterPushSubscriptionDto) => {
      const { data } = await apiClient.post('/notifications/push/subscribe', dto);
      return data;
    },
  });

export const useUnregisterPushMutation = () =>
  useMutation({
    mutationFn: async (endpoint: string) => {
      await apiClient.post('/notifications/push/unsubscribe', { endpoint });
    },
  });

export const useSendTestPushMutation = () =>
  useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<{ message: string; sent: number; failed?: number }>(
        '/notifications/push/test',
      );
      return data;
    },
  });
