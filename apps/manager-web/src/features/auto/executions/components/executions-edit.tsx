"use client";

/**
 * @file executions-edit.tsx
 * @description 실행 이력 상세 보기 모달
 * 
 * 역할:
 * - 상세 보기 UI (모달)
 * - form 컴포넌트 통합
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExecutionsStore } from "../stores";
import { useExecution } from "../hooks";
import { ExecutionsForm } from "./executions-form";

export function ExecutionsEdit() {
  const { editingId, closeForm } = useExecutionsStore();
  const { data: execution, isLoading } = useExecution(editingId);

  if (!editingId) return null;

  return (
    <Dialog open={!!editingId} onOpenChange={closeForm}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>실행 이력 상세</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            로딩 중...
          </div>
        ) : (
          <ExecutionsForm
            initialData={execution}
            onCancel={closeForm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
