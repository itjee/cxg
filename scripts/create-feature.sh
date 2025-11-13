#!/bin/bash
# Manager-Web Feature 생성 스크립트
# Usage: ./create-feature.sh {module} {entity}
# Example: ./create-feature.sh idam users

set -e

MODULE=$1
ENTITY=$2

if [ -z "$MODULE" ] || [ -z "$ENTITY" ]; then
  echo "❌ 사용법: ./create-feature.sh {module} {entity}"
  echo "   예시: ./create-feature.sh idam users"
  exit 1
fi

# 대문자로 시작하는 엔티티명 (PascalCase)
ENTITY_PASCAL=$(echo "$ENTITY" | sed 's/.*/\u&/')

BASE_DIR="apps/manager-web/src/features/${MODULE}/${ENTITY}"

echo "📦 Feature 구조 생성 중..."
echo "   모듈: ${MODULE}"
echo "   엔티티: ${ENTITY}"
echo "   경로: ${BASE_DIR}"

# 폴더 생성
mkdir -p "${BASE_DIR}/components"
mkdir -p "${BASE_DIR}/hooks"
mkdir -p "${BASE_DIR}/services"
mkdir -p "${BASE_DIR}/types"
mkdir -p "${BASE_DIR}/stores"

# 1. index.ts 생성
cat > "${BASE_DIR}/index.ts" << EOF
/**
 * ${ENTITY_PASCAL} feature exports
 */

// Components
export * from "./components";

// Hooks
export * from "./hooks/use-${ENTITY}";

// Services
export { ${ENTITY}Service } from "./services/${ENTITY}.service";

// Types
export type * from "./types/${ENTITY}.types";

// Stores
export { use${ENTITY_PASCAL}Store } from "./stores/${ENTITY}.store";
EOF

# 2. types 파일 생성
cat > "${BASE_DIR}/types/${ENTITY}.types.ts" << EOF
/**
 * @file ${ENTITY}.types.ts
 * @description ${ENTITY_PASCAL} TypeScript 타입 정의
 */

/**
 * ${ENTITY_PASCAL} 정보
 */
export interface ${ENTITY_PASCAL} {
  // 기본 식별자
  id: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;

  // TODO: 필드 정의
  name: string;
  description?: string;
  
  // 상태
  is_active: boolean;
  is_deleted: boolean;
}

/**
 * ${ENTITY_PASCAL} 생성 요청
 */
export interface Create${ENTITY_PASCAL}Request {
  name: string;
  description?: string;
  is_active?: boolean;
}

/**
 * ${ENTITY_PASCAL} 수정 요청
 */
export interface Update${ENTITY_PASCAL}Request {
  name?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * ${ENTITY_PASCAL} 목록 응답
 */
export interface ${ENTITY_PASCAL}ListResponse {
  items: ${ENTITY_PASCAL}[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * ${ENTITY_PASCAL} 쿼리 파라미터
 */
export interface ${ENTITY_PASCAL}QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
}
EOF

# 3. services 파일 생성
cat > "${BASE_DIR}/services/${ENTITY}.service.ts" << EOF
/**
 * @file ${ENTITY}.service.ts
 * @description ${ENTITY_PASCAL} 서비스 레이어
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  ${ENTITY_PASCAL},
  Create${ENTITY_PASCAL}Request,
  Update${ENTITY_PASCAL}Request,
  ${ENTITY_PASCAL}ListResponse,
  ${ENTITY_PASCAL}QueryParams,
} from "../types/${ENTITY}.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const ENDPOINT = "/api/v1/manager/${MODULE}/${ENTITY}";

/**
 * ${ENTITY_PASCAL} 서비스 객체
 */
export const ${ENTITY}Service = {
  /**
   * 목록 조회
   */
  async list${ENTITY_PASCAL}(
    params?: ${ENTITY_PASCAL}QueryParams,
    signal?: AbortSignal
  ): Promise<${ENTITY_PASCAL}ListResponse> {
    try {
      const response = await api.get<ApiResponse<${ENTITY_PASCAL}ListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          active: params?.active,
        },
        signal,
      });
      
      return response.data.data || { 
        items: [], 
        total: 0, 
        page: 1, 
        page_size: 10,
        total_pages: 0
      };
    } catch (error) {
      throw ApiError.fromAxiosError(error, "list${ENTITY_PASCAL}");
    }
  },

  /**
   * 상세 조회
   */
  async get${ENTITY_PASCAL}(id: string, signal?: AbortSignal): Promise<${ENTITY_PASCAL}> {
    try {
      const response = await api.get<ApiResponse<${ENTITY_PASCAL}>>(
        \`\${ENDPOINT}/\${id}\`,
        { signal }
      );
      
      if (!response.data.data) {
        throw new Error('${ENTITY_PASCAL} not found');
      }
      
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, \`get${ENTITY_PASCAL}(\${id})\`);
    }
  },

  /**
   * 생성
   */
  async create${ENTITY_PASCAL}(
    data: Create${ENTITY_PASCAL}Request,
    signal?: AbortSignal
  ): Promise<${ENTITY_PASCAL}> {
    try {
      const response = await api.post<ApiResponse<${ENTITY_PASCAL}>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as ${ENTITY_PASCAL});
    } catch (error) {
      throw ApiError.fromAxiosError(error, "create${ENTITY_PASCAL}");
    }
  },

  /**
   * 수정
   */
  async update${ENTITY_PASCAL}(
    id: string,
    data: Update${ENTITY_PASCAL}Request,
    signal?: AbortSignal
  ): Promise<${ENTITY_PASCAL}> {
    try {
      const response = await api.put<ApiResponse<${ENTITY_PASCAL}>>(
        \`\${ENDPOINT}/\${id}\`,
        data,
        { signal }
      );
      return response.data.data || ({} as ${ENTITY_PASCAL});
    } catch (error) {
      throw ApiError.fromAxiosError(error, \`update${ENTITY_PASCAL}(\${id})\`);
    }
  },

  /**
   * 삭제
   */
  async delete${ENTITY_PASCAL}(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(\`\${ENDPOINT}/\${id}\`, { signal });
    } catch (error) {
      throw ApiError.fromAxiosError(error, \`delete${ENTITY_PASCAL}(\${id})\`);
    }
  },
};
EOF

# 4. hooks 파일 생성
cat > "${BASE_DIR}/hooks/use-${ENTITY}.ts" << EOF
/**
 * @file use-${ENTITY}.ts
 * @description ${ENTITY_PASCAL} React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ${ENTITY}Service } from '../services/${ENTITY}.service';
import type { 
  ${ENTITY_PASCAL}QueryParams,
  Create${ENTITY_PASCAL}Request,
  Update${ENTITY_PASCAL}Request
} from '../types/${ENTITY}.types';

/**
 * 목록 조회 hook
 */
export function use${ENTITY_PASCAL}(params?: ${ENTITY_PASCAL}QueryParams) {
  return useQuery({
    queryKey: ['${ENTITY}', params],
    queryFn: ({ signal }) => ${ENTITY}Service.list${ENTITY_PASCAL}(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function use${ENTITY_PASCAL}ById(id: string) {
  return useQuery({
    queryKey: ['${ENTITY}', id],
    queryFn: ({ signal }) => ${ENTITY}Service.get${ENTITY_PASCAL}(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreate${ENTITY_PASCAL}(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Create${ENTITY_PASCAL}Request) => 
      ${ENTITY}Service.create${ENTITY_PASCAL}(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['${ENTITY}'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdate${ENTITY_PASCAL}(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Update${ENTITY_PASCAL}Request }) =>
      ${ENTITY}Service.update${ENTITY_PASCAL}(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['${ENTITY}'] });
      queryClient.invalidateQueries({ queryKey: ['${ENTITY}', variables.id] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDelete${ENTITY_PASCAL}(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ${ENTITY}Service.delete${ENTITY_PASCAL}(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${ENTITY}'] });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
EOF

# 5. stores 파일 생성
cat > "${BASE_DIR}/stores/${ENTITY}.store.ts" << EOF
/**
 * @file ${ENTITY}.store.ts
 * @description ${ENTITY_PASCAL} Zustand 상태 관리
 */

import { create } from 'zustand';

interface ${ENTITY_PASCAL}Store {
  // UI State
  selectedStatus: 'active' | 'inactive' | '';
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;

  // Actions
  setSelectedStatus: (status: 'active' | 'inactive' | '') => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  setGlobalFilter: (filter: string) => void;
  openForm: (id?: string) => void;
  closeForm: () => void;
  reset: () => void;
}

const initialState = {
  selectedStatus: '' as 'active' | 'inactive' | '',
  currentPage: 0,
  itemsPerPage: 20,
  globalFilter: '',
  formOpen: false,
  selectedId: null,
};

export const use${ENTITY_PASCAL}Store = create<${ENTITY_PASCAL}Store>((set) => ({
  ...initialState,

  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
  setGlobalFilter: (filter) => set({ globalFilter: filter, currentPage: 0 }),
  openForm: (id) => set({ formOpen: true, selectedId: id || null }),
  closeForm: () => set({ formOpen: false, selectedId: null }),
  reset: () => set(initialState),
}));
EOF

# 6. components/index.ts 생성
cat > "${BASE_DIR}/components/index.ts" << EOF
/**
 * ${ENTITY_PASCAL} Components exports
 */

// TODO: 컴포넌트 구현 후 export 추가
// export { ${ENTITY_PASCAL}Header } from "./${ENTITY}-header";
// export { ${ENTITY_PASCAL}Stats } from "./${ENTITY}-stats";
// export { ${ENTITY_PASCAL}Filters } from "./${ENTITY}-filters";
// export { ${ENTITY_PASCAL}Table } from "./${ENTITY}-table";
// export { ${ENTITY_PASCAL}Edit } from "./${ENTITY}-edit";
EOF

echo ""
echo "✅ Feature 구조 생성 완료!"
echo ""
echo "📁 생성된 파일:"
echo "   ${BASE_DIR}/index.ts"
echo "   ${BASE_DIR}/types/${ENTITY}.types.ts"
echo "   ${BASE_DIR}/services/${ENTITY}.service.ts"
echo "   ${BASE_DIR}/hooks/use-${ENTITY}.ts"
echo "   ${BASE_DIR}/stores/${ENTITY}.store.ts"
echo "   ${BASE_DIR}/components/index.ts"
echo ""
echo "📝 다음 단계:"
echo "   1. types/${ENTITY}.types.ts 에서 필드 정의"
echo "   2. services/${ENTITY}.service.ts 에서 API 엔드포인트 확인"
echo "   3. components/ 폴더에 UI 컴포넌트 생성"
echo "   4. app/(main)/${MODULE}/${ENTITY}/page.tsx 페이지 생성"
echo ""
echo "🎉 Happy coding!"
