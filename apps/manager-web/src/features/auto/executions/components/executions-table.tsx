"use client";

/**
 * @file executions-table.tsx
 * @description 워크플로우 실행 이력 데이터 테이블
 *
 * 역할:
 * - columns 파일에서 컬럼 정의 import
 * - DataTable 컴포넌트 설정
 * - Zustand 스토어 연동
 * - 페이지네이션/필터 설정
 */

import { DataTable } from "@/components/data-table";
import { useExecutionsStore } from "../stores";
import { getExecutionsColumns } from "./executions-columns";
import type { Execution } from "../types";

interface ExecutionsTableProps {
  data: Execution[];
  onViewDetails?: (execution: Execution) => void;
}

export function ExecutionsTable({ data, onViewDetails }: ExecutionsTableProps) {
  const { sorting, setSorting } = useExecutionsStore();
  const columns = getExecutionsColumns({ onViewDetails });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="execution_id"
      searchPlaceholder="실행 ID 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
