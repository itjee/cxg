/**
 * @file menus.service.ts
 * @description API를 통한 메뉴 데이터 관리 서비스
 */

import { api } from "@/lib/api";
import type {
  Menu,
  CreateMenuRequest,
  UpdateMenuRequest,
  MenuListResponse,
  MenuDetailResponse,
  MenuQueryParams,
  MenuTreeNode,
} from "../types";

/**
 * 테스트용 Mock 데이터
 * 실제 API 호출 불가 시 사용되는 더미 데이터
 */
export const mockMenus: Menu[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    code: 'SYS_DASHBOARD',
    name: '대시보드',
    name_en: 'Dashboard',
    description: '시스템 대시보드',
    depth: 0,
    sort_order: 1,
    menu_type: 'MENU',
    module_code: 'SYS',
    route_path: '/dashboard',
    component_path: '@/pages/dashboard',
    icon: 'layout-dashboard',
    icon_type: 'lucide',
    is_public: false,
    is_visible: true,
    is_favorite: false,
    open_in_new_tab: false,
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    code: 'SYS_ADMIN',
    name: '시스템 관리',
    name_en: 'System Admin',
    description: '시스템 관리 메뉴',
    depth: 0,
    sort_order: 2,
    menu_type: 'FOLDER',
    module_code: 'SYS',
    icon: 'settings',
    icon_type: 'lucide',
    is_public: false,
    is_visible: true,
    is_favorite: false,
    open_in_new_tab: false,
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    code: 'SYS_USERS',
    name: '사용자 관리',
    name_en: 'Users',
    description: '사용자 계정 관리',
    parent_id: '550e8400-e29b-41d4-a716-446655440002',
    depth: 1,
    sort_order: 1,
    menu_type: 'MENU',
    module_code: 'SYS',
    route_path: '/sys/users',
    component_path: '@/pages/sys/users',
    icon: 'users',
    icon_type: 'lucide',
    permission_code: 'SYS_USERS_READ',
    is_public: false,
    is_visible: true,
    is_favorite: false,
    open_in_new_tab: false,
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
    parent_name: '시스템 관리',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    code: 'SYS_ROLES',
    name: '역할 관리',
    name_en: 'Roles',
    description: '역할 및 권한 관리',
    parent_id: '550e8400-e29b-41d4-a716-446655440002',
    depth: 1,
    sort_order: 2,
    menu_type: 'MENU',
    module_code: 'SYS',
    route_path: '/sys/roles',
    component_path: '@/pages/sys/roles',
    icon: 'shield',
    icon_type: 'lucide',
    permission_code: 'SYS_ROLES_READ',
    is_public: false,
    is_visible: true,
    is_favorite: false,
    open_in_new_tab: false,
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
    parent_name: '시스템 관리',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    code: 'SYS_MENUS',
    name: '메뉴 관리',
    name_en: 'Menus',
    description: '시스템 메뉴 구조 관리',
    parent_id: '550e8400-e29b-41d4-a716-446655440002',
    depth: 1,
    sort_order: 3,
    menu_type: 'MENU',
    module_code: 'SYS',
    route_path: '/sys/menus',
    component_path: '@/pages/sys/menus',
    icon: 'menu',
    icon_type: 'lucide',
    badge_text: 'NEW',
    badge_color: 'blue',
    permission_code: 'SYS_MENUS_READ',
    is_public: false,
    is_visible: true,
    is_favorite: false,
    open_in_new_tab: false,
    is_active: true,
    is_deleted: false,
    created_at: '2025-11-04T00:00:00Z',
    parent_name: '시스템 관리',
  },
];

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface MenuServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: MenuServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      "요청 처리 중 오류가 발생했습니다."
  );
  err.code = error.response?.data?.error || "UNKNOWN_ERROR";
  err.status = error.response?.status;
  err.name = "MenuServiceError";

  console.error(`[MenuService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = "/sys/menus";

/**
 * 메뉴 서비스
 * 
 * @description 메뉴 관련 API 호출을 담당하는 서비스 레이어
 */
export const menuService = {
  /**
   * 메뉴 목록 조회
   * 
   * @param params - 조회 파라미터 (페이징, 필터 등)
   * @param signal - AbortSignal (요청 취소용)
   * @returns 메뉴 목록 응답
   */
  async listMenus(
    params?: MenuQueryParams,
    signal?: AbortSignal
  ): Promise<MenuListResponse> {
    try {
      const response = await api.get<ApiResponse<MenuListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          pageSize: params?.pageSize,
          search: params?.search,
          menuType: params?.menuType,
          moduleCode: params?.moduleCode,
          parentId: params?.parentId,
          depth: params?.depth,
          isVisible: params?.isVisible,
          isActive: params?.isActive,
        },
        signal,
      });
      return (
        response.data.data || { data: [], total: 0, page: 1, pageSize: 10 }
      );
    } catch (error) {
      return handleApiError(error, "listMenus");
    }
  },

  /**
   * 메뉴 상세 조회
   * 
   * @param id - 메뉴 ID
   * @param signal - AbortSignal
   * @returns 메뉴 상세 정보
   */
  async getMenu(id: string, signal?: AbortSignal): Promise<Menu> {
    try {
      const response = await api.get<ApiResponse<MenuDetailResponse>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      return response.data.data?.data || ({} as Menu);
    } catch (error) {
      return handleApiError(error, `getMenu(${id})`);
    }
  },

  /**
   * 메뉴 생성
   * 
   * @param data - 생성할 메뉴 데이터
   * @param signal - AbortSignal
   * @returns 생성된 메뉴 정보
   */
  async createMenu(
    data: CreateMenuRequest,
    signal?: AbortSignal
  ): Promise<Menu> {
    try {
      const response = await api.post<ApiResponse<Menu>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as Menu);
    } catch (error) {
      return handleApiError(error, "createMenu");
    }
  },

  /**
   * 메뉴 수정
   * 
   * @param id - 메뉴 ID
   * @param data - 수정할 메뉴 데이터
   * @param signal - AbortSignal
   * @returns 수정된 메뉴 정보
   */
  async updateMenu(
    id: string,
    data: UpdateMenuRequest,
    signal?: AbortSignal
  ): Promise<Menu> {
    try {
      const response = await api.patch<ApiResponse<Menu>>(
        `${ENDPOINT}/${id}`,
        data,
        { signal }
      );
      return response.data.data || ({} as Menu);
    } catch (error) {
      return handleApiError(error, `updateMenu(${id})`);
    }
  },

  /**
   * 메뉴 삭제
   * 
   * @param id - 메뉴 ID
   * @param signal - AbortSignal
   */
  async deleteMenu(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteMenu(${id})`);
    }
  },

  /**
   * 메뉴 트리 구조 조회
   * 
   * @description 계층형 메뉴 구조를 트리 형태로 반환
   * @param signal - AbortSignal
   * @returns 메뉴 트리 노드 배열
   */
  async getMenuTree(signal?: AbortSignal): Promise<MenuTreeNode[]> {
    try {
      const response = await api.get<ApiResponse<MenuTreeNode[]>>(
        `${ENDPOINT}/tree`,
        { signal }
      );
      return response.data.data || [];
    } catch (error) {
      return handleApiError(error, "getMenuTree");
    }
  },

  /**
   * 메뉴 순서 변경
   * 
   * @param id - 메뉴 ID
   * @param newSortOrder - 새로운 정렬 순서
   * @param signal - AbortSignal
   * @returns 수정된 메뉴 정보
   */
  async updateMenuSortOrder(
    id: string,
    newSortOrder: number,
    signal?: AbortSignal
  ): Promise<Menu> {
    try {
      const response = await api.patch<ApiResponse<Menu>>(
        `${ENDPOINT}/${id}/sort-order`,
        { sort_order: newSortOrder },
        { signal }
      );
      return response.data.data || ({} as Menu);
    } catch (error) {
      return handleApiError(error, `updateMenuSortOrder(${id})`);
    }
  },
};
