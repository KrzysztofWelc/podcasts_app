from celery import Celery
import app.env as conf


def make_celery(app_name=__name__):
    backend = conf.CELERY_BROKER_URL
    broker = conf.CELERY_RESULT_BACKEND

    return Celery(app_name, backend=backend, broker=broker)


celery = make_celery()
