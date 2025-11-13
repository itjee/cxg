-- =====================================================================================
-- DDL 개선 마이그레이션 Phase 2: Tenant DB (P0 긴급 항목)
-- 작성일: 2025-10-27
-- 목표: 제품 변형 지원(variant_id), 사용자 감시 필드, 권한 시스템 개선
-- 실행 순서: 2순위 (Phase 1 후 실행)
-- =====================================================================================

-- 트랜잭션 시작
BEGIN TRANSACTION;

-- =====================================================================================
-- 1. IVM.INVENTORY_BALANCES 개선 (P0 우선순위)
-- =====================================================================================
-- 목표: 제품 변형(variant) 별 재고 추적 지원
-- 현황: 현재 product_id만으로 재고 추적, 옵션 조합별 관리 불가능
-- 영향: 옵션이 있는 제품(사이즈, 색상 등)의 재고 정확도 향상

-- Step 1: 컬럼 추가
ALTER TABLE ivm.inventory_balances
    ADD COLUMN IF NOT EXISTS variant_id UUID;

-- Step 2: 외래키 추가
ALTER TABLE ivm.inventory_balances
    ADD CONSTRAINT fk_inventory_balances__variant_id
        FOREIGN KEY (variant_id) REFERENCES pim.product_variants(id)
        ON DELETE RESTRICT;

-- Step 3: 기존 유니크 인덱스 제거
DROP INDEX IF EXISTS ux_inventory_balances__item_location;

-- Step 4: 유니크 인덱스 재생성 (variant_id 포함)
CREATE UNIQUE INDEX ux_inventory_balances__item_location
    ON ivm.inventory_balances (
        warehouse_id,
        product_id,
        COALESCE(variant_id::TEXT, ''),
        COALESCE(lot_number, ''),
        COALESCE(serial_number, '')
    );
COMMENT ON INDEX ivm.ux_inventory_balances__item_location IS
    '창고별 제품/변형/로트/시리얼 조합 유니크 제약';

-- Step 5: 조회용 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_inventory_balances__variant_id
    ON ivm.inventory_balances (variant_id)
 WHERE variant_id IS NOT NULL AND available_qty > 0;
COMMENT ON INDEX ivm.ix_inventory_balances__variant_id IS
    '가용 재고가 있는 변형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_balances__warehouse_variant
    ON ivm.inventory_balances (warehouse_id, variant_id)
 WHERE variant_id IS NOT NULL AND is_deleted = false;
COMMENT ON INDEX ivm.ix_inventory_balances__warehouse_variant IS
    '창고별 변형 재고 조회 인덱스';

-- Step 6: 주석 추가
COMMENT ON COLUMN ivm.inventory_balances.variant_id IS
    '제품 변형 식별자 - 옵션 조합별 재고 추적 (예: 셔츠_사이즈M_빨강색) (NULL: 변형 없는 제품)';

-- =====================================================================================
-- 2. SYS.USERS 개선
-- =====================================================================================
-- 목표: 사용자 감시 필드 추가, 로그인 추적
-- 현황: created_by 필드 누락, 로그인 이력 미지원
-- 영향: 사용자 생성자 추적, 마지막 로그인 시간 조회 가능

-- Step 1: 감시 필드 추가
ALTER TABLE sys.users
    ADD COLUMN IF NOT EXISTS created_by UUID,
    ADD COLUMN IF NOT EXISTS is_system_user BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS last_login_ip INET,
    ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;

-- Step 2: CHECK 제약 추가
ALTER TABLE sys.users
    ADD CONSTRAINT ck_users__failed_attempts CHECK (failed_login_attempts >= 0);

-- Step 3: 기존 인덱스 확인 및 추가
DROP INDEX IF EXISTS ix_users__email;
DROP INDEX IF EXISTS ix_users__last_login;

CREATE UNIQUE INDEX ux_users__email
    ON sys.users (email)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ux_users__email IS '사용자 이메일 유니크 제약';

CREATE INDEX ix_users__created_by
    ON sys.users (created_by)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_users__created_by IS '생성자별 사용자 조회 인덱스';

CREATE INDEX ix_users__last_login
    ON sys.users (last_login_at DESC NULLS LAST)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_users__last_login IS '마지막 로그인 시간 조회 인덱스';

CREATE INDEX ix_users__is_system_user
    ON sys.users (is_system_user)
 WHERE is_deleted = false;
COMMENT ON INDEX sys.ix_users__is_system_user IS '시스템 사용자 조회 인덱스';

-- Step 4: 주석 업데이트
COMMENT ON COLUMN sys.users.created_by IS '사용자 생성자 UUID';
COMMENT ON COLUMN sys.users.is_system_user IS '시스템 자동 생성 사용자 여부 (true: 시스템 사용자, false: 일반 사용자)';
COMMENT ON COLUMN sys.users.last_login_at IS '마지막 로그인 일시';
COMMENT ON COLUMN sys.users.last_login_ip IS '마지막 로그인 IP 주소';
COMMENT ON COLUMN sys.users.failed_login_attempts IS '실패한 로그인 시도 횟수 (보안: 5회 이상 계정 잠금)';

-- =====================================================================================
-- 3. SYS.SESSIONS 기본 구조 확인
-- =====================================================================================
-- 상태: 기존 파일 (13_sessions.sql) 에서 이미 정의됨
-- 불필요한 수정 없음

-- =====================================================================================
-- 4. SYS.USER_ROLES 제약 강화
-- =====================================================================================
-- 목표: 같은 사용자-역할 조합 중복 방지
-- 현황: 유니크 제약 미지원
-- 영향: 데이터 무결성 향상

ALTER TABLE sys.user_roles
    ADD CONSTRAINT uc_user_roles__user_role UNIQUE (user_id, role_id);
COMMENT ON CONSTRAINT uc_user_roles__user_role ON sys.user_roles IS
    '사용자-역할 조합 유니크 제약 (중복 할당 방지)';

-- 인덱스 최적화
DROP INDEX IF EXISTS ix_user_roles__user_id;
DROP INDEX IF EXISTS ix_user_roles__role_id;

CREATE INDEX ix_user_roles__user_id
    ON sys.user_roles (user_id)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_user_roles__user_id IS '활성 사용자별 역할 조회 인덱스';

CREATE INDEX ix_user_roles__role_id
    ON sys.user_roles (role_id)
 WHERE is_active = true;
COMMENT ON INDEX sys.ix_user_roles__role_id IS '역할별 사용자 조회 인덱스';

CREATE INDEX ix_user_roles__expires
    ON sys.user_roles (expires_at)
 WHERE expires_at IS NOT NULL AND is_active = true;
COMMENT ON INDEX sys.ix_user_roles__expires IS '임시 역할 만료 조회 인덱스';

-- =====================================================================================
-- 5. HRM.EMPLOYEES 보안 필드 추가
-- =====================================================================================
-- 목표: 개인정보 암호화 기반 구조 추가
-- 현황: id_number 평문 저장
-- 영향: 개인정보보호법 준수, 보안 강화

-- Step 1: 암호화된 컬럼 추가
ALTER TABLE hrm.employees
    ADD COLUMN IF NOT EXISTS id_number_encrypted BYTEA,
    ADD COLUMN IF NOT EXISTS phone_encrypted BYTEA,
    ADD COLUMN IF NOT EXISTS email_hash VARCHAR(255);

-- Step 2: 상태 및 이력 필드 추가
ALTER TABLE hrm.employees
    ADD COLUMN IF NOT EXISTS employee_status VARCHAR(50) DEFAULT 'ACTIVE',
    ADD COLUMN IF NOT EXISTS retirement_date DATE;

-- Step 3: CHECK 제약 추가
ALTER TABLE hrm.employees
    ADD CONSTRAINT ck_employees__status CHECK (
        employee_status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'RETIRED', 'TERMINATED')
    );

-- Step 4: 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_employees__department_status
    ON hrm.employees (department_id, employee_status)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__department_status IS '부서별 직원 상태 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_employees__email_hash
    ON hrm.employees (email_hash)
 WHERE is_deleted = false AND email_hash IS NOT NULL;
COMMENT ON INDEX hrm.ix_employees__email_hash IS '이메일 해시 조회 인덱스 (프라이버시 보호)';

CREATE INDEX IF NOT EXISTS ix_employees__status
    ON hrm.employees (employee_status)
 WHERE is_deleted = false;
COMMENT ON INDEX hrm.ix_employees__status IS '직원 상태별 조회 인덱스';

-- Step 5: 주석 추가
COMMENT ON COLUMN hrm.employees.id_number_encrypted IS '주민등록번호 암호화 저장 (pgp_sym_encrypt)';
COMMENT ON COLUMN hrm.employees.phone_encrypted IS '휴대폰 번호 암호화 저장';
COMMENT ON COLUMN hrm.employees.email_hash IS '이메일 해시 (조회용, 원본은 암호화 또는 마스킹)';
COMMENT ON COLUMN hrm.employees.employee_status IS '직원 상태 (ACTIVE: 근무중, INACTIVE: 비활성, ON_LEAVE: 휴가중, RETIRED: 퇴직, TERMINATED: 해고)';
COMMENT ON COLUMN hrm.employees.retirement_date IS '퇴직 일자';

-- =====================================================================================
-- 6. PIM.PRODUCT_VARIANTS 인덱스 최적화
-- =====================================================================================

DROP INDEX IF EXISTS ix_product_variants__product_id;

CREATE INDEX IF NOT EXISTS ix_product_variants__product_id_active
    ON pim.product_variants (product_id, is_active)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_product_variants__product_id_active IS '제품별 활성 변형 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_product_variants__sku
    ON pim.product_variants (sku)
 WHERE is_deleted = false;
COMMENT ON INDEX pim.ix_product_variants__sku IS '변형별 SKU 조회 인덱스';

-- =====================================================================================
-- 7. FIM.JOURNAL_ENTRIES 회계 무결성 강화
-- =====================================================================================
-- 목표: 차대평균 자동 검증, 결산 잠금 기능
-- 현황: 기본 구조만 존재
-- 영향: 회계 데이터 무결성, 실수 방지

-- Step 1: 컬럼 추가
ALTER TABLE fim.journal_entries
    ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS posted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS reference_doc_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS reference_doc_id UUID,
    ADD COLUMN IF NOT EXISTS memo TEXT;

-- Step 2: 강화된 CHECK 제약
ALTER TABLE fim.journal_entries
    ADD CONSTRAINT ck_je__debit_credit_balance
        CHECK (total_debit = total_credit),
    ADD CONSTRAINT ck_je__posting_logic
        CHECK (
            (status != 'POSTED' AND posted_at IS NULL)
            OR
            (status = 'POSTED' AND posted_at IS NOT NULL)
        );

-- Step 3: 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_journal_entries__posted_date
    ON fim.journal_entries (posted_at DESC NULLS LAST)
 WHERE status = 'POSTED';
COMMENT ON INDEX fim.ix_journal_entries__posted_date IS '결산된 전표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_journal_entries__reference
    ON fim.journal_entries (reference_doc_type, reference_doc_id)
 WHERE reference_doc_id IS NOT NULL;
COMMENT ON INDEX fim.ix_journal_entries__reference IS '원본 문서별 전표 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_journal_entries__period_status
    ON fim.journal_entries (period, status)
 WHERE status = 'POSTED';
COMMENT ON INDEX fim.ix_journal_entries__period_status IS '회계 기간-상태별 전표 조회 인덱스';

-- Step 4: 주석 추가
COMMENT ON COLUMN fim.journal_entries.is_locked IS '결산 후 수정 불가 플래그';
COMMENT ON COLUMN fim.journal_entries.posted_at IS '결산 확정 일시 (NULL: 미확정)';
COMMENT ON COLUMN fim.journal_entries.reference_doc_type IS '원본 문서 타입 (SALES_ORDER, PURCHASE_ORDER 등)';
COMMENT ON COLUMN fim.journal_entries.reference_doc_id IS '원본 문서 ID';
COMMENT ON COLUMN fim.journal_entries.memo IS '비고 (수정 사유, 참고 사항)';

-- =====================================================================================
-- 8. CRM.PARTNERS 신용 관리 개선
-- =====================================================================================

ALTER TABLE crm.partners
    ADD COLUMN IF NOT EXISTS credit_usage NUMERIC(18,4) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS credit_rating VARCHAR(10);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_partners__credit_rating
    ON crm.partners (credit_rating)
 WHERE is_deleted = false;

-- 주석 추가
COMMENT ON COLUMN crm.partners.credit_usage IS '신용한도 사용량 (캐시, 트리거로 업데이트)';
COMMENT ON COLUMN crm.partners.credit_rating IS '신용등급 (A, B, C, D, F)';

-- =====================================================================================
-- 9. IVM.INVENTORY_MOVEMENTS 이력 추적 개선
-- =====================================================================================

DROP INDEX IF EXISTS ix_inventory_movements__product_id;

CREATE INDEX IF NOT EXISTS ix_inventory_movements__product_created
    ON ivm.inventory_movements (product_id, created_at DESC)
 WHERE movement_type IN ('IN', 'OUT');
COMMENT ON INDEX ivm.ix_inventory_movements__product_created IS '제품별 입출고 이력 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_inventory_movements__warehouse_date
    ON ivm.inventory_movements (warehouse_id, created_at DESC)
 WHERE is_deleted = false;
COMMENT ON INDEX ivm.ix_inventory_movements__warehouse_date IS '창고별 재고 이동 이력 조회 인덱스';

-- =====================================================================================
-- 10. ADM.GLOSSARY 용어집 개선
-- =====================================================================================

ALTER TABLE adm.glossary
    ADD COLUMN IF NOT EXISTS category VARCHAR(50),
    ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS ix_glossary__category
    ON adm.glossary (category)
 WHERE is_deleted = false;

-- 주석 추가
COMMENT ON COLUMN adm.glossary.category IS '용어 분류 (재무, 구매, 판매 등)';
COMMENT ON COLUMN adm.glossary.usage_count IS '사용 빈도 (캐시용, 정기적 업데이트)';

-- =====================================================================================
-- 검증 쿼리
-- =====================================================================================

-- 변형 재고 일관성 확인
-- SELECT COUNT(*) as inventory_with_variants
-- FROM ivm.inventory_balances
-- WHERE variant_id IS NOT NULL;

-- 사용자 감시 필드 확인
-- SELECT COUNT(*) FROM sys.users WHERE created_by IS NOT NULL OR last_login_at IS NOT NULL;

-- 전표 차대평균 검증
-- SELECT id, total_debit, total_credit
-- FROM fim.journal_entries
-- WHERE total_debit != total_credit AND status = 'POSTED';

-- 트랜잭션 커밋
COMMIT;

-- =====================================================================================
-- 마이그레이션 완료 메시지
-- =====================================================================================
--
-- DDL 개선 Phase 2 (Tenant DB) 마이그레이션이 성공적으로 완료되었습니다.
--
-- 변경 사항 (P0 우선순위):
-- 1. ivm.inventory_balances: +variant_id (제품 변형 지원) ⭐
-- 2. sys.users: +created_by, +is_system_user, +last_login_at/ip, +failed_login_attempts
-- 3. sys.user_roles: UNIQUE 제약 추가
-- 4. hrm.employees: +암호화 필드, +상태 관리
-- 5. fim.journal_entries: +차대평균 검증, +결산 잠금 기능
-- 6. 기타: 인덱스 최적화, 체크 제약 강화
--
-- 주의사항:
-- 1. 애플리케이션에서 variant_id 처리 로직 추가 필요
-- 2. 암호화 필드(id_number_encrypted, phone_encrypted)는 별도 마이그레이션 배치 실행
-- 3. 기존 id_number 필드는 유지 (호환성), 새 데이터는 encrypted 컬럼 사용
-- 4. pgp_sym_encrypt 사용 시 'app.encryption_key' 설정 필수
--
-- =====================================================================================
