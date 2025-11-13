import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface ApprovalLineItem {
  id: string;
  approval_line_id: string;
  line_number: string;
  approver_id: string;
  approver_name: string;
  approval_amount_from: number;
  approval_amount_to: number;
  approval_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApprovalLineItemsListProps {
  columns: ColumnDef<ApprovalLineItem>[];
  data: ApprovalLineItem[];
}

export function ApprovalLineItemsList({ columns, data }: ApprovalLineItemsListProps) {
  return <DataTable columns={columns} data={data} />;
}
