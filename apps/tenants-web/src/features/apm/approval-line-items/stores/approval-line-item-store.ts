import { create } from 'zustand';

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

interface ApprovalLineItemStore {
  selectedItem: ApprovalLineItem | null;
  isFormOpen: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  setSelectedItem: (item: ApprovalLineItem | null) => void;
}

export const useApprovalLineItemsStore = create<ApprovalLineItemStore>((set) => ({
  selectedItem: null,
  isFormOpen: false,
  openForm: (id: string) => {
    set((state) => ({
      isFormOpen: true,
      selectedItem: state.selectedItem,
    }));
  },
  closeForm: () => {
    set(() => ({
      isFormOpen: false,
      selectedItem: null,
    }));
  },
  setSelectedItem: (item: ApprovalLineItem | null) => {
    set(() => ({
      selectedItem: item,
    }));
  },
}));
