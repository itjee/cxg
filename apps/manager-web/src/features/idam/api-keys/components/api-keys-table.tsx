"use client";

/**
 * @file api-keys-table.tsx
 * @description API 키 데이터 테이블 컴포넌트
 *
 * columns 파일에서 컬럼 정의를 import하고 DataTable 컴포넌트를 설정합니다.
 * - Zustand 스토어 연동 (정렬 상태)
 * - 페이지네이션 설정
 * - 검색 설정
 */

import { DataTable } from "@/components/data-table";
import { useApiKeyStore } from "../stores";
import { getApiKeysColumns } from "./api-keys-columns";
import type { ApiKey } from "../types";

interface ApiKeysTableProps {
  data: ApiKey[];
  onEdit: (apiKey: ApiKey) => void;
  onDelete: (apiKey: ApiKey) => void;
  onToggleStatus: (apiKey: ApiKey) => void;
}

export function ApiKeysTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
}: ApiKeysTableProps) {
  const { sorting, setSorting } = useApiKeyStore();
  const columns = getApiKeysColumns({ onEdit, onDelete, onToggleStatus });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="key_name"
      searchPlaceholder="키 이름 또는 키 ID 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
