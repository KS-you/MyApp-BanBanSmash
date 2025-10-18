from app.database import engine, SessionLocal
from app.models import Base, Object

def init():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    if db.query(Object).count() < 30:
        for i in range(30):
            obj = Object(
                name="glass" if i % 2 == 0 else "wood",
                type="glass" if i % 2 == 0 else "wood"
            )
            db.add(obj)
        db.commit()
        print("✅ 30個のオブジェクトを登録しました")
    else:
        print("⚠️ オブジェクトはすでに登録されています")
    db.close()

    print("Done.")

if __name__ == "__main__":
    init()