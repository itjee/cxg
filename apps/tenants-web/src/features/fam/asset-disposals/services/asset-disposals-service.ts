// Asset Disposals Service
// This is a placeholder service for API integration

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

export const assetDisposalsService = {
  async getList(): Promise<AssetDisposal[]> {
    // TODO: Implement API call
    return [];
  },

  async getById(id: string): Promise<AssetDisposal | null> {
    // TODO: Implement API call
    return null;
  },

  async create(data: Omit<AssetDisposal, 'id' | 'created_at' | 'updated_at'>): Promise<AssetDisposal> {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },

  async update(id: string, data: Partial<AssetDisposal>): Promise<AssetDisposal> {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },

  async delete(id: string): Promise<void> {
    // TODO: Implement API call
  },
};
