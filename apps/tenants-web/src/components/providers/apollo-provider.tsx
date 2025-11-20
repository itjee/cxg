'use client';

/**
 * @file apollo-provider.tsx
 * @description Apollo Client Provider 컴포넌트
 *
 * GraphQL 쿼리와 뮤테이션을 처리하는 Apollo Client를 제공합니다.
 * 이 Provider를 통해 모든 하위 컴포넌트에서 Apollo hooks를 사용할 수 있습니다.
 */

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

/**
 * Apollo Client Provider Wrapper
 *
 * @description
 * Next.js의 클라이언트 컴포넌트에서 Apollo Client를 제공합니다.
 * layout.tsx에서 이 컴포넌트를 감싸서 모든 페이지에서 GraphQL을 사용할 수 있도록 합니다.
 *
 * @example
 * ```tsx
 * // layout.tsx
 * <ApolloProviderWrapper>
 *   {children}
 * </ApolloProviderWrapper>
 * ```
 */
export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
