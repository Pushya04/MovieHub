from pydantic_settings import BaseSettings
from pydantic import SecretStr, Field

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:Nhreddy%4017@localhost:5432/movie_data"
    SECRET_KEY: str = "Nhreddy@3456&00917"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SMTP_HOST: str = Field(default="smtp.gmail.com")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="reddyhemanth261@gmail.com")
    SMTP_PASSWORD: SecretStr = Field(default=SecretStr("nhreddy12"))

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()