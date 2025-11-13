export type AssetDisposals = {
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
};

export type CreateAssetDisposalsRequest = Omit<AssetDisposals, 'id' | 'created_at' | 'updated_at'>;

export type UpdateAssetDisposalsRequest = Partial<AssetDisposals>;

export type AssetDisposalsListResponse = {
  data: AssetDisposals[];
  total: number;
  page: number;
  pageSize: number;
};

export type AssetDisposalsDetailResponse = AssetDisposals;

export type AssetDisposalsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
