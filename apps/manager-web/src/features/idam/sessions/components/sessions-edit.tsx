'use client';

/**
 * @file sessions-edit.tsx
 * @description 세션 수정 모달 컴포넌트
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSessionsStore } from '../stores';
import { useSession, useUpdateSession } from '../hooks';
import { SessionsForm } from './sessions-form';
import { toast } from 'sonner';

export function SessionsEdit() {
  const { selectedId, closeForm } = useSessionsStore();
  const { data: sessionResponse, isLoading } = useSession(selectedId);

  const updateMutation = useUpdateSession();

  if (!selectedId) return null;

  const session = sessionResponse?.data;

  if (isLoading) {
    return (
      <Dialog open={!!selectedId} onOpenChange={closeForm}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!session) {
    return (
      <Dialog open={!!selectedId} onOpenChange={closeForm}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-destructive">세션을 찾을 수 없습니다</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={!!selectedId} onOpenChange={closeForm}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>세션 수정</DialogTitle>
        </DialogHeader>
        <SessionsForm
          initialData={session}
          onSubmit={(data) => {
            updateMutation.mutate(
              { id: selectedId, data },
              {
                onSuccess: () => {
                  toast.success('세션이 수정되었습니다');
                  closeForm();
                },
                onError: (error) => {
                  toast.error(error.message || '세션 수정 실패');
                },
              }
            );
          }}
          onCancel={closeForm}
          isLoading={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
