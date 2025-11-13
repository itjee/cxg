import { DataTable } from "@/components/ui/data-table";
import { useAuditLogsStore } from "../stores/audit-logs.store";
import { getAuditLogsColumns } from "./audit-logs-columns";
import type { AuditLog } from "../types/audit-logs.types";

interface AuditLogsTableProps {
  data: AuditLog[];
  onViewDetails?: (log: AuditLog) => void;
}

export function AuditLogsTable({ data, onViewDetails }: AuditLogsTableProps) {
  const { sorting, setSorting } = useAuditLogsStore();
  const columns = getAuditLogsColumns({ onViewDetails });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="description"
      searchPlaceholder="설명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
