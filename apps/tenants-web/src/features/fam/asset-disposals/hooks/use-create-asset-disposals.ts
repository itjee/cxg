import { useMutation } from '@tanstack/react-query';
import { assetDisposalsService } from '../services';

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

export function useCreateAssetDisposals() {
  return useMutation({
    mutationFn: (data: Omit<AssetDisposal, 'id' | 'created_at' | 'updated_at'>) =>
      assetDisposalsService.create(data),
  });
}
