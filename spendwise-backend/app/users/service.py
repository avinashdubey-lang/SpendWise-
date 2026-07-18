from sqlalchemy.orm import Session

from app.users.models import User
from app.users.schemas import UserCreate
from app.auth.security import hash_password


def create_user(db: Session, user_data: UserCreate):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        return None

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def get_current_user_profile(current_user):
    return current_user