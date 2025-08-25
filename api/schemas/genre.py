from pydantic import BaseModel

class GenreBase(BaseModel):
    name: str

class GenreOut(GenreBase):
    id: int

    class Config:
        from_attributes = True