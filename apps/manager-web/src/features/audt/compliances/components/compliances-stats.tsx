import { useMemo } from "react";
import { FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { StatsCards, type StatCardData } from "@/components/stats";
import type { Compliance } from "../types/compliances.types";

interface CompliancesStatsProps {
  data: Compliance[];
}

export function CompliancesStats({ data }: CompliancesStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const compliant = data.filter((c) => c.compliance_status === "COMPLIANT").length;
    const nonCompliant = data.filter((c) => c.compliance_status === "NON_COMPLIANT").length;
    const pending = data.filter((c) => c.compliance_status === "PENDING").length;
    const totalFindings = data.reduce((sum, c) => sum + c.findings_count, 0);
    const totalCritical = data.reduce((sum, c) => sum + c.critical_count, 0);

    return [
      {
        title: "전체 보고서",
        value: total.toString(),
        description: "컴플라이언스 보고서",
        icon: <FileText className="h-5 w-5" />,
        color: "primary",
      },
      {
        title: "준수",
        value: compliant.toString(),
        description: `${total > 0 ? ((compliant / total) * 100).toFixed(1) : 0}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success",
      },
      {
        title: "미준수",
        value: nonCompliant.toString(),
        description: `발견된 이슈: ${totalFindings}`,
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "danger",
      },
      {
        title: "검토중",
        value: pending.toString(),
        description: `심각 이슈: ${totalCritical}`,
        icon: <Clock className="h-5 w-5" />,
        color: "warning",
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
