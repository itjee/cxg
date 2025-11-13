"use client";

/**
 * @file 거래 관리 페이지
 * @description 결제 거래를 조회하고 관리하는 목록 페이지
 *
 * 구조:
 * 1. Header (제목, 설명, 주요 액션)
 * 2. Stats (통계 카드)
 * 3. Table + Pagination (데이터 테이블 with 통합 필터)
 * 4. Edit Modal (수정 모달)
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/shared/hooks";

import {
  TransactionHeader,
  TransactionStats,
  TransactionTable,
  TransactionEdit,
} from "@/features/bill/transactions/components";
import { useTransactionStore } from "@/features/bill/transactions/stores";
import { useTransactions, useDeleteTransaction } from "@/features/bill/transactions/hooks";

export default function TransactionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ========== Store & Hooks ==========
  const {
    formOpen,
    editingId,
    openForm,
    closeForm,
  } = useTransactionStore();

  // 쿼리 파라미터 (필터링, 페이지네이션)
  const params = useMemo(() => ({
    page: 1,
    pageSize: 20,
  }), []);

  // 거래 목록 조회
  const { data: listData, isLoading, error, refetch } = useTransactions(params);

  // 거래 삭제
  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction(
    editingId!
  );

  // ========== Data Processing ==========
  const items = useMemo(() => listData?.items || [], [listData?.items]);
  const total = listData?.total || 0;

  // 통계 계산
  const stats = useMemo(() => {
    const totalAmount = items.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0
    );
    const successCount = items.filter((txn) => txn.status === "SUCCESS").length;
    const failedCount = items.filter((txn) => txn.status === "FAILED").length;
    const pendingCount = items.filter((txn) => txn.status === "PENDING").length;

    return {
      totalAmount,
      successCount,
      failedCount,
      pendingCount,
    };
  }, [items]);

  // ========== Error Handling ==========
  if (error) {
    toast({
      title: "오류",
      description: "거래 목록을 불러올 수 없습니다",
      variant: "destructive",
    });
  }

  // ========== Handlers ==========
  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "성공",
      description: "거래 목록이 갱신되었습니다",
    });
  };

  const handleViewDetails = (transactionId: string) => {
    openForm(transactionId);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (
      window.confirm(
        "정말로 이 거래를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      deleteTransaction(transactionId, {
        onSuccess: () => {
          toast({
            title: "성공",
            description: "거래가 삭제되었습니다",
          });
          closeForm();
          queryClient.invalidateQueries({
            queryKey: ["transactions"],
          });
        },
        onError: (error: any) => {
          toast({
            title: "오류",
            description:
              error?.message || "거래 삭제에 실패했습니다",
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
      <TransactionHeader onRefresh={handleRefresh} />

      {/* 통계 */}
      <TransactionStats
        totalAmount={stats.totalAmount}
        successCount={stats.successCount}
        failedCount={stats.failedCount}
        pendingCount={stats.pendingCount}
      />

      {/* 테이블 */}
      <Card>
        <CardContent className="pt-6">
          <TransactionTable
            data={items}
            onViewDetails={(transaction) => handleViewDetails(transaction.id)}
          />
        </CardContent>
      </Card>

      {/* 편집 모달 */}
      <TransactionEdit />
    </div>
  );
}
