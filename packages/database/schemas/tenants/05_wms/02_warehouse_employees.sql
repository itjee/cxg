-- =====================================================================================
-- 테이블: wms.warehouse_employees
-- 설명: 창고 사원 배정 관리 테이블
-- 작성일: 2025-10-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS wms.warehouse_employees 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 창고사원 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by          UUID,                                                           -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by          UUID,                                                           -- 수정자 UUID
    
    -- 배정 기본 정보
    warehouse_id        UUID                     NOT NULL,                              -- 창고 식별자
    employee_id         UUID                     NOT NULL,                              -- 사원 식별자
    
    -- 역할 및 권한
    role_type           VARCHAR(20)              DEFAULT 'OPERATOR',                    -- 역할 유형
    is_primary          BOOLEAN                  DEFAULT false,                         -- 주담당자 여부
    access_level        VARCHAR(20)              DEFAULT 'READ_write',                  -- 접근 권한
    
    -- 알림 설정
    noti_receipt      BOOLEAN                  DEFAULT true,                          -- 입고 알림 여부
    noti_shipment     BOOLEAN                  DEFAULT true,                          -- 출고 알림 여부
    noti_cancel       BOOLEAN                  DEFAULT true,                          -- 취소 알림 여부
    noti_adjust       BOOLEAN                  DEFAULT false,                         -- 재고조정 알림 여부
    noti_emergency    BOOLEAN                  DEFAULT true,                          -- 긴급상황 알림 여부
    
    -- 알림 방법
    notify_method       VARCHAR(20)              DEFAULT 'EMAIL',                       -- 알림 방법
    notify_email        VARCHAR(255),                                                   -- 알림용 이메일
    notify_phone        VARCHAR(50),                                                    -- 알림용 전화번호
    
    -- 근무 정보
    work_shift          VARCHAR(20),                                                    -- 근무 시간대
    start_date          DATE,                                                           -- 배정 시작일
    close_date          DATE,                                                           -- 배정 종료일
    
    -- 상태 관리
    notes               TEXT,                                                           -- 비고
    status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태
    is_deleted          BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그
    
    -- 외래키 제약조건
    -- 창고 참조 외래키
    CONSTRAINT fk_warehouse_employees__warehouse_id     FOREIGN KEY (warehouse_id) 
                                                        REFERENCES wms.warehouses(id),
    
    -- 사원 참조 외래키
    CONSTRAINT fk_warehouse_employees__employee_id      FOREIGN KEY (employee_id) 
                                                        REFERENCES hrm.employees(id),
    
    -- 등록자 참조 외래키
    CONSTRAINT fk_warehouse_employees__created_by       FOREIGN KEY (created_by) 
                                                        REFERENCES hrm.employees(id),
    
    -- 수정자 참조 외래키
    CONSTRAINT fk_warehouse_employees__updated_by       FOREIGN KEY (updated_by) 
                                                        REFERENCES hrm.employees(id),
    
    -- CHECK 제약조건
    -- 역할 유형 체크 (MANAGER: 관리자, SUPERVISOR: 감독자, OPERATOR: 작업자, PICKER: 피커, PACKER: 포장자, LOADER: 적재자, CHECKER: 검수자, ADMIN: 관리자)
    CONSTRAINT ck_warehouse_employees__role_type_format     CHECK (role_type IN ('MANAGER', 'SUPERVISOR', 'OPERATOR', 'PICKER', 'PACKER', 'LOADER', 'CHECKER', 'ADMIN')),
    
    -- 접근 권한 체크 (read_only: 읽기전용, read_write: 읽기쓰기, admin: 관리자, full_control: 전체권한)
    CONSTRAINT ck_warehouse_employees__access_level_format  CHECK (access_level IN ('read_only', 'read_write', 'admin', 'full_control')),
    
    -- 알림 방법 체크 (EMAIL: 이메일, SMS: 문자, PHONE: 전화, PUSH: 푸시알림, ALL: 모두)
    CONSTRAINT ck_warehouse_employees__notify_method        CHECK (notify_method IN ('EMAIL', 'SMS', 'PHONE', 'PUSH', 'ALL')),
    
    -- 근무 시간대 체크 (DAY: 주간, NIGHT: 야간, SWING: 교대, ROTATING: 순환, FLEXIBLE: 유연)
    CONSTRAINT ck_warehouse_employees__work_shift_format    CHECK (work_shift IS NULL OR work_shift IN ('DAY', 'NIGHT', 'SWING', 'ROTATING', 'FLEXIBLE')),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, SUSPENDED: 일시중지, TERMINATED: 해지)
    CONSTRAINT ck_warehouse_employees__status_format        CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED')),
    
    -- 이메일 형식 체크 (표준 이메일 형식)
    CONSTRAINT ck_warehouse_employees__email_format         CHECK (notify_email IS NULL OR notify_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- 전화번호 형식 체크 (숫자, 하이픈, 플러스, 괄호, 공백 허용, 8-20자)
    CONSTRAINT ck_warehouse_employees__phone_format         CHECK (notify_phone IS NULL OR notify_phone ~ '^[0-9\-\+\(\)\s]{8,20}$'),
    
    -- 날짜 범위 유효성 체크 (종료일이 시작일보다 이후여야 함)
    CONSTRAINT ck_warehouse_employees__date_range_valid     CHECK (close_date IS NULL OR start_date IS NULL OR close_date >= start_date)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  wms.warehouse_employees                   IS '창고별 사원 배정 및 알림 설정 관리 테이블';
COMMENT ON COLUMN wms.warehouse_employees.id                IS '창고사원 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.warehouse_employees.created_at        IS '등록 일시';
COMMENT ON COLUMN wms.warehouse_employees.created_by        IS '등록자 UUID';
COMMENT ON COLUMN wms.warehouse_employees.updated_at        IS '수정 일시';
COMMENT ON COLUMN wms.warehouse_employees.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN wms.warehouse_employees.warehouse_id      IS '창고 식별자';
COMMENT ON COLUMN wms.warehouse_employees.employee_id       IS '사원 식별자';
COMMENT ON COLUMN wms.warehouse_employees.role_type         IS '역할 유형 (MANAGER/SUPERVISOR/OPERATOR/PICKER/PACKER/LOADER/CHECKER/ADMIN)';
COMMENT ON COLUMN wms.warehouse_employees.is_primary        IS '주담당자 여부';
COMMENT ON COLUMN wms.warehouse_employees.access_level      IS '접근 권한 (read_only/read_write/admin/full_control)';
COMMENT ON COLUMN wms.warehouse_employees.noti_receipt    IS '입고 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.noti_shipment   IS '출고 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.noti_cancel     IS '취소 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.noti_adjust     IS '재고조정 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.noti_emergency  IS '긴급상황 알림 여부';
COMMENT ON COLUMN wms.warehouse_employees.notify_method     IS '알림 방법 (EMAIL/SMS/PHONE/PUSH/ALL)';
COMMENT ON COLUMN wms.warehouse_employees.notify_email      IS '알림용 이메일';
COMMENT ON COLUMN wms.warehouse_employees.notify_phone      IS '알림용 전화번호';
COMMENT ON COLUMN wms.warehouse_employees.work_shift        IS '근무 시간대 (DAY/NIGHT/SWING/ROTATING/FLEXIBLE)';
COMMENT ON COLUMN wms.warehouse_employees.start_date        IS '배정 시작일';
COMMENT ON COLUMN wms.warehouse_employees.close_date        IS '배정 종료일';
COMMENT ON COLUMN wms.warehouse_employees.notes             IS '비고';
COMMENT ON COLUMN wms.warehouse_employees.status            IS '상태 (ACTIVE/INACTIVE/SUSPENDED/TERMINATED)';
COMMENT ON COLUMN wms.warehouse_employees.is_deleted        IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__warehouse_id
    ON wms.warehouse_employees (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__warehouse_id IS '창고별 사원 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__employee_id
    ON wms.warehouse_employees (employee_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__employee_id IS '사원별 창고 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__role_type
    ON wms.warehouse_employees (role_type, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__role_type IS '역할별 창고사원 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__primary
    ON wms.warehouse_employees (warehouse_id, is_primary)
 WHERE is_primary = true 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__primary IS '창고별 주담당자 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__access_level
    ON wms.warehouse_employees (access_level, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__access_level IS '접근 권한별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__notifications
    ON wms.warehouse_employees (warehouse_id, notify_method)
 WHERE (noti_receipt = true OR noti_shipment = true OR noti_cancel = true OR noti_emergency = true)
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__notifications IS '알림 설정 사원 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__work_shift
    ON wms.warehouse_employees (work_shift, warehouse_id)
 WHERE work_shift IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__work_shift IS '근무 시간대별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_employees__date_range
    ON wms.warehouse_employees (start_date, close_date, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_employees__date_range IS '배정 기간별 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_employees__warehouse_employee_active
    ON wms.warehouse_employees (warehouse_id, employee_id)
 WHERE status = 'ACTIVE' 
   AND is_deleted = false;
COMMENT ON INDEX wms.ux_warehouse_employees__warehouse_employee_active IS '창고별 사원 중복 배정 방지 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_employees__warehouse_primary
    ON wms.warehouse_employees (warehouse_id)
 WHERE is_primary = true 
   AND status = 'ACTIVE'
   AND is_deleted = false;
COMMENT ON INDEX wms.ux_warehouse_employees__warehouse_primary IS '창고별 주담당자는 하나만 제약';
