import { useMutation } from '@tanstack/react-query';
import { approvalLineItemsService } from '../services';

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

export function useCreateApprovalLineItems() {
  return useMutation({
    mutationFn: (data: Omit<ApprovalLineItem, 'id' | 'created_at' | 'updated_at'>) =>
      approvalLineItemsService.create(data),
  });
}
