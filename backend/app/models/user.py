from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    password: str  # 注意：实际应用中应该存储密码哈希
    is_active: bool = True

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None 