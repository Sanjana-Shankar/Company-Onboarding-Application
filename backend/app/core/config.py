from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    COMPOSIO_API_KEY: str
    COMPOSIO_GMAIL_AUTH_CONFIG_ID: str
    COMPOSIO_CALLBACK_URL: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
