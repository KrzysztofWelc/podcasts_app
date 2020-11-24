from app import db
from app.podcasts.models import Podcast


def create_podcast(data, user):
    p = Podcast(**data, author=user)
    db.session.add(p)
    db.session.commit()

    return p
