import secrets, os
from flask import current_app as app
from PIL import Image
from app import db
from app.podcasts.models import Podcast, PopularPodcast, View
from app.users.models import User
from app.exceptions import ResourceNotFound

PAGE_SIZE = 10


def delete_podcast(podcast):
    podcast_id = podcast.id
    db.session.query(View).filter_by(podcast_id=podcast_id).delete()
    db.session.query(PopularPodcast).filter_by(podcast_id=podcast_id).delete()
    db.session.delete(podcast)
    db.session.commit()
    path = os.path.abspath(os.path.join(app.root_path, 'static', 'podcasts', podcast.audio_file))
    os.remove(path)


def update_podcast(podcast, data):
    for field in data:
        setattr(podcast, field, data[field])
    db.session.commit()

    return podcast


def find_podcast(**kwargs):
    p = Podcast.query.filter_by(**kwargs).first()
    return p


def create_podcast(data, audio_file, user, cover_img=None):
    p = Podcast(**data, author=user)
    a = save_audio(audio_file)
    p.audio_file = a
    if cover_img:
        c = save_cover(cover_img)
        p.cover_img = c
    db.session.add(p)
    db.session.commit()

    return p


def save_cover(file):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(file.filename)
    new_filename = random_hex + f_ext
    file_path = os.path.join(app.root_path, 'static/podcast_covers', new_filename)

    i = Image.open(file)
    i.thumbnail((200, 200))
    i.save(file_path)

    return new_filename


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
    podcasts = Podcast.query.filter_by(user_id=user.id).offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).all()
    is_more = Podcast.query.filter_by(user_id=user.id).count() > (page - 1) * 10 + 10

    return podcasts, is_more


def get_new_podcasts(page):
    page = int(page)

    podcasts = db.session.query(Podcast).order_by(Podcast.publish_date.desc()).offset((page - 1) * PAGE_SIZE).limit(
        PAGE_SIZE).all()
    is_more = db.session.query(Podcast).order_by(Podcast.publish_date.desc()).count() > (page - 1) * 10 + 10

    return podcasts, is_more


def get_most_popular():
    pps = PopularPodcast.query.all()
    ids = [p.podcast_id for p in pps]
    ps = db.session.query(Podcast).filter(Podcast.id.in_(ids))

    return ps
