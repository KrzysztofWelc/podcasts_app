from app import db
from app.comments.models import Comment
from app.podcasts.models import Podcast


def create_comment(data, user):
    c = Comment(**data, author=user)
    db.session.add(c)
    db.session.commit()
    return c


def get_comments(podcast_id, page):
    page = int(page)
    p = Podcast.query.filter_by(id=podcast_id).first()
    comments = p.comments.offset((page - 1) * 10).limit(10).all()
    return comments


def get_single_comment(**kwargs):
    c = Comment.query.filter_by(**kwargs).first()
    return c


def delete_comment(comment):
    db.session.delete(comment)
    db.session.commit()
