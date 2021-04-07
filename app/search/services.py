from app.users.models import User
from app.podcasts.models import Podcast


def get_preview_search(phrase):
    users = User.query.filter(User.username.like('{}%'.format(phrase))).limit(3).all()
    podcasts = Podcast.query.filter(Podcast.title.like('{}%'.format(phrase))).limit(3).all()

    return users, podcasts
