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
import { useViewMode } from "@/lib/hooks/use-view-mode";
import { useAuthStore } from "@/store/client/useAuthStore";

export const useDashboardStatsQuery = (explicitViewAs?: string) => {
  const { isPersonal } = useViewMode();
  const userId = useAuthStore((s) => s.user?.id);
  const viewAs = explicitViewAs ?? (isPersonal ? userId : undefined);
  return useQuery({
    queryKey: ["analytics", "dashboard", viewAs],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardStats>(
        "/analytics/dashboard",
        { params: viewAs ? { viewAs } : undefined },
      );
      return data;
    },
  });
};

export const useActivityInsightsQuery = (
  days: DaysFilter = 30,
  explicitViewAs?: string,
) => {
  const { isPersonal } = useViewMode();
  const userId = useAuthStore((s) => s.user?.id);
  const viewAs = explicitViewAs ?? (isPersonal ? userId : undefined);
  return useQuery({
    queryKey: ["analytics", "activity", days, viewAs],
    queryFn: async () => {
      const { data } = await apiClient.get<ActivityInsights>(
        "/analytics/activity",
        { params: { days, ...(viewAs ? { viewAs } : {}) } },
      );
      return data;
    },
  });
};

export const useBenchmarksQuery = (explicitViewAs?: string) => {
  const { isPersonal } = useViewMode();
  const userId = useAuthStore((s) => s.user?.id);
  const viewAs = explicitViewAs ?? (isPersonal ? userId : undefined);
  return useQuery({
    queryKey: ["analytics", "benchmarks", viewAs],
    queryFn: async () => {
      const { data } = await apiClient.get<BenchmarksResult>(
        "/analytics/benchmarks",
        { params: viewAs ? { viewAs } : undefined },
      );
      return data;
    },
  });
};

export const useLifecycleMetricsQuery = (
  days: DaysFilter = 30,
  explicitViewAs?: string,
) => {
  const { isPersonal } = useViewMode();
  const userId = useAuthStore((s) => s.user?.id);
  const viewAs = explicitViewAs ?? (isPersonal ? userId : undefined);
  return useQuery({
    queryKey: ["analytics", "lifecycle", days, viewAs],
    queryFn: async () => {
      const { data } = await apiClient.get<LifecycleMetricsResult>(
        "/analytics/response-times",
        { params: { days, ...(viewAs ? { viewAs } : {}) } },
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
