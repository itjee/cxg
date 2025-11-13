/**
 * @file graphql-client.ts
 * @description GraphQL 클라이언트 설정
 * 
 * GraphQL 요청을 처리하고 인증 토큰을 자동으로 추가합니다.
 */

import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8100/graphql';

/**
 * GraphQL 클라이언트 인스턴스 생성
 * 
 * 각 요청마다 최신 토큰을 가져와서 헤더에 추가합니다.
 */
export function createGraphQLClient(): GraphQLClient {
  const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {},
    requestMiddleware: (request) => {
      // 브라우저 환경에서만 토큰 가져오기
      if (typeof window !== 'undefined') {
        let token = localStorage.getItem('access_token');
        
        // localStorage에 없으면 쿠키에서 가져오기
        if (!token) {
          token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1] ?? null;
        }
        
        if (token) {
          return {
            ...request,
            headers: {
              ...request.headers,
              Authorization: `Bearer ${token}`,
            },
          };
        }
      }
      
      return request;
    },
    responseMiddleware: (response) => {
      // GraphQL 에러 처리
      if (response instanceof Error) {
        console.error('GraphQL Error:', response);
      }
      
      // 401 에러 처리 (인증 실패)
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/signin';
      }
    },
  });

  return client;
}

/**
 * 싱글톤 GraphQL 클라이언트
 */
export const graphqlClient = createGraphQLClient();

/**
 * GraphQL 에러 타입
 */
export interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: any;
  };
}

/**
 * GraphQL 응답 타입
 */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}
