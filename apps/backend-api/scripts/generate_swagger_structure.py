"""
모듈 구조 자동 분석 및 라우터 생성 스크립트

모든 modules의 스키마를 분석하여:
1. 대분류: manager / tenants (시스템)
2. 중분류: audt, idam, adm, sys 등 (도메인/스키마)
3. 소분류: users, audit_logs 등 (엔티티)

계층적 태그를 자동 생성합니다.
"""

from pathlib import Path
from typing import Dict, List

# 도메인 한글명 매핑
DOMAIN_NAMES = {
    # Manager
    "auth": "인증",
    "idam": "사용자권한",
    "tnnt": "테넌트",
    "bill": "청구",
    "ifra": "인프라",
    "mntr": "모니터링",
    "audt": "감사",
    "bkup": "백업",
    "cnfg": "설정",
    "intg": "통합",
    "noti": "알림",
    "supt": "지원",
    "stat": "통계",
    "auto": "자동화",
    
    # Tenant
    "adm": "기준정보",
    "sys": "시스템",
    "hrm": "인사관리",
    "crm": "고객관리",
    "pim": "제품관리",
    "ivm": "재고관리",
    "wms": "창고관리",
    "psm": "구매관리",
    "srm": "판매관리",
    "fim": "재무관리",
    "fam": "자산관리",
    "apm": "결재관리",
    "lwm": "워크플로우",
    "bim": "분석",
    "asm": "서비스관리",
}

# 엔티티 한글명 매핑 (일부만, 나머지는 자동 변환)
ENTITY_NAMES = {
    "users": "사용자",
    "roles": "역할",
    "permissions": "권한",
    "audit_logs": "감사로그",
    "tenants": "테넌트",
    "subscriptions": "구독",
    "invoices": "청구서",
    "plans": "요금제",
    "transactions": "거래내역",
    "code_groups": "코드그룹",
    "codes": "코드",
    "currencies": "통화",
    "exchange_rates": "환율",
    "employees": "직원",
    "departments": "부서",
    "partners": "거래처",
    "products": "제품",
    "purchase_orders": "구매주문",
    "sales_orders": "판매주문",
    "accounts": "계정과목",
    "workflows": "워크플로우",
}


def analyze_modules(base_path: Path) -> Dict[str, Dict[str, List[str]]]:
    """모듈 구조 분석"""
    result = {}
    
    for system in ["manager", "tenants"]:
        system_path = base_path / system
        if not system_path.exists():
            continue
            
        result[system] = {}
        
        for domain in system_path.iterdir():
            if not domain.is_dir() or domain.name.startswith("_"):
                continue
                
            domain_name = domain.name
            entities = []
            
            for entity in domain.iterdir():
                if not entity.is_dir() or entity.name.startswith("_") or entity.name == "__pycache__":
                    continue
                    
                schema_file = entity / "schemas.py"
                router_file = entity / "router.py"
                
                if schema_file.exists() and router_file.exists():
                    entities.append(entity.name)
            
            if entities:
                result[system][domain_name] = sorted(entities)
    
    return result


def get_tag_name(system: str, domain: str, entity: str) -> str:
    """계층적 태그명 생성"""
    system_name = "관리자" if system == "manager" else "테넌트"
    domain_name = DOMAIN_NAMES.get(domain, domain.upper())
    entity_name = ENTITY_NAMES.get(entity, entity.replace("_", " ").title())
    
    return f"{system_name} > {domain_name} > {entity_name}"


def generate_router_imports(modules: Dict[str, Dict[str, List[str]]]) -> str:
    """라우터 import 문 생성"""
    imports = []
    
    for system, domains in modules.items():
        imports.append(f"# {system.upper()} Modules")
        for domain, entities in sorted(domains.items()):
            for entity in entities:
                module_path = f"src.modules.{system}.{domain}.{entity}.router"
                router_name = f"{system}_{domain}_{entity}_router"
                imports.append(f"from {module_path} import router as {router_name}")
            imports.append("")
    
    return "\n".join(imports)


def generate_router_includes(modules: Dict[str, Dict[str, List[str]]]) -> str:
    """라우터 include 문 생성"""
    includes = []
    
    for system, domains in modules.items():
        system_name = "관리자" if system == "manager" else "테넌트"
        includes.append(f"\n# ==================== 대:{system_name} ====================\n")
        
        for domain, entities in sorted(domains.items()):
            domain_name = DOMAIN_NAMES.get(domain, domain.upper())
            includes.append(f"# 중:{domain_name}")
            
            for entity in entities:
                router_name = f"{system}_{domain}_{entity}_router"
                prefix = f"/{domain}/{entity.replace('_', '-')}"
                tag = get_tag_name(system, domain, entity)
                
                includes.append(
                    f'router.include_router({router_name}, '
                    f'prefix="{prefix}", '
                    f'tags=["{tag}"])'
                )
            
            includes.append("")
    
    return "\n".join(includes)


def generate_tag_metadata(modules: Dict[str, Dict[str, List[str]]]) -> str:
    """태그 메타데이터 생성"""
    tags = []
    
    for system, domains in modules.items():
        for domain, entities in sorted(domains.items()):
            for entity in entities:
                tag_name = get_tag_name(system, domain, entity)
                entity_display = ENTITY_NAMES.get(entity, entity.replace("_", " ").title())
                
                tags.append({
                    "name": tag_name,
                    "description": f"{entity_display} 관리"
                })
    
    # Python dict 형식으로 변환
    result = "SIMPLIFIED_TAGS = [\n"
    for tag in tags:
        result += f'    {{\n'
        result += f'        "name": "{tag["name"]}",\n'
        result += f'        "description": "{tag["description"]}",\n'
        result += f'    }},\n'
    result += "]\n"
    
    return result


if __name__ == "__main__":
    # 모듈 분석
    modules_path = Path("src/modules")
    modules = analyze_modules(modules_path)
    
    # 통계 출력
    print("=== 모듈 분석 결과 ===\n")
    for system, domains in modules.items():
        total = sum(len(entities) for entities in domains.values())
        print(f"{system.upper()}: {total}개 엔티티")
        for domain, entities in sorted(domains.items()):
            print(f"  {domain}: {len(entities)}개")
    
    print(f"\n전체: {sum(sum(len(e) for e in d.values()) for d in modules.values())}개 엔티티")
    
    # 파일 생성
    output_dir = Path("generated")
    output_dir.mkdir(exist_ok=True)
    
    # 1. Router imports
    with open(output_dir / "router_imports.py", "w", encoding="utf-8") as f:
        f.write(generate_router_imports(modules))
    
    # 2. Router includes
    with open(output_dir / "router_includes.py", "w", encoding="utf-8") as f:
        f.write(generate_router_includes(modules))
    
    # 3. Tag metadata
    with open(output_dir / "tag_metadata.py", "w", encoding="utf-8") as f:
        f.write(generate_tag_metadata(modules))
    
    print(f"\n생성 완료:")
    print(f"  - {output_dir / 'router_imports.py'}")
    print(f"  - {output_dir / 'router_includes.py'}")
    print(f"  - {output_dir / 'tag_metadata.py'}")
