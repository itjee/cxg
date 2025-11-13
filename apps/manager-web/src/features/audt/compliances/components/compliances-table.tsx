import { DataTable } from "@/components/ui/data-table";
import { useCompliancesStore } from "../stores/compliances.store";
import { getCompliancesColumns } from "./compliances-columns";
import type { Compliance } from "../types/compliances.types";

interface CompliancesTableProps {
  data: Compliance[];
  onViewDetails?: (compliance: Compliance) => void;
  onDownload?: (compliance: Compliance) => void;
}

export function CompliancesTable({ 
  data, 
  onViewDetails,
  onDownload 
}: CompliancesTableProps) {
  const { sorting, setSorting } = useCompliancesStore();
  const columns = getCompliancesColumns({ onViewDetails, onDownload });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="report_name"
      searchPlaceholder="보고서명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
