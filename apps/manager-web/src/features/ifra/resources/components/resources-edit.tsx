"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useResourcesStore } from "../stores";
import { useResource, useUpdateResource } from "../hooks";
import { ResourcesForm } from "./resources-form";

export function ResourcesEdit() {
  const { editingId, closeForm } = useResourcesStore();
  const { data: resource, isLoading } = useResource(editingId!);
  const { mutate: updateResource, isPending } = useUpdateResource(
    editingId || "",
    {
      onSuccess: () => {
        toast.success("리소스가 수정되었습니다");
        closeForm();
      },
      onError: (error) => {
        toast.error(error.message || "수정 실패");
      },
    }
  );

  if (!editingId) return null;

  const handleSubmit = (data: any) => {
    updateResource(data);
  };

  return (
    <Dialog open={!!editingId} onOpenChange={closeForm}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>리소스 수정</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">로딩 중...</div>
        ) : (
          <ResourcesForm
            initialData={resource}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
