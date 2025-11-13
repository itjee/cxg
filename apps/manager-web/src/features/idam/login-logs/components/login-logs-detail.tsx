'use client';

/**
 * @file login-logs-detail.tsx
 * @description 로그인 이력 상세 모달 컴포넌트
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLoginLogStore } from '../stores';
import { useLoginLog } from '../hooks';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield } from 'lucide-react';

export function LoginLogsDetail() {
  const { detailId, closeDetail } = useLoginLogStore();
  const { data: logResponse, isLoading } = useLoginLog(detailId);

  if (!detailId) return null;

  const log = logResponse?.data;

  if (isLoading) {
    return (
      <Dialog open={!!detailId} onOpenChange={closeDetail}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!log) {
    return (
      <Dialog open={!!detailId} onOpenChange={closeDetail}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-destructive">로그인 이력을 찾을 수 없습니다</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={!!detailId} onOpenChange={closeDetail}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>로그인 이력 상세</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">시도 타입</div>
                <div className="mt-1">
                  <Badge variant="outline">{log.attempt_type}</Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">결과</div>
                <div className="mt-1 flex items-center gap-2">
                  {log.success ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">성공</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">실패</span>
                    </>
                  )}
                </div>
              </div>
              {log.failure_reason && (
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">실패 사유</div>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-red-50 text-red-800">
                      {log.failure_reason}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">사용자 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">사용자명</div>
                <div className="mt-1 font-medium">{log.username || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">사용자 타입</div>
                <div className="mt-1">
                  {log.user_type ? (
                    <Badge variant="secondary">{log.user_type}</Badge>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              {log.user_id && (
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">사용자 ID</div>
                  <div className="mt-1 font-mono text-xs">{log.user_id}</div>
                </div>
              )}
              {log.tenant_context && (
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">테넌트 컨텍스트</div>
                  <div className="mt-1 font-mono text-xs">{log.tenant_context}</div>
                </div>
              )}
            </div>
          </div>

          {/* 세션 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">세션 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">IP 주소</div>
                <div className="mt-1 font-mono">{log.ip_address}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">위치</div>
                <div className="mt-1">
                  {log.city && log.country_code 
                    ? `${log.city}, ${log.country_code}` 
                    : log.city || log.country_code || '-'}
                </div>
              </div>
              {log.session_id && (
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">세션 ID</div>
                  <div className="mt-1 font-mono text-xs break-all">{log.session_id}</div>
                </div>
              )}
              {log.user_agent && (
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">User Agent</div>
                  <div className="mt-1 text-xs break-all">{log.user_agent}</div>
                </div>
              )}
            </div>
          </div>

          {/* MFA 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">MFA 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">MFA 사용</div>
                <div className="mt-1 flex items-center gap-2">
                  {log.mfa_used ? (
                    <>
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">사용</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">미사용</span>
                  )}
                </div>
              </div>
              {log.mfa_method && (
                <div>
                  <div className="text-sm text-muted-foreground">MFA 방법</div>
                  <div className="mt-1">
                    <Badge variant="outline">{log.mfa_method}</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 타임스탬프 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">타임스탬프</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">생성일시</div>
                <div className="mt-1 text-sm">
                  {new Date(log.created_at).toLocaleString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
