"use client";

/**
 * @file workflows-table.tsx
 * @description 워크플로우 관리 테이블 컴포넌트
 * 
 * 역할:
 * - columns 파일에서 컬럼 정의 import
 * - DataTable 컴포넌트 설정
 * - Zustand 스토어 연동
 * - 페이지네이션/필터 설정
 */

import { DataTable } from "@/components/ui/data-table";
import { useWorkflowsStore } from "../stores";
import { getWorkflowsColumns } from "./workflows-columns";
import type { Workflows } from "../types";

interface WorkflowsTableProps {
  data: Workflows[];
  onEdit?: (workflow: Workflows) => void;
  onDelete?: (workflow: Workflows) => void;
  onToggle?: (workflow: Workflows) => void;
}

/**
 * 워크플로우 관리 데이터 테이블 컴포넌트
 */
export function WorkflowsTable({ 
  data, 
  onEdit, 
  onDelete,
  onToggle,
}: WorkflowsTableProps) {
  const { sorting, setSorting } = useWorkflowsStore();
  const columns = getWorkflowsColumns({ onEdit, onDelete, onToggle });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="워크플로우명 검색..."
      showColumnVisibility={false}
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
      useCollapsibleFilter={true}
      filters={[
        {
          key: "is_active",
          label: "상태",
          options: [
            { label: "활성", value: "true" },
            { label: "비활성", value: "false" },
          ],
        },
      ]}
    />
  );
}
