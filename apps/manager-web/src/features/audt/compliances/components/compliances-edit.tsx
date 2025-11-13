import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompliancesStore } from "../stores/compliances.store";
import { useCompliance, useCreateCompliance } from "../hooks/use-compliances";
import { CompliancesForm } from "./compliances-form";
import { toast } from "sonner";

export function CompliancesEdit() {
  const { formOpen, editingId, closeForm } = useCompliancesStore();
  const { data: compliance, isLoading } = useCompliance(editingId);

  const createMutation = useCreateCompliance({
    onSuccess: () => {
      toast.success("보고서가 생성되었습니다");
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingId ? "보고서 수정" : "보고서 생성"}
          </DialogTitle>
        </DialogHeader>
        <CompliancesForm
          initialData={compliance}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={closeForm}
          isSubmitting={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
