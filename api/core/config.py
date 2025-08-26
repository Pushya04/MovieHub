from pydantic_settings import BaseSettings
from pydantic import SecretStr, Field

class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str = "mysql+pymysql://root:Bantu%4012@localhost:3306/movie_data"
    
    # JWT Configuration
    SECRET_KEY: str = "Nhreddy@3456&00917"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # SMTP Configuration (for email features)
    SMTP_HOST: str = Field(default="smtp.gmail.com")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="reddyhemanth261@gmail.com")
    SMTP_PASSWORD: SecretStr = Field(default=SecretStr("nhreddy12"))
    
    # CORS Configuration
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000", "https://your-frontend-domain.vercel.app"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()