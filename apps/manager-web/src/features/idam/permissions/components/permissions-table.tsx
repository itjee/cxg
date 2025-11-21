"use client";

import { DataTable } from "@/components/data-table";
import { usePermissionsStore } from "../stores/permissions.store";
import { getPermissionsColumns } from "./permissions-columns";
import type { Permission } from "../types/permissions.types";

interface PermissionsTableProps {
  data: Permission[];
  isLoading?: boolean;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export function PermissionsTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: PermissionsTableProps) {
  const { sorting, setSorting } = usePermissionsStore();
  const columns = getPermissionsColumns({ onEdit, onDelete });

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
