import { useMemo } from "react";
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { StatsCards, type StatCardData } from "@/components/stats";
import type { AuditLog } from "../types/audit-logs.types";

interface AuditLogsStatsProps {
  data: AuditLog[];
}

export function AuditLogsStats({ data }: AuditLogsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const success = data.filter((log) => log.result === "SUCCESS").length;
    const failure = data.filter((log) => log.result === "FAILURE").length;
    const blocked = data.filter((log) => log.result === "BLOCKED").length;
    const highRisk = data.filter((log) => log.risk_level === "HIGH").length;

    return [
      {
        title: "전체 이벤트",
        value: total.toString(),
        description: "감사 로그",
        icon: <ShieldAlert className="h-5 w-5" />,
        color: "primary",
      },
      {
        title: "성공",
        value: success.toString(),
        description: `${total > 0 ? ((success / total) * 100).toFixed(1) : 0}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success",
      },
      {
        title: "실패",
        value: failure.toString(),
        description: `${total > 0 ? ((failure / total) * 100).toFixed(1) : 0}%`,
        icon: <XCircle className="h-5 w-5" />,
        color: "warning",
      },
      {
        title: "고위험",
        value: highRisk.toString(),
        description: "높은 위험도 이벤트",
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "danger",
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
