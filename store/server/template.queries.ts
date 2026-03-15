import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import {
  Template,
  CreateTemplateDto,
  UpdateTemplateDto,
  SearchTemplatesDto,
  PaginatedTemplatesResponse,
} from "@/types/template";
import { toast } from "sonner";

export const templateKeys = {
  all: ["templates"] as const,
  list: (filters: SearchTemplatesDto) =>
    [...templateKeys.all, "list", filters] as const,
  detail: (id: string) => [...templateKeys.all, "detail", id] as const,
};

export function useTemplatesQuery(filters: SearchTemplatesDto = {}) {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedTemplatesResponse>(
        "/templates",
        {
          params: filters,
        },
      );
      return data;
    },
  });
}

export function useTemplateQuery(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Template>(`/templates/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateTemplateDto) => {
      const { data } = await apiClient.post<Template>("/templates", dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      toast.success("Template created successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create template");
    },
  });
}

export function useUpdateTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateTemplateDto }) => {
      const { data } = await apiClient.patch<Template>(`/templates/${id}`, dto);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(data.id) });
      toast.success("Template updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update template");
    },
  });
}

export function useDeleteTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      toast.success("Template deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete template");
    },
  });
}
