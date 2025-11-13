/**
 * @file users.types.ts
 * @description 사용자 관리 TypeScript 타입 정의
 * 
 * 데이터베이스 스키마(sys.users)와 1:1 매핑되는 타입 정의
 * - User: 사용자 엔티티 (DB 스키마 기반)
 * - CreateUserRequest: 생성 요청 DTO
 * - UpdateUserRequest: 수정 요청 DTO
 * - UserListResponse: 목록 응답 DTO
 * 
 * @sync 데이터베이스 동기화
 * DB 스키마 변경 시 이 파일도 함께 업데이트 필요
 * - 파일: packages/database/schemas/tenants/22_sys/01_users.sql
 * - 테이블: sys.users
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'uuid',
 *   username: 'johndoe',
 *   full_name: '홍길동',
 *   email: 'john@example.com',
 *   ...
 * };
 * ```
 */

/**
 * 사용자 정보 (DB 스키마 sys.users 기반)
 * 
 * @description
 * 데이터베이스 테이블: sys.users
 * 
 * @fields 기본 식별자 및 감사 필드
 * - id: UUID, 사용자 고유 식별자
 * - created_at: TIMESTAMP, 등록 일시
 * - created_by: UUID, 등록자 (NULL 가능)
 * - updated_at: TIMESTAMP, 수정 일시
 * - updated_by: UUID, 수정자
 * 
 * @fields 사용자 기본 정보
 * - username: VARCHAR(100), 로그인 사용자명 (테넌트 내 유니크)
 * - password: VARCHAR(255), 암호화된 비밀번호
 * - full_name: VARCHAR(100), 이름
 * - email: VARCHAR(255), 이메일 (테넌트 내 유니크)
 * - phone: VARCHAR(50), 전화번호
 * 
 * @fields 역할 및 권한
 * - role_id: UUID, 기본 역할 ID
 * - role_name: string, 역할명 (조인 필드, 응답용)
 * - default_conflict_resolution_policy_id: UUID, 권한 충돌 해결 정책
 * 
 * @fields 시스템 사용자
 * - is_system_user: BOOLEAN, 시스템 사용자 여부 (자동화/배치용)
 * 
 * @fields 로그인 추적
 * - last_login_at: TIMESTAMP, 마지막 로그인 일시
 * - last_login_ip: VARCHAR(45), 마지막 로그인 IP (IPv6 지원)
 * - failed_login_attempts: INTEGER, 연속 로그인 실패 횟수
 * - locked_until: TIMESTAMP, 계정 잠금 해제 시각
 * 
 * @fields 상태 정보
 * - is_active: BOOLEAN, 활성 상태 (TRUE: 로그인 가능)
 * - is_deleted: BOOLEAN, 논리 삭제 플래그
 */
export interface User {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 사용자 기본 정보
  username: string;
  password?: string; // 조회 시에는 제외됨 (보안)
  full_name?: string;
  email: string;
  phone?: string;

  // 역할 및 권한
  role_id?: string;
  role_name?: string; // 조인 필드 (응답용)
  default_conflict_resolution_policy_id?: string;

  // 시스템 사용자
  is_system_user: boolean;

  // 로그인 추적
  last_login_at?: string;
  last_login_ip?: string;
  failed_login_attempts: number;
  locked_until?: string;

  // 상태 정보
  is_active: boolean;
  is_deleted: boolean;
}

/**
 * 사용자 생성 요청 (DB 스키마 기반)
 * 
 * @description
 * 새 사용자 생성 시 필요한 필드
 * - username, password, email은 필수
 * - password는 평문으로 전달 (백엔드에서 해싱)
 * 
 * @required
 * - username: 로그인 사용자명 (테넌트 내 유니크)
 * - password: 비밀번호 (백엔드에서 bcrypt 해싱)
 * - email: 이메일 (테넌트 내 유니크)
 * 
 * @optional
 * - full_name: 이름
 * - phone: 전화번호
 * - role_id: 역할 ID
 * - is_active: 활성 상태 (기본: true)
 * - is_system_user: 시스템 사용자 여부 (기본: false)
 */
export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  full_name?: string;
  phone?: string;
  role_id?: string;
  default_conflict_resolution_policy_id?: string;
  is_system_user?: boolean;
  is_active?: boolean;
}

/**
 * 사용자 수정 요청 (DB 스키마 기반)
 * 
 * @description
 * 기존 사용자 수정 시 필요한 필드 (부분 업데이트 지원)
 * - 모든 필드가 optional
 * - password 변경 시에만 포함
 */
export interface UpdateUserRequest {
  username?: string;
  password?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role_id?: string;
  default_conflict_resolution_policy_id?: string;
  is_system_user?: boolean;
  is_active?: boolean;
  is_deleted?: boolean;
  failed_login_attempts?: number;
  locked_until?: string;
  last_login_at?: string;
  last_login_ip?: string;
}

/**
 * 사용자 목록 응답 (페이징 메타데이터 포함)
 * 
 * @description
 * 서버 사이드 페이징 응답 구조
 * - items: 현재 페이지의 사용자 목록
 * - total: 전체 사용자 수
 * - page: 현재 페이지 번호 (1-based)
 * - page_size: 페이지 크기
 * - total_pages: 전체 페이지 수
 */
export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 사용자 상세 응답 (단일 사용자)
 */
export interface UserDetailResponse {
  data: User;
}

/**
 * 사용자 쿼리 파라미터 (목록 조회용)
 * 
 * @description
 * 서버 사이드 페이징 및 필터링 파라미터
 * - page: 페이지 번호 (1-based)
 * - pageSize: 페이지 크기
 * - search: 검색어 (username, email, full_name)
 * - active: 활성 상태 필터
 * - roleId: 역할 ID 필터
 */
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
  roleId?: string;
}

/**
 * 사용자 초대 요청
 * 
 * @description
 * 관리자가 새로운 사용자를 초대할 때 사용하는 DTO
 * 비밀번호는 시스템이 자동 생성하여 이메일로 전송
 * 
 * @required
 * - username: 로그인 사용자명
 * - email: 이메일 주소
 * - full_name: 이름
 * 
 * @optional
 * - phone: 전화번호
 * - department_id: 부서 ID
 * - position: 직급/직책
 * - role_id: 역할 ID
 */
export interface UserInviteRequest {
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  department_id?: string;
  position?: string;
  role_id?: string;
}

/**
 * 사용자 초대 응답
 * 
 * @description
 * 초대 성공 시 반환되는 정보
 * - temp_password: 임시 비밀번호 (이메일 발송용, UI에는 표시 안 함)
 */
export interface UserInviteResponse {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  temp_password: string;
  invited_at: string;
}

/**
 * 비밀번호 변경 요청
 * 
 * @description
 * 사용자가 비밀번호를 변경할 때 사용
 * 현재 비밀번호 검증 후 새 비밀번호로 변경
 */
export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

/**
 * 비밀번호 변경 응답
 */
export interface PasswordChangeResponse {
  message: string;
  changed_at: string;
}
