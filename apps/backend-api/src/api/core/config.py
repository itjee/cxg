from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
    )
    
    # API
    api_title: str = "CXG Platform API"
    api_version: str = "0.1.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    # Database
    database_url: str = "postgresql://cxgadmin:password@localhost:5432/tnnt_db"
    mgmt_database_url: str = "postgresql://cxgadmin:password@localhost:5432/mgmt_db"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:8200",
        "http://localhost:8300",
    ]
    
    log_level: str = "DEBUG"


settings = Settings()