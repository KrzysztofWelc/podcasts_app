from app.celery import celery
from app import create_app
from app.celery_utils import init_celery
print('1111')

app = create_app()
init_celery(celery, app)