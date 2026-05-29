"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/axios";
import {
  KbEntry,
  CreateKbEntryDto,
  UpdateKbEntryDto,
  SaveKbEntryResponse,
} from "@/types/knowledge-base";

export type KbScope = "personal" | "team";

const KNOWLEDGE_BASE_KEYS = {
  all: ["knowledge-base"] as const,
  lists: (scope?: KbScope, viewAs?: string) =>
    [...KNOWLEDGE_BASE_KEYS.all, "list", scope ?? "default", viewAs ?? "all"] as const,
  entry: (id: string) => [...KNOWLEDGE_BASE_KEYS.all, "entry", id] as const,
};

export function useKbEntriesQuery(scope?: KbScope, viewAs?: string) {
  return useQuery({
    queryKey: KNOWLEDGE_BASE_KEYS.lists(scope, viewAs),
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (scope) params.scope = scope;
      if (viewAs) params.viewAs = viewAs;
      const response = await apiClient.get<KbEntry[]>("/ai/knowledge-base", { params });
      return response.data;
    },
  });
}

export function useKbEntryQuery(id: string) {
  return useQuery({
    queryKey: KNOWLEDGE_BASE_KEYS.entry(id),
    queryFn: async () => {
      const response = await apiClient.get<KbEntry>(`/ai/knowledge-base/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateKbEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateKbEntryDto) => {
      const response = await apiClient.post<SaveKbEntryResponse>(
        "/ai/knowledge-base",
        dto,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_BASE_KEYS.all });
      toast.success("Knowledge base entry created successfully");
    },
  });
}

export function useUpdateKbEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateKbEntryDto }) => {
      const response = await apiClient.patch<SaveKbEntryResponse>(
        `/ai/knowledge-base/${id}`,
        dto,
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_BASE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_BASE_KEYS.entry(id) });
      toast.success("Knowledge base entry updated successfully");
    },
  });
}

export function useDeleteKbEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/ai/knowledge-base/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_BASE_KEYS.all });
      toast.success("Knowledge base entry deleted");
    },
  });
}
