-- ============================================================================
-- ConexGrow Tenant Database Schema Initialization
-- ============================================================================
-- Description: 모든 스키마 생성 및 실행 순서 관리
-- Database: tnnt_db (Tenant Database)
-- Created: 2025-01-20
-- ============================================================================
-- 
-- 실행 방법:
--   psql -U username -d tnnt_db -f init.sql
-- 
-- 또는 개별 실행:
--   \i 01_adm.sql
--   \i 02_hrm.sql
--   ...
-- ============================================================================

\echo ''
\echo '╔════════════════════════════════════════════════════════════════╗'
\echo '║     ConexGrow Tenant Database Schema Creation                 ║'
\echo '╚════════════════════════════════════════════════════════════════╝'
\echo ''

-- ============================================================================
-- Phase 1: 공통 기준정보
-- ============================================================================

\echo '[Phase 1/5] Creating Common Administration Schema...'
\i 01_adm.sql
\echo '✅ adm schema created'
\echo ''

-- ============================================================================
-- Phase 2: 마스터 데이터 스키마
-- ============================================================================

\echo '[Phase 2/5] Creating Master Data Schemas...'

\echo '  [2-1] Creating HRM (Human Resources Management) schema...'
\i 02_hrm.sql
\echo '  ✅ hrm schema created'

\echo '  [2-2] Creating CRM (Customer Relationship Management) schema...'
\i 03_crm.sql
\echo '  ✅ crm schema created'

\echo '  [2-3] Creating PIM (Product Information Management) schema...'
\i 04_pim.sql
\echo '  ✅ pim schema created'

\echo '  [2-4] Creating WMS (Warehouse Management System) schema...'
\i 05_wms.sql
\echo '  ✅ wms schema created'

\echo ''

-- ============================================================================
-- Phase 3: 워크플로우
-- ============================================================================

\echo '[Phase 3/5] Creating Workflow Schema...'
\i 06_apm.sql
\echo '✅ apm schema created'
\echo ''

-- ============================================================================
-- Phase 4: 업무 트랜잭션 스키마
-- ============================================================================

\echo '[Phase 4/5] Creating Transaction Schemas...'

\echo '  [4-1] Creating IVM (Inventory Management) schema...'
\i 10_ivm.sql
\echo '  ✅ ivm schema created'

\echo '  [4-2] Creating PSM (Procurement/Purchasing Management) schema...'
\i 11_psm.sql
\echo '  ✅ psm schema created'

\echo '  [4-3] Creating SRM (Sales/Revenue Management) schema...'
\i 12_srm.sql
\echo '  ✅ srm schema created'

\echo '  [4-4] Creating ASM (Asset/After-Sales Management) schema...'
\i 13_asm.sql
\echo '  ✅ asm schema created'

\echo '  [4-5] Creating FIM (Finance/Accounting Management) schema...'
\i 14_fim.sql
\echo '  ✅ fim schema created'

\echo ''

-- ============================================================================
-- Phase 5: 지원 기능 스키마
-- ============================================================================

\echo '[Phase 5/5] Creating Support Schemas...'

\echo '  [5-1] Creating BIM (BI/Analytics) schema...'
\i 20_bim.sql
\echo '  ✅ bim schema created'

\echo '  [5-2] Creating COM (Communication) schema...'
\i 21_com.sql
\echo '  ✅ com schema created'

\echo '  [5-3] Creating SYS (System Configuration) schema...'
\i 22_sys.sql
\echo '  ✅ sys schema created'

\echo ''

-- ============================================================================
-- 완료
-- ============================================================================

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '✅ All schemas created successfully!'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''
\echo 'Schema Summary:'
\echo '  ├── adm  - Common Administration'
\echo '  ├── hrm  - Human Resources Management'
\echo '  ├── crm  - Customer Relationship Management'
\echo '  ├── pim  - Product Information Management'
\echo '  ├── wms  - Warehouse Management System'
\echo '  ├── apm  - Approval/Workflow Management'
\echo '  ├── ivm  - Inventory Management'
\echo '  ├── psm  - Procurement/Purchasing Management'
\echo '  ├── srm  - Sales/Revenue Management'
\echo '  ├── asm  - Asset/After-Sales Management'
\echo '  ├── fim  - Finance/Accounting Management'
\echo '  ├── bim  - BI/Analytics'
\echo '  ├── com  - Communication'
\echo '  └── sys  - System Configuration'
\echo ''
\echo 'Total: 14 schemas'
\echo ''
