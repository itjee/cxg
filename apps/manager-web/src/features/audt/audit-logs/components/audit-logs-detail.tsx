import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useAuditLogsStore } from "../stores/audit-logs.store";
import { useAuditLog } from "../hooks/use-audit-logs";
import type { EventType, EventCategory, AuditResult, RiskLevel } from "../types/audit-logs.types";

const eventTypeLabels: Record<EventType, string> = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  API_CALL: "API 호출",
  DATA_ACCESS: "데이터 접근",
  ADMIN_ACTION: "관리자 작업",
  PASSWORD_CHANGE: "비밀번호 변경",
  PERMISSION_CHANGE: "권한 변경",
};

const eventCategoryLabels: Record<EventCategory, string> = {
  AUTHENTICATION: "인증",
  AUTHORIZATION: "권한부여",
  DATA_MODIFICATION: "데이터수정",
  SYSTEM_CHANGE: "시스템변경",
  SECURITY_VIOLATION: "보안위반",
};

const resultColors: Record<AuditResult, string> = {
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  FAILURE: "bg-red-500/10 text-red-600",
  BLOCKED: "bg-orange-500/10 text-orange-600",
};

const resultLabels: Record<AuditResult, string> = {
  SUCCESS: "성공",
  FAILURE: "실패",
  BLOCKED: "차단",
};

const riskLevelColors: Record<RiskLevel, string> = {
  HIGH: "bg-destructive/10 text-destructive",
  MEDIUM: "bg-orange-500/10 text-orange-600",
  LOW: "bg-blue-500/10 text-blue-600",
};

const riskLevelLabels: Record<RiskLevel, string> = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

export function AuditLogsDetail() {
  const { detailId, closeDetail } = useAuditLogsStore();
  const { data: log, isLoading } = useAuditLog(detailId);

  if (!detailId) return null;
  if (isLoading) return <div>로딩 중...</div>;
  if (!log) return null;

  return (
    <Dialog open={!!detailId} onOpenChange={closeDetail}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>감사 로그 상세</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base text-muted-foreground">이벤트 유형</p>
              <Badge variant="outline" className="mt-1 bg-blue-500/10 text-blue-600">
                {eventTypeLabels[log.event_type]}
              </Badge>
            </div>
            <div>
              <p className="text-base text-muted-foreground">이벤트 분류</p>
              <Badge variant="outline" className="mt-1 bg-purple-500/10 text-purple-600">
                {eventCategoryLabels[log.event_category]}
              </Badge>
            </div>
            <div>
              <p className="text-base text-muted-foreground">결과</p>
              <Badge className={`mt-1 ${resultColors[log.result]}`}>
                {resultLabels[log.result]}
              </Badge>
            </div>
            <div>
              <p className="text-base text-muted-foreground">위험도</p>
              <Badge className={`mt-1 ${riskLevelColors[log.risk_level]}`}>
                {riskLevelLabels[log.risk_level]}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-base text-muted-foreground">설명</p>
            <p className="mt-1">{log.description}</p>
          </div>

          {log.failure_reason && (
            <div>
              <p className="text-base text-muted-foreground">실패 사유</p>
              <p className="mt-1 text-destructive">{log.failure_reason}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base text-muted-foreground">IP 주소</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {log.source_ip || "-"}
              </code>
            </div>
            <div>
              <p className="text-base text-muted-foreground">세션 ID</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {log.session_id || "-"}
              </code>
            </div>
          </div>

          {log.user_agent && (
            <div>
              <p className="text-base text-muted-foreground">User Agent</p>
              <p className="mt-1 text-sm">{log.user_agent}</p>
            </div>
          )}

          {log.resource && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-base text-muted-foreground">리소스</p>
                <p className="mt-1">{log.resource}</p>
              </div>
              <div>
                <p className="text-base text-muted-foreground">리소스 ID</p>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {log.resource_id || "-"}
                </code>
              </div>
            </div>
          )}

          {log.action_performed && (
            <div>
              <p className="text-base text-muted-foreground">수행 작업</p>
              <p className="mt-1">{log.action_performed}</p>
            </div>
          )}

          <div>
            <p className="text-base text-muted-foreground">발생 시간</p>
            <p className="mt-1">{formatDate(log.created_at, "yyyy-MM-dd HH:mm:ss")}</p>
          </div>

          {log.extra_data && Object.keys(log.extra_data).length > 0 && (
            <div>
              <p className="text-base text-muted-foreground">추가 데이터</p>
              <pre className="mt-1 p-2 bg-muted rounded text-sm overflow-auto">
                {JSON.stringify(log.extra_data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
