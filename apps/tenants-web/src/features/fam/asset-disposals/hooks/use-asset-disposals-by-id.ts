import { useQuery } from '@tanstack/react-query';
import { assetDisposalsService } from '../services';

export function useAssetDisposalsById(id: string) {
  return useQuery({
    queryKey: ['asset-disposals', id],
    queryFn: () => assetDisposalsService.getById(id),
    enabled: !!id,
  });
}
