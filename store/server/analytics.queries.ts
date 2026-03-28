import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import type {
  AnalyticsConfig,
  UpsertAnalyticsConfigPayload,
  DashboardStats,
  ActivityInsights,
  LifecycleMetricsResult,
  BenchmarksResult,
  DaysFilter,
} from "@/types/analytics";

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>(
        "/analytics/dashboard",
      );
      return data;
    },
  });
};

export const useActivityInsightsQuery = (days: DaysFilter = 30) => {
  return useQuery({
    queryKey: ["analytics", "activity", days],
    queryFn: async () => {
      const { data } = await apiClient.get<ActivityInsights>(
        "/analytics/activity",
        { params: { days } },
      );
      return data;
    },
  });
};

export const useBenchmarksQuery = () => {
  return useQuery({
    queryKey: ["analytics", "benchmarks"],
    queryFn: async () => {
      const { data } = await apiClient.get<BenchmarksResult>(
        "/analytics/benchmarks",
      );
      return data;
    },
  });
};

export const useLifecycleMetricsQuery = (days: DaysFilter = 30) => {
  return useQuery({
    queryKey: ["analytics", "lifecycle", days],
    queryFn: async () => {
      const { data } = await apiClient.get<LifecycleMetricsResult>(
        "/analytics/response-times",
        { params: { days } },
      );
      return data;
    },
  });
};

export const useAnalyticsConfigQuery = () => {
  return useQuery({
    queryKey: ["analytics", "config"],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyticsConfig>("/analytics/config");
      return data;
    },
  });
};

export const useUpsertAnalyticsConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpsertAnalyticsConfigPayload) => {
      const { data } = await apiClient.put<AnalyticsConfig>(
        "/analytics/config",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};

export const useResetAnalyticsConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete("/analytics/config");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
};
