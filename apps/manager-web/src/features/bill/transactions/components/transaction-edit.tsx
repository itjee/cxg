"use client";

import { EntityDrawer } from "@/components/features";
import { TransactionForm } from "./transaction-form";
import { useTransactionStore } from "../stores";
import { useTransaction, useUpdateTransaction } from "../hooks";

export function TransactionEdit() {
  const { formOpen, editingId, closeForm } = useTransactionStore();
  const { data: transaction } = useTransaction(editingId);
  const updateMutation = useUpdateTransaction(editingId || "");

  const isLoading = updateMutation.isPending;

  const handleSubmit = (formData: any) => {
    if (editingId) {
      updateMutation.mutate(formData, {
        onSuccess: () => closeForm(),
      });
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? "거래 수정" : "거래 생성"}
      description={
        editingId ? "거래 정보를 수정하세요." : "새로운 거래를 생성하세요."
      }
      width="md"
    >
      <TransactionForm
        initialData={transaction}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
