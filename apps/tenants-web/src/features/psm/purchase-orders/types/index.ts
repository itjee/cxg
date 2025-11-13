export interface BaseEntity {
  id: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequest {
  [key: string]: any;
}

export interface UpdateRequest {
  [key: string]: any;
}

export interface ListResponse {
  data: BaseEntity[];
  total: number;
  page: number;
  pageSize: number;
}

export type QueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
};
