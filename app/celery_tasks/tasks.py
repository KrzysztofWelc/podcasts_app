from app.celery_tasks.celery import celery
from app.podcasts.models import Podcast


@celery.task()
def test_task():
    p = Podcast.query.first()
    print(p.title)
