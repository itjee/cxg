"use client";

import React, { useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import {
  CodesHeader,
  CodesStats,
  CodesFilters,
  CodesPaging,
  CodesEdit,
  CodesList,
} from "@/features/adm/codes";
import { useCodeStore } from "@/features/adm/codes/stores/codes.store";
import type { Code } from "@/features/adm/codes/types/codes.types";

// 더미 데이터
const dummyCodes: Code[] = [
  {
    id: "1",
    code_group_id: "1",
    code_group_name: "성별",
    code: "M",
    name: "남성",
    value: "1",
    description: "남성 코드",
    display_order: 1,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-10-28T10:30:00Z",
  },
  {
    id: "2",
    code_group_id: "1",
    code_group_name: "성별",
    code: "F",
    name: "여성",
    value: "2",
    description: "여성 코드",
    display_order: 2,
    is_active: true,
    created_at: "2025-01-05T08:15:00Z",
    updated_at: "2025-10-27T14:45:00Z",
  },
  {
    id: "3",
    code_group_id: "2",
    code_group_name: "상태",
    code: "ACT",
    name: "활성",
    value: "1",
    description: "활성 상태",
    display_order: 1,
    is_active: true,
    created_at: "2025-01-10T10:30:00Z",
    updated_at: "2025-10-26T16:20:00Z",
  },
  {
    id: "4",
    code_group_id: "2",
    code_group_name: "상태",
    code: "INA",
    name: "비활성",
    value: "2",
    description: "비활성 상태",
    display_order: 2,
    is_active: true,
    created_at: "2025-01-15T11:00:00Z",
    updated_at: "2025-10-25T13:10:00Z",
  },
  {
    id: "5",
    code_group_id: "3",
    code_group_name: "결제방식",
    code: "CASH",
    name: "현금",
    value: "1",
    description: "현금 결제",
    display_order: 1,
    is_active: false,
    created_at: "2025-01-20T12:45:00Z",
    updated_at: "2025-10-24T09:55:00Z",
  },
];

export default function CodesPage() {
  const { searchQuery, statusFilter, codeGroupFilter, openSidebar } =
    useCodeStore();

  const [codes, setCodes] = React.useState<Code[]>(dummyCodes);
  const [isLoading, setIsLoading] = React.useState(false);

  // 코드 데이터 로드 (더미 데이터 사용)
  useEffect(() => {
    const loadCodes = async () => {
      try {
        setIsLoading(true);
        // API 호출 대신 더미 데이터 사용
        await new Promise((resolve) => setTimeout(resolve, 100));
        setCodes(dummyCodes);
      } catch (err) {
        console.error("Failed to load codes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCodes();
  }, []);

  // 필터링된 데이터
  const filteredCodes = useMemo(() => {
    const isActiveFilter =
      statusFilter === "active"
        ? true
        : statusFilter === "inactive"
        ? false
        : undefined;

    return codes.filter((code) => {
      if (isActiveFilter !== undefined) {
        if (code.is_active !== isActiveFilter) return false;
      }
      if (codeGroupFilter) {
        if (code.code_group_id !== codeGroupFilter) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          code.code.toLowerCase().includes(query) ||
          code.name.toLowerCase().includes(query) ||
          code.code_group_name.toLowerCase().includes(query) ||
          code.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [codes, statusFilter, searchQuery, codeGroupFilter]);

  // 테이블 컬럼 정의
  const columns: ColumnDef<Code>[] = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "코드",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {row.original.code}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {row.original.name}
            </span>
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "code_group_name",
        header: "코드그룹",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row.original.code_group_name || "-"}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "value",
        header: "값",
        cell: ({ row }) => (
          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
            {row.original.value}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "description",
        header: "설명",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row.original.description || "-"}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "display_order",
        header: "순서",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row.original.display_order}
          </span>
        ),
        size: 80,
      },
      {
        accessorKey: "is_active",
        header: "상태",
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? "default" : "secondary"}>
            {row.original.is_active ? "활성" : "비활성"}
          </Badge>
        ),
        size: 80,
      },
      {
        accessorKey: "created_at",
        header: "생성일시",
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          return (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
        size: 150,
      },
      {
        accessorKey: "updated_at",
        header: "수정일시",
        cell: ({ row }) => {
          if (!row.original.updated_at) {
            return (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                -
              </span>
            );
          }
          const date = new Date(row.original.updated_at);
          return (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
        size: 150,
      },
      {
        id: "actions",
        header: "작업",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                openSidebar(true, row.original);
              }}
              title="수정"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => {
                if (
                  confirm(`'${row.original.name}' 코드를 삭제하시겠습니까?`)
                ) {
                  handleDeleteCode(row.original);
                }
              }}
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        size: 100,
        enableSorting: false,
      },
    ],
    [openSidebar]
  );

  const handleRefresh = async () => {
    try {
      setCodes(dummyCodes);
    } catch (err) {
      console.error("Failed to refresh codes:", err);
      alert("새로고침 중 오류가 발생했습니다.");
    }
  };

  const handleExport = () => {
    // Export 로직 구현
    console.log("Export clicked");
  };

  const handleDeleteCode = (code: Code) => {
    try {
      setCodes(codes.filter((c) => c.id !== code.id));
    } catch (err) {
      console.error("Failed to delete code:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <CodesHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <CodesStats codes={codes} />

      {/* 필터 섹션 */}
      <CodesFilters codes={codes} />

      {/* 데이터 테이블 */}
      <CodesList columns={columns} data={filteredCodes} />

      {/* 페이지네이션 */}
      <CodesPaging totalItems={filteredCodes.length} itemsPerPage={10} />

      {/* 코드 수정/생성 폼 */}
      <CodesEdit />
    </div>
  );
}
