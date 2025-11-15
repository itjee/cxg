import { DataTable } from "@/components/data-table";
import { usePoliciesStore } from "../stores/policies.store";
import { getPoliciesColumns } from "./policies-columns";
import type { Policy } from "../types/policies.types";

interface PoliciesTableProps {
  data: Policy[];
  onViewDetails?: (policy: Policy) => void;
  onApprove?: (policy: Policy) => void;
}

export function PoliciesTable({
  data,
  onViewDetails,
  onApprove,
}: PoliciesTableProps) {
  const { sorting, setSorting } = usePoliciesStore();
  const columns = getPoliciesColumns({ onViewDetails, onApprove });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="policy_name"
      searchPlaceholder="정책명 검색..."
      showPagination={true}
      pageSize={20}
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
}
