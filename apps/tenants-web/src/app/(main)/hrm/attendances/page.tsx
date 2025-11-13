"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  Clock,
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

interface Attendance {
  id: string;
  employee_id: string;
  employee_name?: string;
  employee_no?: string;
  date: string;
  check_in?: string;
  check_out?: string;
  work_hours?: number;
  status: "present" | "absent" | "late" | "early_leave";
  notes?: string;
}

// 상태 맵
const statusMap: Record<string, { label: string; color: string }> = {
  present: { label: "정상", color: "bg-green-100 text-green-800" },
  absent: { label: "결근", color: "bg-red-100 text-red-800" },
  late: { label: "지각", color: "bg-yellow-100 text-yellow-800" },
  early_leave: { label: "조퇴", color: "bg-orange-100 text-orange-800" },
};

// 임시 모의 데이터
const mockAttendances: Attendance[] = [
  {
    id: "1",
    employee_id: "EMP001",
    employee_name: "홍길동",
    employee_no: "EMP001",
    date: "2025-11-02",
    check_in: "09:00",
    check_out: "18:00",
    work_hours: 8,
    status: "present",
  },
  {
    id: "2",
    employee_id: "EMP002",
    employee_name: "김영희",
    employee_no: "EMP002",
    date: "2025-11-02",
    check_in: "09:15",
    check_out: "18:00",
    work_hours: 7.75,
    status: "late",
    notes: "교통 체증",
  },
  {
    id: "3",
    employee_id: "EMP003",
    employee_name: "이순신",
    employee_no: "EMP003",
    date: "2025-11-02",
    status: "absent",
    notes: "병가",
  },
  {
    id: "4",
    employee_id: "EMP004",
    employee_name: "박지성",
    employee_no: "EMP004",
    date: "2025-11-02",
    check_in: "09:00",
    check_out: "17:00",
    work_hours: 7,
    status: "early_leave",
    notes: "개인 사유",
  },
  {
    id: "5",
    employee_id: "EMP005",
    employee_name: "최미영",
    employee_no: "EMP005",
    date: "2025-11-02",
    check_in: "08:55",
    check_out: "18:05",
    work_hours: 8.17,
    status: "present",
  },
];

export default function AttendancesPage() {
  const [attendances, setAttendances] = useState<Attendance[]>(mockAttendances);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  // 테이블 컬럼 정의
  const columns: ColumnDef<Attendance>[] = [
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          날짜
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("date")}</div>
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
      accessorKey: "check_in",
      header: "출근",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("check_in") || "-"}</div>
      ),
    },
    {
      accessorKey: "check_out",
      header: "퇴근",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("check_out") || "-"}</div>
      ),
    },
    {
      accessorKey: "work_hours",
      header: "근무시간",
      cell: ({ row }) => {
        const hours = row.getValue("work_hours") as number | undefined;
        return <div className="text-sm">{hours ? `${hours}시간` : "-"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const display = statusMap[status] || statusMap.present;
        return (
          <div className="flex items-center gap-2">
            {status === "present" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">정상</span>
              </>
            ) : status === "late" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm">지각</span>
              </>
            ) : status === "absent" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm">결근</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">조퇴</span>
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
              setAttendances(
                attendances.filter((a) => a.id !== row.original.id)
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
      key: "employee",
      label: "사원명",
      type: "search",
      placeholder: "사원명, 사번으로 검색...",
    },
    {
      key: "status",
      label: "상태",
      type: "select",
      options: [
        { label: "정상", value: "present" },
        { label: "지각", value: "late" },
        { label: "조퇴", value: "early_leave" },
        { label: "결근", value: "absent" },
      ],
    },
    {
      key: "dateRange",
      label: "근태일",
      type: "daterange",
    },
  ];

  // 필터링된 데이터
  const filteredAttendances = useMemo(() => {
    return attendances.filter((attendance) => {
      if (selectedStatus && attendance.status !== selectedStatus) return false;

      // 날짜 범위 필터링
      if (dateRange.startDate || dateRange.endDate) {
        const attendanceDate = new Date(attendance.date);
        if (dateRange.startDate) {
          const startDate = new Date(dateRange.startDate);
          if (attendanceDate < startDate) return false;
        }
        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (attendanceDate > endDate) return false;
        }
      }

      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          attendance.employee_name?.toLowerCase().includes(query) ||
          attendance.employee_no?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [attendances, selectedStatus, globalFilter, dateRange]);

  // 통계 카드
  const stats: StatCardData[] = useMemo(() => {
    const total = attendances.length;
    const present = attendances.filter((a) => a.status === "present").length;
    const late = attendances.filter((a) => a.status === "late").length;
    const absent = attendances.filter((a) => a.status === "absent").length;

    return [
      {
        title: "전체 기록",
        value: total,
        description: "총 근태 기록",
        icon: <Clock className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "정상 출근",
        value: present,
        description: "정상 출근",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "지각",
        value: late,
        description: "지각",
        icon: <Clock className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "결근",
        value: absent,
        description: "결근",
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [attendances]);

  // 내보내기 핸들러
  const handleExport = () => {
    const exportData = filteredAttendances.map((attendance) => ({
      날짜: attendance.date,
      사원명: attendance.employee_name || "",
      사번: attendance.employee_no || "",
      출근시간: attendance.check_in || "",
      퇴근시간: attendance.check_out || "",
      근무시간: attendance.work_hours ? `${attendance.work_hours}시간` : "",
      상태:
        attendance.status === "present"
          ? "정상"
          : attendance.status === "late"
          ? "지각"
          : attendance.status === "early_leave"
          ? "조퇴"
          : "결근",
      비고: attendance.notes || "",
    }));
    downloadCSV(
      exportData,
      `attendances_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const filterValues = {
    employee: globalFilter,
    status: selectedStatus,
    dateRange: dateRange,
  };

  return (
    <ListPageContainer
      title="근태 관리"
      description="사원의 근태 정보를 관리합니다"
      onRefresh={() => setAttendances([...mockAttendances])}
      onAdd={() => {
        console.log("Add attendance");
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
        data={filteredAttendances}
        pageSize={10}
        emptyMessage="데이터가 없습니다."
      />
    </ListPageContainer>
  );
}
