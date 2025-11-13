import { useMutation } from '@tanstack/react-query';
import { approvalLineItemsService } from '../services';

export function useDeleteApprovalLineItems() {
  return useMutation({
    mutationFn: (id: string) => approvalLineItemsService.delete(id),
  });
}
