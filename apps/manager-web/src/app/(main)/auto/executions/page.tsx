/**
 * @file page.tsx
 * @description 워크플로우 실행 이력 관리 페이지
 * 
 * 워크플로우 실행 이력을 조회하고 관리하는 페이지
 * 클라이언트 사이드 페이징 및 필터링을 통해 실행 이력을 관리
 * 
 * @features
 * - 클라이언트 사이드 페이징: DataTable 내부에서 처리
 * - 실시간 필터링: 상태, 트리거 소스 기준 필터링
 * - 조회 작업: 실행 이력 조회 및 상세 보기
 * - 통계 대시보드: 전체/완료/실패/실행중 현황
 * 
 * @architecture
 * ```
 * ExecutionsPage (Container)
 *   ├─ useExecutionsStore (Zustand): UI 상태 관리 (정렬, 모달)
 *   ├─ useExecutions (TanStack Query): 서버 데이터 조회 및 캐싱
 *   └─ Components
 *       ├─ ExecutionsHeader: 페이지 제목 및 액션 버튼
 *       ├─ ExecutionsStats: 실행 이력 통계 카드
 *       ├─ ExecutionsFilters: 검색 및 필터 UI
 *       ├─ ExecutionsTable: 데이터 테이블 + 페이지네이션 (통합)
 *       └─ ExecutionsEdit: 상세 보기 모달
 * ```
 */

'use client';

import { toast } from 'sonner';
import {
  ExecutionsHeader,
  ExecutionsStats,
  ExecutionsFilters,
  ExecutionsTable,
  ExecutionsEdit,
} from '@/features/auto/executions';
import { useExecutions } from '@/features/auto/executions/hooks';
import { useExecutionsStore } from '@/features/auto/executions/stores';

/**
 * 실행 이력 관리 페이지 컴포넌트
 * 
 * @description
 * 워크플로우 실행 이력의 조회 및 모니터링을 담당하는 메인 페이지
 * - Zustand로 UI 상태(정렬, 모달, 필터) 관리
 * - TanStack Query로 서버 데이터 관리 및 캐싱
 * - DataTable 내부에서 클라이언트 사이드 페이징 처리
 */
export default function ExecutionsPage() {
  /**
   * Zustand 스토어에서 UI 상태 가져오기
   */
  const { openForm } = useExecutionsStore();

  /**
   * 실행 이력 목록 조회
   * 
   * @hook useExecutions
   * @returns
   * - data: 실행 이력 목록 및 메타데이터
   * - isLoading: 로딩 상태
   * - error: 에러 객체
   * - refetch: 수동 재조회 함수
   */
  const { data: executionsResponse, isLoading, error, refetch } = useExecutions();

  /**
   * 응답 데이터 안전하게 추출
   */
  const executions = executionsResponse?.items || [];

  /**
   * 데이터 새로고침 핸들러
   */
  const handleRefresh = () => refetch();

  /**
   * 데이터 내보내기 핸들러
   */
  const handleExport = () => {
    toast.info('내보내기 기능은 준비 중입니다');
  };

  /**
   * 로딩 상태 처리
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  /**
   * 에러 상태 처리
   */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-red-500">
          실행 이력을 불러오는데 실패했습니다
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  /**
   * 페이지 레이아웃 렌더링
   */
  return (
    <div className="space-y-6">
      {/* 페이지 헤더: 제목 및 주요 액션 버튼 */}
      <ExecutionsHeader 
        onRefresh={handleRefresh} 
        onExport={handleExport}
      />

      {/* 통계 카드: 실행 이력 현황 요약 */}
      <ExecutionsStats executions={executions} />

      {/* 검색 및 필터 UI */}
      <ExecutionsFilters data={executions} />

      {/* 데이터 테이블: 실행 이력 목록 + 페이지네이션 통합 */}
      <ExecutionsTable
        data={executions}
        onViewDetails={(execution) => openForm(execution.id)}
      />

      {/* 상세 보기 모달: 전역 상태(formOpen)로 제어 */}
      <ExecutionsEdit />
    </div>
  );
}
