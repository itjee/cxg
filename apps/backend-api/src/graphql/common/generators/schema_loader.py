"""GraphQL 코드 생성기 - 스키마 로더"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class FieldDefinition:
    """필드 정의"""

    name: str
    type: str
    graphql_type: str
    description: str = ""
    default: Any = None
    unique: bool = False
    required: bool = False


@dataclass
class OperationDefinition:
    """작업 정의"""

    name: str
    enabled: bool = True
    description: str = ""
    pagination: bool = False
    filters: list[str] = field(default_factory=list)
    search_fields: list[str] = field(default_factory=list)
    required_fields: list[str] = field(default_factory=list)
    updatable_fields: list[str] = field(default_factory=list)
    order_by: str | None = None
    soft_delete: bool = False
    hooks: dict[str, str] = field(default_factory=dict)


@dataclass
class EntitySchema:
    """엔티티 스키마"""

    name: str
    database: str
    schema: str
    table: str
    model_class: str
    graphql_type_name: str
    graphql_description: str
    fields: list[FieldDefinition]
    queries: list[OperationDefinition]
    mutations: list[OperationDefinition]
    permissions: dict[str, str]
    custom_enabled: bool = False
    custom_path: str | None = None


class SchemaLoader:
    """스키마 파일 로더"""

    def __init__(self, schema_dir: Path):
        self.schema_dir = schema_dir

    def load_schema(self, schema_file: Path) -> EntitySchema:
        """스키마 파일 로드"""
        with open(schema_file, encoding="utf-8") as f:
            data = yaml.safe_load(f)

        entity_data = data["entity"]

        # 필드 파싱
        fields = [
            FieldDefinition(
                name=f["name"],
                type=f["type"],
                graphql_type=f["graphql_type"],
                description=f.get("description", ""),
                default=f.get("default"),
                unique=f.get("unique", False),
                required="!" in f["graphql_type"],
            )
            for f in entity_data["fields"]
        ]

        # Query 작업 파싱
        queries = [
            OperationDefinition(
                name=q["name"],
                enabled=q.get("enabled", True),
                description=q.get("description", ""),
                pagination=q.get("pagination", False),
                filters=q.get("filters", []),
                search_fields=q.get("search_fields", []),
                order_by=q.get("order_by"),
            )
            for q in entity_data["operations"].get("queries", [])
        ]

        # Mutation 작업 파싱
        mutations = [
            OperationDefinition(
                name=m["name"],
                enabled=m.get("enabled", True),
                description=m.get("description", ""),
                required_fields=m.get("required_fields", []),
                updatable_fields=m.get("updatable_fields", []),
                soft_delete=m.get("soft_delete", False),
                hooks=m.get("hooks", {}),
            )
            for m in entity_data["operations"].get("mutations", [])
        ]

        return EntitySchema(
            name=entity_data["name"],
            database=entity_data["database"],
            schema=entity_data["schema"],
            table=entity_data["table"],
            model_class=entity_data["model_class"],
            graphql_type_name=entity_data["graphql"]["type_name"],
            graphql_description=entity_data["graphql"]["description"],
            fields=fields,
            queries=queries,
            mutations=mutations,
            permissions=entity_data.get("permissions", {}),
            custom_enabled=entity_data.get("custom", {}).get("enabled", False),
            custom_path=entity_data.get("custom", {}).get("path"),
        )

    def load_all_schemas(self) -> list[EntitySchema]:
        """모든 스키마 파일 로드"""
        schemas = []
        for schema_file in self.schema_dir.rglob("*.schema.yaml"):
            schemas.append(self.load_schema(schema_file))
        return schemas
