import { useMutation } from '@tanstack/react-query';
import { assetDisposalsService } from '../services';

export function useDeleteAssetDisposals() {
  return useMutation({
    mutationFn: (id: string) => assetDisposalsService.delete(id),
  });
}
