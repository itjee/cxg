"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  DollarSign,
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

interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  employee_no?: string;
  period: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  payment_date?: string;
  status: "PENDING" | "APPROVED" | "PAID" | "CANCELLED";
  notes?: string;
}

// 상태 맵
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "대기", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "승인", color: "bg-blue-100 text-blue-800" },
  PAID: { label: "지급완료", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "취소", color: "bg-red-100 text-red-800" },
};

// 임시 모의 데이터
const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "1",
    employee_id: "EMP001",
    employee_name: "홍길동",
    employee_no: "EMP001",
    period: "2025-10",
    base_salary: 4000000,
    allowances: 500000,
    deductions: 400000,
    net_salary: 4100000,
    payment_date: "2025-10-25",
    status: "PAID",
  },
  {
    id: "2",
    employee_id: "EMP002",
    employee_name: "김영희",
    employee_no: "EMP002",
    period: "2025-10",
    base_salary: 3500000,
    allowances: 400000,
    deductions: 350000,
    net_salary: 3550000,
    payment_date: "2025-10-25",
    status: "PAID",
  },
  {
    id: "3",
    employee_id: "EMP003",
    employee_name: "이순신",
    employee_no: "EMP003",
    period: "2025-10",
    base_salary: 4500000,
    allowances: 600000,
    deductions: 450000,
    net_salary: 4650000,
    status: "APPROVED",
  },
  {
    id: "4",
    employee_id: "EMP004",
    employee_name: "박지성",
    employee_no: "EMP004",
    period: "2025-10",
    base_salary: 3000000,
    allowances: 300000,
    deductions: 300000,
    net_salary: 3000000,
    status: "PENDING",
  },
  {
    id: "5",
    employee_id: "EMP005",
    employee_name: "최미영",
    employee_no: "EMP005",
    period: "2025-10",
    base_salary: 5000000,
    allowances: 700000,
    deductions: 500000,
    net_salary: 5200000,
    payment_date: "2025-10-25",
    status: "PAID",
  },
];

export default function PayrollRecordsPage() {
  const [payrollRecords, setPayrollRecords] =
    useState<PayrollRecord[]>(mockPayrollRecords);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // 금액 포맷팅 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  // 테이블 컬럼 정의
  const columns: ColumnDef<PayrollRecord>[] = [
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: "period",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          급여월
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("period")}</div>
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
      accessorKey: "base_salary",
      header: "기본급",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatCurrency(row.getValue("base_salary") as number)}
        </div>
      ),
    },
    {
      accessorKey: "allowances",
      header: "수당",
      cell: ({ row }) => (
        <div className="text-sm text-green-600">
          +{formatCurrency(row.getValue("allowances") as number)}
        </div>
      ),
    },
    {
      accessorKey: "deductions",
      header: "공제",
      cell: ({ row }) => (
        <div className="text-sm text-red-600">
          -{formatCurrency(row.getValue("deductions") as number)}
        </div>
      ),
    },
    {
      accessorKey: "net_salary",
      header: "실수령액",
      cell: ({ row }) => (
        <div className="text-sm font-semibold">
          {formatCurrency(row.getValue("net_salary") as number)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center gap-2">
            {status === "PAID" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">지급완료</span>
              </>
            ) : status === "APPROVED" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
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
              setPayrollRecords(
                payrollRecords.filter((p) => p.id !== row.original.id)
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

  // 고유한 급여월 목록 생성
  const uniquePeriods = useMemo(() => {
    const periods = Array.from(new Set(payrollRecords.map((p) => p.period)));
    return periods.sort().reverse();
  }, [payrollRecords]);

  // 필터 설정
  const filters: FilterConfig[] = [
    {
      key: "employee",
      label: "사원명",
      type: "search",
      placeholder: "사원명, 사번으로 검색...",
    },
    {
      key: "period",
      label: "급여월",
      type: "select",
      options: uniquePeriods.map((period) => ({
        label: period,
        value: period,
      })),
    },
    {
      key: "status",
      label: "상태",
      type: "select",
      options: [
        { label: "대기", value: "PENDING" },
        { label: "승인", value: "APPROVED" },
        { label: "지급완료", value: "PAID" },
        { label: "취소", value: "CANCELLED" },
      ],
    },
  ];

  // 필터링된 데이터
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      if (selectedStatus && record.status !== selectedStatus) return false;
      if (selectedPeriod && record.period !== selectedPeriod) return false;

      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          record.employee_name?.toLowerCase().includes(query) ||
          record.employee_no?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [payrollRecords, selectedStatus, selectedPeriod, globalFilter]);

  // 통계 카드
  const stats: StatCardData[] = useMemo(() => {
    const total = payrollRecords.length;
    const paid = payrollRecords.filter((p) => p.status === "PAID").length;
    const pending = payrollRecords.filter((p) => p.status === "PENDING").length;
    const totalPaid = payrollRecords
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.net_salary, 0);

    return [
      {
        title: "전체 기록",
        value: total,
        description: "총 급여 기록",
        icon: <DollarSign className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "지급완료",
        value: paid,
        description: "지급 완료된 건",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "대기 중",
        value: pending,
        description: "지급 대기 중",
        icon: <Clock className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "총 지급액",
        value: `${(totalPaid / 1000000).toFixed(0)}M`,
        description: "지급 완료된 총액",
        icon: <DollarSign className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [payrollRecords]);

  // 내보내기 핸들러
  const handleExport = () => {
    const exportData = filteredRecords.map((record) => ({
      급여월: record.period,
      사원명: record.employee_name || "",
      사번: record.employee_no || "",
      기본급: record.base_salary,
      수당: record.allowances,
      공제: record.deductions,
      실수령액: record.net_salary,
      지급일: record.payment_date || "",
      상태:
        record.status === "PAID"
          ? "지급완료"
          : record.status === "APPROVED"
          ? "승인"
          : record.status === "PENDING"
          ? "대기"
          : "취소",
      비고: record.notes || "",
    }));
    downloadCSV(
      exportData,
      `payroll_records_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const filterValues = {
    employee: globalFilter,
    period: selectedPeriod,
    status: selectedStatus,
  };

  return (
    <ListPageContainer
      title="급여 기록"
      description="사원의 급여 기록을 관리합니다"
      onRefresh={() => setPayrollRecords([...mockPayrollRecords])}
      onAdd={() => {
        console.log("Add payroll record");
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
          } else if (key === "period") {
            setSelectedPeriod(typeof value === "string" ? value : "");
          } else if (key === "status") {
            setSelectedStatus(typeof value === "string" ? value : "");
          }
        }}
      />

      {/* 데이터 테이블 */}
      <DataTableWithPagination
        columns={columns}
        data={filteredRecords}
        pageSize={10}
        emptyMessage="데이터가 없습니다."
      />
    </ListPageContainer>
  );
}
