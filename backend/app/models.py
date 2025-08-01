from sqlalchemy import (
    Column, Integer, String, Enum, ForeignKey, TIMESTAMP
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(64), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum("user", "admin"), default="user", nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    destructions = relationship("Destruction", back_populates="user", cascade="all, delete")
    results = relationship("Result", back_populates="user", cascade="all, delete")


class Object(Base):
    __tablename__ = "objects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(32), nullable=False)
    type = Column(String(32), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    destructions = relationship("Destruction", back_populates="object", cascade="all, delete")


class Destruction(Base):
    __tablename__ = "destructions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    object_id = Column(Integer, ForeignKey("objects.id", ondelete="CASCADE"), nullable=False)
    destroyed_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="destructions")
    object = relationship("Object", back_populates="destructions")


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    total_destructions = Column(Integer, nullable=False)
    play_time_seconds = Column(Integer, nullable=False)
    rank = Column(String(32))
    played_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="results")
