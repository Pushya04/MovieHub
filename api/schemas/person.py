from pydantic import BaseModel

class PersonBase(BaseModel):
    name: str

class PersonOut(PersonBase):
    id: int
    role: str

    class Config:
        from_attributes = True