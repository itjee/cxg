#!/usr/bin/env python3
"""
레거시 MSSQL 테이블을 현대적인 PostgreSQL 스키마로 변환하는 마이그레이션 스크립트 생성기

사용법:
    python generate_migration_from_legacy.py

이 스크립트는:
1. tmp_old_tables의 레거시 테이블 DDL 파일들을 분석
2. 현재 tenants 스키마의 테이블들과 비교
3. 필요한 컬럼 추가 또는 신규 테이블 생성 스크립트 작성
4. 현대적인 패턴 (UUID, timestamp, check, index 등) 적용
"""

import re
import os
from pathlib import Path
from typing import Dict, List, Set, Tuple
from datetime import datetime

# 레거시 테이블 명명 규칙 매핑
LEGACY_TABLE_PREFIXES = {
    'TBS_': 'adm',  # Base/Master data -> Administration
    'TSD_': 'srm',  # Sales data -> Sales/Revenue Management
    'TMM_': 'psm',  # Material Management -> Procurement/Supply Management  
    'TIV_': 'ivm',  # Inventory -> Inventory Management
    'TFI_': 'fim',  # Finance -> Finance/Accounting Management
    'TEA_': 'lwm',  # Electronic Approval -> Workflow Management
    'TCO_': 'bim',  # Cost -> BI/Analytics
    'TSR_': 'srm',  # Sales Rental -> Sales/Revenue Management
    'TSS_': 'sys',  # System -> System Configuration
}

# 레거시 컬럼명 -> 현대적 컬럼명 매핑
COLUMN_NAME_MAPPING = {
    'ID': 'id',
    'CREATE_ON': 'created_at',
    'CREATE_BY': 'created_by_name',
    'CREATE_ID': 'created_by',
    'UPDATE_ON': 'updated_at',
    'UPDATE_BY': 'updated_by_name',
    'UPDATE_ID': 'updated_by',
    'USE_YN': 'is_active',
    'NOTES': 'description',
    'TEL_NO': 'phone',
    'FAX_NO': 'fax',
    'CEL_NO': 'mobile',
    'EMAIL': 'email',
    'POST_CD': 'postcode',
    'ADDRESS': 'address1',
    'BLDG_NM': 'address2',
}

# MSSQL -> PostgreSQL 데이터 타입 매핑
DATATYPE_MAPPING = {
    'int': 'INTEGER',
    'bigint': 'BIGINT',
    'smallint': 'SMALLINT',
    'tinyint': 'SMALLINT',
    'bit': 'BOOLEAN',
    'decimal': 'NUMERIC',
    'numeric': 'NUMERIC',
    'money': 'NUMERIC(19,4)',
    'float': 'DOUBLE PRECISION',
    'real': 'REAL',
    'datetime': 'TIMESTAMP WITH TIME ZONE',
    'datetime2': 'TIMESTAMP WITH TIME ZONE',
    'date': 'DATE',
    'time': 'TIME',
    'char': 'CHAR',
    'varchar': 'VARCHAR',
    'nchar': 'CHAR',
    'nvarchar': 'VARCHAR',
    'text': 'TEXT',
    'ntext': 'TEXT',
    'uniqueidentifier': 'UUID',
}


class LegacyTableParser:
    """레거시 MSSQL 테이블 DDL 파싱"""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.table_name = None
        self.columns = []
        self.indexes = []
        self.unique_indexes = []
        
    def parse(self) -> Dict:
        """파일을 파싱하여 테이블 정보 추출"""
        try:
            # UTF-16 LE 인코딩으로 읽기 시도
            with open(self.file_path, 'r', encoding='utf-16-le') as f:
                content = f.read()
        except UnicodeDecodeError:
            # 실패하면 UTF-8로 시도
            with open(self.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        
        # 공백 제거 및 정규화
        content = ' '.join(content.split())
        
        # 테이블명 추출
        table_match = re.search(r'CREATE\s+TABLE\s+\[dbo\]\.\[(\w+)\]', content, re.IGNORECASE)
        if table_match:
            self.table_name = table_match.group(1)
        
        # 컬럼 정의 추출
        columns_match = re.search(r'CREATE\s+TABLE.*?\((.*?)\s+CONSTRAINT', content, re.IGNORECASE | re.DOTALL)
        if columns_match:
            self._parse_columns(columns_match.group(1))
        
        # 인덱스 추출
        self._parse_indexes(content)
        
        return {
            'table_name': self.table_name,
            'columns': self.columns,
            'indexes': self.indexes,
            'unique_indexes': self.unique_indexes
        }
    
    def _parse_columns(self, columns_text: str):
        """컬럼 정의 파싱"""
        # 각 컬럼 라인 분리
        column_lines = re.findall(r'\[(\w+)\]\s+\[?(\w+)\]?(?:\(([^)]+)\))?\s+(.*?)(?=,\s*\[|$)', columns_text)
        
        for match in column_lines:
            if len(match) < 4:
                continue
            col_name, col_type, col_size, col_constraint = match
            # 타입 변환
            pg_type = DATATYPE_MAPPING.get(col_type.lower(), 'TEXT')
            
            if col_size and pg_type in ['VARCHAR', 'CHAR', 'NUMERIC']:
                if pg_type == 'NUMERIC' and ',' in col_size:
                    pg_type = f'{pg_type}({col_size})'
                elif pg_type in ['VARCHAR', 'CHAR']:
                    # max는 TEXT로
                    if col_size.lower() == 'max':
                        pg_type = 'TEXT'
                    else:
                        pg_type = f'{pg_type}({col_size})'
            
            # NOT NULL 체크
            nullable = 'NOT NULL' not in col_constraint.upper()
            
            # IDENTITY 체크
            is_identity = 'IDENTITY' in col_constraint.upper()
            
            self.columns.append({
                'name': col_name,
                'type': pg_type,
                'nullable': nullable,
                'is_identity': is_identity,
                'original_type': col_type
            })
    
    def _parse_indexes(self, content: str):
        """인덱스 추출"""
        # UNIQUE INDEX
        unique_indexes = re.findall(
            r'CREATE\s+UNIQUE.*?INDEX\s+\[(\w+)\].*?ON.*?\((.*?)\)',
            content,
            re.IGNORECASE
        )
        for idx_name, idx_cols in unique_indexes:
            cols = [c.strip().strip('[]') for c in idx_cols.split(',')]
            self.unique_indexes.append({
                'name': idx_name,
                'columns': cols
            })
        
        # 일반 INDEX
        indexes = re.findall(
            r'CREATE\s+(?:NONCLUSTERED\s+)?INDEX\s+\[(\w+)\].*?ON.*?\((.*?)\)',
            content,
            re.IGNORECASE
        )
        for idx_name, idx_cols in indexes:
            if idx_name not in [u['name'] for u in self.unique_indexes]:
                cols = [c.strip().strip('[]').split()[0] for c in idx_cols.split(',')]
                self.columns.append({
                    'name': idx_name,
                    'columns': cols
                })


class CurrentSchemaAnalyzer:
    """현재 PostgreSQL 스키마 분석"""
    
    def __init__(self, schema_dir: str):
        self.schema_dir = Path(schema_dir)
        self.tables = {}
        
    def analyze(self):
        """현재 스키마의 모든 테이블 정보 수집"""
        for sql_file in self.schema_dir.glob('*.sql'):
            if sql_file.name.startswith('init') or 'backup' in sql_file.name:
                continue
            
            with open(sql_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 테이블 추출
            tables = re.findall(
                r'CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)\.(\w+)\s*\((.*?)(?=\);)',
                content,
                re.IGNORECASE | re.DOTALL
            )
            
            for schema, table_name, table_def in tables:
                # 컬럼 추출
                columns = self._extract_columns(table_def)
                
                key = f"{schema}.{table_name}"
                self.tables[key] = {
                    'schema': schema,
                    'table': table_name,
                    'columns': columns,
                    'file': sql_file.name
                }
    
    def _extract_columns(self, table_def: str) -> Set[str]:
        """테이블 정의에서 컬럼명 추출"""
        columns = set()
        lines = table_def.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('--') or line.startswith('CONSTRAINT'):
                continue
            
            # 컬럼명 추출 (첫 번째 단어)
            match = re.match(r'(\w+)\s+', line)
            if match:
                columns.add(match.group(1).lower())
        
        return columns


class MigrationScriptGenerator:
    """마이그레이션 스크립트 생성"""
    
    def __init__(self, legacy_dir: str, current_schema_dir: str, output_dir: str):
        self.legacy_dir = Path(legacy_dir)
        self.current_schema_dir = Path(current_schema_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.current_analyzer = CurrentSchemaAnalyzer(current_schema_dir)
        self.current_analyzer.analyze()
        
        self.migration_scripts = {}
        
    def generate(self):
        """전체 마이그레이션 스크립트 생성"""
        print("="*80)
        print("레거시 테이블 마이그레이션 스크립트 생성 시작")
        print("="*80)
        print()
        
        # 레거시 테이블 파일 목록
        legacy_files = list(self.legacy_dir.glob('dbo.*.Table.sql'))
        print(f"총 {len(legacy_files)}개의 레거시 테이블 파일 발견\n")
        
        processed = 0
        skipped = 0
        new_tables = 0
        column_additions = 0
        
        for legacy_file in sorted(legacy_files):
            result = self._process_legacy_table(legacy_file)
            
            if result['status'] == 'processed':
                processed += 1
                if result['action'] == 'new_table':
                    new_tables += 1
                elif result['action'] == 'add_columns':
                    column_additions += 1
            elif result['status'] == 'skipped':
                skipped += 1
        
        print()
        print("="*80)
        print("처리 완료!")
        print(f"- 처리됨: {processed}개")
        print(f"  - 신규 테이블: {new_tables}개")
        print(f"  - 컬럼 추가: {column_additions}개")
        print(f"- 스킵됨: {skipped}개")
        print("="*80)
        
        # 스크립트 파일 저장
        self._save_migration_scripts()
    
    def _process_legacy_table(self, legacy_file: Path) -> Dict:
        """개별 레거시 테이블 처리"""
        parser = LegacyTableParser(str(legacy_file))
        legacy_info = parser.parse()
        
        if not legacy_info['table_name']:
            return {'status': 'skipped', 'reason': 'parse_failed'}
        
        legacy_table = legacy_info['table_name']
        print(f"처리 중: {legacy_table}")
        
        # 테이블 prefix로 스키마 결정
        target_schema = self._determine_target_schema(legacy_table)
        
        if not target_schema:
            print(f"  → 스킵 (매핑되지 않은 테이블 유형)")
            return {'status': 'skipped', 'reason': 'no_schema_mapping'}
        
        # 현대적인 테이블명 변환
        modern_table = self._modernize_table_name(legacy_table)
        
        # 현재 스키마에 동일 테이블이 있는지 확인
        current_table_key = f"{target_schema}.{modern_table}"
        
        if current_table_key in self.current_analyzer.tables:
            # 기존 테이블에 컬럼 추가
            result = self._generate_column_additions(
                target_schema,
                modern_table,
                legacy_info,
                self.current_analyzer.tables[current_table_key]
            )
            print(f"  → 컬럼 추가: {result['added_count']}개")
            return {'status': 'processed', 'action': 'add_columns', **result}
        else:
            # 신규 테이블 생성
            result = self._generate_new_table(
                target_schema,
                modern_table,
                legacy_info
            )
            print(f"  → 신규 테이블 생성")
            return {'status': 'processed', 'action': 'new_table', **result}
    
    def _determine_target_schema(self, legacy_table: str) -> str:
        """레거시 테이블명에서 타겟 스키마 결정"""
        for prefix, schema in LEGACY_TABLE_PREFIXES.items():
            if legacy_table.startswith(prefix):
                return schema
        return None
    
    def _modernize_table_name(self, legacy_table: str) -> str:
        """레거시 테이블명을 현대적인 이름으로 변환"""
        # Prefix 제거
        for prefix in LEGACY_TABLE_PREFIXES.keys():
            if legacy_table.startswith(prefix):
                legacy_table = legacy_table[len(prefix):]
                break
        
        # MST, TRN, SUM 등 접미사 제거/변환
        replacements = {
            '_MST': 's',  # Master -> plural
            '_TRN': '_transactions',
            '_SUM': '_summaries',
            '_DTL': '_details',
            '_HIST': '_history',
        }
        
        for old, new in replacements.items():
            if legacy_table.endswith(old):
                legacy_table = legacy_table[:-len(old)] + new
                break
        
        # 약어를 풀어쓰기
        abbreviations = {
            'DEPT': 'department',
            'EMPY': 'employee',
            'CUST': 'customer',
            'PRDT': 'product',
            'WHSE': 'warehouse',
            'CTGR': 'category',
            'MAKR': 'maker',
            'BRND': 'brand',
            'VNDR': 'vendor',
        }
        
        for abbr, full in abbreviations.items():
            if abbr in legacy_table:
                legacy_table = legacy_table.replace(abbr, full)
        
        # 소문자 + snake_case 변환
        return legacy_table.lower()
    
    def _modernize_column_name(self, legacy_col: str) -> str:
        """레거시 컬럼명을 현대적인 이름으로 변환"""
        # 직접 매핑이 있으면 사용
        if legacy_col in COLUMN_NAME_MAPPING:
            return COLUMN_NAME_MAPPING[legacy_col]
        
        # 소문자 + snake_case 변환
        col = legacy_col.lower()
        
        # 약어 변환
        col = col.replace('_cd', '_code')
        col = col.replace('_nm', '_name')
        col = col.replace('_tp', '_type')
        col = col.replace('_yn', '_flag')
        col = col.replace('_dt', '_date')
        col = col.replace('_seq', '_order')
        col = col.replace('_no', '_number')
        
        return col
    
    def _generate_column_additions(self, schema: str, table: str, 
                                   legacy_info: Dict, current_info: Dict) -> Dict:
        """기존 테이블에 추가할 컬럼 스크립트 생성"""
        current_columns = current_info['columns']
        new_columns = []
        
        for col in legacy_info['columns']:
            modern_col_name = self._modernize_column_name(col['name'])
            
            # 표준 컬럼은 스킵
            if modern_col_name in ['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'is_deleted']:
                continue
            
            # 이미 있는 컬럼은 스킵
            if modern_col_name in current_columns:
                continue
            
            # 불필요한 컬럼 필터링 (업무에 불필요한 것들)
            skip_patterns = ['_id$', 'create_by_name', 'update_by_name', 'erp_use', 'crm_use', 'eas_use']
            if any(re.search(pattern, modern_col_name) for pattern in skip_patterns):
                continue
            
            new_columns.append({
                'legacy_name': col.get('name', ''),
                'modern_name': modern_col_name,
                'type': col.get('type', 'TEXT'),
                'nullable': col.get('nullable', True),
                'original_type': col.get('original_type', '')
            })
        
        if new_columns:
            script_key = f"{schema}_{table}"
            if script_key not in self.migration_scripts:
                self.migration_scripts[script_key] = {
                    'schema': schema,
                    'table': table,
                    'type': 'alter',
                    'columns': []
                }
            
            self.migration_scripts[script_key]['columns'].extend(new_columns)
        
        return {
            'added_count': len(new_columns),
            'columns': new_columns
        }
    
    def _generate_new_table(self, schema: str, table: str, legacy_info: Dict) -> Dict:
        """신규 테이블 생성 스크립트 작성"""
        modern_columns = []
        
        for col in legacy_info['columns']:
            modern_col_name = self._modernize_column_name(col['name'])
            
            # IDENTITY 컬럼은 id로 변환
            if col.get('is_identity'):
                continue  # 표준 id 컬럼으로 대체
            
            modern_columns.append({
                'legacy_name': col.get('name', ''),
                'modern_name': modern_col_name,
                'type': col.get('type', 'TEXT'),
                'nullable': col.get('nullable', True),
                'original_type': col.get('original_type', '')
            })
        
        script_key = f"{schema}_{table}"
        self.migration_scripts[script_key] = {
            'schema': schema,
            'table': table,
            'type': 'create',
            'legacy_table': legacy_info['table_name'],
            'columns': modern_columns,
            'unique_indexes': legacy_info.get('unique_indexes', [])
        }
        
        return {
            'column_count': len(modern_columns)
        }
    
    def _save_migration_scripts(self):
        """마이그레이션 스크립트를 파일로 저장"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # 스키마별로 그룹화
        by_schema = {}
        for key, script in self.migration_scripts.items():
            schema = script['schema']
            if schema not in by_schema:
                by_schema[schema] = []
            by_schema[schema].append(script)
        
        # 각 스키마별 파일 생성
        for schema, scripts in by_schema.items():
            output_file = self.output_dir / f"migration_{schema}_{timestamp}.sql"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(f"-- ============================================================================\n")
                f.write(f"-- 레거시 테이블 마이그레이션 스크립트\n")
                f.write(f"-- Schema: {schema}\n")
                f.write(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"-- ============================================================================\n\n")
                
                for script in scripts:
                    if script['type'] == 'alter':
                        f.write(self._generate_alter_table_sql(script))
                    elif script['type'] == 'create':
                        f.write(self._generate_create_table_sql(script))
                    
                    f.write("\n\n")
            
            print(f"생성됨: {output_file}")
    
    def _generate_alter_table_sql(self, script: Dict) -> str:
        """ALTER TABLE 스크립트 생성"""
        lines = []
        lines.append(f"-- ============================================================================")
        lines.append(f"-- 테이블: {script['schema']}.{script['table']}")
        lines.append(f"-- 액션: 컬럼 추가 ({len(script['columns'])}개)")
        lines.append(f"-- ============================================================================")
        lines.append("")
        
        for col in script['columns']:
            null_constraint = "" if col['nullable'] else "NOT NULL"
            
            lines.append(f"-- [MIGRATED FROM LEGACY] {col['legacy_name']} ({col['original_type']})")
            lines.append(f"ALTER TABLE {script['schema']}.{script['table']}")
            lines.append(f"ADD COLUMN IF NOT EXISTS {col['modern_name']} {col['type']} {null_constraint};")
            lines.append("")
            
            # 코멘트 추가
            lines.append(f"COMMENT ON COLUMN {script['schema']}.{script['table']}.{col['modern_name']}")
            lines.append(f"IS '레거시 컬럼: {col['legacy_name']}';")
            lines.append("")
        
        return "\n".join(lines)
    
    def _generate_create_table_sql(self, script: Dict) -> str:
        """CREATE TABLE 스크립트 생성"""
        lines = []
        lines.append(f"-- ============================================================================")
        lines.append(f"-- 신규 테이블: {script['schema']}.{script['table']}")
        lines.append(f"-- 레거시: {script['legacy_table']}")
        lines.append(f"-- ============================================================================")
        lines.append("")
        lines.append(f"CREATE TABLE IF NOT EXISTS {script['schema']}.{script['table']} (")
        lines.append(f"    -- 기본 식별자 및 감사 필드")
        lines.append(f"    id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),")
        lines.append(f"    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,")
        lines.append(f"    created_by          UUID,")
        lines.append(f"    updated_at          TIMESTAMP WITH TIME ZONE,")
        lines.append(f"    updated_by          UUID,")
        lines.append(f"    ")
        lines.append(f"    -- 비즈니스 컬럼 (레거시에서 마이그레이션)")
        
        for col in script['columns']:
            null_constraint = "" if col['nullable'] else "NOT NULL"
            comment = f"  -- [LEGACY] {col['legacy_name']}"
            lines.append(f"    {col['modern_name']:30s} {col['type']:30s} {null_constraint:10s},{comment}")
        
        lines.append(f"    ")
        lines.append(f"    -- 상태 관리")
        lines.append(f"    is_deleted          BOOLEAN                  DEFAULT false")
        lines.append(f");")
        lines.append("")
        
        # 코멘트
        lines.append(f"COMMENT ON TABLE {script['schema']}.{script['table']}")
        lines.append(f"IS '레거시 테이블 {script['legacy_table']}에서 마이그레이션';")
        lines.append("")
        
        # 기본 인덱스
        lines.append(f"-- 기본 인덱스")
        lines.append(f"CREATE INDEX IF NOT EXISTS ix_{script['table']}__is_deleted")
        lines.append(f"    ON {script['schema']}.{script['table']} (is_deleted)")
        lines.append(f" WHERE is_deleted = false;")
        lines.append("")
        
        return "\n".join(lines)


def main():
    """메인 실행 함수"""
    # 경로 설정
    base_dir = Path(__file__).parent.parent.parent
    legacy_dir = base_dir / 'database/schemas/tmp_old_tables'
    current_schema_dir = base_dir / 'database/schemas/tenants'
    output_dir = base_dir / 'database/migrations/tenants'
    
    # 마이그레이션 스크립트 생성
    generator = MigrationScriptGenerator(
        str(legacy_dir),
        str(current_schema_dir),
        str(output_dir)
    )
    
    generator.generate()
    
    print()
    print(f"마이그레이션 스크립트가 생성되었습니다: {output_dir}")


if __name__ == '__main__':
    main()
