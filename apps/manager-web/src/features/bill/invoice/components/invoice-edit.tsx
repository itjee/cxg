"use client";

import { FormDrawer } from "@/components/features";
import { InvoiceForm } from "./invoice-form";
import { useInvoiceStore } from "../stores";
import { useInvoice, useCreateInvoice, useUpdateInvoice } from "../hooks";

export function InvoiceEdit() {
  const { formOpen, editingId, closeForm } = useInvoiceStore();
  const { data: invoice } = useInvoice(editingId);
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice(editingId || '');

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (formData: any) => {
    if (editingId) {
      updateMutation.mutate(formData, {
        onSuccess: () => closeForm(),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => closeForm(),
      });
    }
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? '청구서 수정' : '청구서 생성'}
      description={
        editingId ? '청구서 정보를 수정하세요.' : '새로운 청구서를 생성하세요.'
      }
      width="md"
    >
      <InvoiceForm
        initialData={invoice?.data}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </FormDrawer>
  );
}
