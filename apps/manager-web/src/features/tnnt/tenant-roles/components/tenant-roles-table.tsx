/**
 * @file tenant-roles-table.tsx
 * @description 테넌트 역할 데이터 테이블
 */

'use client';

import { DataTable } from '@/components/data-table';
import { useTenantRolesStore } from '../stores';
import { getTenantRolesColumns } from './tenant-roles-columns';
import type { TenantRole } from '../types';

interface TenantRolesTableProps {
  data: TenantRole[];
  onEdit?: (role: TenantRole) => void;
  onDelete?: (role: TenantRole) => void;
}

export function TenantRolesTable({
  data,
  onEdit,
  onDelete,
}: TenantRolesTableProps) {
  const { sorting, setSorting } = useTenantRolesStore();
  const columns = getTenantRolesColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="role_name"
      searchPlaceholder="역할명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
