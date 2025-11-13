import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { AuditLog, EventType, EventCategory, AuditResult, RiskLevel } from "../types/audit-logs.types";

const eventTypeLabels: Record<EventType, string> = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  API_CALL: "API 호출",
  DATA_ACCESS: "데이터 접근",
  ADMIN_ACTION: "관리자 작업",
  PASSWORD_CHANGE: "비밀번호 변경",
  PERMISSION_CHANGE: "권한 변경",
};

const eventCategoryLabels: Record<EventCategory, string> = {
  AUTHENTICATION: "인증",
  AUTHORIZATION: "권한부여",
  DATA_MODIFICATION: "데이터수정",
  SYSTEM_CHANGE: "시스템변경",
  SECURITY_VIOLATION: "보안위반",
};

const resultColors: Record<AuditResult, string> = {
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  FAILURE: "bg-red-500/10 text-red-600",
  BLOCKED: "bg-orange-500/10 text-orange-600",
};

const resultLabels: Record<AuditResult, string> = {
  SUCCESS: "성공",
  FAILURE: "실패",
  BLOCKED: "차단",
};

const riskLevelColors: Record<RiskLevel, string> = {
  HIGH: "bg-destructive/10 text-destructive",
  MEDIUM: "bg-orange-500/10 text-orange-600",
  LOW: "bg-blue-500/10 text-blue-600",
};

const riskLevelLabels: Record<RiskLevel, string> = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

interface GetColumnsParams {
  onViewDetails?: (log: AuditLog) => void;
}

export const getAuditLogsColumns = ({
  onViewDetails,
}: GetColumnsParams = {}): ColumnDef<AuditLog>[] => [
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
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="발생시간" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {formatDate(row.getValue("created_at"), "yyyy-MM-dd HH:mm:ss")}
      </div>
    ),
  },
  {
    accessorKey: "event_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="이벤트 유형" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("event_type") as EventType;
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
          {eventTypeLabels[type]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "event_category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="이벤트 분류" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("event_category") as EventCategory;
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
          {eventCategoryLabels[category]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "설명",
    cell: ({ row }) => (
      <div className="max-w-md truncate text-sm">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "source_ip",
    header: "IP 주소",
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {row.getValue("source_ip") || "-"}
      </code>
    ),
  },
  {
    accessorKey: "risk_level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="위험도" />
    ),
    cell: ({ row }) => {
      const level = row.getValue("risk_level") as RiskLevel;
      return (
        <Badge className={riskLevelColors[level]}>
          {riskLevelLabels[level]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "result",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="결과" />
    ),
    cell: ({ row }) => {
      const result = row.getValue("result") as AuditResult;
      return (
        <Badge className={resultColors[result]}>
          {resultLabels[result]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <button
          onClick={() => onViewDetails?.(row.original)}
          className="text-sm text-primary hover:underline"
        >
          상세
        </button>
      </div>
    ),
  },
];
