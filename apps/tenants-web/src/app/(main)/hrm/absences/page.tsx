"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
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

interface Absence {
  id: string;
  employee_id: string;
  employee_name?: string;
  employee_no?: string;
  absence_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  applied_date: string;
}

// 휴가 유형 맵
const absenceTypeMap: Record<string, string> = {
  ANNUAL: "연차",
  SICK: "병가",
  PERSONAL: "개인 사유",
  MATERNITY: "출산 휴가",
  PATERNITY: "육아 휴가",
  BEREAVEMENT: "경조사",
  UNPAID: "무급 휴가",
  SPECIAL: "특별 휴가",
};

// 상태 맵
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "대기", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "승인", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "반려", color: "bg-red-100 text-red-800" },
};

// 임시 모의 데이터
const mockAbsences: Absence[] = [
  {
    id: "1",
    employee_id: "EMP001",
    employee_name: "홍길동",
    employee_no: "EMP001",
    absence_type: "ANNUAL",
    start_date: "2025-11-05",
    end_date: "2025-11-07",
    days: 3,
    reason: "개인 여행",
    status: "APPROVED",
    applied_date: "2025-10-28",
  },
  {
    id: "2",
    employee_id: "EMP002",
    employee_name: "김영희",
    employee_no: "EMP002",
    absence_type: "SICK",
    start_date: "2025-11-02",
    end_date: "2025-11-02",
    days: 1,
    reason: "감기",
    status: "APPROVED",
    applied_date: "2025-11-02",
  },
  {
    id: "3",
    employee_id: "EMP003",
    employee_name: "이순신",
    employee_no: "EMP003",
    absence_type: "ANNUAL",
    start_date: "2025-11-10",
    end_date: "2025-11-14",
    days: 5,
    reason: "휴식",
    status: "PENDING",
    applied_date: "2025-11-01",
  },
  {
    id: "4",
    employee_id: "EMP004",
    employee_name: "박지성",
    employee_no: "EMP004",
    absence_type: "BEREAVEMENT",
    start_date: "2025-10-29",
    end_date: "2025-10-30",
    days: 2,
    reason: "가족 경조사",
    status: "APPROVED",
    applied_date: "2025-10-28",
  },
  {
    id: "5",
    employee_id: "EMP005",
    employee_name: "최미영",
    employee_no: "EMP005",
    absence_type: "PERSONAL",
    start_date: "2025-11-08",
    end_date: "2025-11-08",
    days: 1,
    reason: "개인 사정",
    status: "PENDING",
    applied_date: "2025-11-01",
  },
];

export default function AbsencesPage() {
  const [absences, setAbsences] = useState<Absence[]>(mockAbsences);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  // 테이블 컬럼 정의
  const columns: ColumnDef<Absence>[] = [
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: "applied_date",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          신청일
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("applied_date")}</div>
      ),
    },
    {
      accessorKey: "employee_name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          사원명
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("employee_name")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.employee_no}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "absence_type",
      header: "휴가 유형",
      cell: ({ row }) => {
        const type = row.getValue("absence_type") as string;
        return (
          <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
            {absenceTypeMap[type] || type}
          </div>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "시작일",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("start_date")}</div>
      ),
    },
    {
      accessorKey: "end_date",
      header: "종료일",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("end_date")}</div>
      ),
    },
    {
      accessorKey: "days",
      header: "일수",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("days")}일</div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
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
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm">반려</span>
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
              setAbsences(absences.filter((a) => a.id !== row.original.id));
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
      key: "employee",
      label: "사원명",
      type: "search",
      placeholder: "사원명, 사번으로 검색...",
    },
    {
      key: "absenceType",
      label: "휴가 유형",
      type: "select",
      options: Object.entries(absenceTypeMap).map(([key, value]) => ({
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
      ],
    },
    {
      key: "dateRange",
      label: "신청일",
      type: "daterange",
    },
  ];

  // 필터링된 데이터
  const filteredAbsences = useMemo(() => {
    return absences.filter((absence) => {
      if (selectedType && absence.absence_type !== selectedType) return false;
      if (selectedStatus && absence.status !== selectedStatus) return false;

      // 날짜 범위 필터링
      if (dateRange.startDate || dateRange.endDate) {
        const absenceDate = new Date(absence.applied_date);
        if (dateRange.startDate) {
          const startDate = new Date(dateRange.startDate);
          if (absenceDate < startDate) return false;
        }
        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (absenceDate > endDate) return false;
        }
      }

      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          absence.employee_name?.toLowerCase().includes(query) ||
          absence.employee_no?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [absences, selectedType, selectedStatus, globalFilter, dateRange]);

  // 통계 카드
  const stats: StatCardData[] = useMemo(() => {
    const total = absences.length;
    const approved = absences.filter((a) => a.status === "APPROVED").length;
    const pending = absences.filter((a) => a.status === "PENDING").length;
    const rejected = absences.filter((a) => a.status === "REJECTED").length;

    return [
      {
        title: "전체 신청",
        value: total,
        description: "총 휴가 신청",
        icon: <Calendar className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "승인된 휴가",
        value: approved,
        description: "승인된 휴가",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "대기 중",
        value: pending,
        description: "승인 대기 중",
        icon: <Clock className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "반려",
        value: rejected,
        description: "반려된 휴가",
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [absences]);

  // 내보내기 핸들러
  const handleExport = () => {
    const exportData = filteredAbsences.map((absence) => ({
      신청일: absence.applied_date,
      사원명: absence.employee_name || "",
      사번: absence.employee_no || "",
      휴가유형: absenceTypeMap[absence.absence_type] || absence.absence_type,
      시작일: absence.start_date,
      종료일: absence.end_date,
      일수: `${absence.days}일`,
      사유: absence.reason || "",
      상태:
        absence.status === "APPROVED"
          ? "승인"
          : absence.status === "PENDING"
          ? "대기"
          : "반려",
    }));
    downloadCSV(
      exportData,
      `absences_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const filterValues = {
    employee: globalFilter,
    absenceType: selectedType,
    status: selectedStatus,
    dateRange: dateRange,
  };

  return (
    <ListPageContainer
      title="휴가 관리"
      description="사원의 휴가 신청을 관리합니다"
      onRefresh={() => setAbsences([...mockAbsences])}
      onAdd={() => {
        console.log("Add absence");
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
          if (key === "employee") {
            setGlobalFilter(typeof value === "string" ? value : "");
          } else if (key === "absenceType") {
            setSelectedType(typeof value === "string" ? value : "");
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
        data={filteredAbsences}
        pageSize={10}
        emptyMessage="데이터가 없습니다."
      />
    </ListPageContainer>
  );
}
