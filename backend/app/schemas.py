from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
	email: EmailStr
	password: constr(min_length=6, max_length=64)

class UserOut(BaseModel):
	id: int
	email: EmailStr

	class Config:
			from_attributes = True

class UserLogin(BaseModel):
	email: EmailStr
	password: constr(min_length=6, max_length=64)

class UserUpdate(BaseModel):
	email :EmailStr | None = None
	password: constr(min_length=6, max_length=64) | None = None