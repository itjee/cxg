"use client";

/**
 * @file roles-table.tsx
 * @description 역할 데이터 테이블 컴포넌트
 *
 * columns 파일에서 컬럼 정의를 import하고 DataTable 컴포넌트를 설정합니다.
 * - 페이지네이션 설정
 * - 검색 설정
 */

import { DataTable } from "@/components/data-table";
import { getRolesColumns } from "./roles-columns";
import type { Role } from "../types/roles.types";

interface RolesTableProps {
  data: Role[];
  isLoading?: boolean;
  onEdit?: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RolesTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: RolesTableProps) {
  const columns = getRolesColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      globalFilter={""}
      onGlobalFilterChange={undefined}
      showPagination={true}
      pageSize={20}
    />
  );
}
