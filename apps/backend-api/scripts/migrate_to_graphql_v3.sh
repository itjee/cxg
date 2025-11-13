#!/bin/bash

echo "🚀 GraphQL v3.0 구조 마이그레이션 시작"
echo "   {시스템명}/{스키마명}/{엔티티명}"
echo ""

# 1. GraphQL 루트 폴더 생성
echo "📁 1. GraphQL 루트 폴더 생성..."
mkdir -p src/graphql

# 2. Common 모듈 생성
echo "📁 2. Common 모듈 생성..."
mkdir -p src/graphql/common
touch src/graphql/common/__init__.py
touch src/graphql/common/scalars.py
touch src/graphql/common/interfaces.py
touch src/graphql/common/base_types.py

# 3. Manager 시스템 생성
echo "📁 3. Manager 시스템 생성..."
mkdir -p src/graphql/manager

# Manager > IDAM 스키마
mkdir -p src/graphql/manager/idam
for entity in users roles permissions; do
    mkdir -p src/graphql/manager/idam/$entity
    touch src/graphql/manager/idam/$entity/__init__.py
    touch src/graphql/manager/idam/$entity/types.py
    touch src/graphql/manager/idam/$entity/queries.py
    touch src/graphql/manager/idam/$entity/mutations.py
    touch src/graphql/manager/idam/$entity/loaders.py
    touch src/graphql/manager/idam/$entity/permissions.py
done

touch src/graphql/manager/idam/__init__.py
touch src/graphql/manager/idam/schema.py

# Manager > Tenant Management 스키마
mkdir -p src/graphql/manager/tenant_mgmt
for entity in tenants subscriptions; do
    mkdir -p src/graphql/manager/tenant_mgmt/$entity
    touch src/graphql/manager/tenant_mgmt/$entity/__init__.py
    touch src/graphql/manager/tenant_mgmt/$entity/types.py
    touch src/graphql/manager/tenant_mgmt/$entity/queries.py
    touch src/graphql/manager/tenant_mgmt/$entity/mutations.py
    touch src/graphql/manager/tenant_mgmt/$entity/loaders.py
done

touch src/graphql/manager/tenant_mgmt/__init__.py
touch src/graphql/manager/tenant_mgmt/schema.py

touch src/graphql/manager/__init__.py
touch src/graphql/manager/schema.py

# 4. Tenants 시스템 생성
echo "📁 4. Tenants 시스템 생성..."
mkdir -p src/graphql/tenants

# Tenants > SYS 스키마
mkdir -p src/graphql/tenants/sys
for entity in users branches departments roles menus permissions; do
    mkdir -p src/graphql/tenants/sys/$entity
    touch src/graphql/tenants/sys/$entity/__init__.py
    touch src/graphql/tenants/sys/$entity/types.py
    touch src/graphql/tenants/sys/$entity/queries.py
    touch src/graphql/tenants/sys/$entity/mutations.py
    touch src/graphql/tenants/sys/$entity/loaders.py
    touch src/graphql/tenants/sys/$entity/permissions.py
done

touch src/graphql/tenants/sys/__init__.py
touch src/graphql/tenants/sys/schema.py

# Tenants > CRM 스키마
mkdir -p src/graphql/tenants/crm
for entity in customers contacts leads; do
    mkdir -p src/graphql/tenants/crm/$entity
    touch src/graphql/tenants/crm/$entity/__init__.py
    touch src/graphql/tenants/crm/$entity/types.py
    touch src/graphql/tenants/crm/$entity/queries.py
    touch src/graphql/tenants/crm/$entity/mutations.py
    touch src/graphql/tenants/crm/$entity/loaders.py
done

touch src/graphql/tenants/crm/__init__.py
touch src/graphql/tenants/crm/schema.py

# Tenants > HRM 스키마
mkdir -p src/graphql/tenants/hrm
for entity in employees attendance; do
    mkdir -p src/graphql/tenants/hrm/$entity
    touch src/graphql/tenants/hrm/$entity/__init__.py
    touch src/graphql/tenants/hrm/$entity/types.py
    touch src/graphql/tenants/hrm/$entity/queries.py
    touch src/graphql/tenants/hrm/$entity/mutations.py
done

touch src/graphql/tenants/hrm/__init__.py
touch src/graphql/tenants/hrm/schema.py

touch src/graphql/tenants/__init__.py
touch src/graphql/tenants/schema.py

# 5. GraphQL 메인 파일들
echo "📁 5. GraphQL 메인 파일 생성..."
touch src/graphql/__init__.py
touch src/graphql/context.py
touch src/graphql/loaders.py
touch src/graphql/schema.py

echo ""
echo "✅ GraphQL v3.0 구조 생성 완료!"
echo ""
echo "생성된 구조:"
echo "  manager/"
echo "    ├── idam/ (users, roles, permissions)"
echo "    └── tenant_mgmt/ (tenants, subscriptions)"
echo ""
echo "  tenants/"
echo "    ├── sys/ (users, branches, departments, roles, menus, permissions)"
echo "    ├── crm/ (customers, contacts, leads)"
echo "    └── hrm/ (employees, attendance)"
echo ""
echo "다음 단계:"
echo "  1. src/graphql/common/ 모듈 구현"
echo "  2. src/graphql/manager/idam/users/ 부터 구현"
echo "  3. src/graphql/tenants/sys/users/ 구현"
