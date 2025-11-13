"""GraphQL Query 생성기"""

from jinja2 import Template
from pathlib import Path
from .schema_loader import EntitySchema


QUERY_TEMPLATE = '''"""{{ schema.graphql_description }} - GraphQL Queries (자동 생성)

⚠️  이 파일은 자동 생성됩니다. 직접 수정하지 마세요!
"""

from typing import Optional
from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from {{ schema.model_class.rsplit('.', 1)[0] }} import {{ schema.name }} as {{ schema.name }}Model
from src.graphql.common import get_by_id, get_list
from .types import {{ schema.graphql_type_name }}


def {{ schema.name.lower() }}_to_graphql(model: {{ schema.name }}Model) -> {{ schema.graphql_type_name }}:
    """{{ schema.name }}Model을 {{ schema.graphql_type_name }}으로 변환"""
    return {{ schema.graphql_type_name }}(
{% for field in schema.fields %}
        {{ field.name }}={% if field.graphql_type.startswith('ID') %}strawberry.ID(str(model.{{ field.name }})){% else %}model.{{ field.name }}{% endif %},
{% endfor %}
    )


{% for query in schema.queries %}
{% if query.enabled %}
{% if query.name == 'get_by_id' %}
async def get_{{ schema.name.lower() }}_by_id(
    db: AsyncSession,
    id_: UUID
) -> Optional[{{ schema.graphql_type_name }}]:
    """{{ query.description or 'ID로 ' + schema.graphql_description + ' 조회' }}"""
    return await get_by_id(
        db=db,
        model_class={{ schema.name }}Model,
        id_=id_,
        to_graphql={{ schema.name.lower() }}_to_graphql{% if 'is_deleted' in [f.name for f in schema.fields] %},
        is_deleted=False{% endif %}
    )


{% elif query.name == 'list' %}
async def get_{{ schema.name.lower() }}_list(
    db: AsyncSession,
    limit: int = 20,
    offset: int = 0{% for filter_field in query.filters %},
    {{ filter_field }}: Optional[str] = None{% endfor %}
) -> list[{{ schema.graphql_type_name }}]:
    """{{ query.description or schema.graphql_description + ' 목록 조회' }}"""
    return await get_list(
        db=db,
        model_class={{ schema.name }}Model,
        to_graphql={{ schema.name.lower() }}_to_graphql,
        limit=limit,
        offset=offset{% if query.order_by %},
        order_by={{ schema.name }}Model.{{ query.order_by }}{% endif %}{% if 'is_deleted' in [f.name for f in schema.fields] %},
        is_deleted=False{% endif %}{% for filter_field in query.filters %},
        {{ filter_field }}={{ filter_field }}{% endfor %}
    )


{% endif %}
{% endif %}
{% endfor %}

@strawberry.type
class {{ schema.graphql_type_name }}Queries:
    """{{ schema.graphql_description }} Query"""
    
{% for query in schema.queries %}
{% if query.enabled %}
{% if query.name == 'get_by_id' %}
    @strawberry.field(description="{{ query.description or 'ID로 조회' }}")
    async def {{ schema.name.lower() }}(
        self,
        info,
        id: strawberry.ID
    ) -> Optional[{{ schema.graphql_type_name }}]:
        """{{ schema.graphql_description }} 단건 조회"""
        db = info.context.{{ schema.database }}_db_session
        return await get_{{ schema.name.lower() }}_by_id(db, UUID(id))
    
{% elif query.name == 'list' %}
    @strawberry.field(description="{{ query.description or '목록 조회' }}")
    async def {{ schema.name.lower() }}_list(
        self,
        info,
        limit: int = 20,
        offset: int = 0{% for filter_field in query.filters %},
        {{ filter_field }}: Optional[str] = None{% endfor %}
    ) -> list[{{ schema.graphql_type_name }}]:
        """{{ schema.graphql_description }} 목록"""
        db = info.context.{{ schema.database }}_db_session
        return await get_{{ schema.name.lower() }}_list(
            db, limit, offset{% for filter_field in query.filters %}, {{ filter_field }}{% endfor %}
        )
    
{% endif %}
{% endif %}
{% endfor %}
'''


class QueryGenerator:
    """GraphQL Query 코드 생성기"""
    
    def __init__(self):
        self.template = Template(QUERY_TEMPLATE)
        
    def generate(self, schema: EntitySchema, output_dir: Path) -> Path:
        """Query 코드 생성"""
        code = self.template.render(schema=schema)
        
        entity_dir = output_dir / schema.database / schema.schema / schema.name.lower()
        entity_dir.mkdir(parents=True, exist_ok=True)
        
        output_file = entity_dir / 'queries.py'
        output_file.write_text(code, encoding='utf-8')
        
        return output_file
