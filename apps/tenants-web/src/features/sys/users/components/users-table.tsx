"use client";

/**
 * @file users-table.tsx
 * @description 사용자 관리 테이블 컴포넌트
 * 
 * TanStack Table을 사용한 사용자 목록 테이블
 * - 정렬, 필터링, 페이지네이션 기능
 * - 컬럼별 정렬 가능
 * - 행별 수정/삭제 액션
 */

import { Edit2, Trash2, ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { useUserStore } from "../stores";
import type { User } from "../types";

/**
 * 날짜/시간 포맷 유틸리티 함수
 * 
 * @description ISO 8601 날짜 문자열을 "YYYY.MM.DD HH:mm:ss" 형식으로 변환
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: "2025-10-28T10:30:00Z")
 * @returns 포맷된 날짜 문자열 (예: "2025.10.28 10:30:00") 또는 "-" (값이 없는 경우)
 * 
 * @example
 * ```ts
 * formatDateTime("2025-10-28T10:30:00Z") // "2025.10.28 10:30:00"
 * formatDateTime(undefined) // "-"
 * ```
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
 * 사용자 테이블 컬럼 정의 생성 함수
 * 
 * @description
 * - TanStack Table에 사용할 컬럼 정의 배열 생성
 * - 각 컬럼의 렌더링 방식, 정렬 기능, 스타일 정의
 * - 수정/삭제 액션 컬럼 포함
 * 
 * @param onEditUser - 사용자 수정 버튼 클릭 핸들러
 * @param onDeleteUser - 사용자 삭제 버튼 클릭 핸들러
 * @returns TanStack Table 컬럼 정의 배열
 * 
 * @columns
 * - NO: 행 번호
 * - 사용자명: username + full_name (정렬 가능)
 * - 이메일: email (정렬 가능)
 * - 역할: role_name (배지 스타일)
 * - 시스템 사용자: is_system_user (배지 스타일)
 * - 상태: is_active (아이콘 + 텍스트)
 * - 로그인 실패: failed_login_attempts + locked_until (잠금 표시)
 * - 마지막 로그인: last_login_at + last_login_ip (정렬 가능)
 * - 생성일시: created_at + created_by (정렬 가능)
 * - 수정일시: updated_at + updated_by (정렬 가능)
 * - 액션: 수정/삭제 버튼
 */
export function createUsersColumns(
  onEditUser: (user: User) => void,
  onDeleteUser: (user: User) => void
): ColumnDef<User>[] {
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
    // 사용자명 컬럼: username + full_name 표시
    {
      accessorKey: "username",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          사용자명
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("username")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.full_name}
          </div>
        </div>
      ),
    },
    // 이메일 컬럼
    {
      accessorKey: "email",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          이메일
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    // 역할 컬럼: 배지 스타일로 표시
    {
      accessorKey: "role_name",
      header: "역할",
      cell: ({ row }) => (
        <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
          {row.getValue("role_name")}
        </div>
      ),
    },
    // 시스템 사용자 여부: 예/아니오 배지
    {
      accessorKey: "is_system_user",
      header: "시스템 사용자",
      cell: ({ row }) => {
        const isSystemUser = row.getValue("is_system_user");
        return (
          <div className="inline-block px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
            {isSystemUser ? "예" : "아니오"}
          </div>
        );
      },
    },
    // 활성 상태: 아이콘 + 텍스트
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
    // 로그인 실패 횟수 및 계정 잠금 상태
    {
      accessorKey: "failed_login_attempts",
      header: "로그인 실패",
      cell: ({ row }) => {
        const attempts = row.getValue("failed_login_attempts") as number;
        const lockedUntil = row.original.locked_until;
        const isLocked = lockedUntil && new Date(lockedUntil) > new Date();

        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{attempts}</span>
            {isLocked && (
              <span className="inline-block px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
                잠금
              </span>
            )}
          </div>
        );
      },
    },
    // 마지막 로그인: 일시 + IP 주소
    {
      accessorKey: "last_login_at",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => column.toggleSorting()}
        >
          마지막 로그인
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const loginAt = row.getValue("last_login_at") as string | undefined;
        const loginIp = row.original.last_login_ip;
        return (
          <div className="space-y-1">
            <div className="text-sm">{formatDateTime(loginAt)}</div>
            {loginIp && (
              <div className="text-xs text-muted-foreground">{loginIp}</div>
            )}
          </div>
        );
      },
    },
    // 생성일시: 일시만 표시
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
        return (
          <div className="text-sm">{formatDateTime(createdAt)}</div>
        );
      },
    },
    // 수정일시: 일시만 표시
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
        return (
          <div className="text-sm">{formatDateTime(updatedAt)}</div>
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
            onClick={() => onEditUser(row.original)}
            title="편집"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {/* 삭제 버튼 */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => onDeleteUser(row.original)}
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
 * UsersTable 컴포넌트 Props 인터페이스
 */
interface UsersTableProps {
  /**
   * 표시할 사용자 데이터 배열
   * 
   * @description
   * - 필터링, 정렬, 페이지네이션이 적용된 최종 데이터
   * - User[] 타입의 배열
   */
  data: User[];
  
  /**
   * 전체 데이터 수 (페이지네이션 계산용)
   */
  totalItems: number;
  
  /**
   * 사용자 수정 버튼 클릭 핸들러
   * 
   * @param user - 수정할 사용자 객체
   */
  onEdit: (user: User) => void;
  
  /**
   * 사용자 삭제 버튼 클릭 핸들러
   * 
   * @param user - 삭제할 사용자 객체
   */
  onDelete: (user: User) => void;
}

/**
 * 사용자 관리 데이터 테이블 컴포넌트
 * 
 * @description
 * - 공통 DataTable 컴포넌트를 래핑하여 사용자 목록 표시
 * - useUserStore와 연동하여 정렬 및 페이지네이션 상태 관리
 * - TanStack Table 기반 고급 테이블 기능 제공
 * - 테이블 하단에 페이지네이션 컨트롤 통합
 * 
 * @features
 * - 컬럼별 정렬 (오름차순/내림차순)
 * - 행별 수정/삭제 액션
 * - 정렬 상태 persist (Zustand store)
 * - 페이지네이션 (페이지 이동, 페이지 크기 변경)
 * 
 * @example
 * ```tsx
 * <UsersTable
 *   data={filteredUsers}
 *   totalItems={100}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function UsersTable({ data, totalItems, onEdit, onDelete }: UsersTableProps) {
  // Zustand 스토어에서 정렬 및 페이지네이션 상태 가져오기
  const { 
    sorting, 
    setSorting,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  } = useUserStore();

  /**
   * 사용자 수정 핸들러
   * 
   * @description 부모 컴포넌트로 수정 이벤트 전달
   */
  const handleEditUser = (user: User) => {
    onEdit(user);
  };

  /**
   * 사용자 삭제 핸들러
   * 
   * @description 부모 컴포넌트로 삭제 이벤트 전달
   */
  const handleDeleteUser = (user: User) => {
    onDelete(user);
  };

  const columns = createUsersColumns(handleEditUser, handleDeleteUser);

  return (
    <div className="space-y-4">
      {/* 데이터 테이블 */}
      <DataTable
        columns={columns}
        data={data}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="데이터가 없습니다."
      />

      {/* 페이지네이션 */}
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        itemsPerPageOptions={[10, 20, 30, 40, 50]}
        showInfo={true}
      />
    </div>
  );
}
