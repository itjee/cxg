/**
 * @file page.tsx
 * @description 워크플로우 관리 페이지
 * 
 * 자동화 워크플로우를 조회, 생성, 수정, 삭제할 수 있는 관리 페이지
 * 클라이언트 사이드 페이징 및 필터링을 통해 워크플로우를 관리
 * 
 * @features
 * - 클라이언트 사이드 페이징: DataTable 내부에서 처리
 * - 실시간 필터링: 상태, 검색어 기준 필터링
 * - CRUD 작업: 워크플로우 생성, 조회, 수정, 삭제
 * - 통계 대시보드: 전체/활성/비활성 워크플로우 현황
 * 
 * @architecture
 * ```
 * WorkflowsPage (Container)
 *   ├─ useWorkflowsStore (Zustand): UI 상태 관리 (정렬, 모달)
 *   ├─ useWorkflows (TanStack Query): 서버 데이터 조회 및 캐싱
 *   ├─ useDeleteWorkflow (TanStack Query): 삭제 mutation
 *   └─ Components
 *       ├─ WorkflowsHeader: 페이지 제목 및 액션 버튼
 *       ├─ WorkflowsStats: 워크플로우 통계 카드
 *       ├─ WorkflowsTable: 데이터 테이블 + 필터 + 페이지네이션 (통합)
 *       └─ WorkflowsEdit: 생성/수정 모달 폼
 * ```
 */

'use client';

import { toast } from 'sonner';
import {
  WorkflowsHeader,
  WorkflowsStats,
  WorkflowsTable,
  WorkflowsEdit,
} from '@/features/auto/workflows';
import { 
  useWorkflows, 
  useDeleteWorkflow,
  useUpdateWorkflow,
} from '@/features/auto/workflows/hooks';
import { useWorkflowsStore } from '@/features/auto/workflows/stores';

/**
 * 워크플로우 관리 페이지 컴포넌트
 * 
 * @description
 * 자동화 워크플로우의 전체 생명주기를 관리하는 메인 페이지
 * - Zustand로 UI 상태(정렬, 모달) 관리
 * - TanStack Query로 서버 데이터 관리 및 캐싱
 * - DataTable 내부에서 클라이언트 사이드 페이징 처리
 */
export default function WorkflowsPage() {
  /**
   * Zustand 스토어에서 UI 상태 가져오기
   */
  const { openForm } = useWorkflowsStore();

  /**
   * 워크플로우 목록 조회
   * 
   * @hook useWorkflows
   * @returns
   * - data: 워크플로우 목록 및 메타데이터
   * - isLoading: 로딩 상태
   * - error: 에러 객체
   * - refetch: 수동 재조회 함수
   */
  const { data: workflowsResponse, isLoading, error, refetch } = useWorkflows();

  /**
   * 워크플로우 삭제 mutation
   */
  const deleteWorkflowMutation = useDeleteWorkflow({
    onSuccess: () => {
      toast.success('워크플로우가 삭제되었습니다');
    },
    onError: (error) => {
      toast.error(error.message || '워크플로우 삭제에 실패했습니다');
    },
  });

  /**
   * 워크플로우 활성/비활성 토글 mutation
   */
  const updateWorkflowMutation = useUpdateWorkflow({
    onSuccess: (workflow) => {
      toast.success(
        workflow.is_active
          ? '워크플로우가 활성화되었습니다'
          : '워크플로우가 비활성화되었습니다'
      );
    },
    onError: (error) => {
      toast.error(error.message || '워크플로우 상태 변경에 실패했습니다');
    },
  });

  /**
   * 응답 데이터 안전하게 추출
   */
  const workflows = workflowsResponse?.items || [];

  /**
   * 데이터 새로고침 핸들러
   */
  const handleRefresh = () => refetch();

  /**
   * 워크플로우 활성/비활성 토글 핸들러
   */
  const handleToggle = (workflow: any) => {
    updateWorkflowMutation.mutate({
      id: workflow.id,
      data: { is_active: !workflow.is_active },
    });
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
          워크플로우를 불러오는데 실패했습니다
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
      <WorkflowsHeader onRefresh={handleRefresh} />

      {/* 통계 카드: 워크플로우 현황 요약 */}
      <WorkflowsStats workflows={workflows} />

      {/* 데이터 테이블: 워크플로우 목록, 필터, 페이지네이션 통합 */}
      <WorkflowsTable
        data={workflows}
        onEdit={(workflow) => openForm(workflow.id)}
        onDelete={(workflow) => {
          if (confirm(`'${workflow.name}' 워크플로우를 삭제하시겠습니까?`)) {
            deleteWorkflowMutation.mutate(workflow.id);
          }
        }}
        onToggle={handleToggle}
      />

      {/* 생성/수정 모달: 전역 상태(formOpen)로 제어 */}
      <WorkflowsEdit />
    </div>
  );
}
