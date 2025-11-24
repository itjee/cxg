"use client";

/**
 * @file login-logs-table.tsx
 * @description 로그인 이력 데이터 테이블 컴포넌트
 */

import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination/pagination";
import { useLoginLogsStore } from "../stores";
import { getLoginLogsColumns } from "./login-logs-columns";
import type { LoginLog } from "../types";

interface LoginLogsTableProps {
  data: LoginLog[];
  isLoading?: boolean;
  totalItems?: number;
  onViewDetail?: (log: LoginLog) => void;
  onDelete?: (log: LoginLog) => void;
}

export function LoginLogsTable({
  data,
  isLoading,
  totalItems = 0,
  onViewDetail,
  onDelete,
}: LoginLogsTableProps) {
  const {
    sorting,
    setSorting,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useLoginLogsStore();
  const columns = getLoginLogsColumns({
    onViewDetail,
    onDelete,
    currentPage,
    itemsPerPage,
  });

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
