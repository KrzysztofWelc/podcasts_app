import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()


def make_celery(app_name=__name__):
    backend = os.getenv('CELERY_BROKER_URL')
    broker = os.getenv('CELERY_RESULT_BACKEND')
    return Celery(app_name, backend=backend, broker=broker)


celery = make_celery()
