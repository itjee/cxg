"use client";

/**
 * @file api-keys-table.tsx
 * @description API 키 데이터 테이블 컴포넌트
 *
 * columns 파일에서 컬럼 정의를 import하고 DataTable 컴포넌트를 설정합니다.
 * - Zustand 스토어 연동 (정렬 상태)
 * - 페이지네이션 설정
 * - 결과내검색 및 컬럼필터 지원
 */

import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination/pagination";
import { useApiKeysStore } from "../stores";
import { getApiKeysColumns } from "./api-keys-columns";
import type { ApiKey } from "../types";

interface ApiKeysTableProps {
  data: ApiKey[];
  isLoading?: boolean;
  totalItems?: number;
  onEdit: (apiKey: ApiKey) => void;
  onDelete: (apiKey: ApiKey) => void;
  onToggleStatus: (apiKey: ApiKey) => void;
}

export function ApiKeysTable({
  data,
  isLoading,
  totalItems = 0,
  onEdit,
  onDelete,
  onToggleStatus,
}: ApiKeysTableProps) {
  const {
    sorting,
    setSorting,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useApiKeysStore();
  const columns = getApiKeysColumns({
    onEdit,
    onDelete,
    onToggleStatus,
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
