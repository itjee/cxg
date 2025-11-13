import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface AssetDisposal {
  id: string;
  asset_id: string;
  asset_code: string;
  asset_name: string;
  disposal_date: string;
  disposal_method: 'SALE' | 'SCRAP' | 'DONATION' | 'WRITE_OFF' | 'OTHER';
  book_value: number;
  disposal_value: number;
  gain_loss: number;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  remarks?: string;
  created_at: string;
  updated_at: string;
}

interface AssetDisposalsListProps {
  columns: ColumnDef<AssetDisposal>[];
  data: AssetDisposal[];
}

export function AssetDisposalsList({ columns, data }: AssetDisposalsListProps) {
  return <DataTable columns={columns} data={data} />;
}
