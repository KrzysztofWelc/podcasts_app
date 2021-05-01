from datetime import datetime
from app import db
from app.comments.models import Comment, AnswerComment
from app.podcasts.models import Podcast


def create_comment(data, user):
    c = Comment(**data, author=user)
    db.session.add(c)
    db.session.commit()
    return c


def get_comments(podcast_id, page):
    page = int(page)
    p = Podcast.query.filter_by(id=podcast_id).first()
    # todo: add ordering
    comments = p.comments.offset((page - 1) * 10).limit(10).all()
    is_more = p.comments.count() > (page - 1) * 10 + 10
    return comments, is_more


def get_answers(comment_id, page):
    page = int(page)
    c = Comment.query.filter_by(id=comment_id).first()
    answers = c.answers.offset((page - 1) * 10).limit(10).all()
    is_more = c.answers.count() > (page - 1) * 10 + 10
    return answers, is_more


def get_single_comment(**kwargs):
    c = Comment.query.filter_by(**kwargs).first()
    return c


def delete_comment(comment):
    db.session.delete(comment)
    db.session.commit()


def update_comment(comment, text):
    comment.text = text
    comment.created_at = datetime.now()
    db.session.commit()
    return comment


def answer_comment(comment_id, answer_text, user):
    a = AnswerComment(
        text=answer_text,
        comment_id=comment_id,
        user_id=user.id
    )
    db.session.add(a)
    db.session.commit()
    return a


def delete_answer(answer_id):
    a = AnswerComment.query.filter_by(id=answer_id).first()
    db.session.delete(a)
