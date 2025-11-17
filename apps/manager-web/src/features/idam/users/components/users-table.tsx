"use client";

/**
 * @file users-table.tsx
 * @description 사용자 데이터 테이블 컴포넌트
 *
 * columns 파일에서 컬럼 정의를 import하고 DataTable 컴포넌트를 설정합니다.
 * - Zustand 스토어 연동 (정렬 상태)
 * - 페이지네이션 설정
 * - 서버사이드 검색 (search 파라미터로 백엔드에서 필터링)
 * - 결과내검색 및 컬럼필터 지원
 */

import { DataTable } from "@/components/data-table";
import { getUsersColumns } from "./users-columns";
import { useUsersStore } from "../stores";
import type { User } from "../types/users.types";

interface UserTableProps {
  data: User[];
  isLoading?: boolean;
  onEdit?: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: UserTableProps) {
  const { sorting, setSorting } = useUsersStore();
  const columns = getUsersColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      sorting={sorting}
      onSortingChange={setSorting}
      showPagination={true}
      pageSize={20}
    />
  );
}
