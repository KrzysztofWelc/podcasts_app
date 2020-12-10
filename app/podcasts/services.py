import secrets, os
from flask import current_app as app
from app import db
from app.podcasts.models import Podcast


def update_podcast(podcast, data):
    for field in data:
        setattr(podcast, field, data[field])
    db.session.commit()

    return podcast


def get_podcast(podcast_id):
    p = Podcast.query.filter_by(id=podcast_id).first()
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
