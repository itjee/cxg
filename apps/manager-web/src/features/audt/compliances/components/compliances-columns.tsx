import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type {
  Compliance,
  ReportType,
  ComplianceStatus,
  ReportStatus,
  FileType,
} from "../types/compliances.types";

const reportTypeLabels: Record<ReportType, string> = {
  GDPR: "GDPR",
  SOX: "SOX",
  HIPAA: "HIPAA",
  ISO27001: "ISO27001",
  PCI_DSS: "PCI-DSS",
  CCPA: "CCPA",
  CUSTOM: "맞춤형",
};

const complianceStatusColors: Record<ComplianceStatus, string> = {
  COMPLIANT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  NON_COMPLIANT: "bg-red-500/10 text-red-600",
  PARTIAL: "bg-orange-500/10 text-orange-600",
  PENDING: "bg-blue-500/10 text-blue-600",
};

const complianceStatusLabels: Record<ComplianceStatus, string> = {
  COMPLIANT: "준수",
  NON_COMPLIANT: "미준수",
  PARTIAL: "부분준수",
  PENDING: "검토중",
};

const statusColors: Record<ReportStatus, string> = {
  DRAFT: "bg-gray-500/10 text-gray-600",
  PENDING_REVIEW: "bg-blue-500/10 text-blue-600",
  APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  PUBLISHED: "bg-purple-500/10 text-purple-600",
};

const statusLabels: Record<ReportStatus, string> = {
  DRAFT: "초안",
  PENDING_REVIEW: "검토대기",
  APPROVED: "승인완료",
  PUBLISHED: "공개됨",
};

const fileTypeLabels: Record<FileType, string> = {
  PDF: "PDF",
  EXCEL: "Excel",
  JSON: "JSON",
  HTML: "HTML",
  CSV: "CSV",
};

interface GetColumnsParams {
  onViewDetails?: (compliance: Compliance) => void;
  onDownload?: (compliance: Compliance) => void;
}

export const getCompliancesColumns = ({
  onViewDetails,
  onDownload,
}: GetColumnsParams = {}): ColumnDef<Compliance>[] => [
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
    accessorKey: "report_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="보고서명" />
    ),
    cell: ({ row }) => (
      <div className="max-w-md">
        <div className="font-medium">{row.getValue("report_name")}</div>
        <div className="text-xs text-muted-foreground">
          {formatDate(row.original.start_date, "yyyy-MM-dd")} ~{" "}
          {formatDate(row.original.close_date, "yyyy-MM-dd")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "report_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="보고서 유형" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("report_type") as ReportType;
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
          {reportTypeLabels[type]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "compliance_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="준수상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("compliance_status") as ComplianceStatus;
      return (
        <Badge className={complianceStatusColors[status]}>
          {complianceStatusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "findings_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="이슈" />
    ),
    cell: ({ row }) => {
      const total = row.getValue("findings_count") as number;
      const critical = row.original.critical_count;
      return (
        <div className="text-center">
          <div className="font-medium">{total}</div>
          {critical > 0 && (
            <div className="text-xs text-destructive">심각: {critical}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as ReportStatus;
      return (
        <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
      );
    },
  },
  {
    accessorKey: "file_type",
    header: "파일",
    cell: ({ row }) => {
      const fileType = row.getValue("file_type") as FileType;
      return (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {fileTypeLabels[fileType]}
        </code>
      );
    },
  },
  {
    accessorKey: "generated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="생성일시" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {formatDate(row.getValue("generated_at"), "yyyy-MM-dd HH:mm")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">작업</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails?.(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        {row.original.file_path && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownload?.(row.original)}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
];
