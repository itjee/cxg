"use client";

/**
 * @file workflows-edit.tsx
 * @description 워크플로우 생성/수정 Drawer 컨테이너 컴포넌트
 * 
 * 워크플로우 생성 및 수정 Drawer를 관리하는 Container Component
 * - Drawer 상태 관리 (열기/닫기)
 * - 데이터 로딩 (수정 모드)
 * - 폼 제출 처리 (생성/수정 mutation)
 * - WorkflowsForm (Presentational) 컴포넌트 래핑
 * 
 * @component
 * - Container Component (비즈니스 로직 포함)
 * - 상태: useWorkflowsStore (Drawer 상태)
 * - 데이터: useWorkflow, useCreateWorkflow, useUpdateWorkflow (React Query)
 */

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkflowsForm } from "./workflows-form";
import { useWorkflowsStore } from "../stores";
import { useWorkflow, useCreateWorkflow, useUpdateWorkflow } from "../hooks";
import type { CreateWorkflowsRequest, UpdateWorkflowsRequest } from "../types";

/**
 * 워크플로우 생성/수정 Drawer 컴포넌트
 * 
 * @description
 * Dialog를 사용하여 워크플로우 폼을 표시하고 제출을 처리하는 컨테이너
 * - 생성 모드: editingId === null
 * - 수정 모드: editingId !== null
 */
export function WorkflowsEdit() {
  // ============================================================
  // 1. Zustand 상태 관리
  // ============================================================
  
  /**
   * Drawer 상태 및 액션
   * - formOpen: Drawer 열림/닫힘 상태
   * - editingId: 수정할 워크플로우 ID (null이면 생성 모드)
   * - closeForm: Drawer 닫기 함수
   */
  const { formOpen, editingId, closeForm } = useWorkflowsStore();
  
  // ============================================================
  // 2. 데이터 조회 (수정 모드)
  // ============================================================
  
  /**
   * 수정할 워크플로우 데이터 조회
   * 
   * @description
   * - editingId가 null이면 쿼리 비활성화 (enabled: false)
   * - editingId가 있으면 해당 워크플로우 상세 조회
   * - 조회된 데이터는 폼의 initialData로 전달됨
   */
  const { data: editingWorkflow } = useWorkflow(editingId);

  // ============================================================
  // 3. Mutation 설정 (생성/수정)
  // ============================================================
  
  /**
   * 워크플로우 생성 Mutation
   * 
   * @description
   * - onSuccess: 성공 토스트 + Drawer 닫기
   * - onError: 에러 토스트 + 콘솔 로그
   * - Optimistic Update: 목록에 임시 데이터 추가 (hooks에서 처리)
   */
  const createMutation = useCreateWorkflow({
    onSuccess: () => {
      toast.success('워크플로우가 생성되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '워크플로우 생성에 실패했습니다');
      console.error('Failed to create workflow:', error);
    },
  });

  /**
   * 워크플로우 수정 Mutation
   * 
   * @description
   * - onSuccess: 성공 토스트 + Drawer 닫기
   * - onError: 에러 토스트 + 콘솔 로그
   * - Optimistic Update: 목록 + 상세 데이터 즉시 업데이트 (hooks에서 처리)
   */
  const updateMutation = useUpdateWorkflow({
    onSuccess: () => {
      toast.success('워크플로우가 수정되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '워크플로우 수정에 실패했습니다');
      console.error('Failed to update workflow:', error);
    },
  });
  
  /**
   * 로딩 상태 통합
   * 
   * @description
   * - 생성 또는 수정 중인지 확인
   * - 로딩 중일 때 폼 제출 버튼 비활성화
   */
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // ============================================================
  // 4. 폼 제출 핸들러
  // ============================================================
  
  /**
   * 폼 제출 핸들러
   * 
   * @description
   * 생성 모드와 수정 모드를 구분하여 적절한 mutation 실행
   * - editingId가 있으면: 수정 mutation
   * - editingId가 없으면: 생성 mutation
   */
  const handleSubmit = (formData: CreateWorkflowsRequest | UpdateWorkflowsRequest) => {
    if (editingId) {
      // 수정 모드: 기존 워크플로우 업데이트
      updateMutation.mutate({ 
        id: editingId, 
        data: formData as UpdateWorkflowsRequest 
      });
    } else {
      // 생성 모드: 새 워크플로우 생성
      createMutation.mutate(formData as CreateWorkflowsRequest);
    }
  };

  /**
   * 초기 데이터 변환
   * 
   * @description
   * editingWorkflow를 폼에서 사용할 수 있는 형태로 변환
   * - 수정 모드일 때만 데이터 전달
   * - 생성 모드일 때는 undefined
   */
  const initialData = editingWorkflow
    ? {
        name: editingWorkflow.name,
        description: editingWorkflow.description || "",
        is_active: editingWorkflow.is_active,
      }
    : undefined;

  // ============================================================
  // 5. UI 렌더링
  // ============================================================

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingId ? "워크플로우 수정" : "워크플로우 생성"}
          </DialogTitle>
          <DialogDescription>
            {editingId
              ? "워크플로우 정보를 수정하세요."
              : "새로운 워크플로우를 생성하세요."}
          </DialogDescription>
        </DialogHeader>

        {/* 워크플로우 폼 (Presentational Component) */}
        <WorkflowsForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
