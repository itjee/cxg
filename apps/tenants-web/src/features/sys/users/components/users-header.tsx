"use client";

/**
 * @file users-header.tsx
 * @description 사용자 관리 페이지 헤더 컴포넌트
 *
 * 페이지 제목, 설명 및 주요 액션 버튼을 표시하는 헤더 컴포넌트
 * - ListPageHeader 공통 컴포넌트 래핑
 * - 일관된 UI/UX 제공
 * - 주요 액션: 새로고침, 사용자 추가, 데이터 내보내기
 *
 * @component
 * - Presentational Component (UI만 담당)
 * - 상태 관리: useUserStore (모달 열기)
 * - 비즈니스 로직: 부모 컴포넌트에서 전달
 *
 * @example
 * ```tsx
 * <UsersHeader
 *   onRefresh={handleRefresh}
 *   onExport={handleExport}
 * />
 * ```
 */

import { Plus, RefreshCw, Download } from "lucide-react";
import { ListPageHeader } from "@/components/layouts/list-page-header";
import { useUserStore } from "../stores";

/**
 * UsersHeader Props 인터페이스
 *
 * @interface UsersHeaderProps
 * @property {() => void} onRefresh - 새로고침 버튼 클릭 핸들러
 * @property {() => void} onExport - 내보내기 버튼 클릭 핸들러 (선택적)
 */
interface UsersHeaderProps {
  /** 새로고침 버튼 클릭 시 호출 (데이터 재조회) */
  onRefresh?: () => void;

  /** 내보내기 버튼 클릭 시 호출 (Excel/CSV 다운로드) */
  onExport?: () => void;
}

/**
 * 사용자 관리 페이지 헤더 컴포넌트
 *
 * @description
 * 페이지 최상단에 위치하는 헤더 영역
 * - 왼쪽: 제목 + 설명
 * - 오른쪽: 액션 버튼들 (새로고침, 추가, 내보내기)
 *
 * @features
 * - 새로고침: 사용자 목록 재조회
 * - 사용자 추가: 생성 모달 열기 (useUserStore.openForm)
 * - 내보내기: Excel/CSV 다운로드 (미구현 시 버튼 숨김)
 *
 * @state
 * - openForm: Zustand store에서 가져옴 (모달 열기 함수)
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <UsersHeader onRefresh={() => refetch()} />
 *
 * // 내보내기 기능 포함
 * <UsersHeader
 *   onRefresh={() => refetch()}
 *   onExport={() => exportToExcel(users)}
 * />
 * ```
 *
 * @param props - UsersHeaderProps
 * @returns JSX.Element
 *
 * - 새로고침, 사용자 추가, 내보내기 액션 버튼 제공
 * - 사용자 추가 버튼 클릭 시 useUserStore의 openForm 호출하여 폼 모달 오픈
 *
 * @example
 * ```tsx
 * <UsersHeader
 *   onRefresh={handleRefresh}
 *   onExport={handleExport}
 * />
 * ```
 */
export function UsersHeader({ onRefresh, onExport }: UsersHeaderProps) {
  // Zustand 스토어에서 폼 열기 함수 가져오기
  const { openForm } = useUserStore();

  return (
    <ListPageHeader
      title="사용자 관리"
      description="시스템 사용자 계정을 관리합니다"
      actions={[
        {
          label: "새로고침",
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: "outline",
        },
        {
          label: "사용자 추가",
          icon: Plus,
          onClick: () => openForm(),
          variant: "default",
        },
        {
          label: "내보내기",
          icon: Download,
          onClick: () => onExport?.(),
          variant: "outline",
        },
      ]}
    />
  );
}
