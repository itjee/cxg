/**
 * @file tenant-users-table.tsx
 * @description 테넌트 사용자 데이터 테이블
 */

'use client';

import { DataTable } from '@/components/data-table';
import { useTenantUsersStore } from '../stores';
import { getTenantUsersColumns } from './tenant-users-columns';
import type { TenantUser } from '../types';

interface TenantUsersTableProps {
  data: TenantUser[];
  onEdit?: (user: TenantUser) => void;
  onDelete?: (user: TenantUser) => void;
  onResetPassword?: (user: TenantUser) => void;
}

export function TenantUsersTable({
  data,
  onEdit,
  onDelete,
  onResetPassword,
}: TenantUsersTableProps) {
  const { sorting, setSorting } = useTenantUsersStore();
  const columns = getTenantUsersColumns({ onEdit, onDelete, onResetPassword });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="username"
      searchPlaceholder="사용자명, 이메일 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
