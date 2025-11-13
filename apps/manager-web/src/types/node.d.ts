/// <reference types="node" />

/**
 * Node.js 환경 변수 타입 정의
 * 
 * process.env에 대한 타입 안전성을 제공합니다.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_API_URL?: string;
    readonly NEXT_PUBLIC_GRAPHQL_URL?: string;
    readonly NEXT_PUBLIC_APP_NAME?: string;
  }
}
