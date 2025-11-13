"use client";

import { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  DollarSign,
  CheckCircle2,
  XCircle,
  Calendar,
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
import { PayrollStructureForm } from "@/features/hrm/salary-structures/components/payroll-structure-form";
import { ColumnDef } from "@tanstack/react-table";
import { downloadCSV } from "@/lib/export-utils";

interface PayrollStructure {
  id: string;
  code: string;
  name: string;
  description?: string;
  department?: string;
  employment_type?: string;
  base_pay: number;
  currency_code: string;
  payment_cycle: string;
  valid_from: string;
  valid_to?: string;
  is_active: boolean;
  created_at: string;
}

// 고용 형태 맵
const employmentTypeMap: Record<string, string> = {
  FULL_TIME: "정직원",
  PART_TIME: "계약직",
  CONTRACT: "계약직",
  INTERN: "인턴",
};

// 지급 주기 맵
const paymentCycleMap: Record<string, string> = {
  DAILY: "일급",
  WEEKLY: "주급",
  BIWEEKLY: "14일급",
  MONTHLY: "월급",
  ANNUAL: "연봉",
};

// 임시 모의 데이터
const mockPayrollStructures: PayrollStructure[] = [
  {
    id: "1",
    code: "PS-001",
    name: "개발팀 정직원 기본 급여",
    description: "개발팀 정직원 기본 급여 구조",
    department: "개발팀",
    employment_type: "FULL_TIME",
    base_pay: 3500000,
    currency_code: "KRW",
    payment_cycle: "MONTHLY",
    valid_from: "2025-01-01",
    valid_to: undefined,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    code: "PS-002",
    name: "영업팀 정직원 기본 급여",
    description: "영업팀 정직원 기본 급여 구조",
    department: "영업팀",
    employment_type: "FULL_TIME",
    base_pay: 3000000,
    currency_code: "KRW",
    payment_cycle: "MONTHLY",
    valid_from: "2025-01-01",
    valid_to: undefined,
    is_active: true,
    created_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "3",
    code: "PS-003",
    name: "마케팅팀 정직원 기본 급여",
    description: "마케팅팀 정직원 기본 급여 구조",
    department: "마케팅팀",
    employment_type: "FULL_TIME",
    base_pay: 2800000,
    currency_code: "KRW",
    payment_cycle: "MONTHLY",
    valid_from: "2025-02-01",
    valid_to: undefined,
    is_active: true,
    created_at: "2025-02-01T00:00:00Z",
  },
  {
    id: "4",
    code: "PS-004",
    name: "계약직 기본 급여",
    description: "모든 부서 계약직 기본 급여",
    employment_type: "CONTRACT",
    base_pay: 2500000,
    currency_code: "KRW",
    payment_cycle: "MONTHLY",
    valid_from: "2025-01-01",
    valid_to: "2025-12-31",
    is_active: true,
    created_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "5",
    code: "PS-005",
    name: "인턴 기본 급여",
    description: "인턴 기본 급여",
    employment_type: "INTERN",
    base_pay: 1500000,
    currency_code: "KRW",
    payment_cycle: "MONTHLY",
    valid_from: "2025-03-01",
    valid_to: undefined,
    is_active: false,
    created_at: "2025-03-01T00:00:00Z",
  },
];

export default function PayrollStructuresPage() {
  const [payrollStructures, setPayrollStructures] = useState<
    PayrollStructure[]
  >(mockPayrollStructures);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingData, setEditingData] = useState<
    PayrollStructure | undefined
  >();

  // 테이블 컬럼 정의
  const columns: ColumnDef<PayrollStructure>[] = [
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          구조코드
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("code")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "부서",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("department") || "-"}</div>
      ),
    },
    {
      accessorKey: "employment_type",
      header: "고용형태",
      cell: ({ row }) => {
        const type = row.getValue("employment_type") as string;
        return (
          <div className="inline-block px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
            {employmentTypeMap[type] || type || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "base_pay",
      header: "기본급",
      cell: ({ row }) => {
        const basePay = row.getValue("base_pay") as number;
        return (
          <div className="font-medium text-right">
            {basePay.toLocaleString("ko-KR")}
          </div>
        );
      },
    },
    {
      accessorKey: "payment_cycle",
      header: "지급주기",
      cell: ({ row }) => {
        const cycle = row.getValue("payment_cycle") as string;
        return <div className="text-sm">{paymentCycleMap[cycle] || cycle}</div>;
      },
    },
    {
      accessorKey: "valid_from",
      header: "유효시작일",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("valid_from")}</div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "상태",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active");
        return (
          <div className="flex items-center gap-2">
            {isActive ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">활성</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
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
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title="편집"
            onClick={() => {
              setEditingData(row.original);
              setFormMode("edit");
              setFormOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              setPayrollStructures(
                payrollStructures.filter((p) => p.id !== row.original.id)
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
      key: "code",
      label: "구조명",
      type: "search",
      placeholder: "구조코드, 구조명으로 검색...",
    },
    {
      key: "employmentType",
      label: "고용형태",
      type: "select",
      options: Object.entries(employmentTypeMap).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    },
    {
      key: "status",
      label: "상태",
      type: "select",
      options: [
        { label: "활성", value: "true" },
        { label: "비활성", value: "false" },
      ],
    },
  ];

  // 필터링된 데이터
  const filteredStructures = useMemo(() => {
    return payrollStructures.filter((structure) => {
      if (
        selectedEmploymentType &&
        structure.employment_type !== selectedEmploymentType
      ) {
        return false;
      }
      if (selectedStatus && structure.is_active.toString() !== selectedStatus) {
        return false;
      }
      if (globalFilter) {
        const query = globalFilter.toLowerCase();
        return (
          structure.code.toLowerCase().includes(query) ||
          structure.name.toLowerCase().includes(query) ||
          structure.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [payrollStructures, selectedEmploymentType, selectedStatus, globalFilter]);

  // 통계 카드
  const stats: StatCardData[] = useMemo(() => {
    const total = payrollStructures.length;
    const active = payrollStructures.filter((p) => p.is_active).length;
    const inactive = payrollStructures.filter((p) => !p.is_active).length;
    const avgBasePay =
      payrollStructures.length > 0
        ? Math.round(
            payrollStructures.reduce((sum, p) => sum + p.base_pay, 0) /
              payrollStructures.length
          )
        : 0;

    return [
      {
        title: "전체급여구조",
        value: total,
        description: "총 등록된 급여 구조",
        icon: <DollarSign className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성구조",
        value: active,
        description: "현재 적용 중인 구조",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "비활성구조",
        value: inactive,
        description: "미적용 구조",
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "평균기본급",
        value: `${(avgBasePay / 1000000).toFixed(1)}M`,
        description: "평균 기본급",
        icon: <Calendar className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [payrollStructures]);

  const filterValues = {
    code: globalFilter,
    employmentType: selectedEmploymentType,
    status: selectedStatus,
  };

  const handleSavePayrollStructure = (data: any) => {
    if (formMode === "create") {
      const newPayrollStructure: PayrollStructure = {
        id: String(payrollStructures.length + 1),
        code: data.code,
        name: data.name,
        description: data.description,
        department: data.department !== "none" ? data.department : undefined,
        employment_type: data.employment_type,
        base_pay: Number(data.base_pay),
        currency_code: data.currency_code,
        payment_cycle: data.payment_cycle,
        valid_from: data.valid_from,
        valid_to: data.valid_to || undefined,
        is_active: data.is_active === "true",
        created_at: new Date().toISOString(),
      };
      setPayrollStructures([...payrollStructures, newPayrollStructure]);
    } else if (editingData) {
      setPayrollStructures(
        payrollStructures.map((p) =>
          p.id === editingData.id
            ? {
                ...p,
                code: data.code,
                name: data.name,
                description: data.description,
                department:
                  data.department !== "none" ? data.department : undefined,
                employment_type: data.employment_type,
                base_pay: Number(data.base_pay),
                currency_code: data.currency_code,
                payment_cycle: data.payment_cycle,
                valid_from: data.valid_from,
                valid_to: data.valid_to || undefined,
                is_active: data.is_active === "true",
              }
            : p
        )
      );
    }
    setFormOpen(false);
    setEditingData(undefined);
  };

  // 내보내기 핸들러
  const handleExport = () => {
    const exportData = filteredStructures.map((ps) => ({
      구조코드: ps.code,
      구조명: ps.name,
      설명: ps.description || "",
      부서: ps.department || "",
      고용형태:
        (ps.employment_type && employmentTypeMap[ps.employment_type]) ||
        ps.employment_type ||
        "",
      기본급: ps.base_pay,
      통화: ps.currency_code,
      지급주기: paymentCycleMap[ps.payment_cycle] || ps.payment_cycle,
      유효시작일: ps.valid_from,
      유효종료일: ps.valid_to || "",
      상태: ps.is_active ? "활성" : "비활성",
    }));
    downloadCSV(
      exportData,
      `payroll-structures_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  return (
    <ListPageContainer
      title="급여구조"
      description="급여 구조 정보를 관리합니다"
      onRefresh={() => setPayrollStructures([...mockPayrollStructures])}
      onAdd={() => {
        setEditingData(undefined);
        setFormMode("create");
        setFormOpen(true);
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
          if (key === "code") {
            setGlobalFilter(typeof value === "string" ? value : "");
          } else if (key === "employmentType") {
            setSelectedEmploymentType(typeof value === "string" ? value : "");
          } else if (key === "status") {
            setSelectedStatus(typeof value === "string" ? value : "");
          }
        }}
      />

      {/* 데이터 테이블 */}
      <DataTableWithPagination
        columns={columns}
        data={filteredStructures}
        pageSize={10}
        emptyMessage="데이터가 없습니다."
      />

      {/* 급여구조 폼 */}
      <PayrollStructureForm
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        data={editingData}
        onSave={handleSavePayrollStructure}
      />
    </ListPageContainer>
  );
}
