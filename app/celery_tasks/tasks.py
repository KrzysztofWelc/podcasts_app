from app.celery_tasks.celery import celery
from app import db
from app.models import View, Podcast


@celery.task()
def add_view_record(file_name):
    p = Podcast.query.filter_by(audio_file=file_name).first()
    v = View(podcast=p)
    db.session.add(v)
    db.session.commit()

