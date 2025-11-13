/**
 * @file page.tsx
 * @description 스케줄된 작업 관리 페이지
 * 
 * 정기적으로 실행되는 시스템 작업을 관리하는 페이지
 * 클라이언트 사이드 페이징 및 필터링을 통해 작업을 관리
 * 
 * @features
 * - 클라이언트 사이드 페이징: DataTable 내부에서 처리
 * - 실시간 필터링: 작업 유형, 활성 상태, 마지막 실행 상태 기준
 * - CRUD 작업: 작업 생성, 조회, 수정, 삭제
 * - 작업 제어: 활성화/비활성화, 즉시 실행
 * - 통계 대시보드: 전체/활성/실행횟수/성공률 현황
 * 
 * @architecture
 * ```
 * TasksPage (Container)
 *   ├─ useTasksStore (Zustand): UI 상태 관리 (정렬, 모달)
 *   ├─ useTasks (TanStack Query): 서버 데이터 조회 및 캐싱
 *   ├─ useDeleteTask (TanStack Query): 삭제 mutation
 *   ├─ useUpdateTask (TanStack Query): 활성/비활성 toggle
 *   ├─ useRunTaskNow (TanStack Query): 즉시 실행
 *   └─ Components
 *       ├─ TasksHeader: 페이지 제목 및 액션 버튼
 *       ├─ TasksStats: 작업 통계 카드
 *       ├─ TasksFilters: 검색 및 필터 UI
 *       ├─ TasksTable: 데이터 테이블 + 페이지네이션 (통합)
 *       └─ TasksEdit: 생성/수정 모달 폼
 * ```
 */

'use client';

import { toast } from 'sonner';
import {
  TasksHeader,
  TasksStats,
  TasksFilters,
  TasksTable,
  TasksEdit,
} from '@/features/auto/tasks';
import {
  useTasks,
  useDeleteTask,
  useUpdateTask,
  useRunTaskNow,
} from '@/features/auto/tasks/hooks';
import { useTasksStore } from '@/features/auto/tasks/stores';

/**
 * 스케줄된 작업 관리 페이지 컴포넌트
 * 
 * @description
 * 정기적으로 실행되는 시스템 작업의 전체 생명주기를 관리하는 메인 페이지
 * - Zustand로 UI 상태(정렬, 모달) 관리
 * - TanStack Query로 서버 데이터 관리 및 캐싱
 * - DataTable 내부에서 클라이언트 사이드 페이징 처리
 */
export default function TasksPage() {
  /**
   * Zustand 스토어에서 UI 상태 가져오기
   */
  const { openForm } = useTasksStore();

  /**
   * 스케줄된 작업 목록 조회
   * 
   * @hook useTasks
   * @returns
   * - data: 작업 목록 및 메타데이터
   * - isLoading: 로딩 상태
   * - error: 에러 객체
   * - refetch: 수동 재조회 함수
   */
  const { data: tasksResponse, isLoading, error, refetch } = useTasks();

  /**
   * 작업 삭제 mutation
   */
  const deleteTaskMutation = useDeleteTask({
    onSuccess: () => {
      toast.success('작업이 삭제되었습니다');
    },
    onError: (error) => {
      toast.error(error.message || '작업 삭제에 실패했습니다');
    },
  });

  /**
   * 작업 활성/비활성 토글 mutation
   */
  const updateTaskMutation = useUpdateTask({
    onSuccess: (task) => {
      toast.success(
        task.enabled
          ? '작업이 활성화되었습니다'
          : '작업이 비활성화되었습니다'
      );
    },
    onError: (error) => {
      toast.error(error.message || '작업 상태 변경에 실패했습니다');
    },
  });

  /**
   * 작업 즉시 실행 mutation
   */
  const runTaskNowMutation = useRunTaskNow({
    onSuccess: () => {
      toast.success('작업이 실행되었습니다');
    },
    onError: (error) => {
      toast.error(error.message || '작업 실행에 실패했습니다');
    },
  });

  /**
   * 응답 데이터 안전하게 추출
   */
  const tasks = tasksResponse?.items || [];

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
   * 작업 활성/비활성 토글 핸들러
   */
  const handleToggle = (task: any) => {
    updateTaskMutation.mutate({
      id: task.id,
      data: { enabled: !task.enabled },
    });
  };

  /**
   * 작업 즉시 실행 핸들러
   */
  const handleRunNow = (task: any) => {
    if (confirm(`'${task.task_name}' 작업을 지금 실행하시겠습니까?`)) {
      runTaskNowMutation.mutate(task.id);
    }
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
          스케줄된 작업을 불러오는데 실패했습니다
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
      <TasksHeader onRefresh={handleRefresh} onExport={handleExport} />

      {/* 통계 카드: 작업 현황 요약 */}
      <TasksStats tasks={tasks} />

      {/* 검색 및 필터 UI */}
      <TasksFilters data={tasks} />

      {/* 데이터 테이블: 작업 목록, 필터, 페이지네이션 통합 */}
      <TasksTable
        data={tasks}
        onEdit={(task) => openForm(task.id)}
        onDelete={(task) => {
          if (confirm(`'${task.task_name}' 작업을 삭제하시겠습니까?`)) {
            deleteTaskMutation.mutate(task.id);
          }
        }}
        onToggle={handleToggle}
        onRunNow={handleRunNow}
      />

      {/* 생성/수정 모달: 전역 상태(formOpen)로 제어 */}
      <TasksEdit />
    </div>
  );
}
