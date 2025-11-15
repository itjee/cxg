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
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:8100/graphql";

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
 */
const authLink = setContext((_, { headers }) => {
  // 브라우저 환경에서만 토큰 가져오기
  let token: string | null = null;

  if (typeof window !== "undefined") {
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
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions
      );

      // 401 에러 처리 (인증 실패)
      if (
        extensions?.code === "UNAUTHENTICATED" ||
        extensions?.code === "401"
      ) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          document.cookie =
            "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/signin";
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // HTTP 401 에러 처리
    if ("statusCode" in networkError && networkError.statusCode === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        document.cookie =
          "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/signin";
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
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
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
