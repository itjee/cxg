import { useQuery } from '@tanstack/react-query';
import { assetDisposalsService } from '../services';

export function useAssetDisposals() {
  return useQuery({
    queryKey: ['asset-disposals'],
    queryFn: () => assetDisposalsService.getList(),
  });
}
