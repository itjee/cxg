import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { 
  Policy, 
  PolicyType, 
  PolicyCategory,
  PolicyStatus,
  EnforcementLevel 
} from "../types/policies.types";

const policyTypeLabels: Record<PolicyType, string> = {
  PASSWORD: "비밀번호",
  ACCESS_CONTROL: "접근제어",
  DATA_RETENTION: "데이터보관",
  ENCRYPTION: "암호화",
  AUTHENTICATION: "인증",
  NETWORK_SECURITY: "네트워크보안",
};

const policyCategoryLabels: Record<PolicyCategory, string> = {
  AUTHENTICATION: "인증",
  AUTHORIZATION: "권한부여",
  DATA_PROTECTION: "데이터보호",
  MONITORING: "모니터링",
  INCIDENT_RESPONSE: "사고대응",
  COMPLIANCE: "컴플라이언스",
};

const statusColors: Record<PolicyStatus, string> = {
  DRAFT: "bg-gray-500/10 text-gray-600",
  PENDING_APPROVAL: "bg-blue-500/10 text-blue-600",
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  ARCHIVED: "bg-orange-500/10 text-orange-600",
};

const statusLabels: Record<PolicyStatus, string> = {
  DRAFT: "초안",
  PENDING_APPROVAL: "승인대기",
  ACTIVE: "활성",
  ARCHIVED: "보관",
};

const enforcementLevelColors: Record<EnforcementLevel, string> = {
  MANDATORY: "bg-red-500/10 text-red-600",
  RECOMMENDED: "bg-orange-500/10 text-orange-600",
  OPTIONAL: "bg-blue-500/10 text-blue-600",
};

const enforcementLevelLabels: Record<EnforcementLevel, string> = {
  MANDATORY: "필수",
  RECOMMENDED: "권장",
  OPTIONAL: "선택",
};

interface GetColumnsParams {
  onViewDetails?: (policy: Policy) => void;
  onApprove?: (policy: Policy) => void;
}

export const getPoliciesColumns = ({
  onViewDetails,
  onApprove,
}: GetColumnsParams = {}): ColumnDef<Policy>[] => [
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
    accessorKey: "policy_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="정책명" />
    ),
    cell: ({ row }) => (
      <div className="max-w-md">
        <div className="font-medium">{row.getValue("policy_name")}</div>
        <div className="text-xs text-muted-foreground">
          버전 {row.original.version}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "policy_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="정책 유형" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("policy_type") as PolicyType;
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
          {policyTypeLabels[type]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "policy_category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="분류" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("policy_category") as PolicyCategory;
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
          {policyCategoryLabels[category]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "enforcement_level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="시행수준" />
    ),
    cell: ({ row }) => {
      const level = row.getValue("enforcement_level") as EnforcementLevel;
      return (
        <Badge className={enforcementLevelColors[level]}>
          {enforcementLevelLabels[level]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as PolicyStatus;
      return (
        <Badge className={statusColors[status]}>
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "effective_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="시행일" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{formatDate(row.getValue("effective_date"), "yyyy-MM-dd")}</div>
        {row.original.expiry_date && (
          <div className="text-xs text-muted-foreground">
            ~ {formatDate(row.original.expiry_date, "yyyy-MM-dd")}
          </div>
        )}
      </div>
    ),
  },
  {
    id: "scope",
    header: "적용범위",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.apply_to_all_tenants ? "전체" : "특정 테넌트"}
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
        {row.original.status === "PENDING_APPROVAL" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onApprove?.(row.original)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
];
