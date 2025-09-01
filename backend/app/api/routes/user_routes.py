from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models
from fastapi import Depends
from passlib.context import CryptContext

router = APIRouter(
		prefix="/users",
		tags=["users"]
	)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Update
@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
		db_user = db.query(models.User).filter(models.User.id == user_id).first()
		if not db_user:
			raise HTTPException(status_code=404, detail="User no found")
		db_user.email = user.email
		db_user.hashed_password = pwd_context.hash(user.password)
		db.commit()
		db.refresh(db_user)
		return db_user


# Delete
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
