from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from sqlalchemy.sql.expression import func
from pydantic import BaseModel

router = APIRouter(prefix="/api")

class DestructionCreate(BaseModel):
    user_id: int
    object_id: int

@router.get("/objects")
def get_objects(db: Session = Depends(get_db)):
    return (
        db.query(models.Object)
        .filter(models.Object.type.in_(["glass", "wood"]))
        .order_by(func.rand())
        .limit(30)
        .all()
    )


@router.post("/destruction")
def create_destruction(payload: DestructionCreate, db: Session = Depends(get_db)):
    destruction = models.Destruction(user_id=payload.user_id, object_id=payload.object_id)
    db.add(destruction)
    db.commit()
    db.refresh(destruction)
    return destruction
