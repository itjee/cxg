import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resource, ResourceStatus, ResourceType } from "../types";

// Status colors
const statusColors: Record<ResourceStatus, string> = {
  PROVISIONING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  RUNNING: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  STOPPED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  TERMINATED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  ERROR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  MAINTENANCE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

const statusLabels: Record<ResourceStatus, string> = {
  PROVISIONING: "프로비저닝",
  RUNNING: "실행중",
  STOPPED: "중지됨",
  TERMINATED: "종료됨",
  ERROR: "오류",
  MAINTENANCE: "점검중",
};

// Resource type labels
const resourceTypeLabels: Record<ResourceType, string> = {
  DATABASE: "데이터베이스",
  STORAGE: "스토리지",
  COMPUTE: "컴퓨팅",
  NETWORK: "네트워크",
  CACHE: "캐시",
  LOAD_BALANCER: "로드밸런서",
  CDN: "CDN",
};

interface GetColumnsParams {
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
}

export const getResourcesColumns = ({
  onEdit,
  onDelete,
}: GetColumnsParams = {}): ColumnDef<Resource>[] => [
  {
    id: "rowNumber",
    header: () => <div className="text-center">NO</div>,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <div className="text-center">{pageIndex * pageSize + row.index + 1}</div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "resource_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="리소스명" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("resource_name")}</div>
    ),
  },
  {
    accessorKey: "resource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="유형" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("resource") as ResourceType;
      return <div>{resourceTypeLabels[type]}</div>;
    },
  },
  {
    accessorKey: "resource_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="리소스 ID" />
    ),
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {row.getValue("resource_id")}
      </code>
    ),
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="리전" />
    ),
    cell: ({ row }) => <div>{row.getValue("region")}</div>,
  },
  {
    accessorKey: "instance_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="인스턴스 타입" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("instance_type") as string | undefined;
      return <div>{type || "-"}</div>;
    },
  },
  {
    accessorKey: "cpu_cores",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPU" />
    ),
    cell: ({ row }) => {
      const cores = row.getValue("cpu_cores") as number | undefined;
      return <div className="text-right">{cores ? `${cores} 코어` : "-"}</div>;
    },
    meta: {
      align: "right",
    },
  },
  {
    accessorKey: "memory_size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="메모리" />
    ),
    cell: ({ row }) => {
      const memory = row.getValue("memory_size") as number | undefined;
      return (
        <div className="text-right">
          {memory ? `${(memory / 1024).toFixed(1)} GB` : "-"}
        </div>
      );
    },
    meta: {
      align: "right",
    },
  },
  {
    accessorKey: "monthly_cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="월간 비용" />
    ),
    cell: ({ row }) => {
      const cost = row.getValue("monthly_cost") as number | undefined;
      const currency = row.original.currency;
      return (
        <div className="text-right">
          {cost ? `${currency} ${cost.toFixed(2)}` : "-"}
        </div>
      );
    },
    meta: {
      align: "right",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as ResourceStatus;
      return (
        <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit?.(row.original)}
        >
          수정
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete?.(row.original)}
        >
          삭제
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
