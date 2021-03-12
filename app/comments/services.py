from app import db
from app.comments.models import Comment


def create_comment(data, user):
    c = Comment(**data, author=user)
    db.session.add(c)
    db.session.commit()
    return c
