from pydantic import BaseModel, EmailStr
from pydantic.types import constr
from typing import Optional, Annotated

class UserCreate(BaseModel):
	email: Optional[EmailStr]
	password: Optional[Annotated[str, constr(min_length=6, max_length=64)]] = None
class UserOut(BaseModel):
	id: int
	email: EmailStr

	class Config:
			from_attributes = True

class UserLogin(BaseModel):
	email: EmailStr
	password: Optional[Annotated[str, constr(min_length=6, max_length=64)]] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[Annotated[str, constr(min_length=6, max_length=64)]] = None
class UserResponse(BaseModel):
	id: int
	email: EmailStr

	class Config:
		orm_mode = True