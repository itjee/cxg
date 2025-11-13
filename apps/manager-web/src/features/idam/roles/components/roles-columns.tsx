"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import type { Roles } from "../types/roles.types";

interface GetColumnsParams {
  onEdit?: (role: Roles) => void;
  onDelete?: (role: Roles) => void;
}

export const getRolesColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Roles>[] => [
  // NO 컬럼
  {
    id: "rowNumber",
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="text-center">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
  },
  // 역할명
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="역할명" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  // 설명
  {
    accessorKey: "description",
    header: "설명",
    cell: ({ row }) => (
      <div>{row.getValue("description") || "-"}</div>
    ),
  },
  // 상태
  {
    accessorKey: "is_active",
    header: "상태",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "활성" : "비활성"}
        </Badge>
      );
    },
  },
  // 액션
  {
    id: "actions",
    header: () => <div className="text-right">액션</div>,
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete?.(row.original)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];
