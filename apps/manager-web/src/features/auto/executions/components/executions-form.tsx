"use client";

/**
 * @file executions-form.tsx
 * @description 실행 이력 폼 (현재는 조회 전용)
 * 
 * 역할:
 * - 실행 이력 상세 정보 표시
 * - 향후 재실행 등의 기능 추가 가능
 */

import { Button } from "@/components/ui/button";
import type { Execution } from "../types";

interface ExecutionsFormProps {
  initialData?: Execution;
  onCancel: () => void;
}

export function ExecutionsForm({
  initialData,
  onCancel,
}: ExecutionsFormProps) {
  if (!initialData) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        실행 이력 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">실행 ID</label>
          <p className="text-sm text-muted-foreground">{initialData.execution_id}</p>
        </div>
        <div>
          <label className="text-sm font-medium">상태</label>
          <p className="text-sm text-muted-foreground">{initialData.status}</p>
        </div>
        <div>
          <label className="text-sm font-medium">트리거 소스</label>
          <p className="text-sm text-muted-foreground">{initialData.trigger_source || '-'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">트리거 실행자</label>
          <p className="text-sm text-muted-foreground">{initialData.triggered_by || '-'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">시작 시간</label>
          <p className="text-sm text-muted-foreground">{initialData.started_at || '-'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">완료 시간</label>
          <p className="text-sm text-muted-foreground">{initialData.completed_at || '-'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">실행 시간</label>
          <p className="text-sm text-muted-foreground">
            {initialData.duration ? `${initialData.duration}초` : '-'}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">재시도 횟수</label>
          <p className="text-sm text-muted-foreground">{initialData.retry_count}</p>
        </div>
      </div>

      {initialData.error_message && (
        <div>
          <label className="text-sm font-medium text-destructive">에러 메시지</label>
          <p className="text-sm text-destructive bg-destructive/10 p-2 rounded mt-1">
            {initialData.error_message}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          닫기
        </Button>
      </div>
    </div>
  );
}
