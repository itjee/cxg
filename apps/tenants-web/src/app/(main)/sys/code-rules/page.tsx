"use client";

import { useMemo } from "react";
import { Edit2, Trash2, ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  CodeRulesHeader,
  CodeRulesStats,
  CodeRulesFilters,
  CodeRulesList,
  CodeRulesPaging,
  CodeRulesEdit,
} from "@/features/sys/code-rules";
import { useCodeRuleStore } from "@/features/sys/code-rules/stores";
import type { CodeRule } from "@/features/sys/code-rules/types";

// 날짜 포맷 함수
function formatDateTime(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

// 더미 데이터
const dummyCodeRules: CodeRule[] = [
  {
    id: "1",
    entityName: "거래처",
    entityCode: "PARTNER",
    prefix: "MCO",
    currentNumber: 1005,
    digitLength: 4,
    description: "거래처 코드 규칙",
    exampleCode: "MCO0001",
    active: true,
    createdAt: "2025-01-01T08:00:00Z",
    updatedAt: "2025-10-28T14:30:00Z",
  },
  {
    id: "2",
    entityName: "제품",
    entityCode: "PRODUCT",
    prefix: "MPT",
    currentNumber: 2150,
    digitLength: 4,
    description: "제품 코드 규칙",
    exampleCode: "MPT0001",
    active: true,
    createdAt: "2025-01-05T09:15:00Z",
    updatedAt: "2025-10-27T11:20:00Z",
  },
  {
    id: "3",
    entityName: "창고",
    entityCode: "WAREHOUSE",
    prefix: "MWH",
    currentNumber: 102,
    digitLength: 3,
    description: "창고 코드 규칙",
    exampleCode: "MWH001",
    active: true,
    createdAt: "2025-02-01T10:30:00Z",
    updatedAt: "2025-10-26T15:45:00Z",
  },
  {
    id: "4",
    entityName: "부서",
    entityCode: "DEPARTMENT",
    prefix: "MDT",
    currentNumber: 52,
    digitLength: 3,
    description: "부서 코드 규칙",
    exampleCode: "MDT001",
    active: true,
    createdAt: "2025-03-01T07:00:00Z",
    updatedAt: "2025-10-25T13:15:00Z",
  },
];

// 테이블 컬럼 정의
const createColumns = (
  onEditCodeRule: (codeRule: CodeRule) => void,
  onDeleteCodeRule: (codeRule: CodeRule) => void
): ColumnDef<CodeRule>[] => [
  {
    id: "rowNumber",
    header: "NO",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: "entityName",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        엔티티명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("entityName")}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.entityCode}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "prefix",
    header: "프리픽스",
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue("prefix")}</div>
    ),
  },
  {
    accessorKey: "digitLength",
    header: "자릿수",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("digitLength")}자리</div>
    ),
  },
  {
    accessorKey: "exampleCode",
    header: "예시 코드",
    cell: ({ row }) => (
      <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
        {row.getValue("exampleCode")}
      </div>
    ),
  },
  {
    accessorKey: "currentNumber",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        현재 번호
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("currentNumber")}</div>
    ),
  },
  {
    accessorKey: "active",
    header: "상태",
    cell: ({ row }) => {
      const isActive = row.getValue("active");
      return (
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">활성</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span className="text-sm">비활성</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        생성일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <div className="text-sm">{formatDateTime(createdAt)}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground"
        onClick={() => column.toggleSorting()}
      >
        수정일시
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      return <div className="text-sm">{formatDateTime(updatedAt)}</div>;
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
          onClick={() => onEditCodeRule(row.original)}
          title="편집"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => onDeleteCodeRule(row.original)}
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function CodeRulesPage() {
  const { selectedStatus } = useCodeRuleStore();

  // 필터링된 데이터
  const filteredCodeRules = useMemo(() => {
    return dummyCodeRules.filter((codeRule) => {
      if (
        selectedStatus &&
        (selectedStatus === "active" ? !codeRule.active : codeRule.active)
      )
        return false;
      return true;
    });
  }, [selectedStatus]);

  const handleEditCodeRule = (codeRule: CodeRule) => {
    const { openForm } = useCodeRuleStore.getState();
    openForm(codeRule.id);
  };

  const handleDeleteCodeRule = (codeRule: CodeRule) => {
    console.log("Delete code rule:", codeRule);
  };

  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    const { editingId } = useCodeRuleStore.getState();
    if (editingId) {
      console.log("Update code rule:", editingId, formData);
    } else {
      console.log("Create code rule:", formData);
    }
  };

  const columns = createColumns(handleEditCodeRule, handleDeleteCodeRule);

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <CodeRulesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <CodeRulesStats codeRules={dummyCodeRules} />

      {/* 필터 섹션 */}
      <CodeRulesFilters codeRules={dummyCodeRules} />

      {/* 데이터 테이블 */}
      <CodeRulesList columns={columns} data={filteredCodeRules} />

      {/* 페이지네이션 */}
      <CodeRulesPaging
        totalItems={filteredCodeRules.length}
        itemsPerPage={10}
      />

      {/* 입력 폼 모달 */}
      <CodeRulesEdit codeRules={dummyCodeRules} onSubmit={handleFormSubmit} />
    </div>
  );
}
