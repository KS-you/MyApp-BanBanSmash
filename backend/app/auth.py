# auth.py
import os
from passlib.context import CryptContext
import re
from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from app.models import User
from app import schemas
from app.database import get_db
import logging

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_access_token(data: dict, expires_delta: int | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(tz=timezone.utc) + timedelta(minutes=expires_delta)
    else:
        expire = datetime.now(tz=timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def login_and_get_token(db: Session, email: str, password: str) -> str:
    user = authenticate_user(db, email, password)
    token_data = {"sub": str(user.id)}
    token = create_access_token(token_data)
    return token

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def is_valid_email(email: str) -> bool:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(pattern, email) is not None

def create_user(db: Session, user_data: schemas.UserCreate) -> User:
    if not is_valid_email(user_data.email):
        raise HTTPException(status_code=422, detail="メールアドレスの形式が正しくありません")
    if len(user_data.password) < 6:
        raise HTTPException(status_code=422, detail="パスワードは6文字以上で入力してください")
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="このメールアドレスはすでに登録されています")
    hash_pw = hash_password(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hash_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, password: str):
    logger.debug("Authenticating: %s", email)
    user = db.query(User).filter(User.email == email).first()
    print("Query result:", user)
    if not user:
        return None
    if user and not pwd_context.verify(password, user.hashed_password):
        logger.debug("Password verification failed for users: %s", email)
        return None
    return user

# JWT obtainUser
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="認証情報が無効です",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user