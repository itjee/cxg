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
  onViewDetail?: (log: LoginLog) => void;
  onDelete?: (log: LoginLog) => void;
}

export function LoginLogsTable({
  data,
  onViewDetail,
  onDelete,
}: LoginLogsTableProps) {
  const { sorting, setSorting } = useLoginLogStore();
  const columns = getLoginLogsColumns({ onViewDetail, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="ip_address"
      searchPlaceholder="IP 주소 또는 사용자명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
