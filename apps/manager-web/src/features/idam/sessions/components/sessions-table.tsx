'use client';

/**
 * @file sessions-table.tsx
 * @description 세션 데이터 테이블 컴포넌트
 */

import { DataTable } from '@/components/data-table';
import { useSessionsStore } from '../stores';
import { getSessionsColumns } from './sessions-columns';
import type { Session } from '../types';

interface SessionsTableProps {
  data: Session[];
  isLoading?: boolean;
  onRevoke: (session: Session) => void;
  onDelete: (session: Session) => void;
}

export function SessionsTable({ data, isLoading, onRevoke, onDelete }: SessionsTableProps) {
  const { sorting, setSorting } = useSessionsStore();
  const columns = getSessionsColumns({ onRevoke, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
