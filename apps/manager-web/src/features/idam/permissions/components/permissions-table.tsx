"use client";

import { DataTable } from "@/components/data-table";
import { usePermissionsStore } from "../stores/permissions.store";
import { getPermissionsColumns } from "./permissions-columns";
import type { Permissions } from "../types/permissions.types";

interface PermissionsTableProps {
  data: Permissions[];
  onEdit: (permission: Permissions) => void;
  onDelete: (permission: Permissions) => void;
}

export function PermissionsTable({
  data,
  onEdit,
  onDelete,
}: PermissionsTableProps) {
  const { sorting, setSorting } = usePermissionsStore();
  const columns = getPermissionsColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="권한명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
