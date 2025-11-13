import { useQuery } from '@tanstack/react-query';
import { approvalLineItemsService } from '../services';

export function useApprovalLineItemsById(id: string) {
  return useQuery({
    queryKey: ['approval-line-items', id],
    queryFn: () => approvalLineItemsService.getById(id),
    enabled: !!id,
  });
}
