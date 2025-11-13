"use client";

/**
 * @file tasks-edit.tsx
 * @description 스케줄된 작업 수정 모달
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTasksStore } from "../stores";
import { useTask, useUpdateTask, useCreateTask } from "../hooks";
import { TasksForm } from "./tasks-form";
import { toast } from "sonner";

export function TasksEdit() {
  const { editingId, closeForm } = useTasksStore();
  const { data: task, isLoading } = useTask(editingId);

  const createMutation = useCreateTask({
    onSuccess: () => {
      toast.success("작업이 생성되었습니다");
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || "작업 생성에 실패했습니다");
    },
  });

  const updateMutation = useUpdateTask({
    onSuccess: () => {
      toast.success("작업이 수정되었습니다");
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || "작업 수정에 실패했습니다");
    },
  });

  if (!editingId && editingId !== null) return null;

  const isNew = editingId === null;

  return (
    <Dialog open={editingId !== undefined} onOpenChange={closeForm}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "스케줄된 작업 추가" : "스케줄된 작업 수정"}
          </DialogTitle>
        </DialogHeader>
        {isLoading && !isNew ? (
          <div className="p-4 text-center text-muted-foreground">
            로딩 중...
          </div>
        ) : (
          <TasksForm
            initialData={task}
            onSubmit={(data) => {
              if (isNew) {
                createMutation.mutate(data);
              } else {
                updateMutation.mutate({ id: editingId!, data });
              }
            }}
            onCancel={closeForm}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
