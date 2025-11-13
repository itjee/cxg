/**
 * useSupportTickets Hook
 * TanStack Query를 사용한 고객 지원 티켓 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportTicketService } from "../services";
import type {
  SupportTicket,
  CreateSupportTicketRequest,
  UpdateSupportTicketRequest,
  SupportTicketQueryParams,
} from "../types";

const SUPPORT_TICKETS_QUERY_KEY = ["support-tickets"] as const;

export function useSupportTickets(params?: SupportTicketQueryParams) {
  return useQuery({
    queryKey: [...SUPPORT_TICKETS_QUERY_KEY, params],
    queryFn: () => supportTicketService.listSupportTickets(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSupportTicket(id: string | null | undefined) {
  return useQuery({
    queryKey: [...SUPPORT_TICKETS_QUERY_KEY, "detail", id],
    queryFn: () => supportTicketService.getSupportTicket(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupportTicketRequest) => supportTicketService.createSupportTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create support ticket:", error);
    },
  });
}

export function useUpdateSupportTicket(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSupportTicketRequest) => supportTicketService.updateSupportTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...SUPPORT_TICKETS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update support ticket ${id}:`, error);
    },
  });
}

export function useDeleteSupportTicket(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => supportTicketService.deleteSupportTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_TICKETS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete support ticket ${id}:`, error);
    },
  });
}
