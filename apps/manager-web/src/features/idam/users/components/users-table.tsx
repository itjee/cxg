"use client";

/**
 * @file users-table.tsx
 * @description 사용자 데이터 테이블 컴포넌트
 * 
 * columns 파일에서 컬럼 정의를 import하고 DataTable 컴포넌트를 설정합니다.
 * - Zustand 스토어 연동 (정렬 상태)
 * - 페이지네이션 설정
 * - 검색 설정
 */

import { DataTable } from "@/components/ui/data-table";
import { useUsersStore } from "../stores/users.store";
import { getUsersColumns } from "./users-columns";
import type { Users } from "../types/users.types";

interface UsersTableProps {
  data: Users[];
  onEdit: (user: Users) => void;
  onDelete: (user: Users) => void;
}

export function UsersTable({ data, onEdit, onDelete }: UsersTableProps) {
  const { sorting, setSorting } = useUsersStore();
  const columns = getUsersColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="사용자명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
