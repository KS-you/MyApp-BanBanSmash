import os
import hashlib
import re
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models, schemas
from app.config import PASSWORD_PEPPER, PASSWORD_SALT

def is_valid_email(email: str) -> bool:
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def hash_password(password: str) -> str:
    salted_password = PASSWORD_SALT + password + PASSWORD_PEPPER
    return hashlib.sha256(salted_password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    if not is_valid_email(user.email):
        raise HTTPException(status_code=422, detail="メールアドレスの形式が正しくありません。")

    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="このメールアドレスはすでに登録されています。")

    hash_pw = hash_password(user.password)
    new_user = models.User(email=user.email, hashed_password=hash_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, password: str) -> models.User:
    if not is_valid_email(email):
        raise HTTPException(status_code=422, detail="メールアドレスの形式が正しくありません。")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status=401, detail="メールアドレスまたはパスワードが間違っています。")
    return user