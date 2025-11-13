"use client";

/**
 * @file subscriptions-table.tsx
 * @description 구독 데이터 테이블 컴포넌트
 *
 * TanStack Table을 사용한 구독 목록 테이블
 * - columns 파일에서 컬럼 정의를 import
 * - DataTable 컴포넌트 설정
 * - Zustand 스토어 연동 (정렬 상태)
 * - 페이지네이션 설정
 */

import { DataTable } from "@/components/ui/data-table";
import { useSubscriptionsStore } from "../stores/subscriptions.store";
import { getSubscriptionsColumns } from "./subscriptions-columns";
import type { Subscription } from "../types/subscriptions.types";

interface SubscriptionsTableProps {
  data: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export function SubscriptionsTable({
  data,
  onEdit,
  onDelete,
}: SubscriptionsTableProps) {
  const columns = getSubscriptionsColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="plan_id"
      searchPlaceholder="플랜 ID, 테넌트 ID 검색..."
      showColumnVisibility={false}
      showPagination={true}
      pageSize={20}
      useCollapsibleFilter={false}
    />
  );
}
