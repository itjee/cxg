import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "../services";
import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceQueryParams,
} from "../types";

const INVOICES_QUERY_KEY = ["invoices"] as const;

/**
 * 청구서 목록 조회 훅
 */
export function useInvoices(params?: InvoiceQueryParams) {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, params],
    queryFn: () => invoiceService.listInvoices(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 청구서 상세 조회 훅
 */
export function useInvoice(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, "detail", id],
    queryFn: () => invoiceService.getInvoice(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 청구서 생성 훅
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => invoiceService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create invoice:", error);
    },
  });
}

/**
 * 청구서 수정 훅
 */
export function useUpdateInvoice(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInvoiceRequest) => invoiceService.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVOICES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update invoice ${id}:`, error);
    },
  });
}

/**
 * 청구서 삭제 훅
 */
export function useDeleteInvoice(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete invoice ${id}:`, error);
    },
  });
}
