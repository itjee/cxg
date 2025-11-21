"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import type { Permission } from "../types/permissions.types";

interface GetColumnsParams {
  onEdit?: (permission: Permission) => void;
  onDelete?: (permission: Permission) => void;
}

export const getPermissionsColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Permission>[] => [
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
    meta: {
      filterable: false,
    },
  },
  // 권한명 + 코드
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="권한명" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-light">{row.getValue("name")}</div>
        <div className="text-xs text-muted-foreground">
          {(row.original as Permission).code}
        </div>
      </div>
    ),
    meta: {
      filterable: true,
    },
  },
  // 카테고리
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="카테고리" />
    ),
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
    meta: {
      filterable: true,
    },
  },
  // 리소스
  {
    accessorKey: "resource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="리소스" />
    ),
    cell: ({ row }) => <div>{row.getValue("resource")}</div>,
    meta: {
      filterable: true,
    },
  },
  // 작업
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="작업" />
    ),
    cell: ({ row }) => <div>{row.getValue("action")}</div>,
    meta: {
      filterable: true,
    },
  },
  // 범위
  {
    accessorKey: "scope",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="범위" />
    ),
    cell: ({ row }) => {
      const scope = row.getValue("scope") as string;
      return (
        <Badge variant="outline">
          {scope === "GLOBAL" ? "전체" : scope === "TENANT" ? "테넌트" : scope}
        </Badge>
      );
    },
    meta: {
      filterable: true,
    },
  },
  // 적용대상
  {
    accessorKey: "appliesTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="적용대상" />
    ),
    cell: ({ row }) => {
      const appliesTo = row.getValue("appliesTo") as string;
      const labelMap: Record<string, string> = {
        ALL: "모두",
        MASTER: "마스터",
        TENANT: "테넌트",
        SYSTEM: "시스템",
      };
      return <div>{labelMap[appliesTo] || appliesTo}</div>;
    },
    meta: {
      filterable: true,
    },
  },
  // 상태
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const isActive = row.getValue("status") === "ACTIVE";
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "활성" : "비활성"}
        </Badge>
      );
    },
    meta: {
      filterable: false,
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
    meta: {
      filterable: false,
    },
  },
];
