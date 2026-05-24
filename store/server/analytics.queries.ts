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

export type AnalyticsScope = "personal" | "team";

export const useDashboardStatsQuery = (
  scope: AnalyticsScope,
  explicitViewAs?: string,
) => {
  return useQuery({
    queryKey: ["analytics", "dashboard", scope, explicitViewAs],
    queryFn: async () => {
      const params: Record<string, string> = { scope };
      if (explicitViewAs) params.viewAs = explicitViewAs;
      const { data } = await apiClient.get<DashboardStats>(
        "/analytics/dashboard",
        { params },
      );
      return data;
    },
  });
};

export const useActivityInsightsQuery = (
  days: DaysFilter = 30,
  scope: AnalyticsScope,
  explicitViewAs?: string,
) => {
  return useQuery({
    queryKey: ["analytics", "activity", days, scope, explicitViewAs],
    queryFn: async () => {
      const params: Record<string, string | number> = { days, scope };
      if (explicitViewAs) params.viewAs = explicitViewAs;
      const { data } = await apiClient.get<ActivityInsights>(
        "/analytics/activity",
        { params },
      );
      return data;
    },
  });
};

export const useBenchmarksQuery = (
  scope: AnalyticsScope,
  explicitViewAs?: string,
) => {
  return useQuery({
    queryKey: ["analytics", "benchmarks", scope, explicitViewAs],
    queryFn: async () => {
      const params: Record<string, string> = { scope };
      if (explicitViewAs) params.viewAs = explicitViewAs;
      const { data } = await apiClient.get<BenchmarksResult>(
        "/analytics/benchmarks",
        { params },
      );
      return data;
    },
  });
};

export const useLifecycleMetricsQuery = (
  days: DaysFilter = 30,
  scope: AnalyticsScope,
  explicitViewAs?: string,
) => {
  return useQuery({
    queryKey: ["analytics", "lifecycle", days, scope, explicitViewAs],
    queryFn: async () => {
      const params: Record<string, string | number> = { days, scope };
      if (explicitViewAs) params.viewAs = explicitViewAs;
      const { data } = await apiClient.get<LifecycleMetricsResult>(
        "/analytics/response-times",
        { params },
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
