import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePoliciesStore } from "../stores/policies.store";
import { usePolicy, useCreatePolicy } from "../hooks/use-policies";
import { PoliciesForm } from "./policies-form";
import { toast } from "sonner";

export function PoliciesEdit() {
  const { formOpen, editingId, closeForm } = usePoliciesStore();
  const { data: policy, isLoading } = usePolicy(editingId);

  const createMutation = useCreatePolicy({
    onSuccess: () => {
      toast.success("정책이 생성되었습니다");
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || "생성 실패");
    },
  });

  if (!formOpen) return null;
  if (editingId && isLoading) return <div>로딩 중...</div>;

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingId ? "정책 수정" : "정책 생성"}
          </DialogTitle>
        </DialogHeader>
        <PoliciesForm
          initialData={policy}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={closeForm}
          isSubmitting={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
