"use client";

/**
 * @file 청구서 관리 페이지
 * @description 테넌트별 청구서를 조회하고 관리하는 목록 페이지
 *
 * 구조:
 * 1. Header (제목, 설명, 주요 액션)
 * 2. Stats (통계 카드)
 * 3. Filters (검색, 필터)
 * 4. Table + Pagination (데이터 테이블)
 * 5. Edit Modal (수정 모달)
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/shared/hooks";

import {
  InvoiceHeader,
  InvoiceFilters,
  InvoiceStats,
  InvoiceTable,
  InvoiceEdit,
} from "@/features/bill/invoice/components";
import { useInvoiceStore } from "@/features/bill/invoice/stores";
import { useInvoices, useDeleteInvoice } from "@/features/bill/invoice/hooks";

export default function InvoicesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ========== Store & Hooks ==========
  const {
    formOpen,
    editingId,
    openForm,
    closeForm,
  } = useInvoiceStore();

  // 쿼리 파라미터 (필터링, 페이지네이션)
  const [params, setParams] = useMemo(
    () => [
      {
        page: 1,
        pageSize: 20,
      },
    ],
    []
  );

  // 청구서 목록 조회
  const { data: listData, isLoading, error, refetch } = useInvoices(params);

  // 청구서 삭제
  const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoice(
    editingId!
  );

  // ========== Data Processing ==========
  const items = useMemo(() => listData?.items || [], [listData?.items]);
  const total = listData?.total || 0;
  const totalPages = listData?.total_pages || 0;

  // 통계 계산
  const stats = useMemo(() => {
    const totalAmount = items.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount),
      0
    );
    const paidAmount = items
      .filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + Number(inv.total_amount), 0);
    const paidCount = items.filter((inv) => inv.status === "PAID").length;
    const pendingCount = items.filter((inv) => inv.status === "PENDING").length;
    const overdueCount = items.filter((inv) => inv.status === "OVERDUE").length;

    const paidRate =
      items.length > 0 ? ((paidCount / items.length) * 100).toFixed(1) : "0";

    return [
      {
        title: "총 청구액",
        value: `₩${totalAmount.toLocaleString()}`,
        description: `${items.length}개 청구서`,
      },
      {
        title: "수금 완료",
        value: `₩${paidAmount.toLocaleString()}`,
        description: `${paidRate}% 수금율`,
      },
      {
        title: "미지급",
        value: pendingCount,
        description: `${pendingCount}개 청구서`,
      },
      {
        title: "연체",
        value: overdueCount,
        description: "즉시 확인 필요",
      },
    ];
  }, [items]);

  // ========== Error Handling ==========
  if (error) {
    toast({
      title: "오류",
      description: "청구서 목록을 불러올 수 없습니다",
      variant: "destructive",
    });
  }

  // ========== Handlers ==========
  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "성공",
      description: "청구서 목록이 갱신되었습니다",
    });
  };

  const handleEditInvoice = (invoiceId: string) => {
    openForm(invoiceId);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (
      window.confirm(
        "정말로 이 청구서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      deleteInvoice(invoiceId, {
        onSuccess: () => {
          toast({
            title: "성공",
            description: "청구서가 삭제되었습니다",
          });
          closeForm();
          queryClient.invalidateQueries({
            queryKey: ["invoices"],
          });
        },
        onError: (error: any) => {
          toast({
            title: "오류",
            description:
              error?.message || "청구서 삭제에 실패했습니다",
            variant: "destructive",
          });
        },
      });
    }
  };

  // ========== Render ==========
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <InvoiceHeader onRefresh={handleRefresh} />

      {/* 통계 */}
      <InvoiceStats invoices={items} />

      {/* 필터 */}
      <InvoiceFilters invoices={items} onParamsChange={setParams} />

      {/* 테이블 */}
      <Card>
        <CardContent className="pt-6">
          <InvoiceTable
            data={items}
            total={total}
            totalPages={totalPages}
            isLoading={isLoading}
            onEdit={handleEditInvoice}
            onDelete={handleDeleteInvoice}
          />
        </CardContent>
      </Card>

      {/* 편집 모달 */}
      <InvoiceEdit onClose={closeForm} />
    </div>
  );
}
