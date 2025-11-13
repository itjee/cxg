/**
 * useCustomerFeedback Hook
 * TanStack Query를 사용한 고객 피드백 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerFeedbackService } from "../services";
import type {
  CustomerFeedback,
  CreateCustomerFeedbackRequest,
  UpdateCustomerFeedbackRequest,
  CustomerFeedbackQueryParams,
} from "../types";

const CUSTOMER_FEEDBACK_QUERY_KEY = ["customer-feedback"] as const;

export function useCustomerFeedback(params?: CustomerFeedbackQueryParams) {
  return useQuery({
    queryKey: [...CUSTOMER_FEEDBACK_QUERY_KEY, params],
    queryFn: () => customerFeedbackService.listCustomerFeedback(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCustomerFeedbackDetail(id: string | null | undefined) {
  return useQuery({
    queryKey: [...CUSTOMER_FEEDBACK_QUERY_KEY, "detail", id],
    queryFn: () => customerFeedbackService.getCustomerFeedback(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateCustomerFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerFeedbackRequest) => customerFeedbackService.createCustomerFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_FEEDBACK_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create customer feedback:", error);
    },
  });
}

export function useUpdateCustomerFeedback(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomerFeedbackRequest) => customerFeedbackService.updateCustomerFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_FEEDBACK_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CUSTOMER_FEEDBACK_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update customer feedback ${id}:`, error);
    },
  });
}

export function useDeleteCustomerFeedback(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => customerFeedbackService.deleteCustomerFeedback(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_FEEDBACK_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete customer feedback ${id}:`, error);
    },
  });
}
