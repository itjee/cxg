"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
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

interface DepartmentHistory {
  id: string;
  department_id: string;
  department_name?: string;
  change_type: string;
  change_date: string;
  effective_date: string;
  change_reason?: string;
  old_name?: string;
  new_name?: string;
  old_manager_name?: string;
  new_manager_name?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  order_number?: string;
  created_at: string;
}

// 변경 유형 맵
const changeTypeMap: Record<string, string> = {
  RENAME: "명칭변경",
  REORGANIZE: "조직개편",
  MANAGER_CHANGE: "부서장변경",
  TYPE_CHANGE: "유형변경",
  PARENT_CHANGE: "상위부서변경",
  MERGE: "통합",
  SPLIT: "분할",
  CLOSE: "폐쇄",
  REOPEN: "재개",
};

// 상태 맵
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "대기", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "승인", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "반려", color: "bg-red-100 text-red-800" },
  CANCELLED: { label: "취소", color: "bg-gray-100 text-gray-800" },
};

// 임시 모의 데이터
const mockDepartmentHistories: DepartmentHistory[] = [
  {
    id: "1",
    department_id: "DEPT001",
    department_name: "개발팀",
    change_type: "RENAME",
    change_date: "2025-10-28",
    effective_date: "2025-10-28",
    change_reason: "조직 재편에 따른 명칭 변경",
    old_name: "Development Team",
    new_name: "개발팀(신)",
    status: "APPROVED",
    order_number: "ORD-2025-001",
    created_at: "2025-10-28T09:00:00Z",
  },
  {
    id: "2",
    department_id: "DEPT002",
    department_name: "영업팀",
    change_type: "MANAGER_CHANGE",
    change_date: "2025-10-25",
    effective_date: "2025-10-25",
    change_reason: "부서장 이동",
    old_manager_name: "김영희",
    new_manager_name: "이순신",
    status: "APPROVED",
    order_number: "ORD-2025-002",
    created_at: "2025-10-25T10:30:00Z",
  },
  {
    id: "3",
    department_id: "DEPT003",
    department_name: "마케팅팀",
    change_type: "REORGANIZE",
    change_date: "2025-10-20",
    effective_date: "2025-10-20",
    change_reason: "사업 전략 변경에 따른 조직 개편",
    status: "PENDING",
    order_number: "ORD-2025-003",
    created_at: "2025-10-20T14:15:00Z",
  },
  {
    id: "4",
    department_id: "DEPT004",
    department_name: "인사팀",
    change_type: "MERGE",
    change_date: "2025-10-15",
    effective_date: "2025-10-15",
    change_reason: "부서 통합을 통한 효율성 증대",
    old_name: "인사팀",
    new_name: "인사·총무팀",
    status: "APPROVED",
    order_number: "ORD-2025-004",
    created_at: "2025-10-15T11:00:00Z",
  },
  {
    id: "5",
    department_id: "DEPT005",
    department_name: "IT팀",
    change_type: "SPLIT",
    change_date: "2025-10-10",
    effective_date: "2025-10-10",
    change_reason: "전문성 강화를 위한 부서 분할",
    old_name: "IT팀",
    new_name: "IT인프라팀, IT개발팀",
    status: "APPROVED",
    order_number: "ORD-2025-005",
    created_at: "2025-10-10T08:45:00Z",
  },
];

export default function DepartmentHistoriesPage() {
  const [departmentHistories, setDepartmentHistories] = useState<
    DepartmentHistory[]
  >(mockDepartmentHistories);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedChangeType, setSelectedChangeType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  // 테이블 컬럼 정의
  const columns: ColumnDef<DepartmentHistory>[] = [
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: "change_date",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          발령일
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("change_date")}</div>
      ),
    },
    {
      accessorKey: "department_name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          부서명
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("department_name")}</div>
      ),
    },
    {
      accessorKey: "change_type",
      header: "변경 유형",
      cell: ({ row }) => {
        const changeType = row.getValue("change_type") as string;
        return (
          <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
            {changeTypeMap[changeType] || changeType}
          </div>
        );
      },
    },
    {
      accessorKey: "effective_date",
      header: "시행일",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("effective_date")}</div>
      ),
    },
    {
      accessorKey: "change_reason",
      header: "변경 사유",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("change_reason") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const display = statusMap[status] || statusMap.PENDING;
        return (
          <div className="flex items-center gap-2">
            {status === "APPROVED" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">승인</span>
              </>
            ) : status === "PENDING" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm">대기</span>
              </>
            ) : status === "REJECTED" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm">반려</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                <span className="text-sm">취소</span>
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
              setDepartmentHistories(
                departmentHistories.filter((h) => h.id !== row.original.id)
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
      key: "department",
      label: "부서명",
      type: "search",
      placeholder: "부서명, 변경 사유로 검색...",
    },
    {
      key: "changeType",
      label: "변경 유형",
      type: "select",
      options: Object.entries(changeTypeMap).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    },
    {
      key: "status",
      label: "상태",
      type: "select",
      options: [
        { label: "대기", value: "PENDING" },
        { label: "승인", value: "APPROVED" },
        { label: "반려", value: "REJECTED" },
        { label: "취소", value: "CANCELLED" },
      ],
    },
    {
      key: "dateRange",
      label: "변경일",
      type: "daterange",
    },
  ];

  // 필터링된 데이터
  const filteredHistories = useMemo(() => {
    return departmentHistories.filter((history) => {
      if (selectedChangeType && history.change_type !== selectedChangeType)
        return false;
      if (selectedStatus && history.status !== selectedStatus) return false;

      // 날짜 범위 필터링
      if (dateRange.startDate || dateRange.endDate) {
        const historyDate = new Date(history.change_date);
        if (dateRange.startDate) {
          const startDate = new Date(dateRange.startDate);
          if (historyDate < startDate) return false;
        }
        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          // endDate는 포함하도록 하기 위해 다음 날의 시작으로 설정
          endDate.setHours(23, 59, 59, 999);
          if (historyDate > endDate) return false;
        }
      }

      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          history.department_name?.toLowerCase().includes(query) ||
          history.change_reason?.toLowerCase().includes(query) ||
          changeTypeMap[history.change_type]?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [
    departmentHistories,
    selectedChangeType,
    selectedStatus,
    globalFilter,
    dateRange,
  ]);

  // 통계 카드
  const stats: StatCardData[] = useMemo(() => {
    const total = departmentHistories.length;
    const approved = departmentHistories.filter(
      (h) => h.status === "APPROVED"
    ).length;
    const pending = departmentHistories.filter(
      (h) => h.status === "PENDING"
    ).length;
    const rejected = departmentHistories.filter(
      (h) => h.status === "REJECTED"
    ).length;

    return [
      {
        title: "전체 이력",
        value: total,
        description: "총 부서변경 이력",
        icon: <History className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "승인된 이력",
        value: approved,
        description: "승인된 변경 이력",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "대기 중인 이력",
        value: pending,
        description: "승인 대기 중",
        icon: <Clock className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "반려된 이력",
        value: rejected,
        description: "반려된 변경 이력",
        icon: <AlertCircle className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [departmentHistories]);

  // 내보내기 핸들러
  const handleExport = () => {
    const exportData = filteredHistories.map((history) => {
      let changeDetails = "";
      if (history.old_name && history.new_name) {
        changeDetails = `명칭: ${history.old_name} → ${history.new_name}`;
      }
      if (history.old_manager_name && history.new_manager_name) {
        changeDetails = `부서장: ${history.old_manager_name} → ${history.new_manager_name}`;
      }

      return {
        변경일: history.change_date,
        부서명: history.department_name || "",
        변경유형: changeTypeMap[history.change_type] || history.change_type,
        시행일: history.effective_date,
        변경내용: changeDetails,
        변경사유: history.change_reason || "",
        발령번호: history.order_number || "",
        상태:
          history.status === "APPROVED"
            ? "승인"
            : history.status === "PENDING"
            ? "대기"
            : history.status === "REJECTED"
            ? "반려"
            : "취소",
      };
    });
    downloadCSV(
      exportData,
      `department_histories_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const filterValues = {
    department: globalFilter,
    changeType: selectedChangeType,
    status: selectedStatus,
    dateRange: dateRange,
  };

  return (
    <ListPageContainer
      title="부서 변경이력"
      description="부서의 변경 이력을 관리합니다"
      onRefresh={() => setDepartmentHistories([...mockDepartmentHistories])}
      onAdd={() => {
        console.log("Add department history");
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
          if (key === "department") {
            setGlobalFilter(typeof value === "string" ? value : "");
          } else if (key === "changeType") {
            setSelectedChangeType(typeof value === "string" ? value : "");
          } else if (key === "status") {
            setSelectedStatus(typeof value === "string" ? value : "");
          } else if (key === "dateRange") {
            setDateRange(value as { startDate?: string; endDate?: string });
          }
        }}
      />

      {/* 데이터 테이블 */}
      <DataTableWithPagination
        columns={columns}
        data={filteredHistories}
        pageSize={10}
        emptyMessage="데이터가 없습니다."
      />
    </ListPageContainer>
  );
}
