/**
 * @file page.tsx
 * @description 요금제 관리 페이지
 */

"use client";

import { useMemo } from "react";
import { usePlans } from "@/features/bill/plans";
import {
  PlansHeader,
  PlansFilters,
  PlansStats,
  PlansTable,
  PlansEdit,
} from "@/features/bill/plans/components";
import { usePlansStore } from "@/features/bill/plans/stores";
import { useToast } from "@/shared/hooks";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/features/bill/plans";

export default function PlansPage() {
  const {
    filters,
    pageState: { currentPage, pageSize },
    setCurrentPage,
  } = usePlansStore();

  const { toast } = useToast();

  // 쿼리 파라미터 준비 (0-based를 1-based로 변환)
  const queryParams = {
    page: currentPage + 1, // 0-based to 1-based pagination conversion
    pageSize,
    search: filters.search || undefined,
    status: filters.status,
    type: filters.type,
    billing_cycle: filters.billing_cycle,
  };

  const { data: listData, isLoading, error } = usePlans(queryParams);

  // 편집 모달 열기
  const handleEditPlan = (plan: Plan) => {
    usePlansStore.getState().openForm(plan);
  };

  // 데이터 처리
  const items = useMemo(() => listData?.items || [], [listData?.items]);
  const total = listData?.total || 0;
  const totalPages = listData?.total_pages || 0;

  // 에러 처리
  if (error) {
    toast({
      title: "오류",
      description: "요금제 목록을 불러올 수 없습니다",
      variant: "destructive",
    });
  }

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(0, endPage - maxButtons + 1);
    }

    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <PlansHeader />

      {/* 통계 */}
      <PlansStats plans={items} />

      {/* 필터 */}
      <PlansFilters />

      {/* 테이블 */}
      <PlansTable data={items} isLoading={isLoading} onEdit={handleEditPlan} />

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            총 {total}개 중 {currentPage * pageSize + 1}-
            {Math.min((currentPage + 1) * pageSize, total)}개 표시
          </p>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentPage > 0) setCurrentPage(currentPage - 1);
              }}
              disabled={currentPage === 0}
            >
              이전
            </Button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page as number)}
                >
                  {(page as number) + 1}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentPage < totalPages - 1)
                  setCurrentPage(currentPage + 1);
              }}
              disabled={currentPage >= totalPages - 1}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {/* 편집 모달 */}
      <PlansEdit />
    </div>
  );
}
