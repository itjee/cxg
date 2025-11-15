"use client";

import { DataTable } from "@/components/data-table";
import { useRolesStore } from "../stores/roles.store";
import { getRolesColumns } from "./roles-columns";
import type { Roles } from "../types/roles.types";

interface RolesTableProps {
  data: Roles[];
  onEdit: (role: Roles) => void;
  onDelete: (role: Roles) => void;
}

export function RolesTable({ data, onEdit, onDelete }: RolesTableProps) {
  const { sorting, setSorting } = useRolesStore();
  const columns = getRolesColumns({ onEdit, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="역할명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
