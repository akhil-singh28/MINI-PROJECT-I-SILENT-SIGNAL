from pydantic import BaseModel

class UserSignup(BaseModel):
    name: str
    phone: str
    password: str
    guardian_name: str
    guardian_phone: str


class UserLogin(BaseModel):
    phone: str
    password: str