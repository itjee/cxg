'use client';

/**
 * @file tenants-table.tsx
 * @description 테넌트 데이터 테이블 컴포넌트
 *
 * columns 파일에서 컬럼 정의를 import하고 DataTable 컴포넌트를 설정합니다.
 * - Zustand 스토어 연동 (정렬 상태)
 * - 페이지네이션 설정
 * - 검색 설정
 */

import { DataTable } from '@/components/data-table';
import { useTenantsStore } from '../stores';
import { getTenantsColumns } from './tenants-columns';
import type { Tenant } from '../types';

interface TenantsTableProps {
  data: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export function TenantsTable({ data, onEdit, onDelete }: TenantsTableProps) {
  const { sorting, setSorting } = useTenantsStore();
  const columns = getTenantsColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="code"
      searchPlaceholder="코드, 이름으로 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
