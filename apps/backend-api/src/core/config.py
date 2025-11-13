"""설정 관리"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """애플리케이션 설정"""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )

    # 환경
    environment: str = "development"
    debug: bool = True

    # API
    api_title: str = "ConexGrow API"
    api_version: str = "1.0.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8100
    api_v1_prefix: str = "/api/v1"

    # 데이터베이스
    tenants_database_url: str = "postgresql://admin:cxg2025!!@localhost:5432/tnnt"
    manager_database_url: str = "postgresql://admin:cxg2025!!@localhost:5432/mgmt"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # 보안
    secret_key: str = "your-secret-key-change-in-production-min-32-chars"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # CORS
    allowed_origins: list[str] = [
        "http://localhost:8200",
        "http://localhost:8300",
    ]

    # 로깅
    log_level: str = "INFO"
    log_format: str = "text"

    # 파일 업로드
    max_upload_size: int = 10485760  # 10MB
    allowed_extensions: list[str] = ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"]

    # AI (선택)
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    pinecone_api_key: str = ""
    pinecone_environment: str = ""


settings = Settings()
