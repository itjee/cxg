# Tenant Database Schemas

## Overview

This directory contains the DDL (Data Definition Language) files for the tenant database schemas. Each file represents a functional domain within the ERP system.

## Schema List

### 📋 ADM - Administration (기준정보 관리)
- **File**: `adm.sql` (162KB)
- **Description**: 회사, 부서, 사원, 거래처, 제품, 창고 등 기준정보 관리
- **Key Tables**: 
  - 조직 관리 (회사, 부서, 사원)
  - 거래처 관리
  - 제품 관리
  - 창고 관리
  - 제조사 관리

### 🏢 ASM - Asset Management (자산 관리)
- **File**: `asm.sql` (3.2KB)
- **Description**: 고정자산, 감가상각, 유지보수 관리
- **Key Tables**: 자산등록, 자산이력

### 📊 BIM - Business Intelligence & Analytics (BI/분석)
- **File**: `bim.sql` (4.2KB)
- **Description**: 대시보드, 리포트, KPI, 데이터 분석
- **Key Tables**: 대시보드, 리포트, KPI

### 💬 COM - Communication (커뮤니케이션)
- **File**: `com.sql` (33KB)
- **Description**: 알림, 메시지, 캘린더, 이메일
- **Key Tables**: 
  - 알림/메시지
  - 캘린더/일정
  - 이메일 관리

### 🤝 CSM - Customer Service Management (고객 서비스)
- **File**: `csm.sql` (3.0KB)
- **Description**: CRM, 고객관리, 서비스티켓, 문의사항
- **Key Tables**: 고객관리, 서비스티켓

### 💰 FIM - Financial Management (재무 관리)
- **File**: `fim.sql` (5.9KB)
- **Description**: 회계, 원가, 예산, 결산
- **Key Tables**: 회계, 원가, 예산

### 📦 IVM - Inventory Management (재고 관리)
- **File**: `ivm.sql` (2.8KB)
- **Description**: 입출고, 재고조정, 재고실사
- **Key Tables**: 재고이동, 재고조정

### ✅ LWM - Workflow Management (워크플로우)
- **File**: `lwm.sql` (3.6KB)
- **Description**: 결재선, 결재진행, 결재이력
- **Key Tables**: 워크플로우, 결재

### 🛒 PSM - Procurement & Supply Management (구매/조달)
- **File**: `psm.sql` (3.8KB)
- **Description**: 구매요청, 구매발주, 입고, 매입
- **Key Tables**: 구매발주, 매입

### 💵 SRM - Sales & Revenue Management (판매/영업)
- **File**: `srm.sql` (3.7KB)
- **Description**: 판매주문, 출고, 매출, 견적
- **Key Tables**: 판매주문, 매출

### ⚙️ SYS - System Configuration (시스템 설정)
- **File**: `sys.sql` (18KB)
- **Description**: 코드 규칙, 시스템 설정, 권한
- **Key Tables**: 
  - 코드 규칙 관리 (sys_code_rules)
  - 시스템 설정
  - 권한 관리

## File Format

Each schema file follows this structure:

```sql
-- ============================================================================
-- [Schema Name] Schema ([abbreviation])
-- ============================================================================
-- Description: [Description in Korean]
-- Database: tnnt_db (Tenant Database)
-- Schema: [abbreviation]
-- Created: 2024-10-20
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS [abbreviation];

COMMENT ON SCHEMA [abbreviation] IS '[Description]';

-- Table definitions...
```

## Database Information

- **Database Name**: `tnnt_db`
- **PostgreSQL Version**: 15+
- **Multi-tenancy Strategy**: Schema per tenant

## Code Prefix Rules

The system uses the following master code prefixes (defined in `sys.sql`):

| Entity | Prefix | Digit Length | Example |
|--------|--------|--------------|---------|
| Company | MCO | 3 | MCO001 |
| Department | MDP | 3 | MDP001 |
| Partner | MBP | 4 | MBP0001 |
| Product | MPD | 5 | MPD00001 |
| Warehouse | MWH | 2 | MWH01 |
| Employee | MEM | 4 | MEM0001 |

## Usage

### Apply All Schemas

```bash
# Connect to tenant database
psql -U postgres -d tnnt_db

# Apply schemas in order
\i schemas/tenants/sys.sql
\i schemas/tenants/adm.sql
\i schemas/tenants/com.sql
\i schemas/tenants/fim.sql
\i schemas/tenants/ivm.sql
\i schemas/tenants/psm.sql
\i schemas/tenants/srm.sql
\i schemas/tenants/asm.sql
\i schemas/tenants/bim.sql
\i schemas/tenants/csm.sql
\i schemas/tenants/lwm.sql
```

### Apply Single Schema

```bash
psql -U postgres -d tnnt_db -f schemas/tenants/adm.sql
```

## Migration

Use Alembic for migrations:

```bash
cd apps/backend-api

# Generate migration
alembic revision --autogenerate -m "add_tenant_schemas"

# Apply migration
alembic upgrade head
```

## Notes

- All files are UTF-8 encoded
- Created from temp DDL files on 2024-10-20
- Follow manager schema format for consistency
- Include proper comments and constraints

## Related Documentation

- [Manager Schemas](../manager/README.md)
- [Code Rules Management](../../scripts/README_CODE_RULES.md)
- [Database Architecture](../../../docs/architecture/database.md)
