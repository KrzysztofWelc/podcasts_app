from app.celery_tasks.celery import celery
from app import create_app
from app.celery_tasks.celery_utils import init_celery

app = create_app()
init_celery(celery, app)