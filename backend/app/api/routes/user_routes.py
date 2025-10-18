from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas, models
from app.schemas import UserUpdate
from app.auth import get_current_user
from fastapi import Depends
from passlib.context import CryptContext

router = APIRouter(
		prefix="/users",
		tags=["users"]
	)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# UserUpdate
@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int,
  user: UserUpdate,
  db: Session = Depends(get_db),
  current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="このユーザーに更新する権限がありません")
    if user.email is not None:
        current_user.email = user.email
    if user.password is not None and user.password.strip() != "":
        current_user.hashed_password = pwd_context.hash(user.password)
    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at
    }


# UserDelete
@router.delete("/{user_id}")
def delete_user(
  user_id: int,
  db: Session = Depends(get_db),
	current_user: models.User = Depends(get_current_user)
):
	if current_user.id != user_id:
		raise HTTPException(status_code=403, detail="他のユーザーは削除できません")
	user = db.query(models.User).filter(models.User.id == user_id).first()
	if not user:
		raise HTTPException(status_code = 404, detail="ユーザーが見つかりません")

	db.delete(user)
	db.commit()
	return {"message": "User deleted successfully"}