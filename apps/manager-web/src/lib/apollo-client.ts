/**
 * @file apollo-client.ts
 * @description Apollo Client 설정
 * 
 * GraphQL 요청을 처리하고 인증 토큰을 자동으로 추가합니다.
 */

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from, gql } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8100/graphql';

/**
 * 토큰 갱신 뮤테이션 정의
 */
const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      tokenType
      expiresIn
    }
  }
`;

/**
 * HTTP Link 생성
 */
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include', // 쿠키 포함
});

/**
 * 인증 Link
 * 모든 요청에 JWT 토큰을 자동으로 추가
 */
const authLink = setContext((_, { headers }) => {
  // 브라우저 환경에서만 토큰 가져오기
  let token: string | null = null;
  
  if (typeof window !== 'undefined') {
    // localStorage에서 토큰 가져오기
    token = localStorage.getItem('access_token');
    
    // localStorage에 없으면 쿠키에서 가져오기
    if (!token) {
      token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1] ?? null;
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/**
 * 토큰 갱신 함수
 * Refresh Token으로 새로운 Access Token을 발급받습니다.
 */
async function refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    if (typeof window === 'undefined') return null;

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.warn('No refresh token available');
      return null;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($input: RefreshTokenInput!) {
            refreshToken(input: $input) {
              accessToken
              refreshToken
              tokenType
              expiresIn
            }
          }
        `,
        variables: {
          input: { refreshToken },
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('Token refresh error:', data.errors);
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data.refreshToken;

    // 새 토큰 저장 (localStorage + Cookie)
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', newRefreshToken);

    // 쿠키도 업데이트
    document.cookie = `access_token=${accessToken}; path=/; max-age=604800`; // 7일
    document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=604800`; // 7일

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

/**
 * 에러 처리 Link
 * GraphQL 및 네트워크 에러를 처리하고 필요시 토큰 갱신
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions
      );

      // 인증 실패 에러 처리
      if (extensions?.code === 'UNAUTHENTICATED' || message?.includes('Authentication required')) {
        if (typeof window !== 'undefined') {
          // refreshToken mutation은 인증을 요구하지 않으므로 재시도하지 않음
          // 바로 토큰을 삭제하고 로그인 페이지로 이동
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/signin';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // HTTP 401 에러 처리 - 토큰 갱신 시도
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        // 비동기로 토큰 갱신 시도
        (async () => {
          const newTokens = await refreshAccessToken();

          if (newTokens) {
            // 토큰 갱신 성공 - 원래 요청 재시도
            console.log('Token refreshed, retrying request');
            // forward를 사용하여 요청을 다시 보냄
            return forward(operation);
          } else {
            // 토큰 갱신 실패 - 로그인 페이지로 이동
            console.log('Token refresh failed, redirecting to login');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/signin';
          }
        })();
      }
    }
  }
});

/**
 * Apollo Client 인스턴스 생성
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 페이지네이션 정책
          managerUsers: {
            // key arguments로 페이지 관련 파라미터 지정
            keyArgs: ['userType', 'status'],
            // merge 함수로 기존 데이터와 새 데이터 병합
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          managerRoles: {
            keyArgs: ['category', 'status'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          managerSessions: {
            keyArgs: ['userId', 'status'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          managerPermissions: {
            keyArgs: ['category', 'resource'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
});

/**
 * Apollo Client 초기화 (SSR 지원)
 */
export function initializeApollo(initialState: any = null) {
  const client = apolloClient;

  // SSG/SSR에서 초기 상태 복원
  if (initialState) {
    const existingCache = client.extract();
    client.cache.restore({ ...existingCache, ...initialState });
  }

  return client;
}
