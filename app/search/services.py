from app.users.models import User
from app.podcasts.models import Podcast


def get_preview_search(phrase):
    users = User.query.filter(User.username.like('{}%'.format(phrase))).limit(3).all()
    podcasts = Podcast.query.filter(Podcast.title.like('{}%'.format(phrase))).limit(3).all()

    return users, podcasts


def search_users(phrase, page):
    page = int(page)
    users = User.query.filter(User.username.like('{}%'.format(phrase))).offset((page - 1) * 10).limit(10).all()
    is_more = User.query.filter(User.username.like('{}%'.format(phrase))).count() > (page - 1) * 10 + 10

    return users, is_more


def search_podcasts(phrase, page):
    page = int(page)
    podcasts = Podcast.query.filter(Podcast.title.like('{}%'.format(phrase))).offset((page - 1) * 10).limit(10).all()
    is_more = Podcast.query.filter(Podcast.title.like('{}%'.format(phrase))).count() > (page - 1) * 10 + 10

    return podcasts, is_more


