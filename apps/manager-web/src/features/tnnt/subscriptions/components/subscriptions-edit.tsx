"use client";

/**
 * @file subscriptions-edit.tsx
 * @description 구독 수정 모달 컴포넌트
 *
 * 역할:
 * - 수정 UI (모달)
 * - form 컴포넌트 통합
 * - mutation 호출
 * - 성공/실패 처리
 */

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscriptionsStore } from "../stores/subscriptions.store";
import {
  useSubscription,
  useCreateSubscription,
  useUpdateSubscription,
} from "../hooks/use-subscriptions";
import { SubscriptionsForm } from "./subscriptions-form";
import type { CreateSubscriptionRequest } from "../types/subscriptions.types";

export function SubscriptionsEdit() {
  const { formOpen, selectedId, closeForm } = useSubscriptionsStore();
  const { data: subscription, isLoading } = useSubscription(selectedId || "");

  const createMutation = useCreateSubscription({
    onSuccess: () => {
      toast.success("구독이 생성되었습니다");
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || "생성 실패");
    },
  });

  const updateMutation = useUpdateSubscription({
    onSuccess: () => {
      toast.success("구독이 수정되었습니다");
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || "수정 실패");
    },
  });

  const handleSubmit = (data: CreateSubscriptionRequest) => {
    if (selectedId) {
      updateMutation.mutate({
        id: selectedId,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  if (!formOpen) return null;
  if (selectedId && isLoading) {
    return (
      <Dialog open={true} onOpenChange={closeForm}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedId ? "구독 수정" : "구독 추가"}
          </DialogTitle>
        </DialogHeader>
        <SubscriptionsForm
          initialData={subscription}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
