'use client';

/**
 * @file sessions-table.tsx
 * @description 세션 데이터 테이블 컴포넌트
 */

import { DataTable } from '@/components/data-table';
import { Pagination } from '@/components/pagination/pagination';
import { useSessionsStore } from '../stores';
import { getSessionsColumns } from './sessions-columns';
import type { Session } from '../types';

interface SessionsTableProps {
  data: Session[];
  isLoading?: boolean;
  totalItems?: number;
  onRevoke: (session: Session) => void;
  onDelete: (session: Session) => void;
}

export function SessionsTable({
  data,
  isLoading,
  totalItems = 0,
  onRevoke,
  onDelete
}: SessionsTableProps) {
  const { sorting, setSorting, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage } = useSessionsStore();
  const columns = getSessionsColumns({ onRevoke, onDelete, currentPage, itemsPerPage });

  // 서버 사이드 페이지네이션: 클라이언트 페이징 비활성화
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        showPagination={false}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      {/* 서버 사이드 페이지네이션 */}
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        showInfo={true}
      />
    </div>
  );
}
