/**
 * useFAQs Hook
 * TanStack Query를 사용한 FAQ 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { faqService } from "../services";
import type {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  FAQQueryParams,
} from "../types";

const FAQS_QUERY_KEY = ["faqs"] as const;

export function useFAQs(params?: FAQQueryParams) {
  return useQuery({
    queryKey: [...FAQS_QUERY_KEY, params],
    queryFn: () => faqService.listFAQs(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useFAQ(id: string | null | undefined) {
  return useQuery({
    queryKey: [...FAQS_QUERY_KEY, "detail", id],
    queryFn: () => faqService.getFAQ(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFAQRequest) => faqService.createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create FAQ:", error);
    },
  });
}

export function useUpdateFAQ(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFAQRequest) => faqService.updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...FAQS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update FAQ ${id}:`, error);
    },
  });
}

export function useDeleteFAQ(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => faqService.deleteFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete FAQ ${id}:`, error);
    },
  });
}
