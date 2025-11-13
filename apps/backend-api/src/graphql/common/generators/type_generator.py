"""GraphQL Type 생성기"""

from jinja2 import Template
from pathlib import Path
from .schema_loader import EntitySchema, FieldDefinition


TYPE_TEMPLATE = '''"""{{ schema.graphql_description }} - GraphQL Types (자동 생성)

⚠️  이 파일은 자동 생성됩니다. 직접 수정하지 마세요!
    스키마 변경: schemas/{{ schema.database }}/{{ schema.schema }}/{{ schema.name.lower() }}.schema.yaml
    재생성: python scripts/codegen.py
"""

from datetime import datetime
from typing import Optional

import strawberry

from src.graphql.common import Node


@strawberry.type(description="{{ schema.graphql_description }}")
class {{ schema.graphql_type_name }}(Node):
    """
    {{ schema.graphql_description }}
    
    Database: {{ schema.database }}.{{ schema.schema }}.{{ schema.table }}
    Model: {{ schema.model_class }}
    """
    
{% for field in schema.fields %}
    {{ field.name }}: {{ get_python_type(field) }} = strawberry.field(
        description="{{ field.description }}"{% if field.default is not none %},
        default={{ get_default_value(field) }}{% endif %}
    )
{% endfor %}


@strawberry.input(description="{{ schema.graphql_type_name }} 생성 입력")
class {{ schema.graphql_type_name }}CreateInput:
    """{{ schema.graphql_type_name }} 생성"""
    
{% for field in get_create_fields(schema) %}
    {{ field.name }}: {{ get_input_python_type(field) }}{% if field.default is not none %} = {{ get_default_value(field) }}{% endif %}

{% endfor %}


@strawberry.input(description="{{ schema.graphql_type_name }} 수정 입력")
class {{ schema.graphql_type_name }}UpdateInput:
    """{{ schema.graphql_type_name }} 수정"""
    
{% for field in get_update_fields(schema) %}
    {{ field.name }}: Optional[{{ get_input_python_type(field) }}] = None
{% endfor %}
'''


class TypeGenerator:
    """GraphQL Type 코드 생성기"""
    
    def __init__(self):
        self.template = Template(TYPE_TEMPLATE)
        
    def get_python_type(self, field: FieldDefinition) -> str:
        """GraphQL 타입을 Python 타입으로 변환"""
        type_map = {
            'ID!': 'strawberry.ID',
            'ID': 'Optional[strawberry.ID]',
            'String!': 'str',
            'String': 'Optional[str]',
            'Int!': 'int',
            'Int': 'Optional[int]',
            'Float!': 'float',
            'Float': 'Optional[float]',
            'Boolean!': 'bool',
            'Boolean': 'Optional[bool]',
            'DateTime!': 'datetime',
            'DateTime': 'Optional[datetime]',
        }
        return type_map.get(field.graphql_type, 'Any')
    
    def get_input_python_type(self, field: FieldDefinition) -> str:
        """Input용 Python 타입"""
        type_str = self.get_python_type(field)
        # Optional[] 제거
        return type_str.replace('Optional[', '').replace(']', '')
    
    def get_default_value(self, field: FieldDefinition) -> str:
        """기본값 변환"""
        if field.default is None:
            return 'None'
        if isinstance(field.default, str):
            return f'"{field.default}"'
        if isinstance(field.default, bool):
            return str(field.default)
        return str(field.default)
    
    def get_create_fields(self, schema: EntitySchema) -> list[FieldDefinition]:
        """생성 입력에 포함될 필드"""
        exclude = ['id', 'created_at', 'updated_at', 'is_deleted']
        return [f for f in schema.fields if f.name not in exclude]
    
    def get_update_fields(self, schema: EntitySchema) -> list[FieldDefinition]:
        """수정 입력에 포함될 필드"""
        exclude = ['id', 'created_at', 'updated_at', 'is_deleted']
        
        # mutations에서 updatable_fields가 정의되어 있으면 사용
        for mutation in schema.mutations:
            if mutation.name == 'update' and mutation.updatable_fields:
                return [f for f in schema.fields if f.name in mutation.updatable_fields]
        
        return [f for f in schema.fields if f.name not in exclude]
    
    def generate(self, schema: EntitySchema, output_dir: Path) -> Path:
        """타입 코드 생성"""
        code = self.template.render(
            schema=schema,
            get_python_type=self.get_python_type,
            get_input_python_type=self.get_input_python_type,
            get_default_value=self.get_default_value,
            get_create_fields=self.get_create_fields,
            get_update_fields=self.get_update_fields,
        )
        
        # 출력 경로 생성
        entity_dir = output_dir / schema.database / schema.schema / schema.name.lower()
        entity_dir.mkdir(parents=True, exist_ok=True)
        
        output_file = entity_dir / 'types.py'
        output_file.write_text(code, encoding='utf-8')
        
        return output_file
