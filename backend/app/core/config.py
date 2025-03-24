from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # LLM 配置
    LLM_PROVIDER: str = "deepseek"  # 默认使用 DeepSeek
    
    # DeepSeek 配置
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_API_BASE: str = "http://chatgpt.tiny-test.wke-office.test.wacai.info"
    DEEPSEEK_API_VERSION: str = "2024-03-18"
    DEEPSEEK_MODEL: str = "deepseek-v3"
    DEEPSEEK_TIMEOUT: int = 120  # 增加到120秒
    DEEPSEEK_CONNECT_TIMEOUT: int = 30  # 增加到30秒
    DEEPSEEK_READ_TIMEOUT: int = 120  # 增加到120秒
    
    # OpenAI 配置
    OPENAI_API_KEY: str = ""
    OPENAI_API_BASE: str = ""
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # BGE 配置
    BGE_BASE_URL: str = "http://stark-vector.x-amc.wke-office.test.wacai.info"
    
    # 应用配置
    APP_NAME: str = "Aurora API"
    DEBUG: bool = False
    
    # Qdrant 配置
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_PORT: int = 6333
    QDRANT_API_KEY: str | None = None

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings() 