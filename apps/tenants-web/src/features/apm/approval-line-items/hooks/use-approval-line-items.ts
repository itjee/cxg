import { useQuery } from '@tanstack/react-query';
import { approvalLineItemsService } from '../services';

export function useApprovalLineItems() {
  return useQuery({
    queryKey: ['approval-line-items'],
    queryFn: () => approvalLineItemsService.getList(),
  });
}
