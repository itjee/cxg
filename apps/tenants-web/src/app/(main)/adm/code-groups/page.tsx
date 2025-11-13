"use client";

import React, { useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Lock } from "lucide-react";
import {
  CodeGroupsHeader,
  CodeGroupsStats,
  CodeGroupsFilters,
  CodeGroupsPaging,
  CodeGroupsEdit,
  CodeGroupsList,
} from "@/features/adm/code-groups";
import {
  getCodeGroups,
  deleteCodeGroup,
  type CodeGroup,
} from "@/lib/api-client/code-groups";
import { useCodeGroupStore } from "@/features/adm/code-groups/stores";

export default function CodeGroupsPage() {
  const {
    isSidebarOpen,
    selectedCodeGroup,
    searchQuery,
    statusFilter,
    openSidebar,
  } = useCodeGroupStore();

  const [codeGroups, setCodeGroups] = React.useState<CodeGroup[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // 코드그룹 데이터 로드
  useEffect(() => {
    const loadCodeGroups = async () => {
      try {
        setIsLoading(true);
        const response = await getCodeGroups(1, 100);
        setCodeGroups(response.items || []);
      } catch (err) {
        console.error("Failed to load code groups:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCodeGroups();
  }, []);

  // 필터링된 데이터
  const filteredCodeGroups = useMemo(() => {
    const isActiveFilter =
      statusFilter === "active"
        ? true
        : statusFilter === "inactive"
        ? false
        : undefined;

    return codeGroups.filter((cg) => {
      if (isActiveFilter !== undefined) {
        if (cg.is_active !== isActiveFilter) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          cg.code.toLowerCase().includes(query) ||
          cg.name.toLowerCase().includes(query) ||
          cg.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [codeGroups, statusFilter, searchQuery]);

  // 테이블 컬럼 정의
  const columns: ColumnDef<CodeGroup>[] = useMemo(
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
        size: 150,
      },
      {
        accessorKey: "description",
        header: "설명",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {row.original.description || "-"}
          </span>
        ),
        size: 250,
      },
      {
        accessorKey: "is_system",
        header: "구분",
        cell: ({ row }) => (
          <Badge variant={row.original.is_system ? "default" : "outline"}>
            {row.original.is_system ? (
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                시스템
              </span>
            ) : (
              "사용자"
            )}
          </Badge>
        ),
        size: 100,
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
                const codeGroup = row.original;
                if (codeGroup.is_system) {
                  alert("시스템 코드그룹은 삭제할 수 없습니다.");
                  return;
                }
                if (
                  confirm(`'${codeGroup.name}' 코드그룹을 삭제하시겠습니까?`)
                ) {
                  handleDeleteCodeGroup(codeGroup);
                }
              }}
              disabled={row.original.is_system}
              title={
                row.original.is_system
                  ? "시스템 코드그룹은 삭제할 수 없습니다"
                  : "삭제"
              }
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
      const response = await getCodeGroups(1, 100);
      setCodeGroups(response.items || []);
    } catch (err) {
      console.error("Failed to refresh code groups:", err);
      alert("새로고침 중 오류가 발생했습니다.");
    }
  };

  const handleExport = () => {
    // Export 로직 구현
    console.log("Export clicked");
  };

  const handleDeleteCodeGroup = async (codeGroup: CodeGroup) => {
    try {
      await deleteCodeGroup(codeGroup.id);
      const response = await getCodeGroups(1, 100);
      setCodeGroups(response.items || []);
    } catch (err) {
      console.error("Failed to delete code group:", err);
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
      <CodeGroupsHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드 */}
      <CodeGroupsStats codeGroups={codeGroups} />

      {/* 필터 섹션 */}
      <CodeGroupsFilters codeGroups={codeGroups} />

      {/* 데이터 테이블 */}
      <CodeGroupsList columns={columns} data={filteredCodeGroups} />

      {/* 페이지네이션 */}
      <CodeGroupsPaging
        totalItems={filteredCodeGroups.length}
        itemsPerPage={10}
      />

      {/* 코드그룹 수정/생성 폼 */}
      <CodeGroupsEdit />
    </div>
  );
}
