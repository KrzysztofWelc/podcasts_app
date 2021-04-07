import os
from celery import Celery
from app import db
from app.podcasts.models import Podcast, View
from dotenv import load_dotenv

load_dotenv()

celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379")


@celery.task(name="add_view")
def add_view(podcast_file_name):
    p = Podcast.query.filter_by(audio_file=podcast_file_name).first()
    if p:
        v = View(podcast=p)
        db.session.add(v)
        db.session.commit()
