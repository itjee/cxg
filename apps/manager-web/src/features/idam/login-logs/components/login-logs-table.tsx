"use client";

/**
 * @file login-logs-table.tsx
 * @description 로그인 이력 데이터 테이블 컴포넌트
 */

import { DataTable } from "@/components/data-table";
import { useLoginLogStore } from "../stores";
import { getLoginLogsColumns } from "./login-logs-columns";
import type { LoginLog } from "../types";

interface LoginLogsTableProps {
  data: LoginLog[];
  isLoading?: boolean;
  onViewDetail?: (log: LoginLog) => void;
  onDelete?: (log: LoginLog) => void;
}

export function LoginLogsTable({
  data,
  isLoading,
  onViewDetail,
  onDelete,
}: LoginLogsTableProps) {
  const { sorting, setSorting } = useLoginLogStore();
  const columns = getLoginLogsColumns({ onViewDetail, onDelete });

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
