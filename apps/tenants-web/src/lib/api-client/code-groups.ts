import { api } from '@/lib/api';

export interface CodeGroup {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CodeGroupsListResponse {
  items: CodeGroup[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CodeGroupCreate {
  code: string;
  name: string;
  description?: string;
  is_system?: boolean;
  is_active?: boolean;
}

export interface CodeGroupUpdate {
  code?: string;
  name?: string;
  description?: string;
  is_system?: boolean;
  is_active?: boolean;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 코드그룹 목록 조회
 */
export const getCodeGroups = async (
  page: number = 1,
  pageSize: number = 20,
  isActive?: boolean,
  search?: string
): Promise<CodeGroupsListResponse> => {
  try {
    const response = await api.get<ApiResponse<CodeGroupsListResponse>>(
      '/adm/code-groups',
      {
        params: {
          page,
          page_size: pageSize,
          is_active: isActive !== undefined ? isActive : undefined,
          search,
        },
      }
    );
    return response.data.data || { items: [], total: 0, page, page_size: pageSize, total_pages: 0 };
  } catch (error) {
    console.error('Failed to fetch code groups:', error);
    throw error;
  }
};

/**
 * 코드그룹 상세 조회
 */
export const getCodeGroup = async (id: string): Promise<CodeGroup> => {
  try {
    const response = await api.get<ApiResponse<CodeGroup>>(`/adm/code-groups/${id}`);
    return response.data.data || ({} as CodeGroup);
  } catch (error) {
    console.error('Failed to fetch code group:', error);
    throw error;
  }
};

/**
 * 코드그룹 생성
 */
export const createCodeGroup = async (data: CodeGroupCreate): Promise<CodeGroup> => {
  try {
    const response = await api.post<ApiResponse<CodeGroup>>('/adm/code-groups', data);
    return response.data.data || ({} as CodeGroup);
  } catch (error) {
    console.error('Failed to create code group:', error);
    throw error;
  }
};

/**
 * 코드그룹 수정
 */
export const updateCodeGroup = async (
  id: string,
  data: CodeGroupUpdate
): Promise<CodeGroup> => {
  try {
    const response = await api.put<ApiResponse<CodeGroup>>(
      `/adm/code-groups/${id}`,
      data
    );
    return response.data.data || ({} as CodeGroup);
  } catch (error) {
    console.error('Failed to update code group:', error);
    throw error;
  }
};

/**
 * 코드그룹 삭제
 */
export const deleteCodeGroup = async (id: string): Promise<void> => {
  try {
    await api.delete(`/adm/code-groups/${id}`);
  } catch (error) {
    console.error('Failed to delete code group:', error);
    throw error;
  }
};
