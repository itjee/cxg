"use client";

import { DataTable } from "@/components/data-table";
import { useResourcesStore } from "../stores";
import { getResourcesColumns } from "./resources-columns";
import type { Resource } from "../types";

interface ResourcesTableProps {
  data: Resource[];
  total: number;
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
  isLoading?: boolean;
}

export function ResourcesTable({
  data,
  total,
  onEdit,
  onDelete,
  isLoading,
}: ResourcesTableProps) {
  const {
    sorting,
    setSorting,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useResourcesStore();

  const columns = getResourcesColumns({
    onEdit,
    onDelete,
  });

  const pageCount = Math.ceil(total / itemsPerPage);

  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sorting}
      onSortingChange={setSorting}
      pagination={{
        pageIndex: currentPage,
        pageSize: itemsPerPage,
        totalPages: pageCount,
        totalItems: total,
      }}
      onPaginationChange={(newPagination) => {
        if (newPagination.pageIndex !== undefined) {
          setCurrentPage(newPagination.pageIndex);
        }
        if (newPagination.pageSize !== undefined) {
          setItemsPerPage(newPagination.pageSize);
        }
      }}
      loading={isLoading}
      emptyMessage="등록된 리소스가 없습니다"
    />
  );
}
