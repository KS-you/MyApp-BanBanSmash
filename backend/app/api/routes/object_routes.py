from fastapi import APIRouter, Depends, Body, Request, HTTPException
from sqlalchemy.orm import Session
from app.models import Destruction, Object, User
from app.database import get_db
from app.auth import get_current_user
from sqlalchemy.sql.expression import func

router = APIRouter()

@router.get("/objects")
def get_objects(db: Session = Depends(get_db)):
    return (
        db.query(Object)
        .filter(Object.type.in_(["glass", "wood"]))
        .order_by(func.rand())
        .limit(30)
        .all()
    )

@router.post("/destruction")
def create_destruction(
    request: Request,
    object_id: int = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(status_code=401, detail="認証情報がありません")

    destruction = Destruction(user_id=current_user.id, object_id=object_id)
    db.add(destruction)
    db.commit()
    db.refresh(destruction)
    return destruction