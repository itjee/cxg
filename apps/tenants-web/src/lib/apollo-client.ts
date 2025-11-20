/**
 * @file apollo-client.ts
 * @description Apollo Client 설정
 *
 * GraphQL 요청을 처리하고 인증 토큰을 자동으로 추가합니다.
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8100/graphql/tenants";

/**
 * HTTP Link 생성
 */
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: "include", // 쿠키 포함
});

/**
 * 인증 Link
 * 모든 요청에 JWT 토큰을 자동으로 추가
 *
 * @note
 * 프론트엔드는 REST API 기반 인증을 사용하고 있으며,
 * 토큰 갱신은 auth-provider.tsx에서 별도로 관리합니다.
 * GraphQL 요청에는 현재 유효한 토큰만 추가합니다.
 */
const authLink = setContext((_, { headers }) => {
  // 브라우저 환경에서만 토큰 가져오기
  let token: string | null = null;

  if (typeof window !== "undefined") {
    try {
      // localStorage에서 토큰 가져오기
      token = localStorage.getItem("access_token");

      // localStorage에 없으면 쿠키에서 가져오기
      if (!token) {
        token =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1] ?? null;
      }
    } catch (error) {
      console.warn("[Apollo AuthLink] 토큰 로드 중 에러:", error);
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

/**
 * 에러 처리 Link
 *
 * GraphQL 및 네트워크 에러를 처리합니다.
 * 인증 에러는 경고만 하고 auth-provider.tsx에서 처리합니다.
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions
      );

      // 401 에러 처리 (인증 실패)
      // 주의: auth-provider.tsx의 인증 로직이 이를 처리하도록 함
      if (
        extensions?.code === "UNAUTHENTICATED" ||
        extensions?.code === "401"
      ) {
        console.warn("[GraphQL] 인증이 실패했습니다. 로그인 페이지로 리다이렉트합니다.");
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // HTTP 401 에러 처리
    // 주의: auth-provider.tsx의 인증 로직이 이를 처리하도록 함
    if ("statusCode" in networkError && networkError.statusCode === 401) {
      console.warn("[Network] 401 인증 에러. 로그인 페이지로 리다이렉트합니다.");
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
          users: {
            // key arguments로 페이지 관련 파라미터 지정
            keyArgs: ["userType", "status"],
            // merge 함수로 기존 데이터와 새 데이터 병합
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          roles: {
            keyArgs: ["category", "status"],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          sessions: {
            keyArgs: ["userId", "status"],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          permissions: {
            keyArgs: ["category", "resource"],
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
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore", // 에러를 무시하고 캐시된 데이터 사용
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore", // 에러를 무시하고 계속 진행
    },
    mutate: {
      errorPolicy: "ignore", // 뮤테이션 에러도 무시
    },
  },
  connectToDevTools: process.env.NODE_ENV === "development",
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
