import { create } from 'zustand';

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

interface AssetDisposalStore {
  selectedDisposal: AssetDisposal | null;
  isFormOpen: boolean;
  openForm: (id: string) => void;
  closeForm: () => void;
  setSelectedDisposal: (disposal: AssetDisposal | null) => void;
}

export const useAssetDisposalsStore = create<AssetDisposalStore>((set) => ({
  selectedDisposal: null,
  isFormOpen: false,
  openForm: (id: string) => {
    set((state) => ({
      isFormOpen: true,
      selectedDisposal: state.selectedDisposal,
    }));
  },
  closeForm: () => {
    set(() => ({
      isFormOpen: false,
      selectedDisposal: null,
    }));
  },
  setSelectedDisposal: (disposal: AssetDisposal | null) => {
    set(() => ({
      selectedDisposal: disposal,
    }));
  },
}));
