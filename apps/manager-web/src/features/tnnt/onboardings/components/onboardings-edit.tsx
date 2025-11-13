/**
 * @file onboardings-edit.tsx
 * @description 온보딩 프로세스 수정 모달
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOnboardingsStore } from '../stores';
import { useOnboardingById, useUpdateOnboarding } from '../hooks';
import { OnboardingsForm } from './onboardings-form';
import { toast } from 'sonner';

export function OnboardingsEdit() {
  const { formOpen, selectedId, closeForm } = useOnboardingsStore();
  const { data: onboarding, isLoading } = useOnboardingById(selectedId || '');

  const updateMutation = useUpdateOnboarding({
    onSuccess: () => {
      toast.success('온보딩 정보가 수정되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '수정 실패');
    },
  });

  if (!formOpen || !selectedId) return null;
  if (isLoading) return null;

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>온보딩 프로세스 수정</DialogTitle>
        </DialogHeader>
        {onboarding && (
          <OnboardingsForm
            initialData={onboarding}
            onSubmit={(data) =>
              updateMutation.mutate({ id: selectedId, data })
            }
            onCancel={closeForm}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
