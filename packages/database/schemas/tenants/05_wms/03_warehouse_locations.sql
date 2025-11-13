-- =====================================================================================
-- 테이블: wms.warehouse_locations
-- 설명: 창고 내 로케이션 (보관 위치) 관리 테이블
-- 작성일: 2025-10-20
-- 수정일: 2025-10-23
-- =====================================================================================

CREATE TABLE IF NOT EXISTS wms.warehouse_locations 
(
    -- 기본 식별자 및 감사 필드
    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 로케이션 고유 식별자 (UUID)
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시
    created_by          UUID,                                                           -- 등록자 UUID
    updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시
    updated_by          UUID,                                                           -- 수정자 UUID
    
    -- 로케이션 기본 정보
    warehouse_id        UUID                     NOT NULL,                              -- 창고 식별자
    location_code       VARCHAR(50)              NOT NULL,                              -- 로케이션 코드
    location_name       VARCHAR(100)             NOT NULL,                              -- 로케이션명
    location_type       VARCHAR(20)              DEFAULT 'BIN',                         -- 로케이션 유형
    
    -- 계층 구조 정보
    parent_id           UUID,                                                           -- 상위 로케이션 식별자
    level_depth         INTEGER                  DEFAULT 1,                             -- 계층 깊이
    full_path           VARCHAR(500),                                                   -- 전체 경로 (예: ZONE-A/AISLE-01/RACK-001/BIN-A001)
    
    -- 물리적 정보
    zone                VARCHAR(20),                                                    -- 구역 코드
    aisle               VARCHAR(20),                                                    -- 통로 코드
    rack                VARCHAR(20),                                                    -- 랙 코드
    bin                 VARCHAR(20),                                                    -- 빈 코드
    
    -- 위치 좌표 (선택적)
    x_coordinate        NUMERIC(10,2),                                                  -- X 좌표
    y_coordinate        NUMERIC(10,2),                                                  -- Y 좌표
    z_coordinate        NUMERIC(10,2),                                                  -- Z 좌표 (높이)
    
    -- 용량 및 규격 정보
    capacity_weight     NUMERIC(12,2),                                                  -- 중량 용량 (kg)
    capacity_volume     NUMERIC(12,2),                                                  -- 부피 용량 (㎥)
    capacity_units      INTEGER,                                                        -- 단위 용량 (개수)
    width_cm            NUMERIC(8,2),                                                   -- 가로 (cm)
    height_cm           NUMERIC(8,2),                                                   -- 세로 (cm)
    depth_cm            NUMERIC(8,2),                                                   -- 깊이 (cm)
    
    -- 로케이션 속성
    is_pickable         BOOLEAN                  DEFAULT true,                          -- 피킹 가능 여부
    is_receivable       BOOLEAN                  DEFAULT true,                          -- 입고 가능 여부
    is_virtual          BOOLEAN                  DEFAULT false,                         -- 가상 로케이션 여부
    is_damaged_area     BOOLEAN                  DEFAULT false,                         -- 불량품 구역 여부
    is_quarantine       BOOLEAN                  DEFAULT false,                         -- 격리 구역 여부
    
    -- 환경 조건
    temperature_min     NUMERIC(5,2),                                                   -- 최저 온도 (℃)
    temperature_max     NUMERIC(5,2),                                                   -- 최고 온도 (℃)
    humidity_min        NUMERIC(5,2),                                                   -- 최저 습도 (%)
    humidity_max        NUMERIC(5,2),                                                   -- 최고 습도 (%)
    
    -- 정렬 및 우선순위
    sort_order          INTEGER                  DEFAULT 0,                             -- 정렬 순서
    picking_priority    INTEGER                  DEFAULT 0,                             -- 피킹 우선순위
    
    -- 바코드 및 RFID
    barcode             VARCHAR(100),                                                   -- 바코드
    rfid_tag            VARCHAR(100),                                                   -- RFID 태그
    
    -- 추가 정보
    description         TEXT,                                                           -- 로케이션 설명    
    
    -- 상태 관리
    notes               TEXT,                                                           -- 비고
    status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태
    is_deleted          BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그
    
    -- 외래키 제약조건
    -- 창고 참조 외래키 (창고 삭제 시 로케이션도 함께 삭제)
    CONSTRAINT fk_warehouse_locations__warehouse_id     FOREIGN KEY (warehouse_id)  
                                                        REFERENCES wms.warehouses(id)   
                                                        ON DELETE CASCADE,
    
    -- 상위 로케이션 참조 외래키 (상위 로케이션 삭제 시 하위도 함께 삭제)
    CONSTRAINT fk_warehouse_locations__parent_id        FOREIGN KEY (parent_id)  
                                                        REFERENCES wms.warehouse_locations(id) 
                                                        ON DELETE CASCADE,
    
    -- CHECK 제약조건
    -- 로케이션 코드 형식 체크 (영문 대문자, 숫자, 하이픈, 언더스코어, 1-50자)
    CONSTRAINT ck_warehouse_locations__location_code_format     CHECK (location_code ~ '^[A-Z0-9\-_]{1,50}$'),
    
    -- 로케이션 유형 체크 (ZONE: 구역, AISLE: 통로, RACK: 랙, SHELF: 선반, BIN: 빈, PALLET: 파렛트, FLOOR: 바닥, DOOR: 문, STAGING: 스테이징, VIRTUAL: 가상)
    CONSTRAINT ck_warehouse_locations__location_type_format     CHECK (location_type IN ('ZONE', 'AISLE', 'RACK', 'SHELF', 'BIN', 'PALLET', 'FLOOR', 'DOOR', 'STAGING', 'VIRTUAL')),
    
    -- 계층 깊이 범위 체크 (1~10단계)
    CONSTRAINT ck_warehouse_locations__level_depth_range        CHECK (level_depth BETWEEN 1 AND 10),
    
    -- 중량 용량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__capacity_positive        CHECK (capacity_weight IS NULL OR capacity_weight >= 0),
    
    -- 부피 용량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__volume_positive          CHECK (capacity_volume IS NULL OR capacity_volume >= 0),
    
    -- 단위 용량 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__units_positive           CHECK (capacity_units IS NULL OR capacity_units >= 0),
    
    -- 규격 양수 체크 (가로, 세로, 깊이 모두 0보다 커야 함)
    CONSTRAINT ck_warehouse_locations__dimensions_positive      CHECK ((width_cm IS NULL OR width_cm > 0) AND (height_cm IS NULL OR height_cm > 0) AND (depth_cm IS NULL OR depth_cm > 0)),
    
    -- 온도 범위 체크 (최저온도가 최고온도보다 낮거나 같아야 함)
    CONSTRAINT ck_warehouse_locations__temperature_range        CHECK ((temperature_min IS NULL OR temperature_max IS NULL) OR temperature_min <= temperature_max),
    
    -- 습도 범위 체크 (최저습도가 최고습도보다 낮거나 같고, 0~100% 범위 내여야 함)
    CONSTRAINT ck_warehouse_locations__humidity_range           CHECK ((humidity_min IS NULL OR humidity_max IS NULL) OR (humidity_min <= humidity_max AND humidity_min >= 0 AND humidity_max <= 100)),
    
    -- 정렬 순서 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__sort_order_positive      CHECK (sort_order >= 0),
    
    -- 피킹 우선순위 음수 불가 체크 (0 이상)
    CONSTRAINT ck_warehouse_locations__picking_priority         CHECK (picking_priority >= 0),
    
    -- 상태 체크 (ACTIVE: 활성, INACTIVE: 비활성, MAINTENANCE: 보수중, BLOCKED: 차단됨, DAMAGED: 손상됨, RESERVED: 예약됨)
    CONSTRAINT ck_warehouse_locations__status_format            CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'BLOCKED', 'DAMAGED', 'RESERVED')),
    
    -- 자기 참조 방지 체크 (부모 로케이션이 자기 자신이 될 수 없음)
    CONSTRAINT ck_warehouse_locations__parent_not_self          CHECK (parent_id != id)
);

-- =====================================================================================
-- 테이블 및 컬럼 COMMENT
-- =====================================================================================

COMMENT ON TABLE  wms.warehouse_locations                   IS '창고 로케이션 정보 관리 테이블';
COMMENT ON COLUMN wms.warehouse_locations.id                IS '로케이션 고유 식별자 (UUID)';
COMMENT ON COLUMN wms.warehouse_locations.created_at        IS '등록 일시';
COMMENT ON COLUMN wms.warehouse_locations.created_by        IS '등록자 UUID';
COMMENT ON COLUMN wms.warehouse_locations.updated_at        IS '수정 일시';
COMMENT ON COLUMN wms.warehouse_locations.updated_by        IS '수정자 UUID';
COMMENT ON COLUMN wms.warehouse_locations.warehouse_id      IS '창고 식별자';
COMMENT ON COLUMN wms.warehouse_locations.location_code     IS '로케이션 코드';
COMMENT ON COLUMN wms.warehouse_locations.location_name     IS '로케이션명';
COMMENT ON COLUMN wms.warehouse_locations.location_type     IS '로케이션 유형 (ZONE/AISLE/RACK/SHELF/BIN/PALLET/FLOOR/DOOR/STAGING/VIRTUAL)';
COMMENT ON COLUMN wms.warehouse_locations.parent_id         IS '상위 로케이션 식별자 (계층구조)';
COMMENT ON COLUMN wms.warehouse_locations.level_depth       IS '계층 깊이 (1=ZONE, 2=AISLE, 3=RACK, 4=BIN)';
COMMENT ON COLUMN wms.warehouse_locations.full_path         IS '전체 경로 (ZONE-A/AISLE-01/RACK-001/BIN-A001)';
COMMENT ON COLUMN wms.warehouse_locations.zone         IS '구역 코드';
COMMENT ON COLUMN wms.warehouse_locations.aisle        IS '통로 코드';
COMMENT ON COLUMN wms.warehouse_locations.rack         IS '랙 코드';
COMMENT ON COLUMN wms.warehouse_locations.bin          IS '빈 코드';
COMMENT ON COLUMN wms.warehouse_locations.x_coordinate      IS 'X 좌표';
COMMENT ON COLUMN wms.warehouse_locations.y_coordinate      IS 'Y 좌표';
COMMENT ON COLUMN wms.warehouse_locations.z_coordinate      IS 'Z 좌표 (높이)';
COMMENT ON COLUMN wms.warehouse_locations.capacity_weight   IS '중량 용량 (kg)';
COMMENT ON COLUMN wms.warehouse_locations.capacity_volume   IS '부피 용량 (㎥)';
COMMENT ON COLUMN wms.warehouse_locations.capacity_units    IS '단위 용량 (개수)';
COMMENT ON COLUMN wms.warehouse_locations.width_cm          IS '가로 (cm)';
COMMENT ON COLUMN wms.warehouse_locations.height_cm         IS '세로 (cm)';
COMMENT ON COLUMN wms.warehouse_locations.depth_cm          IS '깊이 (cm)';
COMMENT ON COLUMN wms.warehouse_locations.is_pickable       IS '피킹 가능 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_receivable     IS '입고 가능 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_virtual        IS '가상 로케이션 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_damaged_area   IS '불량품 구역 여부';
COMMENT ON COLUMN wms.warehouse_locations.is_quarantine     IS '격리 구역 여부';
COMMENT ON COLUMN wms.warehouse_locations.temperature_min   IS '최저 온도 (℃)';
COMMENT ON COLUMN wms.warehouse_locations.temperature_max   IS '최고 온도 (℃)';
COMMENT ON COLUMN wms.warehouse_locations.humidity_min      IS '최저 습도 (%)';
COMMENT ON COLUMN wms.warehouse_locations.humidity_max      IS '최고 습도 (%)';
COMMENT ON COLUMN wms.warehouse_locations.sort_order        IS '정렬 순서';
COMMENT ON COLUMN wms.warehouse_locations.picking_priority  IS '피킹 우선순위';
COMMENT ON COLUMN wms.warehouse_locations.barcode           IS '바코드';
COMMENT ON COLUMN wms.warehouse_locations.rfid_tag          IS 'RFID 태그';
COMMENT ON COLUMN wms.warehouse_locations.description       IS '로케이션 설명';
COMMENT ON COLUMN wms.warehouse_locations.notes             IS '비고';
COMMENT ON COLUMN wms.warehouse_locations.status            IS '상태 (ACTIVE/INACTIVE/MAINTENANCE/BLOCKED/DAMAGED/RESERVED)';
COMMENT ON COLUMN wms.warehouse_locations.is_deleted        IS '논리 삭제 플래그';

-- =====================================================================================
-- 인덱스 (INDEX)
-- =====================================================================================

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__warehouse_id
    ON wms.warehouse_locations (warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__warehouse_id IS '창고별 로케이션 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__location_code
    ON wms.warehouse_locations (location_code)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__location_code IS '로케이션 코드별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__parent_id
    ON wms.warehouse_locations (parent_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__parent_id IS '상위 로케이션별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__level_depth
    ON wms.warehouse_locations (warehouse_id, level_depth, sort_order)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__level_depth IS '창고별 계층 깊이 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__location_type
    ON wms.warehouse_locations (location_type, warehouse_id)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__location_type IS '로케이션 유형별 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__zone
    ON wms.warehouse_locations (zone)
 WHERE zone IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__zone IS '구역별 로케이션 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__picking
    ON wms.warehouse_locations (warehouse_id, is_pickable, picking_priority, sort_order)
 WHERE is_pickable = true 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__picking IS '피킹 최적화 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__receivable
    ON wms.warehouse_locations (warehouse_id, is_receivable)
 WHERE is_receivable = true 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__receivable IS '입고 가능 로케이션 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__coordinates
    ON wms.warehouse_locations (warehouse_id, x_coordinate, y_coordinate, z_coordinate)
 WHERE x_coordinate IS NOT NULL 
   AND y_coordinate IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__coordinates IS '좌표 기반 로케이션 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__barcode
    ON wms.warehouse_locations (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__barcode IS '바코드별 로케이션 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__rfid_tag
    ON wms.warehouse_locations (rfid_tag)
 WHERE rfid_tag IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__rfid_tag IS 'RFID 태그별 로케이션 조회 인덱스';

CREATE INDEX IF NOT EXISTS ix_warehouse_locations__full_path
    ON wms.warehouse_locations (full_path)
 WHERE full_path IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ix_warehouse_locations__full_path IS '전체 경로별 로케이션 조회 인덱스';

-- =====================================================================================
-- 유니크 인덱스 (UNIQUE INDEX)
-- =====================================================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_locations__warehouse_code
    ON wms.warehouse_locations (warehouse_id, location_code)
 WHERE is_deleted = false;
COMMENT ON INDEX wms.ux_warehouse_locations__warehouse_code IS '창고별 로케이션 코드 유니크 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_locations__barcode
    ON wms.warehouse_locations (barcode)
 WHERE barcode IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ux_warehouse_locations__barcode IS '로케이션 바코드 유니크 제약';

CREATE UNIQUE INDEX IF NOT EXISTS ux_warehouse_locations__rfid_tag
    ON wms.warehouse_locations (rfid_tag)
 WHERE rfid_tag IS NOT NULL 
   AND is_deleted = false;
COMMENT ON INDEX wms.ux_warehouse_locations__rfid_tag IS '로케이션 RFID 태그 유니크 제약';
