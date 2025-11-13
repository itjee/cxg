'use client';

/**
 * @file login-logs-edit.tsx
 * @description 로그인 이력 편집 모달 컴포넌트
 * 
 * 로그인 이력은 일반적으로 읽기 전용이므로 편집 기능은 제한적입니다.
 * 이 컴포넌트는 프론트엔드 가이드라인 준수를 위해 포함되었습니다.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface LoginLogsEditProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginLogsEdit({ isOpen, onClose }: LoginLogsEditProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그인 이력 편집</DialogTitle>
        </DialogHeader>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            로그인 이력은 보안 감사용 데이터로 일반적으로 편집할 수 없습니다.
            이력 조회는 상세 보기를 이용해주세요.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}
