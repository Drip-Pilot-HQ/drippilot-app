import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import type {
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
