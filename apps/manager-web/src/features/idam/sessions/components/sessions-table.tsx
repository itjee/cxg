'use client';

/**
 * @file sessions-table.tsx
 * @description 세션 데이터 테이블 컴포넌트
 */

import { DataTable } from '@/components/ui/data-table';
import { useSessionStore } from '../stores';
import { getSessionsColumns } from './sessions-columns';
import type { Session } from '../types';

interface SessionsTableProps {
  data: Session[];
  onRevoke: (session: Session) => void;
  onDelete: (session: Session) => void;
}

export function SessionsTable({ data, onRevoke, onDelete }: SessionsTableProps) {
  const { sorting, setSorting } = useSessionStore();
  const columns = getSessionsColumns({ onRevoke, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="ip_address"
      searchPlaceholder="IP 주소 또는 세션 ID 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
