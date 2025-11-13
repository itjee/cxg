"use client";

/**
 * @file menus-table.tsx
 * @description 메뉴 관리 테이블 컴포넌트
 * 
 * TanStack Table을 사용한 메뉴 목록 테이블
 * - 정렬, 필터링, 페이지네이션 기능
 * - 컬럼별 정렬 가능
 * - 행별 수정/삭제 액션
 */

import { Edit2, Trash2, ArrowUpDown, ChevronRight } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useMenuStore } from "../stores";
import { mockMenus } from "../services";
import type { Menu } from "../types";

/**
 * 날짜/시간 포맷 유틸리티 함수
 * 
 * @description ISO 8601 날짜 문자열을 "YYYY.MM.DD HH:mm:ss" 형식으로 변환
 * @param dateString - ISO 8601 형식의 날짜 문자열
 * @returns 포맷된 날짜 문자열 또는 "-"
 */
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

/**
 * 메뉴 타입 라벨 맵
 */
const menuTypeLabels: Record<string, string> = {
  MENU: '메뉴',
  FOLDER: '폴더',
  LINK: '링크',
  DIVIDER: '구분선',
};

/**
 * 메뉴 타입 색상 맵
 */
const menuTypeColors: Record<string, string> = {
  MENU: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-500/20',
  FOLDER: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-500/20',
  LINK: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-500/20',
  DIVIDER: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border border-gray-500/20',
};

/**
 * 메뉴 테이블 컬럼 정의 생성 함수
 * 
 * @param onEditMenu - 메뉴 수정 버튼 클릭 핸들러
 * @param onDeleteMenu - 메뉴 삭제 버튼 클릭 핸들러
 * @returns TanStack Table 컬럼 정의 배열
 */
export function createMenusColumns(
  onEditMenu: (menu: Menu) => void,
  onDeleteMenu: (menu: Menu) => void
): ColumnDef<Menu>[] {
  return [
    // NO 컬럼: 행 번호 표시
    {
      id: "rowNumber",
      header: "NO",
      cell: ({ row }) => (
        <div className="font-medium text-muted-foreground">{row.index + 1}</div>
      ),
      size: 50,
    },
    // 메뉴 코드 컬럼
    {
      accessorKey: "code",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          메뉴 코드
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium">
          {row.getValue("code")}
        </div>
      ),
    },
    // 메뉴명 컬럼: name + name_en 표시
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          메뉴명
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const depth = row.original.depth;
        return (
          <div className="flex items-center gap-2">
            {/* 계층 구조 들여쓰기 */}
            {depth > 0 && (
              <span className="text-muted-foreground" style={{ marginLeft: `${depth * 12}px` }}>
                <ChevronRight className="h-3 w-3 inline" />
              </span>
            )}
            <div>
              <div className="font-medium">{row.getValue("name")}</div>
              {row.original.name_en && (
                <div className="text-xs text-muted-foreground">
                  {row.original.name_en}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    // 메뉴 타입 컬럼: 배지 스타일로 표시
    {
      accessorKey: "menu_type",
      header: "타입",
      cell: ({ row }) => {
        const menuType = row.getValue("menu_type") as string;
        return (
          <div className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${menuTypeColors[menuType] || ''}`}>
            {menuTypeLabels[menuType] || menuType}
          </div>
        );
      },
    },
    // 모듈 코드 컬럼
    {
      accessorKey: "module_code",
      header: "모듈",
      cell: ({ row }) => {
        const moduleCode = row.getValue("module_code");
        if (!moduleCode) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="inline-block px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
            {moduleCode as string}
          </div>
        );
      },
    },
    // 라우트 경로 컬럼
    {
      accessorKey: "route_path",
      header: "라우트 경로",
      cell: ({ row }) => {
        const routePath = row.getValue("route_path");
        if (!routePath) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="font-mono text-xs text-muted-foreground">
            {routePath as string}
          </div>
        );
      },
    },
    // 아이콘 컬럼
    {
      accessorKey: "icon",
      header: "아이콘",
      cell: ({ row }) => {
        const icon = row.getValue("icon");
        if (!icon) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{icon as string}</span>
          </div>
        );
      },
    },
    // 정렬 순서 컬럼
    {
      accessorKey: "sort_order",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          순서
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-center">{row.getValue("sort_order")}</div>
      ),
      size: 80,
    },
    // 표시 여부 컬럼
    {
      accessorKey: "is_visible",
      header: "표시",
      cell: ({ row }) => {
        const isVisible = row.getValue("is_visible");
        return (
          <div className="flex items-center gap-2">
            {isVisible ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">표시</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                <span className="text-sm">숨김</span>
              </>
            )}
          </div>
        );
      },
    },
    // 활성 상태 컬럼
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
                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                <span className="text-sm">비활성</span>
              </>
            )}
          </div>
        );
      },
    },
    // 생성일시 컬럼
    {
      accessorKey: "created_at",
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
        const createdAt = row.getValue("created_at") as string;
        const createdBy = row.original.created_by;
        const createdByMenu = createdBy
          ? mockMenus.find((m) => m.id === createdBy)
          : null;

        return (
          <div className="space-y-1">
            <div className="text-sm">{formatDateTime(createdAt)}</div>
            {createdByMenu && (
              <div className="text-xs text-muted-foreground">
                by {createdByMenu.name}
              </div>
            )}
          </div>
        );
      },
    },
    // 수정일시 컬럼
    {
      accessorKey: "updated_at",
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
        const updatedAt = row.getValue("updated_at") as string | undefined;
        const updatedBy = row.original.updated_by;
        const updatedByMenu = updatedBy
          ? mockMenus.find((m) => m.id === updatedBy)
          : null;

        return (
          <div className="space-y-1">
            <div className="text-sm">{formatDateTime(updatedAt)}</div>
            {updatedByMenu && (
              <div className="text-xs text-muted-foreground">
                by {updatedByMenu.name}
              </div>
            )}
          </div>
        );
      },
    },
    // 액션 컬럼: 수정/삭제 버튼
    {
      id: "actions",
      header: "작업",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* 수정 버튼 */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEditMenu(row.original)}
            title="편집"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {/* 삭제 버튼 */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDeleteMenu(row.original)}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}

/**
 * MenusTable 컴포넌트 Props 인터페이스
 */
interface MenusTableProps {
  /**
   * 표시할 메뉴 데이터 배열
   */
  data: Menu[];
  
  /**
   * 메뉴 수정 버튼 클릭 핸들러
   */
  onEdit: (menu: Menu) => void;
  
  /**
   * 메뉴 삭제 버튼 클릭 핸들러
   */
  onDelete: (menu: Menu) => void;
}

/**
 * 메뉴 관리 데이터 테이블 컴포넌트
 * 
 * @description
 * - 공통 DataTable 컴포넌트를 래핑하여 메뉴 목록 표시
 * - useMenuStore와 연동하여 정렬 상태 관리
 * - TanStack Table 기반 고급 테이블 기능 제공
 */
export function MenusTable({ data, onEdit, onDelete }: MenusTableProps) {
  // Zustand 스토어에서 정렬 상태 가져오기
  const { sorting, setSorting } = useMenuStore();

  /**
   * 메뉴 수정 핸들러
   */
  const handleEditMenu = (menu: Menu) => {
    onEdit(menu);
  };

  /**
   * 메뉴 삭제 핸들러
   */
  const handleDeleteMenu = (menu: Menu) => {
    onDelete(menu);
  };

  // 컬럼 정의 생성
  const columns = createMenusColumns(handleEditMenu, handleDeleteMenu);

  // DataTable 컴포넌트 렌더링
  return (
    <DataTable
      data={data}
      columns={columns}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
