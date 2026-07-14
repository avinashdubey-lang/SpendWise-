from sqlalchemy.orm import Session

from app.users.models import User
from app.auth.security import verify_password, create_access_token


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    access_token = create_access_token(user.id)

    return access_token