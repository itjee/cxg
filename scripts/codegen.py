#!/usr/bin/env python3
"""GraphQL 코드 생성 스크립트

사용법:
    python scripts/codegen.py              # 모든 스키마 생성
    python scripts/codegen.py --schema user # 특정 스키마만 생성
    python scripts/codegen.py --watch      # 변경 감지 모드
"""

import sys
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
project_root = Path(__file__).parent.parent
backend_root = project_root / 'apps' / 'backend-api'
sys.path.insert(0, str(backend_root))

import argparse
from src.graphql.common.generators.schema_loader import SchemaLoader
from src.graphql.common.generators.type_generator import TypeGenerator
from src.graphql.common.generators.query_generator import QueryGenerator


def generate_code(schema_dir: Path, output_dir: Path, schema_name: str | None = None):
    """코드 생성 실행"""
    
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("  🚀 GraphQL 코드 자동 생성")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    
    # 스키마 로드
    loader = SchemaLoader(schema_dir)
    schemas = loader.load_all_schemas()
    
    if schema_name:
        schemas = [s for s in schemas if s.name.lower() == schema_name.lower()]
        if not schemas:
            print(f"❌ 스키마를 찾을 수 없습니다: {schema_name}")
            return
    
    print(f"📋 발견한 스키마: {len(schemas)}개\n")
    
    # 생성기 초기화
    type_gen = TypeGenerator()
    query_gen = QueryGenerator()
    
    generated_files = []
    
    for schema in schemas:
        print(f"🔨 {schema.database}.{schema.schema}.{schema.name} 생성 중...")
        
        # Types 생성
        type_file = type_gen.generate(schema, output_dir)
        print(f"   ✓ {type_file.relative_to(backend_root)}")
        generated_files.append(type_file)
        
        # Queries 생성
        query_file = query_gen.generate(schema, output_dir)
        print(f"   ✓ {query_file.relative_to(backend_root)}")
        generated_files.append(query_file)
        
        # TODO: Mutations 생성
        # mutation_file = mutation_gen.generate(schema, output_dir)
        
        # __init__.py 생성
        init_file = type_file.parent / '__init__.py'
        if not init_file.exists():
            init_file.write_text('"""자동 생성된 GraphQL 모듈"""\n')
            generated_files.append(init_file)
        
        print()
    
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ 완료! {len(generated_files)}개 파일 생성됨")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    
    print("📝 생성된 파일:")
    for f in generated_files:
        print(f"   {f.relative_to(backend_root)}")
    
    print("\n💡 다음 단계:")
    print("   1. 생성된 코드 확인")
    print("   2. 커스텀 로직이 필요하면 src/graphql/custom/ 에 작성")
    print("   3. 스키마 수정 시 'python scripts/codegen.py' 재실행")


def main():
    parser = argparse.ArgumentParser(description='GraphQL 코드 자동 생성')
    parser.add_argument(
        '--schema',
        help='생성할 스키마 이름 (없으면 전체 생성)'
    )
    parser.add_argument(
        '--watch',
        action='store_true',
        help='스키마 파일 변경 감지 모드'
    )
    
    args = parser.parse_args()
    
    # 경로 설정
    schema_dir = backend_root / 'src' / 'schemas'
    output_dir = backend_root / 'src' / 'graphql' / 'generated'
    
    if args.watch:
        print("👀 파일 변경 감지 모드 (아직 미구현)")
        print("   Ctrl+C로 종료")
        # TODO: watchdog 라이브러리로 구현
        return
    
    generate_code(schema_dir, output_dir, args.schema)


if __name__ == '__main__':
    main()
