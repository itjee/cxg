import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { usePoliciesStore } from "../stores/policies.store";
import { usePolicy } from "../hooks/use-policies";
import type { 
  PolicyType, 
  PolicyCategory,
  PolicyStatus,
  EnforcementLevel 
} from "../types/policies.types";

const policyTypeLabels: Record<PolicyType, string> = {
  PASSWORD: "비밀번호",
  ACCESS_CONTROL: "접근제어",
  DATA_RETENTION: "데이터보관",
  ENCRYPTION: "암호화",
  AUTHENTICATION: "인증",
  NETWORK_SECURITY: "네트워크보안",
};

const policyCategoryLabels: Record<PolicyCategory, string> = {
  AUTHENTICATION: "인증",
  AUTHORIZATION: "권한부여",
  DATA_PROTECTION: "데이터보호",
  MONITORING: "모니터링",
  INCIDENT_RESPONSE: "사고대응",
  COMPLIANCE: "컴플라이언스",
};

const statusColors: Record<PolicyStatus, string> = {
  DRAFT: "bg-gray-500/10 text-gray-600",
  PENDING_APPROVAL: "bg-blue-500/10 text-blue-600",
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  ARCHIVED: "bg-orange-500/10 text-orange-600",
};

const statusLabels: Record<PolicyStatus, string> = {
  DRAFT: "초안",
  PENDING_APPROVAL: "승인대기",
  ACTIVE: "활성",
  ARCHIVED: "보관",
};

const enforcementLevelColors: Record<EnforcementLevel, string> = {
  MANDATORY: "bg-red-500/10 text-red-600",
  RECOMMENDED: "bg-orange-500/10 text-orange-600",
  OPTIONAL: "bg-blue-500/10 text-blue-600",
};

const enforcementLevelLabels: Record<EnforcementLevel, string> = {
  MANDATORY: "필수",
  RECOMMENDED: "권장",
  OPTIONAL: "선택",
};

export function PoliciesDetail() {
  const { detailId, closeDetail } = usePoliciesStore();
  const { data: policy, isLoading } = usePolicy(detailId);

  if (!detailId) return null;
  if (isLoading) return <div>로딩 중...</div>;
  if (!policy) return null;

  return (
    <Dialog open={!!detailId} onOpenChange={closeDetail}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>보안 정책 상세</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{policy.policy_name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                {policyTypeLabels[policy.policy_type]}
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
                {policyCategoryLabels[policy.policy_category]}
              </Badge>
              <Badge className={statusColors[policy.status]}>
                {statusLabels[policy.status]}
              </Badge>
              <Badge className={enforcementLevelColors[policy.enforcement_level]}>
                {enforcementLevelLabels[policy.enforcement_level]}
              </Badge>
            </div>
          </div>

          {policy.description && (
            <div>
              <p className="text-sm text-muted-foreground">설명</p>
              <p className="mt-1">{policy.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">버전</p>
              <p className="mt-1 text-lg font-semibold">{policy.version}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">적용 범위</p>
              <p className="mt-1">
                {policy.apply_to_all_tenants ? "전체 테넌트" : "특정 테넌트"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">시행일</p>
              <p className="mt-1">{formatDate(policy.effective_date, "yyyy-MM-dd")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">만료일</p>
              <p className="mt-1">
                {policy.expiry_date ? formatDate(policy.expiry_date, "yyyy-MM-dd") : "무기한"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">정책 규칙</p>
            <pre className="p-4 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(policy.rules, null, 2)}
            </pre>
          </div>

          {policy.approved_at && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">승인일시</p>
                <p className="mt-1">{formatDate(policy.approved_at, "yyyy-MM-dd HH:mm:ss")}</p>
              </div>
              {policy.approved_by && (
                <div>
                  <p className="text-sm text-muted-foreground">승인자</p>
                  <p className="mt-1">{policy.approved_by}</p>
                </div>
              )}
            </div>
          )}

          {policy.tenant_ids && policy.tenant_ids.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground">대상 테넌트</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {policy.tenant_ids.map((id) => (
                  <Badge key={id} variant="outline">
                    {id}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {policy.previous_version_id && (
            <div>
              <p className="text-sm text-muted-foreground">이전 버전 ID</p>
              <code className="mt-1 block p-2 bg-muted rounded text-xs">
                {policy.previous_version_id}
              </code>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">생성일시</p>
              <p className="mt-1 text-xs">{formatDate(policy.created_at, "yyyy-MM-dd HH:mm:ss")}</p>
            </div>
            {policy.updated_at && (
              <div>
                <p className="text-sm text-muted-foreground">수정일시</p>
                <p className="mt-1 text-xs">{formatDate(policy.updated_at, "yyyy-MM-dd HH:mm:ss")}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
