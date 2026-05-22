import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import {
  EmailAlias,
  PhoneNumber,
  CreateEmailAliasDto,
  UpdateEmailAliasDto,
  SearchPhoneNumbersDto,
  BuyPhoneNumberDto,
  AvailablePhoneNumber,
  AssignEmailAliasDto,
  AssignPhoneNumberDto,
} from "@/types/assets";
import { toast } from "sonner";
import { useViewMode } from "@/lib/hooks/use-view-mode";

// Email Aliases
export const useEmailAliasesQuery = () => {
  const { viewMode } = useViewMode();
  return useQuery({
    queryKey: ["email-aliases", viewMode],
    queryFn: async () => {
      const { data } = await apiClient.get<EmailAlias[]>("/assets/email-aliases", { params: { viewMode } });
      return data;
    },
  });
};

export const useCreateEmailAliasMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateEmailAliasDto) => {
      const { data } = await apiClient.post<EmailAlias>("/assets/email-aliases", dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-aliases"] });
      toast.success("Email alias created successfully");
    },
  });
};

export const useUpdateEmailAliasMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateEmailAliasDto }) => {
      const { data } = await apiClient.put<EmailAlias>(`/assets/email-aliases/${id}`, dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-aliases"] });
      toast.success("Email alias updated successfully");
    },
  });
};

export const useDeleteEmailAliasMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/assets/email-aliases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-aliases"] });
      toast.success("Email alias deleted successfully");
    },
  });
};

// Phone Numbers
export const usePhoneNumbersQuery = () => {
  const { viewMode } = useViewMode();
  return useQuery({
    queryKey: ["phone-numbers", viewMode],
    queryFn: async () => {
      const { data } = await apiClient.get<PhoneNumber[]>("/assets/phone-numbers", { params: { viewMode } });
      return data;
    },
  });
};

export const useSearchPhoneNumbersQuery = (dto: SearchPhoneNumbersDto, enabled = false) => {
  return useQuery({
    queryKey: ["available-phone-numbers", dto],
    queryFn: async () => {
      const { data } = await apiClient.get<AvailablePhoneNumber[]>("/assets/phone-numbers/search", { params: dto });
      return data;
    },
    enabled,
  });
};

export const useBuyPhoneNumberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: BuyPhoneNumberDto) => {
      const { data } = await apiClient.post<PhoneNumber>("/assets/phone-numbers", dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phone-numbers"] });
      toast.success("Phone number purchased successfully");
    },
  });
};

export const useReleasePhoneNumberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/assets/phone-numbers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phone-numbers"] });
      toast.success("Phone number released successfully");
    },
  });
};

export const useAssignEmailAliasMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: AssignEmailAliasDto }) => {
      const { data } = await apiClient.patch<EmailAlias>(`/assets/email-aliases/${id}/assign`, dto);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueriesData<EmailAlias[]>(
        { queryKey: ["email-aliases"], exact: false },
        (old) => old?.map((a) => a.id === data.id ? { ...a, assignedUserIds: data.assignedUserIds } : a),
      );
      queryClient.invalidateQueries({ queryKey: ["email-aliases"] });
    },
  });
};

export const useAssignPhoneNumberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: AssignPhoneNumberDto }) => {
      const { data } = await apiClient.patch<PhoneNumber>(`/assets/phone-numbers/${id}/assign`, dto);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueriesData<PhoneNumber[]>(
        { queryKey: ["phone-numbers"], exact: false },
        (old) => old?.map((n) => n.id === data.id ? { ...n, assignedUserIds: data.assignedUserIds } : n),
      );
      queryClient.invalidateQueries({ queryKey: ["phone-numbers"] });
    },
  });
};
