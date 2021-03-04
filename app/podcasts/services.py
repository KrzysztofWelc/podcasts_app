import secrets, os
from flask import current_app as app
from app import db
from app.podcasts.models import Podcast
from app.users.models import User
from app.podcasts.exceptions import ResourceNotFound

PAGE_SIZE = 10


def delete_podcast(podcast):
    db.session.delete(podcast)
    db.session.commit()
    path = os.path.join(app.root_path, 'static', 'podcasts', podcast.audio_file)
    os.remove(path)


def update_podcast(podcast, data):
    for field in data:
        setattr(podcast, field, data[field])
    db.session.commit()

    return podcast


def find_podcast(**kwargs):
    p = Podcast.query.filter_by(**kwargs).first()
    return p


def create_podcast(data, audio_file, user):
    p = Podcast(**data, author=user)
    a = save_audio(audio_file)
    p.audio_file = a
    db.session.add(p)
    db.session.commit()

    return p


def save_audio(file):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(file.filename)
    new_filename = random_hex + f_ext
    file_path = os.path.join(app.root_path, 'static/podcasts', new_filename)

    file.save(file_path)

    return new_filename


def get_user_podcasts(user_id, page):
    page = int(page)
    user = User.query.filter_by(id=user_id).first()
    if not user:
        raise ResourceNotFound('no such a user.')
    podcasts = Podcast.query.filter_by(user_id=user.id).offset((page-1)*PAGE_SIZE).limit(PAGE_SIZE).all()

    return podcasts
