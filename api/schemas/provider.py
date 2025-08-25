from pydantic import BaseModel

class ProviderOut(BaseModel):
    id: int
    
    url: str

    class Config:
        from_attributes = True