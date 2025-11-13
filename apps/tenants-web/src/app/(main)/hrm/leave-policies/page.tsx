"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListPageContainer } from "@/components/layouts/list-page-container";
import {
  FilterSection,
  FilterConfig,
} from "@/components/layouts/filter-section";
import { DataTableWithPagination } from "@/components/data-table/data-table-with-pagination";
import { StatsCards } from "@/components/stats/stats-cards";
import type { StatCardData } from "@/components/stats/stats-cards";
import { ColumnDef } from "@tanstack/react-table";
import { downloadCSV } from "@/lib/export-utils";

interface LeavePolicy {
  id: string;
  policy_name: string;
  leave_type: string;
  total_days: number;
  min_service_months: number;
  max_carry_forward: number;
  is_paid: boolean;
  is_active: boolean;
  description?: string;
  created_at: string;
}

// 휴가 유형 맵
const leaveTypeMap: Record<string, string> = {
  ANNUAL: "연차",
  SICK: "병가",
  PERSONAL: "개인 사유",
  MATERNITY: "출산 휴가",
  PATERNITY: "육아 휴가",
  BEREAVEMENT: "경조사",
  UNPAID: "무급 휴가",
  SPECIAL: "특별 휴가",
};

// 임시 모의 데이터
const mockLeavePolicies: LeavePolicy[] = [
  {
    id: "1",
    policy_name: "기본 연차 정책",
    leave_type: "ANNUAL",
    total_days: 15,
    min_service_months: 12,
    max_carry_forward: 5,
    is_paid: true,
    is_active: true,
    description: "1년 이상 근무 시 15일의 유급 연차 제공",
    created_at: "2025-01-01",
  },
  {
    id: "2",
    policy_name: "병가 정책",
    leave_type: "SICK",
    total_days: 10,
    min_service_months: 0,
    max_carry_forward: 0,
    is_paid: true,
    is_active: true,
    description: "연간 10일의 유급 병가 제공",
    created_at: "2025-01-01",
  },
  {
    id: "3",
    policy_name: "출산 휴가 정책",
    leave_type: "MATERNITY",
    total_days: 90,
    min_service_months: 0,
    max_carry_forward: 0,
    is_paid: true,
    is_active: true,
    description: "출산 전후 90일의 유급 휴가 제공",
    created_at: "2025-01-01",
  },
  {
    id: "4",
    policy_name: "육아 휴가 정책",
    leave_type: "PATERNITY",
    total_days: 30,
    min_service_months: 6,
    max_carry_forward: 0,
    is_paid: true,
    is_active: true,
    description: "육아를 위한 30일의 유급 휴가 제공",
    created_at: "2025-01-01",
  },
  {
    id: "5",
    policy_name: "경조사 휴가 정책",
    leave_type: "BEREAVEMENT",
    total_days: 5,
    min_service_months: 0,
    max_carry_forward: 0,
    is_paid: true,
    is_active: true,
    description: "경조사 시 5일의 유급 휴가 제공",
    created_at: "2025-01-01",
  },
];

export default function LeavePoliciesPage() {
  const [leavePolicies, setLeavePolicies] =
    useState<LeavePolicy[]>(mockLeavePolicies);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // 테이블 컬럼 정의
  const columns: ColumnDef<LeavePolicy>[] = [
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: "policy_name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          정책명
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("policy_name")}</div>
      ),
    },
    {
      accessorKey: "leave_type",
      header: "휴가 유형",
      cell: ({ row }) => {
        const type = row.getValue("leave_type") as string;
        return (
          <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
            {leaveTypeMap[type] || type}
          </div>
        );
      },
    },
    {
      accessorKey: "total_days",
      header: "총 일수",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("total_days")}일</div>
      ),
    },
    {
      accessorKey: "min_service_months",
      header: "최소 근속",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("min_service_months")}개월</div>
      ),
    },
    {
      accessorKey: "max_carry_forward",
      header: "이월 가능",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("max_carry_forward")}일</div>
      ),
    },
    {
      accessorKey: "is_paid",
      header: "유급/무급",
      cell: ({ row }) => {
        const isPaid = row.getValue("is_paid") as boolean;
        return (
          <div className="flex items-center gap-2">
            {isPaid ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">유급</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                <span className="text-sm">무급</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "상태",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <div className="flex items-center gap-2">
            {isActive ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">활성</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm">비활성</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "작업",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8" title="편집">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              setLeavePolicies(
                leavePolicies.filter((p) => p.id !== row.original.id)
              );
            }}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // 필터 설정
  const filters: FilterConfig[] = [
    {
      key: "policyName",
      label: "정책명",
      type: "search",
      placeholder: "정책명으로 검색...",
    },
    {
      key: "leaveType",
      label: "휴가 유형",
      type: "select",
      options: Object.entries(leaveTypeMap).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    },
    {
      key: "status",
      label: "상태",
      type: "select",
      options: [
        { label: "활성", value: "active" },
        { label: "비활성", value: "inactive" },
      ],
    },
  ];

  // 필터링된 데이터
  const filteredPolicies = useMemo(() => {
    return leavePolicies.filter((policy) => {
      if (selectedType && policy.leave_type !== selectedType) return false;
      if (selectedStatus === "active" && !policy.is_active) return false;
      if (selectedStatus === "inactive" && policy.is_active) return false;

      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          policy.policy_name.toLowerCase().includes(query) ||
          policy.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [leavePolicies, selectedType, selectedStatus, globalFilter]);

  // 통계 카드
  const stats: StatCardData[] = useMemo(() => {
    const total = leavePolicies.length;
    const active = leavePolicies.filter((p) => p.is_active).length;
    const paid = leavePolicies.filter((p) => p.is_paid).length;
    const totalDays = leavePolicies.reduce((sum, p) => sum + p.total_days, 0);

    return [
      {
        title: "전체 정책",
        value: total,
        description: "총 휴가 정책",
        icon: <FileText className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성 정책",
        value: active,
        description: "활성화된 정책",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "유급 정책",
        value: paid,
        description: "유급 휴가 정책",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "비활성 정책",
        value: total - active,
        description: "비활성 정책",
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [leavePolicies]);

  // 내보내기 핸들러
  const handleExport = () => {
    const exportData = filteredPolicies.map((policy) => ({
      정책명: policy.policy_name,
      휴가유형: leaveTypeMap[policy.leave_type] || policy.leave_type,
      총일수: `${policy.total_days}일`,
      최소근속: `${policy.min_service_months}개월`,
      이월가능일수: `${policy.max_carry_forward}일`,
      유급여부: policy.is_paid ? "유급" : "무급",
      상태: policy.is_active ? "활성" : "비활성",
      설명: policy.description || "",
      생성일: policy.created_at,
    }));
    downloadCSV(
      exportData,
      `leave_policies_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const filterValues = {
    policyName: globalFilter,
    leaveType: selectedType,
    status: selectedStatus,
  };

  return (
    <ListPageContainer
      title="휴가 정책 관리"
      description="휴가 정책을 관리합니다"
      onRefresh={() => setLeavePolicies([...mockLeavePolicies])}
      onAdd={() => {
        console.log("Add leave policy");
      }}
      onExport={handleExport}
      showExport={true}
    >
      {/* 통계 섹션 */}
      <StatsCards cards={stats} columns={4} />

      {/* 필터 섹션 */}
      <FilterSection
        filters={filters}
        values={filterValues}
        onFilterChange={(key, value) => {
          if (key === "policyName") {
            setGlobalFilter(typeof value === "string" ? value : "");
          } else if (key === "leaveType") {
            setSelectedType(typeof value === "string" ? value : "");
          } else if (key === "status") {
            setSelectedStatus(typeof value === "string" ? value : "");
          }
        }}
      />

      {/* 데이터 테이블 */}
      <DataTableWithPagination
        columns={columns}
        data={filteredPolicies}
        pageSize={10}
        emptyMessage="데이터가 없습니다."
      />
    </ListPageContainer>
  );
}
