import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios";
import { 
  EmailAlias, 
  PhoneNumber, 
  CreateEmailAliasDto, 
  UpdateEmailAliasDto, 
  SearchPhoneNumbersDto, 
  BuyPhoneNumberDto,
  AvailablePhoneNumber
} from "@/types/assets";
import { toast } from "sonner";

// Email Aliases
export const useEmailAliasesQuery = () => {
  return useQuery({
    queryKey: ["email-aliases"],
    queryFn: async () => {
      const { data } = await apiClient.get<EmailAlias[]>("/assets/email-aliases");
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
  return useQuery({
    queryKey: ["phone-numbers"],
    queryFn: async () => {
      const { data } = await apiClient.get<PhoneNumber[]>("/assets/phone-numbers");
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
